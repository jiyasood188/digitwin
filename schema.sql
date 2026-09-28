CREATE DATABASE IF NOT EXISTS digicampus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE digicampus;


CREATE TABLE IF NOT EXISTS campuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    city VARCHAR(100),
    total_area_acres DECIMAL(8,2) DEFAULT 45.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS buildings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campus_id INT DEFAULT 1,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(100) DEFAULT 'academic',
    total_floors INT DEFAULT 3,
    occupancy INT DEFAULT 0,
    energy_kw DECIMAL(6,2) DEFAULT 0.00,
    active_sensors INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Normal',
    description TEXT,
    pos_x INT DEFAULT 100,
    pos_y INT DEFAULT 100,
    color VARCHAR(30) DEFAULT '#3B82F6',
    FOREIGN KEY (campus_id) REFERENCES campuses(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS floors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    building_id INT NOT NULL,
    floor_number INT NOT NULL,
    name VARCHAR(100),
    FOREIGN KEY (building_id) REFERENCES buildings(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    building_id INT NOT NULL,
    floor_id INT NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    name VARCHAR(150),
    type VARCHAR(50) NOT NULL DEFAULT 'Lecture Room',
    capacity INT NOT NULL DEFAULT 45,
    current_occupancy INT DEFAULT 0,
    UNIQUE KEY uk_bld_room (building_id, room_number),
    FOREIGN KEY (building_id) REFERENCES buildings(id),
    FOREIGN KEY (floor_id) REFERENCES floors(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    instructor VARCHAR(150),
    type VARCHAR(50) DEFAULT 'lecture',
    time_slot VARCHAR(50) NOT NULL DEFAULT '09:00 - 10:00',
    start_time TIME DEFAULT '09:00:00',
    end_time TIME DEFAULT '10:00:00',
    day_of_week VARCHAR(30) DEFAULT 'Monday',
    FOREIGN KEY (room_id) REFERENCES rooms(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    designation VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(30) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS checkins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    checkin_time DATETIME,
    checkout_time DATETIME,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS equipment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    equipment_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS parking_areas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    area_name VARCHAR(100) UNIQUE NOT NULL,
    location VARCHAR(150) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS parking_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    area_id INT NOT NULL,
    slot_number VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL,
    FOREIGN KEY (area_id) REFERENCES parking_areas(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vehicle_number VARCHAR(30) UNIQUE NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sensors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sensor_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL,
    building_name VARCHAR(100),
    location VARCHAR(150),
    reading_value VARCHAR(50),
    reading_unit VARCHAR(20),
    status ENUM('active', 'warning', 'offline') DEFAULT 'active',
    icon_class VARCHAR(50) DEFAULT 'green',
    icon_symbol VARCHAR(10) DEFAULT '°',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    severity ENUM('critical', 'warning', 'info', 'resolved') DEFAULT 'warning',
    status ENUM('active', 'dismissed', 'resolved') DEFAULT 'active',
    category VARCHAR(100) DEFAULT 'General',
    location VARCHAR(150),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS dashboard_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS campus_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stat_key VARCHAR(100) NOT NULL UNIQUE,
    stat_value VARCHAR(100) NOT NULL,
    unit VARCHAR(50),
    description VARCHAR(300),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    booking_id INT,
    room_id INT,
    action VARCHAR(50) NOT NULL,
    booking_date DATE,
    checkin_time DATETIME,
    checkout_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS campus_facilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity INT DEFAULT 1,
    description VARCHAR(255)
) ENGINE=InnoDB;

INSERT INTO campus_facilities (name, category, quantity, description) VALUES
('Cricket Ground', 'Sports', 1, 'Main cricket ground'),
('Cricket Practice Nets', 'Sports', 4, 'Practice nets beside the ground'),
('Volleyball Court & Net', 'Sports', 1, 'Outdoor volleyball court'),
('Football Goals', 'Sports', 2, 'Goal posts on the football field'),
('Parks/Green Areas', 'Landscape', 3, 'Green areas across campus'),
('Trees', 'Landscape', 120, 'Trees across campus'),
('Benches', 'Landscape', 40, 'Seating benches'),
('Campus Lights', 'Utility', 60, 'Street and pathway lights'),
('Main Gate', 'Entry', 1, 'Entry and exit gate'),
('Security Cabin', 'Security', 1, 'Security cabin at the main gate');

INSERT INTO users (name, email, designation) VALUES
('Admin User', 'admin@campus.edu', 'Admin'),
('Dr. Sharma', 'sharma@campus.edu', 'Faculty'),
('Riya Verma', 'riya@campus.edu', 'Student'),
('Guard Singh', 'guard@campus.edu', 'Security');

INSERT INTO parking_areas (area_name, location) VALUES
('Main Gate Parking', 'Near Main Gate'),
('Staff Parking', 'Behind Administration Building');

INSERT INTO parking_slots (area_id, slot_number, status) VALUES
((SELECT id FROM parking_areas WHERE area_name='Main Gate Parking'), 'P-01', 'available'),
((SELECT id FROM parking_areas WHERE area_name='Main Gate Parking'), 'P-02', 'occupied'),
((SELECT id FROM parking_areas WHERE area_name='Main Gate Parking'), 'P-03', 'available'),
((SELECT id FROM parking_areas WHERE area_name='Staff Parking'), 'S-01', 'available'),
((SELECT id FROM parking_areas WHERE area_name='Staff Parking'), 'S-02', 'occupied');

INSERT INTO vehicles (user_id, vehicle_number, vehicle_type) VALUES
((SELECT id FROM users WHERE email='riya@campus.edu'), 'PB10AB1234', 'Two Wheeler'),
((SELECT id FROM users WHERE email='sharma@campus.edu'), 'PB10CD5678', 'Car');
