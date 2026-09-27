"""
init_db.py - Database Initialization and Seeding Script
Campus Digital Twin
"""

import sys
import pymysql
import pymysql.cursors
from db import DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME


def init_database():
    print(f"Connecting to MySQL server at {DB_HOST}:{DB_PORT}...")
    
    # Connect without database first to ensure database exists
    conn = pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        charset="utf8mb4"
    )
    with conn.cursor() as cursor:
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
    conn.close()

    # Connect to the target database
    conn = pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor
    )

    with conn.cursor() as cursor:
        print(f"Checking and creating tables in `{DB_NAME}`...")

        # 1. campuses
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS `campuses` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `name` VARCHAR(200) NOT NULL,
            `code` VARCHAR(50) NOT NULL UNIQUE,
            `description` TEXT,
            `city` VARCHAR(100),
            `total_area_acres` DECIMAL(8,2) DEFAULT 45.0,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
        """)

        # 2. buildings
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS `buildings` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `campus_id` INT DEFAULT 1,
            `code` VARCHAR(50) NOT NULL UNIQUE,
            `name` VARCHAR(150) NOT NULL,
            `type` VARCHAR(100) DEFAULT 'academic',
            `total_floors` INT DEFAULT 3,
            `occupancy` INT DEFAULT 0,
            `energy_kw` DECIMAL(6,2) DEFAULT 0.00,
            `active_sensors` INT DEFAULT 0,
            `status` VARCHAR(50) DEFAULT 'Normal',
            `description` TEXT,
            `pos_x` INT DEFAULT 100,
            `pos_y` INT DEFAULT 100,
            `color` VARCHAR(30) DEFAULT '#3B82F6'
        ) ENGINE=InnoDB;
        """)

        # Add columns to buildings if they don't exist
        try:
            cursor.execute("ALTER TABLE `buildings` MODIFY COLUMN `type` VARCHAR(100) DEFAULT 'academic';")
        except Exception:
            pass

        for col, col_type in [
            ("occupancy", "INT DEFAULT 0"),
            ("energy_kw", "DECIMAL(6,2) DEFAULT 0.00"),
            ("active_sensors", "INT DEFAULT 0"),
            ("status", "VARCHAR(50) DEFAULT 'Normal'")
        ]:
            try:
                cursor.execute(f"ALTER TABLE `buildings` ADD COLUMN `{col}` {col_type};")
            except pymysql.err.OperationalError:
                pass  # column already exists

        # Add current_occupancy to rooms if missing
        try:
            cursor.execute("ALTER TABLE `rooms` ADD COLUMN `current_occupancy` INT DEFAULT 0;")
        except Exception:
            pass

        try:
            cursor.execute("ALTER TABLE `rooms` ADD UNIQUE KEY `uk_bld_room` (`building_id`, `room_number`);")
        except Exception:
            pass

        # 4. schedules
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS `schedules` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `room_id` INT NOT NULL,
            `title` VARCHAR(200) NOT NULL,
            `instructor` VARCHAR(150),
            `type` VARCHAR(50) DEFAULT 'lecture',
            `time_slot` VARCHAR(50) NOT NULL,
            `start_time` TIME DEFAULT '09:00:00',
            `end_time` TIME DEFAULT '10:00:00',
            `day_of_week` VARCHAR(30) DEFAULT 'Monday'
        ) ENGINE=InnoDB;
        """)

        # Add time_slot if missing
        try:
            cursor.execute("ALTER TABLE `schedules` ADD COLUMN `time_slot` VARCHAR(50) NOT NULL DEFAULT '09:00 - 10:00';")
        except pymysql.err.OperationalError:
            pass

        # 5. sensors
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS `sensors` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `sensor_code` VARCHAR(50) NOT NULL UNIQUE,
            `name` VARCHAR(150) NOT NULL,
            `type` VARCHAR(50) NOT NULL,
            `building_name` VARCHAR(100),
            `location` VARCHAR(150),
            `reading_value` VARCHAR(50),
            `reading_unit` VARCHAR(20),
            `status` ENUM('active', 'warning', 'offline') DEFAULT 'active',
            `icon_class` VARCHAR(50) DEFAULT 'green',
            `icon_symbol` VARCHAR(10) DEFAULT '°',
            `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
        """)

        # 6. alerts
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS `alerts` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `title` VARCHAR(255) NOT NULL,
            `severity` ENUM('critical', 'warning', 'info', 'resolved') DEFAULT 'warning',
            `status` ENUM('active', 'dismissed', 'resolved') DEFAULT 'active',
            `category` VARCHAR(100) DEFAULT 'General',
            `location` VARCHAR(150),
            `description` TEXT,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `resolved_at` TIMESTAMP NULL DEFAULT NULL
        ) ENGINE=InnoDB;
        """)

        # 7. dashboard_settings
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS `dashboard_settings` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `setting_key` VARCHAR(100) NOT NULL UNIQUE,
            `setting_value` TEXT NOT NULL,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
        """)

        # 8. campus_stats
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS `campus_stats` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `stat_key` VARCHAR(100) NOT NULL UNIQUE,
            `stat_value` VARCHAR(100) NOT NULL,
            `unit` VARCHAR(50),
            `description` VARCHAR(255),
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
        """)

        conn.commit()
        print("Tables created/verified successfully.")

        # ================= SEED DATA =================

        # Seed campus
        cursor.execute("""
        INSERT INTO `campuses` (`id`, `name`, `code`, `description`, `city`, `total_area_acres`)
        VALUES (1, 'Apex Institute of Technology & Research', 'AITR-CAMPUS', 'Smart High-Tech Digital Twin Campus', 'Bengaluru', 45.50)
        ON DUPLICATE KEY UPDATE name=VALUES(name);
        """)

        # Seed buildings (Blocks 1 through 7)
        buildings_data = [
            ("BLK-1", "Block 1", "Academic Block", 3, 420, 18.60, 52, "Normal", "Undergraduate lecture halls and computing labs.", 180, 140, "#06B6D4"),
            ("BLK-2", "Block 2", "Academic Block", 3, 385, 16.90, 48, "Normal", "Engineering faculty suites and seminar rooms.", 460, 140, "#3B82F6"),
            ("BLK-3", "Block 3", "Academic Block", 4, 510, 22.40, 61, "Attention", "Postgraduate departments and digital robotics lab.", 180, 360, "#8B5CF6"),
            ("BLK-4", "Block 4", "Computing Center", 3, 290, 14.20, 41, "Normal", "High Performance Computing clusters and AI servers.", 460, 360, "#10B981"),
            ("BLK-5", "Block 5", "Science Block", 4, 340, 17.10, 46, "Normal", "Physics, Chemistry, and Nanotechnology laboratories.", 300, 200, "#F59E0B"),
            ("BLK-6", "Block 6", "Research Complex", 4, 210, 12.80, 35, "Normal", "Interdisciplinary research labs and incubator suites.", 300, 400, "#6366F1"),
            ("BLK-7", "Block 7", "Innovation Hub", 2, 175, 10.50, 28, "Normal", "Student innovation labs, maker spaces, and start-up pods.", 120, 260, "#EC4899"),
        ]

        for b in buildings_data:
            cursor.execute("""
            INSERT INTO `buildings` (`campus_id`, `code`, `name`, `type`, `total_floors`, `occupancy`, `energy_kw`, `active_sensors`, `status`, `description`, `pos_x`, `pos_y`, `color`)
            VALUES (1, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                name=VALUES(name),
                type=VALUES(type),
                occupancy=VALUES(occupancy),
                energy_kw=VALUES(energy_kw),
                active_sensors=VALUES(active_sensors),
                status=VALUES(status);
            """, b)
        conn.commit()
        print("Buildings seeded successfully.")

        # Get building IDs mapping
        cursor.execute("SELECT id, name FROM `buildings`;")
        building_map = {row["name"]: row["id"] for row in cursor.fetchall()}

        # Seed Rooms & Schedules
        room_data_def = {
            "Block 1": {
                "Room 101": [
                    ("09:00 - 10:00", "Mathematics", "Dr. Sharma"),
                    ("10:00 - 11:00", "Programming in C", "Ms. Gupta"),
                    ("11:15 - 12:15", "Physics", "Dr. Verma"),
                    ("12:15 - 01:15", "English", "Ms. Mehta")
                ],
                "Room 102": [
                    ("09:00 - 10:00", "Physics", "Dr. Verma"),
                    ("10:00 - 11:00", "Mathematics", "Dr. Sharma"),
                    ("11:15 - 12:15", "Programming in C", "Ms. Gupta"),
                    ("12:15 - 01:15", "Engineering Graphics", "Mr. Singh")
                ],
                "Room 103": [
                    ("09:00 - 10:00", "Programming in C", "Ms. Gupta"),
                    ("10:00 - 11:00", "English", "Ms. Mehta"),
                    ("11:15 - 12:15", "Mathematics", "Dr. Sharma"),
                    ("12:15 - 01:15", "Physics", "Dr. Verma")
                ],
                "Room 104": [
                    ("09:00 - 10:00", "Engineering Graphics", "Mr. Singh"),
                    ("10:00 - 11:00", "Physics", "Dr. Verma"),
                    ("11:15 - 12:15", "English", "Ms. Mehta"),
                    ("12:15 - 01:15", "Mathematics", "Dr. Sharma")
                ]
            },
            "Block 2": {
                "Room 201": [
                    ("09:00 - 10:00", "Data Structures", "Prof. Roy"),
                    ("10:00 - 11:00", "Discrete Math", "Dr. Patel"),
                    ("11:15 - 12:15", "Digital Logic", "Dr. Rao"),
                    ("12:15 - 01:15", "Computer Organization", "Ms. Sen")
                ],
                "Room 202": [
                    ("09:00 - 10:00", "Digital Logic", "Dr. Rao"),
                    ("10:00 - 11:00", "Data Structures", "Prof. Roy"),
                    ("11:15 - 12:15", "Computer Organization", "Ms. Sen"),
                    ("12:15 - 01:15", "Discrete Math", "Dr. Patel")
                ],
                "Room 203": [
                    ("09:00 - 10:00", "Computer Organization", "Ms. Sen"),
                    ("10:00 - 11:00", "Digital Logic", "Dr. Rao"),
                    ("11:15 - 12:15", "Discrete Math", "Dr. Patel"),
                    ("12:15 - 01:15", "Data Structures", "Prof. Roy")
                ],
                "Room 204": [
                    ("09:00 - 10:00", "Discrete Math", "Dr. Patel"),
                    ("10:00 - 11:00", "Computer Organization", "Ms. Sen"),
                    ("11:15 - 12:15", "Data Structures", "Prof. Roy"),
                    ("12:15 - 01:15", "Digital Logic", "Dr. Rao")
                ]
            },
            "Block 3": {
                "Room 301": [
                    ("09:00 - 10:00", "Database Systems", "Dr. Kapoor"),
                    ("10:00 - 11:00", "Operating Systems", "Prof. Nair"),
                    ("11:15 - 12:15", "Computer Networks", "Ms. Joshi"),
                    ("12:15 - 01:15", "Software Engineering", "Mr. Das")
                ],
                "Room 302": [
                    ("09:00 - 10:00", "Operating Systems", "Prof. Nair"),
                    ("10:00 - 11:00", "Database Systems", "Dr. Kapoor"),
                    ("11:15 - 12:15", "Software Engineering", "Mr. Das"),
                    ("12:15 - 01:15", "Computer Networks", "Ms. Joshi")
                ],
                "Room 303": [
                    ("09:00 - 10:00", "Computer Networks", "Ms. Joshi"),
                    ("10:00 - 11:00", "Software Engineering", "Mr. Das"),
                    ("11:15 - 12:15", "Operating Systems", "Prof. Nair"),
                    ("12:15 - 01:15", "Database Systems", "Dr. Kapoor")
                ],
                "Room 304": [
                    ("09:00 - 10:00", "Software Engineering", "Mr. Das"),
                    ("10:00 - 11:00", "Computer Networks", "Ms. Joshi"),
                    ("11:15 - 12:15", "Database Systems", "Dr. Kapoor"),
                    ("12:15 - 01:15", "Operating Systems", "Prof. Nair")
                ]
            },
            "Block 4": {
                "Room 401": [
                    ("09:00 - 10:00", "Algorithms Design", "Dr. Sen"),
                    ("10:00 - 11:00", "Theory of Computation", "Prof. Roy"),
                    ("11:15 - 12:15", "Compiler Design", "Dr. Bannerjee")
                ],
                "Room 402": [
                    ("09:00 - 10:00", "Theory of Computation", "Prof. Roy"),
                    ("10:00 - 11:00", "Compiler Design", "Dr. Bannerjee"),
                    ("11:15 - 12:15", "Algorithms Design", "Dr. Sen")
                ],
                "Room 403": [
                    ("09:00 - 10:00", "Compiler Design", "Dr. Bannerjee"),
                    ("10:00 - 11:00", "Algorithms Design", "Dr. Sen"),
                    ("11:15 - 12:15", "Theory of Computation", "Prof. Roy")
                ]
            },
            "Block 5": {
                "Room 501": [
                    ("09:00 - 10:00", "Machine Learning", "Dr. Bose"),
                    ("10:00 - 11:00", "Artificial Intelligence", "Prof. Mishra"),
                    ("11:15 - 12:15", "Data Mining", "Ms. Ghosh")
                ],
                "Room 502": [
                    ("09:00 - 10:00", "Artificial Intelligence", "Prof. Mishra"),
                    ("10:00 - 11:00", "Data Mining", "Ms. Ghosh"),
                    ("11:15 - 12:15", "Machine Learning", "Dr. Bose")
                ],
                "Room 503": [
                    ("09:00 - 10:00", "Data Mining", "Ms. Ghosh"),
                    ("10:00 - 11:00", "Machine Learning", "Dr. Bose"),
                    ("11:15 - 12:15", "Artificial Intelligence", "Prof. Mishra")
                ]
            },
            "Block 6": {
                "Room 601": [
                    ("09:00 - 10:00", "Cloud Computing", "Dr. Agarwal"),
                    ("10:00 - 11:00", "Big Data Analytics", "Prof. Kulkarni"),
                    ("11:15 - 12:15", "DevOps & SRE", "Mr. Nambiar")
                ],
                "Room 602": [
                    ("09:00 - 10:00", "Big Data Analytics", "Prof. Kulkarni"),
                    ("10:00 - 11:00", "DevOps & SRE", "Mr. Nambiar"),
                    ("11:15 - 12:15", "Cloud Computing", "Dr. Agarwal")
                ],
                "Room 603": [
                    ("09:00 - 10:00", "DevOps & SRE", "Mr. Nambiar"),
                    ("10:00 - 11:00", "Cloud Computing", "Dr. Agarwal"),
                    ("11:15 - 12:15", "Big Data Analytics", "Prof. Kulkarni")
                ]
            },
            "Block 7": {
                "Room 701": [
                    ("09:00 - 10:00", "Cyber Security", "Dr. Nanda"),
                    ("10:00 - 11:00", "Cryptography", "Prof. Paul"),
                    ("11:15 - 12:15", "Ethical Hacking", "Mr. Sethi")
                ],
                "Room 702": [
                    ("09:00 - 10:00", "Cryptography", "Prof. Paul"),
                    ("10:00 - 11:00", "Ethical Hacking", "Mr. Sethi"),
                    ("11:15 - 12:15", "Cyber Security", "Dr. Nanda")
                ],
                "Room 703": [
                    ("09:00 - 10:00", "Ethical Hacking", "Mr. Sethi"),
                    ("10:00 - 11:00", "Cyber Security", "Dr. Nanda"),
                    ("11:15 - 12:15", "Cryptography", "Prof. Paul")
                ]
            }
        }

        # Modify schedules table if needed to have defaults for start_time and end_time
        try:
            cursor.execute("ALTER TABLE `schedules` MODIFY COLUMN `start_time` TIME DEFAULT '09:00:00';")
            cursor.execute("ALTER TABLE `schedules` MODIFY COLUMN `end_time` TIME DEFAULT '10:00:00';")
        except Exception:
            pass

        def parse_slot(slot_str):
            try:
                parts = slot_str.split(" - ")
                def to_time(s):
                    h, m = map(int, s.strip().split(":"))
                    if 1 <= h <= 5:
                        h += 12
                    return f"{h:02d}:{m:02d}:00"
                return to_time(parts[0]), to_time(parts[1])
            except Exception:
                return "09:00:00", "10:00:00"

        for building_name, rooms in room_data_def.items():
            b_id = building_map.get(building_name)
            if not b_id:
                continue

            # Ensure at least one floor exists for this building
            cursor.execute("SELECT id FROM `floors` WHERE `building_id` = %s LIMIT 1;", (b_id,))
            floor_rec = cursor.fetchone()
            if floor_rec:
                floor_id = floor_rec["id"]
            else:
                cursor.execute("INSERT INTO `floors` (`building_id`, `floor_number`, `name`) VALUES (%s, 1, 'Floor 1');", (b_id,))
                floor_id = cursor.lastrowid

            for room_number, schedules in rooms.items():
                cursor.execute("""
                INSERT INTO `rooms` (`building_id`, `floor_id`, `room_number`, `name`, `type`, `capacity`, `current_occupancy`)
                VALUES (%s, %s, %s, %s, 'Lecture Room', 45, 32)
                ON DUPLICATE KEY UPDATE name=VALUES(name), current_occupancy=VALUES(current_occupancy);
                """, (b_id, floor_id, room_number, f"{building_name} - {room_number}"))
                
                cursor.execute("SELECT id FROM `rooms` WHERE `building_id` = %s AND `room_number` = %s;", (b_id, room_number))
                room_rec = cursor.fetchone()
                if room_rec:
                    r_id = room_rec["id"]
                    # Clear existing schedules for this room to avoid duplicates
                    cursor.execute("DELETE FROM `schedules` WHERE `room_id` = %s;", (r_id,))
                    for time_slot, subject, instructor in schedules:
                        st, et = parse_slot(time_slot)
                        cursor.execute("""
                        INSERT INTO `schedules` (`room_id`, `title`, `instructor`, `time_slot`, `start_time`, `end_time`, `day_of_week`)
                        VALUES (%s, %s, %s, %s, %s, %s, 'Today');
                        """, (r_id, subject, instructor, time_slot, st, et))
        conn.commit()
        print("Rooms and schedules seeded successfully.")

        # Seed Sensors
        sensors_data = [
            ("SNS-TMP-101", "Temperature Sensor", "temperature", "Block 1", "Block 1 · Room 203", "22.4", "°C", "active", "green", "°"),
            ("SNS-OCC-102", "Occupancy Sensor", "occupancy", "Library", "Library · Floor 1", "142", "people", "active", "blue", "♟"),
            ("SNS-PWR-103", "Energy Sensor", "energy", "Block 1", "Block 1", "18.6", "kW", "warning", "yellow", "ϟ"),
            ("SNS-AQI-104", "Air Quality Sensor", "air_quality", "Science Lab", "Science Lab · Floor 2", "Good", "AQI", "active", "blue", "◌"),
            ("SNS-DOR-105", "Door Sensor", "door", "Admin Block", "Admin Block · Main Entry", "Closed", "", "active", "peach", "▣"),
            ("SNS-MOT-106", "Motion Sensor", "motion", "Sports Centre", "Sports Centre · Hall A", "No motion", "", "offline", "red", "⌁"),
            ("SNS-WTR-107", "Water Level Sensor", "water", "Utility Building", "Utility Building", "79", "%", "active", "blue", "▰"),
            ("SNS-HUM-108", "Humidity Sensor", "humidity", "Block 2", "Block 2 · Room 201", "48", "%", "active", "green", "💧"),
        ]

        for s in sensors_data:
            cursor.execute("""
            INSERT INTO `sensors` (`sensor_code`, `name`, `type`, `building_name`, `location`, `reading_value`, `reading_unit`, `status`, `icon_class`, `icon_symbol`)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                name=VALUES(name),
                reading_value=VALUES(reading_value),
                status=VALUES(status),
                last_updated=CURRENT_TIMESTAMP;
            """, s)
        conn.commit()
        print("Sensors seeded successfully.")

        # Seed Alerts
        cursor.execute("SELECT COUNT(*) AS cnt FROM `alerts`;")
        if cursor.fetchone()["cnt"] == 0:
            alerts_data = [
                ("High Energy Consumption", "warning", "active", "Energy", "Block 3", "Energy consumption is above the normal threshold."),
                ("HVAC Failure Warning", "critical", "active", "Climate", "Server Room · Floor 2", "Cooling system is operating at reduced efficiency."),
                ("Occupancy Spike", "warning", "active", "Occupancy", "Library · Ground Floor", "Zone occupancy reached 94% of safe capacity."),
                ("Routine Sensor Maintenance", "resolved", "resolved", "Maintenance", "Block 1 · Floor 2", "Temperature calibration completed successfully.")
            ]
            for a in alerts_data:
                cursor.execute("""
                INSERT INTO `alerts` (`title`, `severity`, `status`, `category`, `location`, `description`)
                VALUES (%s, %s, %s, %s, %s, %s);
                """, a)
            conn.commit()
            print("Alerts seeded successfully.")

        # Seed Settings
        default_settings = [
            ("refreshInterval", "15"),
            ("liveData", "true"),
            ("defaultView", "Overview"),
            ("enableAlerts", "true"),
            ("criticalAlerts", "true"),
            ("warningAlerts", "true"),
            ("sensorRefresh", "true"),
            ("sensorHealth", "true"),
            ("offlineAlerts", "true"),
            ("density", "comfortable"),
            ("systemStatus", "true"),
            ("timestamps", "true")
        ]
        for key, val in default_settings:
            cursor.execute("""
            INSERT INTO `dashboard_settings` (`setting_key`, `setting_value`)
            VALUES (%s, %s)
            ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);
            """, (key, val))
        conn.commit()
        print("Settings seeded successfully.")

        # Seed Campus Stats
        default_stats = [
            ("total_buildings", "18", "buildings", "Mapped on campus"),
            ("network_status", "98.7%", "%", "All systems operational"),
            ("active_issues", "7", "issues", "Needs attention"),
            ("campus_coverage", "94%", "%", "Digitally mapped"),
            ("total_occupancy", "2,846", "people", "Live campus headcount"),
            ("occupied_buildings", "16 / 18", "buildings", "Active operational buildings"),
            ("total_energy", "324", "kWh", "Campus total consumption"),
            ("solar_production", "98", "kWh", "Green energy generated"),
            ("peak_load", "42", "kW", "Block 3 peak demand"),
            ("energy_efficiency", "91%", "%", "Optimal power utilization"),
            ("active_sensors", "231", "sensors", "Reporting live"),
            ("total_sensors", "248", "sensors", "Across campus"),
            ("warning_sensors", "11", "sensors", "Needs attention"),
            ("offline_sensors", "6", "sensors", "Not reporting")
        ]
        for key, val, unit, desc in default_stats:
            cursor.execute("""
            INSERT INTO `campus_stats` (`stat_key`, `stat_value`, `unit`, `description`)
            VALUES (%s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE stat_value=VALUES(stat_value), unit=VALUES(unit), description=VALUES(description);
            """, (key, val, unit, desc))
        conn.commit()
        print("Campus stats seeded successfully.")

    conn.close()
    print("MySQL database initialization completed successfully!")


if __name__ == "__main__":
    init_database()
