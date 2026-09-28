/* =====================================================
   CAMPUS DIGITAL TWIN - INTERACTION
===================================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       BASIC ELEMENTS
    ===================================================== */

    const campusView =
        document.querySelector(".campus-view");

    const ground =
        document.querySelector(".ground");

    const buildings =
        document.querySelectorAll(".building");

    const zoomIn =
        document.querySelector(
            ".campus-controls button:nth-child(1)"
        );

    const zoomOut =
        document.querySelector(
            ".campus-controls button:nth-child(2)"
        );

    const fullscreen =
        document.querySelector(
            ".campus-controls button:nth-child(3)"
        );


    /* =====================================================
       BUILDING DATA - 3D CAMPUS
    ===================================================== */

    let buildingData = {

        "building-a": {
            name: "Block 1",
            type: "Academic Block",
            occupancy: "420 students",
            energy: "18.6 kW",
            sensors: "52 active",
            status: "Normal"
        },

        "building-b": {
            name: "Block 2",
            type: "Academic Block",
            occupancy: "385 students",
            energy: "16.9 kW",
            sensors: "48 active",
            status: "Normal"
        },

        "building-c": {
            name: "Block 3",
            type: "Academic Block",
            occupancy: "510 students",
            energy: "22.4 kW",
            sensors: "61 active",
            status: "Attention"
        }

    };

    const demoBuildings = [
        { name: "Block 1", type: "Academic Block", occupancy: 420, energy_kw: 18.6, active_sensors: 52, status: "Normal", mapped: 98, network: 100 },
        { name: "Block 2", type: "Academic Block", occupancy: 385, energy_kw: 16.9, active_sensors: 48, status: "Normal", mapped: 96, network: 99 },
        { name: "Block 3", type: "Academic Block", occupancy: 510, energy_kw: 22.4, active_sensors: 61, status: "Attention", mapped: 91, network: 96 },
        { name: "Block 4", type: "Computing Center", occupancy: 465, energy_kw: 20.1, active_sensors: 57, status: "Normal", mapped: 95, network: 99 },
        { name: "Block 5", type: "Science Block", occupancy: 398, energy_kw: 17.8, active_sensors: 49, status: "Normal", mapped: 93, network: 100 },
        { name: "Block 6", type: "Research Complex", occupancy: 445, energy_kw: 19.5, active_sensors: 55, status: "Normal", mapped: 88, network: 97 },
        { name: "Block 7", type: "Innovation Hub", occupancy: 376, energy_kw: 15.7, active_sensors: 44, status: "Normal", mapped: 93, network: 100 }
    ];
    const demoBlockProfiles = {
        "Block 1": {
            floors: 3, capacity: 500, network: 100, sensorTotal: 60, sensorsOnline: 55,
            labs: [
                { name: "Computer Lab 1", type: "Computer", floor: 2, capacity: 40, occupants: 28, status: "In Use" },
                { name: "Computer Lab 2", type: "Computer", floor: 2, capacity: 40, occupants: 0, status: "Available" },
                { name: "Electronics Lab", type: "Electronics", floor: 3, capacity: 30, occupants: 18, status: "In Use" },
                { name: "Networking Lab", type: "Networking", floor: 3, capacity: 32, occupants: 0, status: "Available" }
            ]
        },
        "Block 2": {
            floors: 3, capacity: 500, network: 99, sensorTotal: 56, sensorsOnline: 52,
            labs: [
                { name: "Mechanical Lab", type: "Mechanical", floor: 1, capacity: 36, occupants: 20, status: "In Use" },
                { name: "Robotics Lab", type: "Robotics", floor: 2, capacity: 30, occupants: 18, status: "In Use" },
                { name: "Electrical Lab", type: "Electronics", floor: 3, capacity: 32, occupants: 0, status: "Available" }
            ]
        },
        "Block 3": {
            floors: 4, capacity: 550, network: 96, sensorTotal: 68, sensorsOnline: 62,
            labs: [
                { name: "Robotics Lab", type: "Robotics", floor: 2, capacity: 30, occupants: 24, status: "In Use" },
                { name: "AI Lab", type: "Computer", floor: 3, capacity: 36, occupants: 0, status: "Available" },
                { name: "Electronics Lab", type: "Electronics", floor: 4, capacity: 30, occupants: 16, status: "In Use" }
            ],
            library: { name: "Block 3 Library", floor: 1, capacity: 150, occupants: 86, open: true, hours: "8:00 AM – 8:00 PM", network: 99, lights: "ON", hvac: "ON", temperature: 23.0 }
        },
        "Block 4": {
            floors: 3, capacity: 550, network: 99, sensorTotal: 63, sensorsOnline: 58,
            labs: [
                { name: "High Performance Computing Lab", type: "Computer", floor: 2, capacity: 40, occupants: 32, status: "In Use" },
                { name: "AI Systems Lab", type: "Computer", floor: 3, capacity: 36, occupants: 0, status: "Available" },
                { name: "Network Security Lab", type: "Networking", floor: 3, capacity: 30, occupants: 22, status: "In Use" }
            ]
        },
        "Block 5": {
            floors: 4, capacity: 500, network: 100, sensorTotal: 54, sensorsOnline: 50,
            labs: [
                { name: "Physics Lab", type: "Physics", floor: 1, capacity: 32, occupants: 19, status: "In Use" },
                { name: "Chemistry Lab", type: "Chemistry", floor: 2, capacity: 28, occupants: 0, status: "Available" },
                { name: "Nanotechnology Lab", type: "Science", floor: 3, capacity: 24, occupants: 16, status: "In Use" },
                { name: "Materials Lab", type: "Science", floor: 4, capacity: 30, occupants: 0, status: "Available" }
            ]
        },
        "Block 6": {
            floors: 4, capacity: 500, network: 97, sensorTotal: 43, sensorsOnline: 39,
            labs: [
                { name: "Cloud Computing Lab", type: "Computer", floor: 2, capacity: 36, occupants: 26, status: "In Use" },
                { name: "Big Data Analytics Lab", type: "Computer", floor: 3, capacity: 32, occupants: 0, status: "Available" },
                { name: "DevOps & SRE Lab", type: "Networking", floor: 4, capacity: 30, occupants: 18, status: "In Use" }
            ]
        },
        "Block 7": {
            floors: 2, capacity: 500, network: 100, sensorTotal: 36, sensorsOnline: 33,
            labs: [
                { name: "Cybersecurity Lab", type: "Networking", floor: 1, capacity: 32, occupants: 24, status: "In Use" },
                { name: "Maker Lab", type: "Electronics", floor: 2, capacity: 28, occupants: 0, status: "Available" },
                { name: "Innovation Lab", type: "Computer", floor: 2, capacity: 30, occupants: 15, status: "In Use" }
            ]
        }
    };
    const demoLabSessions = {
        Computer: [
            { time: "2:00 PM – 4:00 PM", title: "Python Programming Practical", instructor: "Faculty (demo)" },
            { time: "4:00 PM – 6:00 PM", title: "Database Systems Lab", instructor: "Faculty (demo)" }
        ],
        Electronics: [
            { time: "1:00 PM – 3:00 PM", title: "Circuits Practical", instructor: "Faculty (demo)" },
            { time: "3:00 PM – 5:00 PM", title: "Embedded Systems Lab", instructor: "Faculty (demo)" }
        ],
        Robotics: [
            { time: "2:00 PM – 4:00 PM", title: "Robotics Practical", instructor: "Faculty (demo)" },
            { time: "4:00 PM – 6:00 PM", title: "Control Systems Lab", instructor: "Faculty (demo)" }
        ],
        Networking: [
            { time: "10:00 AM – 12:00 PM", title: "Network Configuration Lab", instructor: "Faculty (demo)" },
            { time: "1:00 PM – 3:00 PM", title: "Network Security Practical", instructor: "Faculty (demo)" }
        ],
        Science: [
            { time: "11:00 AM – 1:00 PM", title: "Materials Analysis Practical", instructor: "Faculty (demo)" },
            { time: "2:00 PM – 4:00 PM", title: "Laboratory Session", instructor: "Faculty (demo)" }
        ],
        Physics: [
            { time: "10:00 AM – 12:00 PM", title: "Physics Practical", instructor: "Faculty (demo)" },
            { time: "1:00 PM – 3:00 PM", title: "Instrumentation Lab", instructor: "Faculty (demo)" }
        ],
        Chemistry: [
            { time: "10:00 AM – 12:00 PM", title: "Chemistry Practical", instructor: "Faculty (demo)" },
            { time: "1:00 PM – 3:00 PM", title: "Analysis Lab", instructor: "Faculty (demo)" }
        ],
        Mechanical: [
            { time: "9:00 AM – 11:00 AM", title: "Manufacturing Practical", instructor: "Faculty (demo)" },
            { time: "11:00 AM – 1:00 PM", title: "Mechanics Lab", instructor: "Faculty (demo)" }
        ]
    };
    const demoRoomOccupancies = {
        "Block 1": [32, 0, 18, 0],
        "Block 2": [24, 0, 30, 0],
        "Block 3": [28, 18, 0, 24],
        "Block 4": [0, 22, 0],
        "Block 5": [19, 0, 16],
        "Block 6": [26, 0, 18],
        "Block 7": [24, 0, 15]
    };
    let buildingRoomRecords = {};
    let sensorRecords = [];
    let backendConnected = false;
    const networkZones = [
        { name: "Block 1", network: 100 },
        { name: "Block 2", network: 99 },
        { name: "Block 3", network: 96 },
        { name: "Block 4", network: 99 },
        { name: "Block 5", network: 100 },
        { name: "Block 6", network: 97 },
        { name: "Block 7", network: 100 },
        { name: "Library Zone", network: 76 },
        { name: "Campus Core", network: 61 }
    ];
    let campusBuildings = demoBuildings.map(building => ({ ...building }));
    let campusStats = {
        total_buildings: "18",
        network_status: "98.7%",
        active_issues: "3",
        campus_coverage: "94%",
        total_energy: "324",
        total_occupancy: "2,846"
    };
    let weeklyEnergy = [
        { day: "Mon", value: 90 }, { day: "Tue", value: 130 },
        { day: "Wed", value: 170 }, { day: "Thu", value: 110 },
        { day: "Fri", value: 190 }, { day: "Sat", value: 100 },
        { day: "Sun", value: 70 }
    ];
    let alertRecords = [
        { id: null, title: "High Energy Consumption", severity: "warning", status: "active", category: "Energy sensor", location: "Block 3", description: "Energy consumption is above the normal threshold.", created_at: "Today, 10:42 AM" },
        { id: null, title: "HVAC Failure Warning", severity: "critical", status: "active", category: "Climate sensor", location: "Server Room · Floor 2", description: "Cooling system is operating at reduced efficiency.", created_at: "Today, 09:18 AM" },
        { id: null, title: "Occupancy Spike", severity: "warning", status: "active", category: "Occupancy sensor", location: "Library · Ground Floor", description: "Zone occupancy reached 94% of safe capacity.", created_at: "Today, 08:35 AM" },
        { id: null, title: "Routine Sensor Maintenance", severity: "resolved", status: "resolved", category: "Maintenance", location: "Block 1 · Floor 2", description: "Temperature calibration completed successfully.", created_at: "Today, 07:12 AM" }
    ];


    /* =====================================================
       3D BUILDING INFO PANEL
    ===================================================== */

    if (campusView) {

        const infoPanel =
            document.createElement("div");

        infoPanel.className =
            "building-info-panel";

        infoPanel.innerHTML = `

            <button class="close-panel">
                ×
            </button>

            <div class="panel-status">
                <span></span>
                LIVE
            </div>

            <h2 id="panel-building-name">
                Building
            </h2>

            <p id="panel-building-type">
                Campus Building
            </p>

            <div class="panel-stats">

                <div>
                    <span>Occupancy</span>
                    <strong id="panel-occupancy">
                        —
                    </strong>
                </div>

                <div>
                    <span>Energy</span>
                    <strong id="panel-energy">
                        —
                    </strong>
                </div>

                <div>
                    <span>Sensors</span>
                    <strong id="panel-sensors">
                        —
                    </strong>
                </div>

                <div>
                    <span>Status</span>
                    <strong id="panel-status">
                        —
                    </strong>
                </div>

            </div>

            <button class="panel-building-link" id="panel-building-details" type="button">
                View building rooms
            </button>

        `;

        campusView.appendChild(infoPanel);


        buildings.forEach(building => {

            building.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    const className =
                        [...building.classList]
                        .find(cls =>
                            buildingData[cls]
                        );

                    if (!className) return;

                    const data =
                        buildingData[className];


                    const nameElement =
                        document.querySelector(
                            "#panel-building-name"
                        );

                    const typeElement =
                        document.querySelector(
                            "#panel-building-type"
                        );

                    const occupancyElement =
                        document.querySelector(
                            "#panel-occupancy"
                        );

                    const energyElement =
                        document.querySelector(
                            "#panel-energy"
                        );

                    const sensorsElement =
                        document.querySelector(
                            "#panel-sensors"
                        );

                    const statusElement =
                        document.querySelector(
                            "#panel-status"
                        );


                    if (nameElement)
                        nameElement.textContent =
                            data.name;

                    if (typeElement)
                        typeElement.textContent =
                            data.type;

                    if (occupancyElement)
                        occupancyElement.textContent =
                            data.occupancy;

                    if (energyElement)
                        energyElement.textContent =
                            data.energy;

                    if (sensorsElement)
                        sensorsElement.textContent =
                            data.sensors;

                    if (statusElement)
                        statusElement.textContent =
                            data.status;


                    infoPanel.classList.add("show");


                    buildings.forEach(item => {
                        item.classList.remove(
                            "selected"
                        );
                    });

                    building.classList.add(
                        "selected"
                    );

                }
            );

            building.addEventListener("keydown", event => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    building.click();
                }
            });

        });


        const closePanel =
            infoPanel.querySelector(
                ".close-panel"
            );


        if (closePanel) {

            closePanel.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    infoPanel.classList.remove(
                        "show"
                    );

                    buildings.forEach(building => {

                        building.classList.remove(
                            "selected"
                        );

                    });

                }
            );

        }

        infoPanel.querySelector("#panel-building-details")?.addEventListener("click", event => {
            event.stopPropagation();
            const selectedBuilding = document.querySelector(".building.selected");
            const className = selectedBuilding
                ? [...selectedBuilding.classList].find(cls => buildingData[cls])
                : null;
            const blockName = className ? buildingData[className].name : "Block 1";
            showPage("buildings");
            openBuildingRooms(blockName);
        });


        campusView.addEventListener(
            "click",
            () => {

                infoPanel.classList.remove(
                    "show"
                );

                buildings.forEach(building => {

                    building.classList.remove(
                        "selected"
                    );

                });

            }
        );

    }


    /* =====================================================
       ZOOM
    ===================================================== */

    let scale = 1;

    let rotateY = 0;

    let rotateX = 57;


    function updateZoom() {

        if (!ground) return;

        ground.style.transform = `
            translateX(-50%)
            rotateX(${rotateX}deg)
            rotateZ(${rotateY * 0.05 - 2}deg)
            rotateY(${rotateY * 0.12}deg)
            scale(${scale})
        `;

    }


    if (zoomIn) {

        zoomIn.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                scale += 0.1;

                if (scale > 1.5)
                    scale = 1.5;

                updateZoom();

            }
        );

    }


    if (zoomOut) {

        zoomOut.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                scale -= 0.1;

                if (scale < 0.7)
                    scale = 0.7;

                updateZoom();

            }
        );

    }


    /* =====================================================
       MOUSE ROTATION
    ===================================================== */

    let isDragging = false;

    let startX = 0;

    let startY = 0;


    if (campusView) {

        campusView.addEventListener(
            "mousedown",
            event => {

                if (
                    event.target.closest(
                        ".building"
                    ) ||

                    event.target.closest(
                        ".campus-controls"
                    ) ||

                    event.target.closest(
                        ".building-info-panel"
                    )
                ) {
                    return;
                }


                isDragging = true;

                startX =
                    event.clientX;

                startY =
                    event.clientY;

                campusView.style.cursor =
                    "grabbing";

            }
        );


        document.addEventListener(
            "mousemove",
            event => {

                if (
                    !isDragging ||
                    !ground
                ) {
                    return;
                }


                const deltaX =
                    event.clientX -
                    startX;

                const deltaY =
                    event.clientY -
                    startY;


                rotateY +=
                    deltaX * 0.15;

                rotateX -=
                    deltaY * 0.08;


                if (rotateX < 45)
                    rotateX = 45;

                if (rotateX > 70)
                    rotateX = 70;


                ground.style.transform = `
                    translateX(-50%)
                    rotateX(${rotateX}deg)
                    rotateZ(${rotateY * 0.05 - 2}deg)
                    rotateY(${rotateY * 0.12}deg)
                    scale(${scale})
                `;


                startX =
                    event.clientX;

                startY =
                    event.clientY;

            }
        );


        document.addEventListener(
            "mouseup",
            () => {

                isDragging = false;

                campusView.style.cursor =
                    "grab";

            }
        );


        campusView.addEventListener(
            "dblclick",
            event => {

                if (
                    event.target.closest(
                        ".building"
                    ) ||

                    event.target.closest(
                        ".campus-controls"
                    )
                ) {
                    return;
                }


                scale = 1;

                rotateY = 0;

                rotateX = 57;

                updateZoom();

            }
        );

    }


    /* =====================================================
       FULLSCREEN
    ===================================================== */

    if (
        fullscreen &&
        campusView
    ) {

        fullscreen.addEventListener(
            "click",
            async event => {

                event.stopPropagation();

                try {

                    if (
                        !document.fullscreenElement
                    ) {

                        await campusView.requestFullscreen();

                    } else {

                        await document.exitFullscreen();

                    }

                } catch (error) {

                    console.log(
                        "Fullscreen unavailable"
                    );

                }

            }
        );

    }


    /* =====================================================
       SENSOR CLICK
    ===================================================== */

    const sensors =
        document.querySelectorAll(
            ".sensor-point"
        );


    sensors.forEach(sensor => {

        sensor.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                showSensorMessage(
                    sensor
                );

            }
        );

    });


    function showSensorMessage(sensor) {

        const oldMessage =
            document.querySelector(
                ".sensor-message"
            );


        if (oldMessage)
            oldMessage.remove();


        if (!campusView)
            return;


        const message =
            document.createElement(
                "div"
            );


        message.className =
            "sensor-message";


        message.innerHTML = `

            <div class="sensor-message-header">

                <span class="sensor-live-dot"></span>

                LIVE SENSOR

            </div>

            <strong>
                Environmental Sensor
            </strong>

            <p>
                Temperature: 24.8°C
            </p>

            <p>
                Humidity: 61%
            </p>

            <p>
                Air Quality: Good
            </p>

        `;


        campusView.appendChild(
            message
        );


        setTimeout(() => {

            message.classList.add(
                "show"
            );

        }, 20);


        setTimeout(() => {

            message.classList.remove(
                "show"
            );


            setTimeout(() => {

                message.remove();

            }, 300);

        }, 4000);

    }


    /* =====================================================
       LIVE TIME
    ===================================================== */

    function updateLiveTime() {

        const now =
            new Date();

        const liveSettings =
            getStoredSettings();


        if (!liveSettings.liveData)
            return;


        const refreshInterval =
            Number(
                liveSettings.refreshInterval
            ) || 15;


        if (
            now.getSeconds() %
            refreshInterval > 4
        ) {
            return;
        }


        const seconds =
            now.getSeconds();


        const systemStatus =
            document.querySelector(
                ".system-status small"
            );


        if (systemStatus) {

            systemStatus.textContent =
                `Updated ${seconds} sec ago`;

        }

    }


    setInterval(
        updateLiveTime,
        5000
    );


    /* =====================================================
       SIDEBAR NAVIGATION
    ===================================================== */

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    const hero =
        document.querySelector(
            ".hero"
        );


    const stats =
        document.querySelector(
            ".stats"
        );


    const workspace =
        document.querySelector(
            ".workspace"
        );


    const bottomGrid =
        document.querySelector(
            ".bottom-grid"
        );


    const buildingsSection =
        document.querySelector(
            "#buildings-section"
        );


    const energySection =
        document.querySelector(
            "#energy-section"
        );


    const occupancySection =
        document.querySelector(
            "#occupancy-section"
        );


    const sensorsSection =
        document.querySelector(
            "#sensors-section"
        );


    const alertsSection =
        document.querySelector(
            "#alerts-section"
        );


    const settingsSection =
        document.querySelector(
            "#settings-section"
        );

    const networkSection = document.querySelector("#network-section");
    const coverageSection = document.querySelector("#coverage-section");
    const analyticsSection = document.querySelector("#analytics-section");

    function renderNetworkView() {
        const grid = document.querySelector("#network-zone-grid");
        if (!grid) return;

        const overall = Math.round(
            networkZones.reduce((total, zone) => total + zone.network, 0) / networkZones.length
        );
        const overallLabel = document.querySelector("#network-overall-health");
        const summaryStatus = document.querySelector("#network-summary-status");
        if (overallLabel) overallLabel.textContent = `${overall}%`;
        if (summaryStatus) {
            summaryStatus.textContent = overall >= 85 ? "Healthy" : overall >= 65 ? "Moderate" : "Poor";
            summaryStatus.className = `network-health-badge ${overall >= 85 ? "healthy" : overall >= 65 ? "moderate" : "critical"}`;
        }

        grid.replaceChildren(...networkZones.map(zone => {
            const tone = zone.network >= 85 ? "healthy" : zone.network >= 65 ? "moderate" : "critical";
            const card = document.createElement("article");
            card.className = `network-zone-card ${tone}`;
            card.innerHTML = `<div class="network-zone-heading"><strong></strong><span class="network-zone-status"></span></div><strong class="network-zone-value"></strong><div class="network-meter"><span></span></div>`;
            card.querySelector(".network-zone-heading strong").textContent = zone.name;
            card.querySelector(".network-zone-status").textContent = tone === "healthy" ? "Healthy" : tone === "moderate" ? "Moderate" : "Poor";
            card.querySelector(".network-zone-value").textContent = `${zone.network}%`;
            card.querySelector(".network-meter span").style.setProperty("--meter-value", `${zone.network}%`);
            const building = campusBuildings.find(item => item.name === zone.name);
            if (building) {
                card.tabIndex = 0;
                card.setAttribute("role", "button");
                card.setAttribute("aria-label", `Open ${building.name} details`);
                card.addEventListener("click", () => {
                    showPage("buildings");
                    openBuildingRooms(building.name);
                });
                card.addEventListener("keydown", event => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        card.click();
                    }
                });
            }
            return card;
        }));
    }

    function renderCoverageView() {
        const grid = document.querySelector("#coverage-building-grid");
        if (!grid) return;

        const buildings = campusBuildings.length ? campusBuildings : demoBuildings;
        const coverage = Number.parseFloat(campusStats.campus_coverage) || Math.round(buildings.reduce((total, building) => total + Number(building.mapped || 0), 0) / buildings.length);
        const summary = document.querySelector("#coverage-overall");
        const ring = document.querySelector("#coverage-ring");
        if (summary) summary.textContent = `${coverage}%`;
        if (ring) {
            ring.style.setProperty("--coverage-angle", `${coverage * 3.6}deg`);
            ring.setAttribute("aria-label", `Campus coverage ${coverage} percent`);
        }

        grid.replaceChildren(...buildings.map(building => {
            const card = document.createElement("article");
            card.className = "coverage-building-card";
            card.innerHTML = `<div class="coverage-building-heading"><strong></strong><span></span></div><div class="coverage-meter"><span></span></div><small>Digitally mapped</small>`;
            card.querySelector(".coverage-building-heading strong").textContent = building.name;
            card.querySelector(".coverage-building-heading span").textContent = `${building.mapped}%`;
            card.querySelector(".coverage-meter span").style.setProperty("--meter-value", `${building.mapped}%`);
            card.tabIndex = 0;
            card.setAttribute("role", "button");
            card.setAttribute("aria-label", `Open ${building.name} details`);
            card.addEventListener("click", () => {
                showPage("buildings");
                openBuildingRooms(building.name);
            });
            card.addEventListener("keydown", event => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    card.click();
                }
            });
            return card;
        }));
    }

    function renderAnalyticsView() {
        const setText = (selector, value) => {
            const element = document.querySelector(selector);
            if (element && value !== undefined && value !== null) element.textContent = value;
        };
        setText("#analytics-energy", `${campusStats.total_energy || "324"} kWh`);
        setText("#analytics-occupancy", campusStats.total_occupancy || "2,846");
        setText("#analytics-network", `${Math.round(networkZones.reduce((sum, zone) => sum + zone.network, 0) / networkZones.length)}%`);
        setText("#analytics-issues", alertRecords.filter(alert => alert.status === "active").length);
        setText("#analytics-buildings", `${campusBuildings.filter(building => !["offline", "critical"].includes(String(building.status).toLowerCase())).length} / ${campusBuildings.length}`);
        setText("#analytics-coverage", `${Number.parseFloat(campusStats.campus_coverage) || Math.round(campusBuildings.reduce((sum, building) => sum + Number(building.mapped || 0), 0) / campusBuildings.length)}%`);

        const chart = document.querySelector("#analytics-energy-chart");
        if (!chart) return;
        const maxValue = Math.max(...weeklyEnergy.map(item => Number(item.value) || 0), 1);
        chart.replaceChildren(...weeklyEnergy.map(item => {
            const bar = document.createElement("div");
            bar.className = "energy-bar";
            bar.style.height = `${Math.max(28, Number(item.value) / maxValue * 190)}px`;
            const label = document.createElement("span");
            label.textContent = item.day;
            bar.append(label);
            bar.title = `${item.day}: ${item.value} kWh`;
            bar.setAttribute("aria-label", bar.title);
            return bar;
        }));
    }

    function showDataSection(section) {
        if (!section) return;
        section.style.display = "block";
        section.classList.add("active-section");
    }


    /* =====================================================
       SHOW OVERVIEW
    ===================================================== */

    function showOverview() {

        [
            buildingsSection,
            energySection,
            occupancySection,
            sensorsSection,
            alertsSection,
            settingsSection
        ].forEach(section => {

            if (!section) return;

            section.style.display =
                "none";

            section.classList.remove(
                "active-section"
            );

        });


        if (hero)
            hero.style.display = "";


        if (stats)
            stats.style.display = "";


        if (workspace)
            workspace.style.display = "";


        if (bottomGrid)
            bottomGrid.style.display = "";

    }


    /* =====================================================
       SHOW BUILDINGS
    ===================================================== */

    function showBuildings() {

        [
            energySection,
            occupancySection,
            sensorsSection,
            alertsSection,
            settingsSection
        ].forEach(section => {

            if (!section) return;

            section.style.display =
                "none";

            section.classList.remove(
                "active-section"
            );

        });


        if (hero)
            hero.style.display =
                "none";


        if (stats)
            stats.style.display =
                "none";


        if (workspace)
            workspace.style.display =
                "none";


        if (bottomGrid)
            bottomGrid.style.display =
                "none";


        if (buildingsSection) {

            buildingsSection.style.display =
                "block";

            buildingsSection.classList.add(
                "active-section"
            );

        }

    }


    /* =====================================================
       SHOW ENERGY
    ===================================================== */

    function showEnergy() {

        [
            buildingsSection,
            occupancySection,
            sensorsSection,
            alertsSection,
            settingsSection
        ].forEach(section => {

            if (!section) return;

            section.style.display =
                "none";

            section.classList.remove(
                "active-section"
            );

        });


        if (hero)
            hero.style.display =
                "none";


        if (stats)
            stats.style.display =
                "none";


        if (workspace)
            workspace.style.display =
                "none";


        if (bottomGrid)
            bottomGrid.style.display =
                "none";


        if (energySection) {

            energySection.style.display =
                "block";

            energySection.classList.add(
                "active-section"
            );

        }

    }


    /* =====================================================
       SHOW OCCUPANCY
    ===================================================== */

    function showOccupancy() {

        [
            buildingsSection,
            energySection,
            sensorsSection,
            alertsSection,
            settingsSection
        ].forEach(section => {

            if (!section) return;

            section.style.display =
                "none";

            section.classList.remove(
                "active-section"
            );

        });


        if (hero)
            hero.style.display =
                "none";


        if (stats)
            stats.style.display =
                "none";


        if (workspace)
            workspace.style.display =
                "none";


        if (bottomGrid)
            bottomGrid.style.display =
                "none";


        if (occupancySection) {

            occupancySection.style.display =
                "block";

            occupancySection.classList.add(
                "active-section"
            );

        }

    }


    /* =====================================================
       SHOW SENSORS
    ===================================================== */

    function showSensors() {

        [
            buildingsSection,
            energySection,
            occupancySection,
            alertsSection,
            settingsSection
        ].forEach(section => {

            if (!section) return;

            section.style.display =
                "none";

            section.classList.remove(
                "active-section"
            );

        });


        if (hero)
            hero.style.display =
                "none";


        if (stats)
            stats.style.display =
                "none";


        if (workspace)
            workspace.style.display =
                "none";


        if (bottomGrid)
            bottomGrid.style.display =
                "none";


        if (sensorsSection) {

            sensorsSection.style.display =
                "block";

            sensorsSection.classList.add(
                "active-section"
            );

        }

    }


    /* =====================================================
       SHOW ALERTS
    ===================================================== */

    function showAlerts() {

        [
            buildingsSection,
            energySection,
            occupancySection,
            sensorsSection,
            settingsSection
        ].forEach(section => {

            if (!section) return;

            section.style.display =
                "none";

            section.classList.remove(
                "active-section"
            );

        });


        if (hero)
            hero.style.display =
                "none";


        if (stats)
            stats.style.display =
                "none";


        if (workspace)
            workspace.style.display =
                "none";


        if (bottomGrid)
            bottomGrid.style.display =
                "none";


        if (alertsSection) {

            alertsSection.style.display =
                "block";

            alertsSection.classList.add(
                "active-section"
            );

        }

    }


    /* =====================================================
       SHOW SETTINGS
    ===================================================== */

    function showSettings() {

        [
            buildingsSection,
            energySection,
            occupancySection,
            sensorsSection,
            alertsSection
        ].forEach(section => {

            if (!section) return;

            section.style.display =
                "none";

            section.classList.remove(
                "active-section"
            );

        });


        if (hero)
            hero.style.display =
                "none";


        if (stats)
            stats.style.display =
                "none";


        if (workspace)
            workspace.style.display =
                "none";


        if (bottomGrid)
            bottomGrid.style.display =
                "none";


        if (settingsSection) {

            settingsSection.style.display =
                "block";

            settingsSection.classList.add(
                "active-section"
            );

        }

    }


    function showPage(page, updateHistory = true) {
        const pageName = page.split("/")[0];
        const pageRenderers = {
            overview: showOverview,
            buildings: showBuildings,
            energy: showEnergy,
            occupancy: showOccupancy,
            sensors: showSensors,
            alerts: showAlerts,
            settings: showSettings,
            network: () => showDataSection(networkSection),
            coverage: () => showDataSection(coverageSection),
            analytics: () => showDataSection(analyticsSection)
        };
        const renderPage = pageRenderers[pageName];

        if (!renderPage) return;

        document.querySelectorAll(".page-section").forEach(section => {
            section.style.display = "none";
            section.classList.remove("active-section");
        });
        [hero, stats, workspace, bottomGrid].forEach(section => {
            if (section) section.style.display = "none";
        });
        if (workspace) workspace.classList.remove("twin-focus");

        renderPage();
        if (pageName === "network") renderNetworkView();
        if (pageName === "coverage") renderCoverageView();
        if (pageName === "analytics") renderAnalyticsView();
        const matchingNav = [...navItems].find(item =>
            item.querySelector("p")?.textContent.trim().toLowerCase() === pageName
        );
        navItems.forEach(item => {
            item.classList.toggle("active", item === matchingNav || (!matchingNav && item.querySelector("p")?.textContent.trim() === "Overview"));
        });

        if (updateHistory && window.location.hash !== `#${page}`) {
            window.history.pushState({ page }, "", `#${page}`);
        }
    }


    function restoreDashboardHash() {
        const parts = window.location.hash.slice(1).split("/").filter(Boolean).map(part => {
            try { return decodeURIComponent(part); } catch { return part; }
        });
        const page = parts[0] || "overview";
        showPage(page, false);
        if (page !== "buildings" || !parts[1]) return;

        const buildingName = parts[1];
        openBuildingRooms(buildingName, false, false);
        if (parts[2] === "room" && parts[3]) {
            const roomName = parts[3];
            const roomButton = [...document.querySelectorAll("#room-grid .room-card")]
                .find(card => card.dataset.room === roomName);
            roomButton?.classList.add("selected");
            showRoomTimetable(buildingName, roomName, false);
        } else if (parts[2] === "lab" && parts[3]) {
            const lab = getLabModels(buildingName).map((item, index) => createLabModel(buildingName, item, index))
                .find(item => item.name === parts[3]);
            if (lab) showFacilityDetails("lab", buildingName, lab, false);
        } else if (parts[2] === "library" && parts[3]) {
            const library = renderLibraries(buildingName).find(item => item.name === parts[3]);
            if (library) showFacilityDetails("library", buildingName, library, false);
        }
    }

    window.addEventListener("popstate", () => {
        restoreDashboardHash();
    });


    /* =====================================================
       NAV CLICK
    ===================================================== */

    navItems.forEach(item => {

        item.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const sectionName =
                    item.querySelector("p")
                    ?.textContent
                    .trim();

                showPage(sectionName?.toLowerCase());

            }
        );

    });

    navItems.forEach(item => {
        const label = item.querySelector("p")?.textContent.trim().toLowerCase();
        if (label) {
            item.setAttribute("href", `#${label}`);
            item.setAttribute("aria-label", label[0].toUpperCase() + label.slice(1));
            item.setAttribute("title", label[0].toUpperCase() + label.slice(1));
        }
    });

    document.querySelectorAll(".stat-card[data-dashboard-view]").forEach(card => {
        const openView = () => {
            const view = card.dataset.dashboardView;
            showPage(view);
            if (view === "alerts") {
                document.querySelector("#dashboard-search").value = "";
                document.querySelector("#alerts-building-filter").value = "all";
                closeSearchResults();
                document.querySelector('.alert-filter[data-alert-filter="active"]')?.click();
            }
        };
        card.addEventListener("click", openView);
        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openView();
            }
        });
    });

    document.querySelector("#explore-digital-twin")?.addEventListener("click", () => {
        showPage("overview");
        workspace?.classList.add("twin-focus");
        campusView?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    document.querySelector("#view-analytics")?.addEventListener("click", () => showPage("analytics"));
    const showFullAlertList = () => {
        showPage("alerts");
        const search = document.querySelector("#dashboard-search");
        if (search) search.value = "";
        const buildingFilter = document.querySelector("#alerts-building-filter");
        if (buildingFilter) buildingFilter.value = "all";
        closeSearchResults();
        document.querySelector('.alert-filter[data-alert-filter="all"]')?.click();
    };
    document.querySelector("#see-all-alerts")?.addEventListener("click", showFullAlertList);
    document.querySelector("#notifications-button")?.addEventListener("click", showFullAlertList);
    document.querySelector("#profile-button")?.addEventListener("click", () => showPage("settings"));
    document.querySelector(".zone-card .more-btn")?.addEventListener("click", () => showPage("occupancy"));
    document.querySelector(".bottom-grid .energy-card .dropdown")?.addEventListener("click", () => showPage("energy"));
    document.querySelector("#energy-section .dropdown")?.addEventListener("click", loadBackendEnergy);
    document.querySelector("#occupancy-section .dropdown")?.addEventListener("click", loadBackendOccupancy);

    document.querySelectorAll(".building-card").forEach(card => {
        card.tabIndex = 0;
        card.setAttribute("role", "group");
        card.setAttribute("aria-label", `${card.querySelector("h3")?.textContent.trim() || "Building"} details`);
        card.addEventListener("click", event => {
            if (event.target.closest("button")) return;
            const name = card.querySelector("h3")?.textContent.trim();
            if (name) openBuildingRooms(name);
        });
        card.addEventListener("keydown", event => {
            if ((event.key === "Enter" || event.key === " ") && event.target === card) {
                event.preventDefault();
                card.querySelector(".view-building")?.click();
            }
        });
    });

    const searchInput = document.querySelector("#dashboard-search");
    const searchResults = document.querySelector("#search-results");
    let searchSensors = [
        { name: "Temperature Sensor", location: "Block 1 · Room 203", code: "SNS-TMP-101" },
        { name: "Occupancy Sensor", location: "Library · Floor 1", code: "SNS-OCC-102" },
        { name: "Energy Sensor", location: "Block 1", code: "SNS-PWR-103" },
        { name: "Air Quality Sensor", location: "Science Lab · Floor 2", code: "SNS-AQI-104" },
        { name: "Motion Sensor", location: "Block 6 · Corridor", code: "SNS-MOT-106" }
    ];

    function closeSearchResults() {
        if (!searchResults || !searchInput) return;
        searchResults.hidden = true;
        searchInput.setAttribute("aria-expanded", "false");
    }

    function renderSearchResults() {
        if (!searchInput || !searchResults) return;
        const query = searchInput.value.trim().toLowerCase();
        searchResults.replaceChildren();
        if (!query) {
            closeSearchResults();
            return;
        }

        const results = [
            ...campusBuildings.map(building => ({ name: building.name, detail: building.type, page: "buildings", kind: "building" })),
            ...searchSensors.map(sensor => ({ name: sensor.name, detail: `${sensor.location} · ${sensor.code}`, page: "sensors", kind: "sensor" })),
            ...["Library", "Science Lab", "Campus Core", "Sports Centre"].map(name => ({ name, detail: "Campus zone", page: "occupancy", kind: "zone" })),
            ...alertRecords.map(alert => ({ name: alert.title, detail: `${alert.location} · ${alert.severity}`, page: "alerts", kind: "alert", alert }))
        ].filter(item => `${item.name} ${item.detail}`.toLowerCase().includes(query)).slice(0, 8);

        if (!results.length) {
            const empty = document.createElement("div");
            empty.className = "search-empty";
            empty.textContent = "No matching campus records";
            searchResults.append(empty);
        } else {
            results.forEach(result => {
                const option = document.createElement("button");
                option.type = "button";
                option.className = "search-result";
                option.setAttribute("role", "option");
                const name = document.createElement("strong");
                const detail = document.createElement("small");
                name.textContent = result.name;
                detail.textContent = result.detail;
                option.append(name, detail);
                option.addEventListener("click", () => {
                    closeSearchResults();
                    showPage(result.page);
                    if (result.kind === "building") openBuildingRooms(result.name);
                    if (result.kind === "alert") showAlertDetails(result.alert);
                    if (result.kind === "sensor") {
                        window.setTimeout(() => {
                            const row = [...document.querySelectorAll("#sensors-section .sensor-row")]
                                .find(sensorRow => sensorRow.textContent.toLowerCase().includes(result.name.toLowerCase()));
                            row?.scrollIntoView({ behavior: "smooth", block: "center" });
                            row?.click();
                        }, 0);
                    }
                });
                searchResults.append(option);
            });
        }
        searchResults.hidden = false;
        searchInput.setAttribute("aria-expanded", "true");
    }

    searchInput?.addEventListener("input", renderSearchResults);
    searchInput?.addEventListener("keydown", event => {
        if (event.key === "Escape") closeSearchResults();
        if (event.key === "Enter" && searchResults && !searchResults.hidden) {
            event.preventDefault();
            searchResults.querySelector(".search-result")?.click();
        }
    });
    document.addEventListener("click", event => {
        if (!event.target.closest(".search")) closeSearchResults();
    });


    /* =====================================================
       SENSOR SECTION INTERACTIONS
    ===================================================== */

    const sensorRows =
        document.querySelectorAll(
            "#sensors-section .sensor-row"
        );


    const sensorLiveData =
        document.querySelector(
            "#sensor-live-data"
        );


    const sensorLastUpdated =
        document.querySelector(
            "#sensor-last-updated"
        );


    const sensorLiveStatus =
        document.querySelector(
            "#sensor-live-status"
        );


    function refreshSensorTimestamp() {

        const liveSettings =
            getStoredSettings();


        if (
            !liveSettings.liveData ||
            !liveSettings.sensorRefresh
        ) {
            return;
        }


        const updatedAt =
            new Date()
            .toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            );


        if (sensorLastUpdated) {

            sensorLastUpdated.textContent =
                `Last updated ${updatedAt}`;

        }


        if (sensorLiveStatus) {

            sensorLiveStatus.textContent =
                "Live monitoring active";

        }

    }


    sensorRows.forEach(row => {

        row.addEventListener(
            "click",
            () => {

                sensorRows.forEach(item => {

                    item.classList.remove(
                        "selected"
                    );

                });


                row.classList.add(
                    "selected"
                );


                if (sensorLiveStatus) {

                    sensorLiveStatus.textContent =
                        `${
                            row.querySelector(
                                ".sensor-device strong"
                            )?.textContent ||
                            "Sensor"
                        } selected`;

                }

            }
        );


        row.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    row.click();

                }

            }
        );

    });


    if (sensorLiveData) {

        sensorLiveData.addEventListener(
            "click",
            refreshSensorTimestamp
        );

    }


    setInterval(
        refreshSensorTimestamp,
        30000
    );


    /* =====================================================
       ALERT INTERACTIONS
    ===================================================== */

    const alertFilters =
        document.querySelectorAll(
            ".alert-filter"
        );


    const alertSearch =
        document.querySelector(
            ".search input"
        );


    const alertsLastUpdated =
        document.querySelector(
            "#alerts-last-updated"
        );


    function getActiveAlertFilter() {
        return document.querySelector(".alert-filter.active")?.dataset.alertFilter || "all";
    }

    function updateAlertStats() {
        const notDismissed = alertRecords.filter(alert => alert.status !== "dismissed");
        const counts = {
            "#alerts-total": notDismissed.length,
            "#alerts-critical": notDismissed.filter(alert => alert.severity === "critical").length,
            "#alerts-warning": notDismissed.filter(alert => alert.severity === "warning").length,
            "#alerts-resolved": alertRecords.filter(alert => alert.status === "resolved").length
        };
        Object.entries(counts).forEach(([selector, count]) => {
            const element = document.querySelector(selector);
            if (element) element.textContent = count;
        });

        const emptyState = document.querySelector(".alerts-empty");
        if (emptyState) {
            emptyState.hidden = [...document.querySelectorAll("#alerts-list .alert-page-row")]
                .some(row => !row.hidden);
        }
        const issueCount = document.querySelector("#stat-active-issues");
        const activeCount = alertRecords.filter(alert => alert.status === "active").length;
        if (issueCount) issueCount.textContent = activeCount;
        const notificationCount = document.querySelector("#notifications-button b");
        if (notificationCount) notificationCount.textContent = activeCount;
        renderAnalyticsView();
    }

    function formatAlertTime(value) {
        if (!value) return "Time unavailable";
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
    }

    function showAlertDetails(alert) {
        if (!alert) return;
        const fields = {
            "#alert-detail-title": alert.title || "Campus alert",
            "#alert-detail-state": (alert.status || "active").replace(/^./, char => char.toUpperCase()),
            "#alert-detail-description": alert.description || "No additional details are available.",
            "#alert-detail-location": alert.location || "Campus",
            "#alert-detail-source": alert.category || alert.source || "Monitoring system",
            "#alert-detail-time": formatAlertTime(alert.created_at || alert.timestamp)
        };
        Object.entries(fields).forEach(([selector, value]) => {
            const element = document.querySelector(selector);
            if (element) element.textContent = value;
        });
        const severity = document.querySelector("#alert-detail-severity");
        if (severity) {
            const level = alert.severity || "info";
            severity.textContent = level.replace(/^./, char => char.toUpperCase());
            severity.className = `alert-status ${level === "resolved" ? "resolved" : `${level}-status`}`;
        }
        const dialog = document.querySelector("#alert-detail-dialog");
        if (dialog && !dialog.open) dialog.showModal();
    }

    function renderAlertsList() {
        const list = document.querySelector("#alerts-list");
        if (!list) return;
        list.replaceChildren(...alertRecords.map(alert => {
            const article = document.createElement("article");
            article.className = "alert alert-page-row";
            article.dataset.id = alert.id ?? "";
            article.dataset.severity = alert.severity || "info";
            article.dataset.status = alert.status || "active";
            article.tabIndex = 0;
            article.setAttribute("role", "group");
            article.setAttribute("aria-label", alert.title || "Campus alert");
            article.innerHTML = `<div class="alert-icon"></div><div class="alert-text"><strong></strong><small></small><p></p></div><span class="alert-status"></span><button class="alert-action dismiss-alert" type="button">Dismiss</button><button class="alert-action resolve-alert" type="button">Resolve</button>`;
            const severity = alert.severity || "info";
            const status = alert.status || "active";
            const icon = article.querySelector(".alert-icon");
            icon.classList.add(severity === "critical" ? "red" : severity === "resolved" ? "blue" : "yellow");
            icon.textContent = severity === "critical" ? "!" : status === "resolved" ? "✓" : "ϟ";
            article.querySelector(".alert-text strong").textContent = alert.title || "Campus alert";
            article.querySelector(".alert-text small").textContent = `${alert.location || "Campus"} · ${alert.category || "System"} · ${formatAlertTime(alert.created_at)}${alert.id ? " · MySQL" : " · Demo data"}`;
            article.querySelector(".alert-text p").textContent = alert.description || "No additional details are available.";
            const badge = article.querySelector(".alert-status");
            badge.textContent = status === "resolved" ? "Resolved" : severity.replace(/^./, char => char.toUpperCase());
            badge.classList.add(status === "resolved" ? "resolved" : `${severity}-status`);
            article.querySelector(".dismiss-alert").hidden = status !== "active";
            article.querySelector(".resolve-alert").hidden = status !== "active";
            article.addEventListener("click", event => {
                if (!event.target.closest("button")) showAlertDetails(alert);
            });
            article.addEventListener("keydown", event => {
                if (event.target === article && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    showAlertDetails(alert);
                }
            });
            article.querySelector(".dismiss-alert").addEventListener("click", () => updateAlert(alert, "dismissed"));
            article.querySelector(".resolve-alert").addEventListener("click", () => updateAlert(alert, "resolved"));
            return article;
        }));
        filterAlerts(getActiveAlertFilter());
        renderRecentAlerts();
    }

    function renderRecentAlerts() {
        const recentItems = [...document.querySelectorAll("[data-recent-alert]")];
        const visibleAlerts = alertRecords.filter(alert => alert.status !== "dismissed").slice(0, recentItems.length);
        recentItems.forEach((item, index) => {
            const alert = visibleAlerts[index];
            if (!alert) {
                item.hidden = true;
                return;
            }
            item.hidden = false;
            item.dataset.alertIndex = String(alertRecords.indexOf(alert));
            item.querySelector(".alert-text strong").textContent = alert.title;
            item.querySelector(".alert-text small").textContent = `${alert.category || "Campus"} · ${alert.location || "Campus"} · ${formatAlertTime(alert.created_at)}`;
            const status = item.querySelector(".alert-status");
            status.textContent = alert.status === "resolved" ? "Resolved" : alert.severity.replace(/^./, char => char.toUpperCase());
            status.className = `alert-status ${alert.status === "resolved" ? "resolved" : `${alert.severity}-status`}`;
            item.querySelector(".alert-icon").className = `alert-icon ${alert.severity === "critical" ? "red" : alert.status === "resolved" ? "blue" : "yellow"}`;
        });
    }

    async function updateAlert(alert, newStatus) {
        if (alert.id) {
            try {
                const response = await fetch(`${API_BASE}/api/alerts/${alert.id}/${newStatus === "resolved" ? "resolve" : "dismiss"}`, { method: "POST" });
                if (!response.ok) throw new Error("Could not update the alert in MySQL.");
            } catch (error) {
                if (alertsLastUpdated) alertsLastUpdated.textContent = "Alert update failed; database unavailable";
                return;
            }
        }
        alert.status = newStatus;
        if (newStatus === "resolved") alert.severity = "resolved";
        renderAlertsList();
        updateAlertStats();
    }

    function filterAlerts(filter = "all") {
        const rows = [...document.querySelectorAll("#alerts-list .alert-page-row")];
        const searchTerm = alertSearch?.value.trim().toLowerCase() || "";
        const building = document.querySelector("#alerts-building-filter")?.value || "all";
        rows.forEach(row => {
            const matchesFilter = filter === "all" || row.dataset.severity === filter || row.dataset.status === filter;
            const matchesSearch = !searchTerm || row.textContent.toLowerCase().includes(searchTerm);
            const matchesBuilding = building === "all" || row.querySelector(".alert-text small")?.textContent.toLowerCase().includes(building);
            row.hidden = !(matchesFilter && matchesSearch && matchesBuilding);
        });
        updateAlertStats();
    }

    alertFilters.forEach(button => button.addEventListener("click", () => {
        alertFilters.forEach(item => item.classList.toggle("active", item === button));
        filterAlerts(button.dataset.alertFilter);
    }));

    alertSearch?.addEventListener("input", () => {
        if (alertsSection?.classList.contains("active-section")) filterAlerts(getActiveAlertFilter());
    });
    document.querySelector("#alerts-building-filter")?.addEventListener("change", () => filterAlerts(getActiveAlertFilter()));

    document.querySelector("#alert-detail-back")?.addEventListener("click", () => document.querySelector("#alert-detail-dialog")?.close());
    document.querySelector("#alert-detail-list")?.addEventListener("click", () => {
        document.querySelector("#alert-detail-dialog")?.close();
        showPage("alerts");
    });
    document.querySelector("#alert-detail-dialog")?.addEventListener("click", event => {
        if (event.target === event.currentTarget) event.currentTarget.close();
    });
    document.querySelectorAll("[data-recent-alert]").forEach(item => {
        const openAlert = () => {
            const alert = alertRecords[Number(item.dataset.alertIndex)];
            if (!alert) return;
            showPage("alerts");
            showAlertDetails(alert);
        };
        item.addEventListener("click", openAlert);
        item.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openAlert();
            }
        });
    });

    renderAlertsList();


    setInterval(
        () => {

            if (
                getStoredSettings()
                    .liveData &&
                alertsLastUpdated
            ) {

                alertsLastUpdated.textContent =
                    `Last updated ${
                        new Date()
                            .toLocaleTimeString(
                                [],
                                {
                                    hour:
                                        "2-digit",
                                    minute:
                                        "2-digit"
                                }
                            )
                    }`;

            }

        },
        30000
    );


    /* =====================================================
       SETTINGS
    ===================================================== */

    const settingsDefaults = {

        refreshInterval: "15",

        liveData: true,

        defaultView: "Overview",

        enableAlerts: true,

        criticalAlerts: true,

        warningAlerts: true,

        sensorRefresh: true,

        sensorHealth: true,

        offlineAlerts: true,

        density: "comfortable",

        systemStatus: true,

        timestamps: true

    };


    const settingsStorageKey =
        "campusDashboardSettings";


    const settingsControls = {

        refreshInterval:
            document.querySelector(
                "#settings-refresh-interval"
            ),

        liveData:
            document.querySelector(
                "#settings-live-data"
            ),

        defaultView:
            document.querySelector(
                "#settings-default-view"
            ),

        enableAlerts:
            document.querySelector(
                "#settings-enable-alerts"
            ),

        criticalAlerts:
            document.querySelector(
                "#settings-critical-alerts"
            ),

        warningAlerts:
            document.querySelector(
                "#settings-warning-alerts"
            ),

        sensorRefresh:
            document.querySelector(
                "#settings-sensor-refresh"
            ),

        sensorHealth:
            document.querySelector(
                "#settings-sensor-health"
            ),

        offlineAlerts:
            document.querySelector(
                "#settings-offline-alerts"
            ),

        density:
            document.querySelector(
                "#settings-density"
            ),

        systemStatus:
            document.querySelector(
                "#settings-system-status"
            ),

        timestamps:
            document.querySelector(
                "#settings-timestamps"
            )

    };


    function getStoredSettings() {

        try {

            return {

                ...settingsDefaults,

                ...(
                    JSON.parse(
                        localStorage.getItem(
                            settingsStorageKey
                        )
                    ) || {}
                )

            };

        } catch (error) {

            return {
                ...settingsDefaults
            };

        }

    }


    function applySettings(
        settings
    ) {

        Object.entries(
            settingsControls
        ).forEach(
            ([key, control]) => {

                if (!control)
                    return;


                if (
                    control.type ===
                    "checkbox"
                ) {

                    control.checked =
                        Boolean(
                            settings[key]
                        );

                } else {

                    control.value =
                        settings[key];

                }

            }
        );


        const systemStatus =
            document.querySelector(
                ".system-status"
            );


        if (systemStatus) {

            systemStatus.hidden =
                !settings.systemStatus;

        }


        document.body.classList.toggle(
            "settings-compact",
            settings.density ===
                "compact"
        );


        document.body.classList.toggle(
            "settings-hide-timestamps",
            !settings.timestamps
        );

    }


    function readSettingsFromControls() {

        return Object.fromEntries(

            Object.entries(
                settingsControls
            ).map(
                ([key, control]) => [

                    key,

                    control.type ===
                    "checkbox"

                        ? control.checked

                        : control.value

                ]
            )

        );

    }


    function showSettingsFeedback(
        message
    ) {

        const feedback =
            document.querySelector(
                "#settings-feedback"
            );


        if (feedback)
            feedback.textContent =
                message;

    }


    function saveSettings() {

        const settings =
            readSettingsFromControls();


        localStorage.setItem(
            settingsStorageKey,
            JSON.stringify(
                settings
            )
        );


        applySettings(
            settings
        );


        const sync =
            document.querySelector(
                "#settings-last-sync"
            );


        if (sync) {

            sync.textContent =
                new Date()
                    .toLocaleTimeString(
                        [],
                        {
                            hour:
                                "2-digit",
                            minute:
                                "2-digit"
                        }
                    );

        }


        showSettingsFeedback(
            "Settings saved successfully."
        );

        if (typeof API_BASE !== "undefined") {
            fetch(`${API_BASE}/api/settings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings)
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showSettingsFeedback("Settings saved to MySQL successfully.");
                }
            })
            .catch(err => {
                console.warn("Could not save settings to MySQL:", err);
            });
        }

    }


    const storedSettings =
        getStoredSettings();


    applySettings(
        storedSettings
    );


    if (
        !window.location.hash &&
        storedSettings.defaultView !==
        "Overview"
    ) {

        const defaultViewNav =
            [
                ...navItems
            ].find(
                item =>
                    item.querySelector("p")
                        ?.textContent
                        .trim() ===
                    storedSettings.defaultView
            );


        defaultViewNav?.click();

    }


    document.querySelector(
        "#settings-save"
    )?.addEventListener(
        "click",
        saveSettings
    );


    document.querySelector(
        "#settings-reset"
    )?.addEventListener(
        "click",
        () => {

            localStorage.setItem(
                settingsStorageKey,
                JSON.stringify(
                    settingsDefaults
                )
            );


            applySettings(
                settingsDefaults
            );


            showSettingsFeedback(
                "Default settings restored."
            );

        }
    );


    /* =====================================================
       BUILDING FILTER BUTTONS
    ===================================================== */

    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    btn => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                const filter =
                    button.textContent
                        .trim();


                const buildingCards =
                    document.querySelectorAll(
                        ".building-card"
                    );


                buildingCards.forEach(
                    card => {

                        const type =
                            card.querySelector(
                                "p"
                            )?.textContent
                                .trim();


                        if (
                            filter ===
                            "All Buildings"
                        ) {

                            card.style.display =
                                "";

                        } else if (
                            filter ===
                            "Academic"
                        ) {

                            if (
                                type ===
                                "Academic Block"
                            ) {

                                card.style.display =
                                    "";

                            } else {

                                card.style.display =
                                    "none";

                            }

                        } else if (
                            filter ===
                            "Hostels"
                        ) {

                            if (
                                type &&
                                type
                                    .toLowerCase()
                                    .includes(
                                        "hostel"
                                    )
                            ) {

                                card.style.display =
                                    "";

                            } else {

                                card.style.display =
                                    "none";

                            }

                        } else {

                            card.style.display =
                                "";

                        }

                    }
                );

            }
        );

    });


    /* =====================================================
       ROOM DATA
    ===================================================== */

    let roomData = {

        "Block 1": {

            "Room 101": [
                [
                    "09:00 - 10:00",
                    "Mathematics",
                    "Dr. Sharma"
                ],
                [
                    "10:00 - 11:00",
                    "Programming in C",
                    "Ms. Gupta"
                ],
                [
                    "11:15 - 12:15",
                    "Physics",
                    "Dr. Verma"
                ],
                [
                    "12:15 - 01:15",
                    "English",
                    "Ms. Mehta"
                ]
            ],

            "Room 102": [
                [
                    "09:00 - 10:00",
                    "Physics",
                    "Dr. Verma"
                ],
                [
                    "10:00 - 11:00",
                    "Mathematics",
                    "Dr. Sharma"
                ],
                [
                    "11:15 - 12:15",
                    "Programming in C",
                    "Ms. Gupta"
                ],
                [
                    "12:15 - 01:15",
                    "Engineering Graphics",
                    "Mr. Singh"
                ]
            ],

            "Room 103": [
                [
                    "09:00 - 10:00",
                    "Programming in C",
                    "Ms. Gupta"
                ],
                [
                    "10:00 - 11:00",
                    "English",
                    "Ms. Mehta"
                ],
                [
                    "11:15 - 12:15",
                    "Mathematics",
                    "Dr. Sharma"
                ],
                [
                    "12:15 - 01:15",
                    "Physics",
                    "Dr. Verma"
                ]
            ],

            "Room 104": [
                [
                    "09:00 - 10:00",
                    "Engineering Graphics",
                    "Mr. Singh"
                ],
                [
                    "10:00 - 11:00",
                    "Physics",
                    "Dr. Verma"
                ],
                [
                    "11:15 - 12:15",
                    "English",
                    "Ms. Mehta"
                ],
                [
                    "12:15 - 01:15",
                    "Programming in C",
                    "Ms. Gupta"
                ]
            ]

        },


        "Block 2": {

            "Room 201": [
                [
                    "09:00 - 10:00",
                    "Mathematics",
                    "Dr. Sharma"
                ],
                [
                    "10:00 - 11:00",
                    "Physics",
                    "Dr. Verma"
                ],
                [
                    "11:15 - 12:15",
                    "Programming in C",
                    "Ms. Gupta"
                ],
                [
                    "12:15 - 01:15",
                    "English",
                    "Ms. Mehta"
                ]
            ],

            "Room 202": [
                [
                    "09:00 - 10:00",
                    "English",
                    "Ms. Mehta"
                ],
                [
                    "10:00 - 11:00",
                    "Mathematics",
                    "Dr. Sharma"
                ],
                [
                    "11:15 - 12:15",
                    "Physics",
                    "Dr. Verma"
                ],
                [
                    "12:15 - 01:15",
                    "Programming in C",
                    "Ms. Gupta"
                ]
            ],

            "Room 203": [
                [
                    "09:00 - 10:00",
                    "Physics",
                    "Dr. Verma"
                ],
                [
                    "10:00 - 11:00",
                    "Programming in C",
                    "Ms. Gupta"
                ],
                [
                    "11:15 - 12:15",
                    "Mathematics",
                    "Dr. Sharma"
                ],
                [
                    "12:15 - 01:15",
                    "English",
                    "Ms. Mehta"
                ]
            ],

            "Room 204": [
                [
                    "09:00 - 10:00",
                    "Programming in C",
                    "Ms. Gupta"
                ],
                [
                    "10:00 - 11:00",
                    "English",
                    "Ms. Mehta"
                ],
                [
                    "11:15 - 12:15",
                    "Physics",
                    "Dr. Verma"
                ],
                [
                    "12:15 - 01:15",
                    "Mathematics",
                    "Dr. Sharma"
                ]
            ]

        },


        "Block 3": {

            "Room 301": [
                [
                    "09:00 - 10:00",
                    "Mathematics",
                    "Dr. Sharma"
                ],
                [
                    "10:00 - 11:00",
                    "Physics",
                    "Dr. Verma"
                ],
                [
                    "11:15 - 12:15",
                    "English",
                    "Ms. Mehta"
                ],
                [
                    "12:15 - 01:15",
                    "Programming in C",
                    "Ms. Gupta"
                ]
            ],

            "Room 302": [
                [
                    "09:00 - 10:00",
                    "Physics",
                    "Dr. Verma"
                ],
                [
                    "10:00 - 11:00",
                    "Mathematics",
                    "Dr. Sharma"
                ],
                [
                    "11:15 - 12:15",
                    "Programming in C",
                    "Ms. Gupta"
                ],
                [
                    "12:15 - 01:15",
                    "English",
                    "Ms. Mehta"
                ]
            ],

            "Room 303": [
                [
                    "09:00 - 10:00",
                    "Programming in C",
                    "Ms. Gupta"
                ],
                [
                    "10:00 - 11:00",
                    "English",
                    "Ms. Mehta"
                ],
                [
                    "11:15 - 12:15",
                    "Mathematics",
                    "Dr. Sharma"
                ],
                [
                    "12:15 - 01:15",
                    "Physics",
                    "Dr. Verma"
                ]
            ],

            "Room 304": [
                [
                    "09:00 - 10:00",
                    "English",
                    "Ms. Mehta"
                ],
                [
                    "10:00 - 11:00",
                    "Physics",
                    "Dr. Verma"
                ],
                [
                    "11:15 - 12:15",
                    "Mathematics",
                    "Dr. Sharma"
                ],
                [
                    "12:15 - 01:15",
                    "Programming in C",
                    "Ms. Gupta"
                ]
            ]

        },


        "Block 4": {

            "Room 401": [
                [
                    "09:00 - 10:00",
                    "Mathematics",
                    "Dr. Sharma"
                ],
                [
                    "10:00 - 11:00",
                    "Programming in C",
                    "Ms. Gupta"
                ],
                [
                    "11:15 - 12:15",
                    "Physics",
                    "Dr. Verma"
                ],
                [
                    "12:15 - 01:15",
                    "English",
                    "Ms. Mehta"
                ]
            ],

            "Room 402": [
                [
                    "09:00 - 10:00",
                    "Physics",
                    "Dr. Verma"
                ],
                [
                    "10:00 - 11:00",
                    "English",
                    "Ms. Mehta"
                ],
                [
                    "11:15 - 12:15",
                    "Mathematics",
                    "Dr. Sharma"
                ],
                [
                    "12:15 - 01:15",
                    "Programming in C",
                    "Ms. Gupta"
                ]
            ],

            "Room 403": [
                [
                    "09:00 - 10:00",
                    "English",
                    "Ms. Mehta"
                ],
                [
                    "10:00 - 11:00",
                    "Mathematics",
                    "Dr. Sharma"
                ],
                [
                    "11:15 - 12:15",
                    "Physics",
                    "Dr. Verma"
                ],
                [
                    "12:15 - 01:15",
                    "Programming in C",
                    "Ms. Gupta"
                ]
            ]

        },


        "Block 5": {

            "Room 501": [
                [
                    "09:00 - 10:00",
                    "Mathematics",
                    "Dr. Sharma"
                ],
                [
                    "10:00 - 11:00",
                    "Physics",
                    "Dr. Verma"
                ],
                [
                    "11:15 - 12:15",
                    "English",
                    "Ms. Mehta"
                ],
                [
                    "12:15 - 01:15",
                    "Programming in C",
                    "Ms. Gupta"
                ]
            ],

            "Room 502": [
                [
                    "09:00 - 10:00",
                    "Programming in C",
                    "Ms. Gupta"
                ],
                [
                    "10:00 - 11:00",
                    "Mathematics",
                    "Dr. Sharma"
                ],
                [
                    "11:15 - 12:15",
                    "Physics",
                    "Dr. Verma"
                ],
                [
                    "12:15 - 01:15",
                    "English",
                    "Ms. Mehta"
                ]
            ],

            "Room 503": [
                [
                    "09:00 - 10:00",
                    "English",
                    "Ms. Mehta"
                ],
                [
                    "10:00 - 11:00",
                    "Programming in C",
                    "Ms. Gupta"
                ],
                [
                    "11:15 - 12:15",
                    "Mathematics",
                    "Dr. Sharma"
                ],
                [
                    "12:15 - 01:15",
                    "Physics",
                    "Dr. Verma"
                ]
            ]

        },


        "Block 6": {

            "Room 601": [
                [
                    "09:00 - 10:00",
                    "Physics",
                    "Dr. Verma"
                ],
                [
                    "10:00 - 11:00",
                    "Mathematics",
                    "Dr. Sharma"
                ],
                [
                    "11:15 - 12:15",
                    "English",
                    "Ms. Mehta"
                ],
                [
                    "12:15 - 01:15",
                    "Programming in C",
                    "Ms. Gupta"
                ]
            ],

            "Room 602": [
                [
                    "09:00 - 10:00",
                    "Mathematics",
                    "Dr. Sharma"
                ],
                [
                    "10:00 - 11:00",
                    "English",
                    "Ms. Mehta"
                ],
                [
                    "11:15 - 12:15",
                    "Programming in C",
                    "Ms. Gupta"
                ],
                [
                    "12:15 - 01:15",
                    "Physics",
                    "Dr. Verma"
                ]
            ],

            "Room 603": [
                [
                    "09:00 - 10:00",
                    "Programming in C",
                    "Ms. Gupta"
                ],
                [
                    "10:00 - 11:00",
                    "Physics",
                    "Dr. Verma"
                ],
                [
                    "11:15 - 12:15",
                    "Mathematics",
                    "Dr. Sharma"
                ],
                [
                    "12:15 - 01:15",
                    "English",
                    "Ms. Mehta"
                ]
            ]

        },


        "Block 7": {

            "Room 701": [
                [
                    "09:00 - 10:00",
                    "Mathematics",
                    "Dr. Sharma"
                ],
                [
                    "10:00 - 11:00",
                    "English",
                    "Ms. Mehta"
                ],
                [
                    "11:15 - 12:15",
                    "Physics",
                    "Dr. Verma"
                ],
                [
                    "12:15 - 01:15",
                    "Programming in C",
                    "Ms. Gupta"
                ]
            ],

            "Room 702": [
                [
                    "09:00 - 10:00",
                    "Physics",
                    "Dr. Verma"
                ],
                [
                    "10:00 - 11:00",
                    "Programming in C",
                    "Ms. Gupta"
                ],
                [
                    "11:15 - 12:15",
                    "English",
                    "Ms. Mehta"
                ],
                [
                    "12:15 - 01:15",
                    "Mathematics",
                    "Dr. Sharma"
                ]
            ],

            "Room 703": [
                [
                    "09:00 - 10:00",
                    "Programming in C",
                    "Ms. Gupta"
                ],
                [
                    "10:00 - 11:00",
                    "Mathematics",
                    "Dr. Sharma"
                ],
                [
                    "11:15 - 12:15",
                    "Physics",
                    "Dr. Verma"
                ],
                [
                    "12:15 - 01:15",
                    "English",
                    "Ms. Mehta"
                ]
            ]

        }

    };


    /* =====================================================
       BUILDING → ROOM
    ===================================================== */

    const viewButtons =
        document.querySelectorAll(
            ".view-building"
        );


    const buildingRoomView =
        document.querySelector(
            "#building-room-view"
        );


    const selectedBuildingName =
        document.querySelector(
            "#selected-building-name"
        );


    const roomGrid =
        document.querySelector(
            "#room-grid"
        );


    const roomTimetable =
        document.querySelector(
            "#room-timetable"
        );


    const closeBuildingView =
        document.querySelector(
            "#close-building-view"
        );

    const blockOverview = document.querySelector("#block-overview");
    const blockIssueList = document.querySelector("#block-issue-list");
    const labGrid = document.querySelector("#lab-grid");
    const libraryGrid = document.querySelector("#library-grid");
    const facilityDetails = document.querySelector("#facility-details");
    const facilityDetailData = new Map();

    function makeElement(tagName, className, text) {
        const element = document.createElement(tagName);
        if (className) element.className = className;
        if (text !== undefined && text !== null) element.textContent = text;
        return element;
    }

    function getBlockData(buildingName) {
        return campusBuildings.find(building => building.name === buildingName) ||
            demoBuildings.find(building => building.name === buildingName) || {};
    }

    function getBlockProfile(buildingName) {
        return demoBlockProfiles[buildingName] || {
            floors: 1, capacity: 250, network: 92, sensorTotal: 12, sensorsOnline: 11, labs: []
        };
    }

    function getRoomNumber(roomName) {
        return String(roomName).match(/\d+/)?.[0] || String(roomName);
    }

    function getRoomRecord(buildingName, roomName) {
        const records = buildingRoomRecords[buildingName]?.rooms || [];
        const number = getRoomNumber(roomName);
        return records.find(room => String(room.room_number) === number) || null;
    }

    function getRoomSchedule(buildingName, roomName) {
        const schedules = roomData[buildingName] || {};
        const number = getRoomNumber(roomName);
        return schedules[roomName] || schedules[number] || [];
    }

    function parseScheduleMinutes(value) {
        const match = String(value).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
        if (!match) return null;
        let hour = Number(match[1]);
        const minute = Number(match[2]);
        const meridian = (match[3] || "").toUpperCase();
        if (meridian === "PM" && hour < 12) hour += 12;
        if (meridian === "AM" && hour === 12) hour = 0;
        if (!meridian && hour >= 1 && hour <= 5) hour += 12;
        return hour * 60 + minute;
    }

    function getScheduleState(schedule) {
        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        const parsed = schedule.map(item => {
            const parts = String(item[0] || "").split(/[-–]/);
            return {
                item,
                start: parseScheduleMinutes(parts[0]),
                end: parseScheduleMinutes(parts[1])
            };
        }).filter(item => item.start !== null && item.end !== null)
            .sort((left, right) => left.start - right.start);
        const current = parsed.find(item => item.start <= nowMinutes && nowMinutes < item.end)?.item || null;
        const next = parsed.find(item => item.start > nowMinutes)?.item || null;
        return { current, next };
    }

    function getRoomIssue(buildingName, roomName) {
        const number = getRoomNumber(roomName);
        const linked = alertRecords.filter(alert => alert.status === "active" &&
            String(alert.location || "").toLowerCase().includes(number.toLowerCase()));
        if (buildingName === "Block 2" && number === "204") {
            linked.push({
                id: null,
                title: "Speaker check · Room 204",
                severity: "warning",
                status: "active",
                category: "Classroom equipment · simulated demo status",
                location: "Block 2 · Room 204",
                description: "Simulated demo finding: speaker status needs inspection. This is not a reported physical fault.",
                created_at: "Fixed demo profile"
            });
        }
        return linked;
    }

    function getRoomModel(buildingName, roomName, roomIndex) {
        const building = getBlockData(buildingName);
        const profile = getBlockProfile(buildingName);
        const record = getRoomRecord(buildingName, roomName);
        const capacity = Number(record?.capacity ?? 45);
        const demoOccupancy = demoRoomOccupancies[buildingName]?.[roomIndex] ?? (roomIndex % 2 ? 0 : 24);
        const occupants = Number(record?.current_occupancy ?? demoOccupancy);
        const roomNumber = getRoomNumber(roomName);
        const sensor = sensorRecords.find(item =>
            String(item.location || "").toLowerCase().includes(roomNumber.toLowerCase()) &&
            String(item.type || "").toLowerCase().includes("temperature")
        );
        const demoTemperatures = [22.4, 22.1, 23.0, 22.8, 21.9, 23.2];
        const schedule = getRoomSchedule(buildingName, roomName);
        const scheduleState = getScheduleState(schedule);
        const alerts = getRoomIssue(buildingName, roomName);
        const network = Math.max(85, Number(profile.network) - (roomIndex % 3));
        const temperature = sensor?.reading_value ?? demoTemperatures[roomIndex % demoTemperatures.length];
        const type = String(record?.type || "Classroom");
        const displayType = type.toLowerCase().includes("lecture") ? "Classroom" : type;
        const roomFloor = Number(record?.floor_number) || Number(roomNumber[0]) || 1;
        const equipment = [
            { name: "Projector", status: record?.has_projector ? "Working (Demo)" : record ? "Not Available" : "Working (Demo)", installed: record ? Boolean(record.has_projector) : true },
            { name: "Smart Board", status: record?.has_smartboard ? "Working (Demo)" : record ? "Not Available" : "Working (Demo)", installed: record ? Boolean(record.has_smartboard) : true },
            { name: "Computer / Desktop", status: "Not Available", installed: false },
            { name: "Speakers", status: buildingName === "Block 2" && roomNumber === "204" ? "Not Working (Simulated)" : "Working (Demo)", installed: true },
            { name: "Microphone", status: "Not Available", installed: false },
            { name: "Wi-Fi", status: `Connected · ${network}% (Demo)`, installed: true },
            { name: "Power sockets", status: "Working (Demo)", installed: true },
            { name: "Lights", status: "ON (Demo)", installed: true },
            { name: "Fans", status: "ON (Demo)", installed: true },
            { name: "AC / HVAC", status: record?.has_ac === 0 ? "Not Available" : "ON (Demo)", installed: record ? Boolean(record.has_ac) : true },
            { name: "CCTV", status: "Not Available", installed: false },
            { name: "Emergency equipment", status: "Not Available", installed: false }
        ];
        const checkedEquipment = equipment.filter(item => item.installed);
        const workingEquipment = checkedEquipment.filter(item =>
            !/not working|offline|maintenance/i.test(item.status)
        ).length;
        const currentStatus = scheduleState.current ? "In Use" : occupants > 0 ? "Occupied" : "Available";
        const airSensor = sensorRecords.find(item =>
            String(item.location || "").toLowerCase().includes(roomNumber.toLowerCase()) &&
            String(item.type || "").toLowerCase().includes("air")
        );
        const roomSensors = sensorRecords.filter(item =>
            String(item.location || "").toLowerCase().includes(roomNumber.toLowerCase())
        );
        return {
            building,
            profile,
            record,
            name: roomName,
            number: roomNumber,
            type: displayType,
            floor: roomFloor,
            capacity,
            occupants,
            occupancyPercent: capacity ? Math.min(100, Math.round(occupants / capacity * 100)) : 0,
            available: Math.max(0, capacity - occupants),
            network,
            lights: "ON (Demo)",
            hvac: record?.has_ac === 0 ? "Not Equipped" : "ON (Demo)",
            temperature,
            airQuality: airSensor?.reading_value || "Not available",
            schedule,
            scheduleState,
            status: currentStatus,
            alerts,
            equipment,
            equipmentHealth: checkedEquipment.length ? Math.round(workingEquipment / checkedEquipment.length * 100) : 100,
            sensorsOnline: roomSensors.length ? roomSensors.filter(item => item.status === "active").length : 2,
            sensorsTotal: roomSensors.length || 2,
            sensorSource: roomSensors.length ? "Database sensor records" : "Deterministic demo profile",
            lastUpdated: sensor?.last_updated ? formatAlertTime(sensor.last_updated) : "Fixed demo profile · not live"
        };
    }

    function getLabEquipment(buildingName, lab) {
        const type = String(lab.type || lab.name).toLowerCase();
        const technical = /computer|network|robot|cloud|data|security|software|hpc|ai|devops/.test(type);
        const science = /science|physics|chemistry|material|electronics|mechanical/.test(type);
        const issueLab = buildingName === "Block 1" && lab.name === "Computer Lab 1";
        if (technical) {
            const computers = issueLab ? "38 / 40 working" : "40 / 40 working (Demo)";
            return [
                { name: "Computers", status: computers, healthy: true },
                ...(issueLab ? [
                    { name: "Computer #17", status: "Offline (Simulated)", healthy: false, issue: "System unavailable · simulated demo status", maintenance: "Pending demo review" },
                    { name: "Computer #23", status: "Maintenance Required (Simulated)", healthy: false, issue: "Scheduled check · simulated demo status", maintenance: "Demo maintenance queue" }
                ] : []),
                { name: "Projector", status: "1 / 1 working (Demo)", healthy: true },
                { name: "Network ports", status: "24 / 24 active (Demo)", healthy: true },
                { name: "Wi-Fi", status: `${lab.network}% · Demo`, healthy: true },
                { name: "AC units", status: "2 / 2 working (Demo)", healthy: true },
                { name: "Power", status: "Normal · Demo", healthy: true }
            ];
        }
        if (science) {
            return [
                { name: "Lab instruments", status: "12 / 12 available (Demo)", healthy: true },
                { name: "Safety equipment", status: "Available · Demo", healthy: true },
                { name: "Ventilation", status: "Operational · Demo", healthy: true },
                { name: "Power", status: "Normal · Demo", healthy: true },
                { name: "Temperature monitor", status: `${lab.temperature} °C · Demo`, healthy: true }
            ];
        }
        return [
            { name: "Work benches", status: "18 / 20 available (Demo)", healthy: true },
            { name: "Shared equipment", status: "Available · Demo", healthy: true },
            { name: "Network", status: `${lab.network}% · Demo`, healthy: true },
            { name: "AC units", status: "2 / 2 working (Demo)", healthy: true },
            { name: "Power", status: "Normal · Demo", healthy: true }
        ];
    }

    function getLabModels(buildingName) {
        const actualLabs = (buildingRoomRecords[buildingName]?.rooms || []).filter(room =>
            String(room.type || "").toLowerCase().includes("lab")
        );
        if (actualLabs.length) {
            return actualLabs.map((record, index) => {
                const base = getLabModelsFromProfile(buildingName)[index] || {};
                return {
                    ...base,
                    name: record.name || `Lab ${record.room_number}`,
                    number: record.room_number,
                    floor: Number(record.floor_number) || base.floor || 1,
                    type: record.type,
                    capacity: Number(record.capacity) || base.capacity || 30,
                    occupants: Number(record.current_occupancy) || 0,
                    status: Number(record.current_occupancy) > 0 ? "In Use" : "Available",
                    record,
                    source: "Database room type; telemetry demo profile"
                };
            });
        }
        return getLabModelsFromProfile(buildingName);
    }

    function getLabModelsFromProfile(buildingName) {
        const profile = getBlockProfile(buildingName);
        const buildingIndex = Math.max(0, demoBuildings.findIndex(item => item.name === buildingName));
        return profile.labs.map((lab, index) => {
            const snapshot = getLabEquipment(buildingName, lab);
            const issueCount = snapshot.filter(item => !item.healthy).length;
            const network = Math.max(85, profile.network - (index % 3));
            const temperature = [22.6, 23.1, 22.8, 21.9][(buildingIndex + index) % 4];
            const sessions = demoLabSessions[lab.type] || demoLabSessions.Science;
            return {
                ...lab,
                network,
                temperature,
                equipment: snapshot.map(item => item.name === "Wi-Fi" ? { ...item, status: `${network}% · Demo` } : item),
                equipmentHealth: Math.round(snapshot.filter(item => item.healthy).length / snapshot.length * 100),
                equipmentIssue: issueCount > 0,
                maintenance: snapshot.some(item => /maintenance/i.test(item.status)),
                sessions,
                source: "Fixed deterministic demo profile"
            };
        });
    }

    function getLibraryModels(buildingName) {
        const actualLibraries = (buildingRoomRecords[buildingName]?.rooms || []).filter(room =>
            String(room.type || "").toLowerCase().includes("library")
        );
        if (actualLibraries.length) {
            return actualLibraries.map(record => ({
                ...getBlockProfile(buildingName).library,
                name: record.name || `${buildingName} Library`,
                floor: Number(record.floor_number) || 1,
                capacity: Number(record.capacity) || 150,
                occupants: Number(record.current_occupancy) || 0,
                source: "Database room metadata; environment readings demo"
            }));
        }
        const library = getBlockProfile(buildingName).library;
        return library ? [{ ...library, source: "Fixed deterministic demo profile" }] : [];
    }

    function statusTone(value) {
        const score = Number(value);
        return score >= 90 ? "healthy" : score >= 70 ? "moderate" : "critical";
    }

    function addSummaryMetric(container, label, value, note, tone = "") {
        const card = makeElement("div", `block-summary-metric ${tone}`);
        card.append(makeElement("span", "", label), makeElement("strong", "", value));
        if (note) card.append(makeElement("small", "", note));
        container.append(card);
    }

    function getBlockIssues(buildingName) {
        const issues = alertRecords.filter(alert => alert.status === "active" &&
            String(alert.location || "").toLowerCase().includes(buildingName.toLowerCase()));
        if (buildingName === "Block 2") {
            issues.push(...getRoomIssue(buildingName, "204").filter(alert => alert.category.includes("simulated")));
        }
        return issues;
    }

    function openFacilityAlert(alert) {
        showPage("alerts");
        showAlertDetails(alert);
    }

    function renderBlockIssues(buildingName) {
        if (!blockIssueList) return [];
        const issues = getBlockIssues(buildingName);
        blockIssueList.replaceChildren();
        blockIssueList.hidden = issues.length === 0;
        if (!issues.length) return issues;

        blockIssueList.append(makeElement("strong", "block-issue-heading", `${issues.length} active issue${issues.length === 1 ? "" : "s"}`));
        issues.forEach(alert => {
            const button = makeElement("button", `facility-issue-button ${alert.severity || "warning"}`);
            button.type = "button";
            button.append(makeElement("span", "", alert.severity === "critical" ? "!" : "⚠"));
            button.append(makeElement("span", "", `${alert.title} · ${alert.location || buildingName}`));
            button.addEventListener("click", () => openFacilityAlert(alert));
            blockIssueList.append(button);
        });
        return issues;
    }

    function renderBlockOverview(buildingName, roomNames) {
        if (!blockOverview) return;
        const building = getBlockData(buildingName);
        const profile = getBlockProfile(buildingName);
        const actualRooms = buildingRoomRecords[buildingName]?.rooms || [];
        const labs = getLabModels(buildingName);
        const libraries = getLibraryModels(buildingName);
        const roomModels = roomNames.map((name, index) => getRoomModel(buildingName, name, index));
        const occupants = Number(building.occupancy ?? demoBuildings.find(item => item.name === buildingName)?.occupancy ?? 0);
        const capacity = Number(profile.capacity);
        const occupancyPercent = capacity ? Math.min(100, Math.round(occupants / capacity * 100)) : 0;
        const activeSensors = Number(building.active_sensors ?? profile.sensorsOnline);
        const sensorHealth = profile.sensorTotal ? Math.round(activeSensors / profile.sensorTotal * 100) : 100;
        const network = Number(profile.network ?? building.network ?? 90);
        const allEquipment = [
            ...labs.flatMap(lab => lab.equipment || []),
            ...roomModels.flatMap(room => room.equipment)
        ].filter(item => item.installed !== false);
        const equipmentHealth = allEquipment.length
            ? Math.round(allEquipment.filter(item => !/not working|offline|maintenance/i.test(item.status)).length / allEquipment.length * 100)
            : 100;
        const powerHealth = String(building.status || "Normal").toLowerCase().includes("attention") ? 82 : 100;
        const occupancyHealth = occupancyPercent <= 85 ? 100 : Math.max(60, 100 - (occupancyPercent - 85) * 2);
        const issues = getBlockIssues(buildingName);
        const overallHealth = Math.max(0, Math.round(
            network * 0.2 + equipmentHealth * 0.25 + sensorHealth * 0.2 +
            powerHealth * 0.15 + occupancyHealth * 0.2 - Math.min(15, issues.length * 4)
        ));
        const status = building.status || "Normal";
        const dataSource = buildingRoomRecords[buildingName] ? "Building and room inventory · MySQL" : "Fixed demo profile · not live";

        blockOverview.replaceChildren();
        const header = makeElement("div", "block-summary-heading");
        const headerText = makeElement("div");
        headerText.append(makeElement("span", "eyebrow", dataSource));
        headerText.append(makeElement("h3", "", building.type || "Campus Block"));
        header.append(headerText);
        const overallBadge = makeElement("div", `block-overall-badge ${statusTone(overallHealth)}`);
        overallBadge.append(makeElement("strong", "", `${overallHealth}%`), makeElement("span", "", "Block Health"));
        header.append(overallBadge);
        blockOverview.append(header);

        const metrics = makeElement("div", "block-summary-grid");
        addSummaryMetric(metrics, "Floors", building.total_floors ?? profile.floors, "Building data");
        addSummaryMetric(metrics, "Rooms", building.room_count ?? (actualRooms.length || roomNames.length), "Teaching spaces");
        addSummaryMetric(metrics, "Labs", labs.length, "Separate lab inventory");
        addSummaryMetric(metrics, "Libraries", libraries.length, libraries.length ? libraries[0].open ? "Open" : "Closed" : "No library recorded");
        addSummaryMetric(metrics, "Occupants", `${occupants} / ${capacity}`, `${occupancyPercent}% · ${Math.max(0, capacity - occupants)} spaces available`);
        addSummaryMetric(metrics, "Network", `${network}%`, "Demo signal profile", statusTone(network));
        addSummaryMetric(metrics, "Power", building.energy_kw !== undefined ? `${building.energy_kw} kW` : "Not available", "Building meter reading");
        addSummaryMetric(metrics, "Sensors", `${activeSensors} / ${profile.sensorTotal}`, `${sensorHealth}% health · profile count`);
        addSummaryMetric(metrics, "Active Issues", issues.length, status === "Normal" ? "No block-level warning" : status);
        blockOverview.append(metrics);

        const buildingIndex = Math.max(0, demoBuildings.findIndex(item => item.name === buildingName));
        const blockTemperature = sensorRecords.find(sensor =>
            String(sensor.type || "").toLowerCase().includes("temperature") &&
            String(sensor.building_name || "").toLowerCase() === buildingName.toLowerCase()
        )?.reading_value || ["22.4", "22.1", "23.0", "22.8", "21.9", "23.2", "22.6"][buildingIndex];
        const airQuality = sensorRecords.find(sensor =>
            String(sensor.type || "").toLowerCase().includes("air") &&
            String(sensor.building_name || "").toLowerCase() === buildingName.toLowerCase()
        )?.reading_value || "Good · Demo";
        const operations = makeElement("div", "block-operational-strip");
        [
            ["Lighting", occupants > 0 ? "Partially ON · Demo" : "OFF · Demo"],
            ["HVAC", "ON · Demo"],
            ["Temperature", `${blockTemperature} °C${sensorRecords.length ? " · Sensor" : " · Demo"}`],
            ["Air Quality", airQuality]
        ].forEach(([label, value]) => {
            const item = makeElement("div", "block-operational-item");
            item.append(makeElement("span", "", label), makeElement("strong", "", value));
            operations.append(item);
        });
        blockOverview.append(operations);

        const lower = makeElement("div", "block-health-layout");
        const occupancy = makeElement("section", "block-occupancy-card");
        occupancy.append(makeElement("span", "eyebrow", "BLOCK OCCUPANCY"));
        occupancy.append(makeElement("strong", "block-occupancy-value", `${occupants} / ${capacity}`));
        occupancy.append(makeElement("span", "", `${occupancyPercent}% occupied · ${Math.max(0, capacity - occupants)} spaces available`));
        const occupancyMeter = makeElement("div", "capacity-meter");
        const occupancyFill = makeElement("span");
        occupancyFill.style.setProperty("--capacity-value", `${occupancyPercent}%`);
        occupancyMeter.append(occupancyFill);
        occupancy.append(occupancyMeter);
        lower.append(occupancy);

        const health = makeElement("section", "block-health-card");
        health.append(makeElement("span", "eyebrow", "HEALTH BREAKDOWN"));
        [
            ["Network", network], ["Equipment", equipmentHealth],
            ["Sensors", sensorHealth], ["Power", powerHealth], ["Occupancy", occupancyHealth]
        ].forEach(([label, value]) => {
            const row = makeElement("div", "block-health-row");
            row.append(makeElement("span", "", label));
            row.append(makeElement("strong", statusTone(value), `${Math.round(value)}%`));
            health.append(row);
        });
        lower.append(health);
        blockOverview.append(lower);
    }

    function createLabModel(buildingName, lab, index) {
        const profile = getBlockProfile(buildingName);
        const network = Number(lab.network ?? Math.max(85, profile.network - index % 3));
        const temperature = Number(lab.temperature ?? [22.6, 23.1, 22.8, 21.9][index % 4]);
        const model = {
            ...lab,
            floor: Number(lab.floor) || 1,
            capacity: Number(lab.capacity) || 30,
            occupants: Number(lab.occupants) || 0,
            network,
            temperature,
            power: "Normal · Demo",
            lights: "ON · Demo",
            hvac: "ON · Demo",
            source: lab.source || "Fixed deterministic demo profile"
        };
        model.equipment = lab.equipment || getLabEquipment(buildingName, model);
        model.equipmentHealth = lab.equipmentHealth ?? Math.round(
            model.equipment.filter(item => item.healthy !== false).length / model.equipment.length * 100
        );
        model.equipmentIssue = model.equipment.some(item => item.healthy === false && !/maintenance/i.test(item.status));
        model.maintenance = model.equipment.some(item => /maintenance/i.test(item.status));
        model.occupancyPercent = model.capacity ? Math.round(model.occupants / model.capacity * 100) : 0;
        model.available = Math.max(0, model.capacity - model.occupants);
        model.sessions = lab.sessions || demoLabSessions[lab.type] || demoLabSessions.Science;
        model.scheduleState = getScheduleState(model.sessions.map(session => [session.time, session.title, session.instructor]));
        return model;
    }

    function renderLabs(buildingName) {
        if (!labGrid) return [];
        const models = getLabModels(buildingName).map((lab, index) => createLabModel(buildingName, lab, index));
        facilityDetailData.clear();
        labGrid.replaceChildren(...models.map((lab, index) => {
            const card = makeElement("article", "facility-card lab-card");
            card.dataset.labStatus = lab.status.toLowerCase().replaceAll(" ", "-");
            card.dataset.equipmentIssue = String(lab.equipmentIssue);
            card.dataset.maintenance = String(lab.maintenance);
            const top = makeElement("div", "facility-card-top");
            top.append(makeElement("strong", "facility-card-title", lab.name));
            top.append(makeElement("span", `facility-status ${lab.equipmentIssue ? "warning" : "healthy"}`, lab.status));
            card.append(top);
            card.append(makeElement("p", "facility-card-subtitle", `${lab.type} · Floor ${lab.floor}`));
            card.append(makeElement("strong", "facility-card-occupancy", `${lab.occupants} / ${lab.capacity}`));
            card.append(makeElement("span", "facility-card-caption", `${lab.occupancyPercent}% occupied · ${lab.available} available`));
            const meter = makeElement("div", "capacity-meter");
            const fill = makeElement("span");
            fill.style.setProperty("--capacity-value", `${lab.occupancyPercent}%`);
            meter.append(fill);
            card.append(meter);
            const facts = makeElement("div", "facility-card-facts");
            facts.append(makeElement("span", "", `Network ${lab.network}%`));
            facts.append(makeElement("span", "", `Equipment ${lab.equipmentHealth}%`));
            card.append(facts);
            const button = makeElement("button", "facility-open-button", "Lab details");
            button.type = "button";
            button.addEventListener("click", () => showFacilityDetails("lab", buildingName, lab));
            card.append(button);
            facilityDetailData.set(`lab-${index}`, lab);
            return card;
        }));
        const note = document.querySelector("#lab-data-note");
        if (note) note.textContent = buildingRoomRecords[buildingName]
            ? "Lab locations use database room types where available. Equipment telemetry is simulated until connected."
            : "Lab inventory and equipment states are deterministic demo profiles until a lab inventory source is connected.";
        return models;
    }

    function renderLibraries(buildingName) {
        if (!libraryGrid) return [];
        const models = getLibraryModels(buildingName).map(library => {
            const capacity = Number(library.capacity) || 150;
            const occupants = Number(library.occupants) || 0;
            return {
                ...library,
                capacity,
                occupants,
                open: library.open !== false,
                occupancyPercent: capacity ? Math.round(occupants / capacity * 100) : 0,
                available: Math.max(0, capacity - occupants),
                network: Number(library.network) || getBlockProfile(buildingName).network,
                temperature: Number(library.temperature) || 23.0
            };
        });
        const section = document.querySelector("#block-library-section");
        if (section) section.hidden = models.length === 0;
        libraryGrid.replaceChildren(...models.map(library => {
            const card = makeElement("article", "facility-card library-card");
            card.dataset.libraryOpen = String(library.open);
            card.dataset.libraryNearCapacity = String(library.occupancyPercent >= 85);
            const top = makeElement("div", "facility-card-top");
            top.append(makeElement("strong", "facility-card-title", library.name));
            top.append(makeElement("span", `facility-status ${library.open ? "healthy" : "critical"}`, library.open ? "OPEN" : "CLOSED"));
            card.append(top);
            card.append(makeElement("p", "facility-card-subtitle", `Floor ${library.floor || 1} · ${library.hours || "Hours not configured"}`));
            card.append(makeElement("strong", "facility-card-occupancy", `${library.occupants} / ${library.capacity}`));
            card.append(makeElement("span", "facility-card-caption", `${library.occupancyPercent}% occupied · ${library.available} seats available`));
            const meter = makeElement("div", "capacity-meter");
            const fill = makeElement("span");
            fill.style.setProperty("--capacity-value", `${library.occupancyPercent}%`);
            meter.append(fill);
            card.append(meter);
            const facts = makeElement("div", "facility-card-facts");
            facts.append(makeElement("span", "", `Network ${library.network}% · Demo`));
            facts.append(makeElement("span", "", `Lighting ${library.lights || "ON · Demo"}`));
            card.append(facts);
            const button = makeElement("button", "facility-open-button", "Library details");
            button.type = "button";
            button.addEventListener("click", () => showFacilityDetails("library", buildingName, library));
            card.append(button);
            return card;
        }));
        return models;
    }

    function showFacilityDetails(kind, buildingName, model, updateHistory = true) {
        if (!facilityDetails) return;
        facilityDetails.replaceChildren();
        facilityDetails.hidden = false;
        if (updateHistory) {
            const facilityHash = `#buildings/${encodeURIComponent(buildingName)}/${kind}/${encodeURIComponent(model.name)}`;
            if (window.location.hash !== facilityHash) {
                window.history.pushState({ page: "buildings", buildingName, facilityKind: kind, facilityName: model.name }, "", facilityHash);
            }
        }
        const header = makeElement("div", "facility-detail-heading");
        const titleGroup = makeElement("div");
        titleGroup.append(makeElement("span", "eyebrow", kind === "lab" ? "LAB DETAILS" : "LIBRARY DETAILS"));
        titleGroup.append(makeElement("h3", "", model.name));
        titleGroup.append(makeElement("p", "", `${buildingName} · Floor ${model.floor || 1} · ${model.type || "Study space"}`));
        header.append(titleGroup);
        const backButton = makeElement("button", "facility-back-button", kind === "lab" ? "Back to Labs" : "Back to Library");
        backButton.type = "button";
        backButton.addEventListener("click", () => {
            if (window.history.state?.facilityKind === kind) {
                window.history.back();
            } else {
                facilityDetails.hidden = true;
                const blockHash = `#buildings/${encodeURIComponent(buildingName)}`;
                window.history.replaceState({ page: "buildings", buildingName }, "", blockHash);
                document.querySelector(kind === "lab" ? "#lab-grid" : "#library-grid")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        });
        header.append(backButton);
        facilityDetails.append(header);

        const metrics = makeElement("div", "facility-detail-metrics");
        addSummaryMetric(metrics, "Occupants", `${model.occupants} / ${model.capacity}`, `${model.occupancyPercent}% · ${model.available} available`);
        addSummaryMetric(metrics, "Network", `${model.network}%`, "Deterministic demo profile", statusTone(model.network));
        addSummaryMetric(metrics, "Power", model.power || "Normal · Demo", "No room-level power meter");
        addSummaryMetric(metrics, "Lights", model.lights || "ON · Demo", "Simulated state");
        addSummaryMetric(metrics, "AC / HVAC", model.hvac || "ON · Demo", `${model.temperature} °C · Demo`);
        if (kind === "lab") addSummaryMetric(metrics, "Equipment Health", `${model.equipmentHealth}%`, "Calculated from listed equipment");
        facilityDetails.append(metrics);

        const statusLine = makeElement("p", "facility-source-note", model.source || "Fixed deterministic demo profile · not live");
        facilityDetails.append(statusLine);

        const issues = kind === "lab"
            ? model.equipment.filter(item => item.healthy === false)
            : alertRecords.filter(alert => alert.status === "active" && String(alert.location || "").toLowerCase().includes("library"));
        if (issues.length) {
            const issueSection = makeElement("div", "facility-detail-issues");
            issueSection.append(makeElement("strong", "", `${issues.length} active issue${issues.length === 1 ? "" : "s"}`));
            issues.forEach(issue => {
                const button = makeElement("button", "facility-issue-button warning");
                button.type = "button";
                const issueText = issue.title
                    ? `${issue.title} · ${issue.location || buildingName}`
                    : `${issue.name} · ${issue.status} · ${issue.issue || "Simulated equipment state"}`;
                button.textContent = `⚠ ${issueText}`;
                button.addEventListener("click", () => {
                    const alert = issue.title ? issue : {
                        id: null,
                        title: `${issue.name} · ${model.name}`,
                        severity: "warning",
                        status: "active",
                        category: "Lab equipment · simulated demo status",
                        location: `${buildingName} · ${model.name}`,
                        description: `${issue.issue || issue.status}. This is a simulated demo state, not a reported physical fault. ${issue.maintenance || ""}`,
                        created_at: "Fixed demo profile"
                    };
                    openFacilityAlert(alert);
                });
                issueSection.append(button);
            });
            facilityDetails.append(issueSection);
        }

        const sessionSection = makeElement("div", "facility-sessions");
        sessionSection.append(makeElement("span", "eyebrow", kind === "lab" ? "PRACTICAL SCHEDULE · DEMO" : "LIBRARY AVAILABILITY"));
        const current = model.scheduleState?.current;
        const next = model.scheduleState?.next;
        const sessions = [
            [kind === "lab" ? "Current session" : "Library status", current ? `${current[1]} · ${current[0]}` : kind === "library" ? (model.open ? "Open" : "Closed") : "No active session at local time"],
            [kind === "lab" ? "Next session" : "Opening hours", next ? `${next[1]} · ${next[0]}` : kind === "library" ? (model.hours || "Hours not configured") : "No further session scheduled today"]
        ];
        sessions.forEach(([label, value]) => {
            const row = makeElement("div", "facility-session-row");
            row.append(makeElement("span", "", label), makeElement("strong", "", value));
            sessionSection.append(row);
        });
        if (current?.[2]) sessionSection.append(makeElement("small", "facility-source-note", `Instructor: ${current[2]}`));
        facilityDetails.append(sessionSection);

        if (kind === "lab") {
            const equipmentSection = makeElement("div", "equipment-section");
            const equipmentHeading = makeElement("div", "facility-section-heading");
            equipmentHeading.append(makeElement("h4", "", "Equipment & Infrastructure"));
            equipmentHeading.append(makeElement("strong", "equipment-health-summary", `Equipment Health ${model.equipmentHealth}%`));
            equipmentSection.append(equipmentHeading);
            const equipmentGrid = makeElement("div", "equipment-grid");
            model.equipment.forEach(item => {
                const row = makeElement("div", `equipment-item ${item.healthy === false ? "warning" : "healthy"}`);
                const icon = makeElement("span", "equipment-status-icon", item.healthy === false ? "⚠" : "✓");
                const text = makeElement("div", "equipment-item-text");
                text.append(makeElement("strong", "", item.name), makeElement("span", "", item.status));
                row.append(icon, text);
                if (item.issue) row.append(makeElement("small", "equipment-issue-detail", `${item.issue} · ${item.maintenance || "Fixed demo profile"}`));
                equipmentGrid.append(row);
            });
            equipmentSection.append(equipmentGrid);
            equipmentSection.append(makeElement("p", "facility-source-note", "Equipment state is simulated demo data; it does not report a real physical fault."));
            facilityDetails.append(equipmentSection);
        }
    }

    function renderBlockFacilities(buildingName) {
        const labs = renderLabs(buildingName);
        const libraries = renderLibraries(buildingName);
        return { labs, libraries };
    }

    function applyRoomFilter(filter = "all") {
        document.querySelectorAll("#room-grid .room-card").forEach(card => {
            const status = card.dataset.roomStatus;
            const matches = filter === "all" ||
                (filter === "alerts" ? card.dataset.roomAlerts === "true" : status === filter);
            card.hidden = !matches;
        });
    }

    function applyLabFilter(filter = "all") {
        document.querySelectorAll("#lab-grid .lab-card").forEach(card => {
            const status = card.dataset.labStatus;
            const matches = filter === "all" ||
                (filter === "equipment-issue" ? card.dataset.equipmentIssue === "true" :
                    filter === "maintenance" ? card.dataset.maintenance === "true" :
                        status === filter);
            card.hidden = !matches;
        });
    }

    document.querySelector("#room-filters")?.addEventListener("click", event => {
        const button = event.target.closest("[data-room-filter]");
        if (!button) return;
        document.querySelectorAll("#room-filters .facility-filter").forEach(item => item.classList.toggle("active", item === button));
        applyRoomFilter(button.dataset.roomFilter);
    });

    document.querySelector("#lab-filters")?.addEventListener("click", event => {
        const button = event.target.closest("[data-lab-filter]");
        if (!button) return;
        document.querySelectorAll("#lab-filters .facility-filter").forEach(item => item.classList.toggle("active", item === button));
        applyLabFilter(button.dataset.labFilter);
    });

    document.querySelector("#library-filters")?.addEventListener("click", event => {
        const button = event.target.closest("[data-library-filter]");
        if (!button) return;
        document.querySelectorAll("#library-filters .facility-filter").forEach(item => item.classList.toggle("active", item === button));
        document.querySelectorAll("#library-grid .library-card").forEach(card => {
            const filter = button.dataset.libraryFilter;
            card.hidden = filter === "open" ? card.dataset.libraryOpen !== "true" :
                filter === "closed" ? card.dataset.libraryOpen !== "false" :
                    filter === "near-capacity" ? card.dataset.libraryNearCapacity !== "true" : false;
        });
    });


    /* =====================================================
       VIEW BUILDING CLICK
    ===================================================== */

    viewButtons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();


                const card =
                    button.closest(
                        ".building-card"
                    );


                if (!card)
                    return;


                const buildingName =
                    card.querySelector(
                        "h3"
                    )?.textContent
                        .trim();


                if (!buildingName)
                    return;


                openBuildingRooms(
                    buildingName
                );

            }
        );

    });


    /* =====================================================
       OPEN BUILDING ROOMS
    ===================================================== */

    function openBuildingRooms(buildingName, requestDetails = true, updateHistory = true) {
        if (!buildingRoomView || !roomGrid) return;

        const schedules = roomData[buildingName] || {};
        const records = buildingRoomRecords[buildingName]?.rooms || [];
        const normalizeRoomName = value => /^\d+$/.test(String(value)) ? `Room ${value}` : String(value);
        const scheduledNames = Object.keys(schedules).map(normalizeRoomName);
        const normalRoomRecords = records.filter(record => {
            const type = String(record.type || "").toLowerCase();
            return !type.includes("lab") && !type.includes("library");
        });
        const roomNames = [...new Set([
            ...scheduledNames,
            ...normalRoomRecords.map(record => `Room ${record.room_number}`)
        ])];

        if (selectedBuildingName) selectedBuildingName.textContent = buildingName;
        buildingRoomView.dataset.building = buildingName;
        if (roomTimetable) {
            roomTimetable.hidden = true;
            roomTimetable.replaceChildren();
        }
        if (facilityDetails) {
            facilityDetails.hidden = true;
            facilityDetails.replaceChildren();
        }

        renderBlockOverview(buildingName, roomNames);
        renderBlockIssues(buildingName);
        renderBlockFacilities(buildingName);
        roomGrid.replaceChildren(...roomNames.map((roomName, index) => {
            const model = getRoomModel(buildingName, roomName, index);
            const card = makeElement("button", "room-card");
            card.type = "button";
            card.dataset.room = roomName;
            card.dataset.roomStatus = model.status === "Available" ? "available" : "occupied";
            card.dataset.roomAlerts = String(model.alerts.length > 0);
            card.append(makeElement("span", "room-icon", "▦"));
            card.append(makeElement("span", "room-name", roomName));
            card.append(makeElement("span", "room-type", `${model.type} · Floor ${model.floor}`));
            card.append(makeElement("strong", "room-occupancy-summary", `${model.occupants} / ${model.capacity}`));
            const detail = makeElement("span", "room-action", `${model.occupancyPercent}% occupied · ${model.status}`);
            card.append(detail);
            card.addEventListener("click", () => {
                roomGrid.querySelectorAll(".room-card").forEach(item => item.classList.toggle("selected", item === card));
                showRoomTimetable(buildingName, roomName);
                const roomHash = `#buildings/${encodeURIComponent(buildingName)}/room/${encodeURIComponent(roomName)}`;
                if (window.location.hash !== roomHash) {
                    window.history.pushState({ page: "buildings", buildingName, roomName }, "", roomHash);
                }
            });
            return card;
        }));
        document.querySelectorAll("#room-filters .facility-filter").forEach(item => item.classList.toggle("active", item.dataset.roomFilter === "all"));
        document.querySelectorAll("#lab-filters .facility-filter").forEach(item => item.classList.toggle("active", item.dataset.labFilter === "all"));
        document.querySelectorAll("#library-filters .facility-filter").forEach(item => item.classList.toggle("active", item.dataset.libraryFilter === "all"));
        applyRoomFilter("all");
        applyLabFilter("all");

        const roomNote = document.querySelector("#room-data-note");
        if (roomNote) roomNote.textContent = buildingRoomRecords[buildingName]
            ? "Floor, room type, capacity, occupancy, and listed equipment availability come from the database. Environment readings without a matching sensor are demo values."
            : "Room environment and lighting values are fixed demo readings unless a matching database sensor is available.";

        buildingRoomView.hidden = false;
        buildingRoomView.classList.add("show");
        const buildingHash = `#buildings/${encodeURIComponent(buildingName)}`;
        if (updateHistory && window.location.hash !== buildingHash) {
            window.history.pushState({ page: "buildings", buildingName }, "", buildingHash);
        }
        if (requestDetails && backendConnected) loadBackendBuildingRooms(buildingName);
        setTimeout(() => buildingRoomView.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }


    /* =====================================================
       SHOW ONLY SELECTED ROOM TIMETABLE
    ===================================================== */

    function showRoomTimetable(buildingName, roomName, updateHistory = true) {
        if (!roomTimetable) return;
        const model = getRoomModel(buildingName, roomName, [...roomGrid.querySelectorAll(".room-card")].findIndex(card => card.dataset.room === roomName));
        const timetable = model.schedule;
        roomTimetable.replaceChildren();

        const header = makeElement("div", "timetable-header room-detail-header");
        const titleGroup = makeElement("div");
        titleGroup.append(makeElement("span", "eyebrow", `ROOM DETAILS · ${model.sensorSource}`));
        titleGroup.append(makeElement("h3", "", roomName));
        titleGroup.append(makeElement("p", "", `${model.type} · Floor ${model.floor} · ${model.status}`));
        header.append(titleGroup);
        const backButton = makeElement("button", "facility-back-button", "Back to Rooms");
        backButton.type = "button";
        backButton.addEventListener("click", () => {
            if (window.history.state?.roomName === roomName) {
                window.history.back();
            } else {
                roomTimetable.hidden = true;
                roomGrid.querySelectorAll(".room-card").forEach(card => card.classList.remove("selected"));
                const blockHash = `#buildings/${encodeURIComponent(buildingName)}`;
                window.history.replaceState({ page: "buildings", buildingName }, "", blockHash);
                document.querySelector(".room-section")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        });
        header.append(backButton);
        roomTimetable.append(header);

        const detailsGrid = makeElement("div", "room-detail-grid");
        addSummaryMetric(detailsGrid, "Occupancy", `${model.occupants} / ${model.capacity}`, `${model.occupancyPercent}% · ${model.available} spaces available`);
        addSummaryMetric(detailsGrid, "Network", `${model.network}%`, `${model.network >= 85 ? "Good" : "Moderate"} · demo profile`, statusTone(model.network));
        addSummaryMetric(detailsGrid, "Lights", model.lights, "Simulated state");
        addSummaryMetric(detailsGrid, "AC / HVAC", model.hvac, `${model.temperature} °C · demo`);
        addSummaryMetric(detailsGrid, "Air quality", model.airQuality, model.airQuality === "Not available" ? "No matching room sensor" : "Sensor reading");
        addSummaryMetric(detailsGrid, "Sensors", `${model.sensorsOnline} / ${model.sensorsTotal} online`, model.sensorSource);
        addSummaryMetric(detailsGrid, "Room alerts", model.alerts.length, model.alerts.length ? "Needs review" : "No linked active alerts");
        addSummaryMetric(detailsGrid, "Last sensor update", model.lastUpdated, "Not a live heartbeat");
        roomTimetable.append(detailsGrid);

        const occupancyCard = makeElement("div", "room-occupancy-card");
        occupancyCard.append(makeElement("strong", "", `${model.occupancyPercent}% occupied`));
        occupancyCard.append(makeElement("span", "", `${model.occupants} of ${model.capacity} · ${model.available} available`));
        const occupancyMeter = makeElement("div", "capacity-meter");
        const occupancyFill = makeElement("span");
        occupancyFill.style.setProperty("--capacity-value", `${model.occupancyPercent}%`);
        occupancyMeter.append(occupancyFill);
        occupancyCard.append(occupancyMeter);
        roomTimetable.append(occupancyCard);

        const scheduleSummary = makeElement("div", "room-session-grid");
        const currentCard = makeElement("div", "room-session-card current");
        currentCard.append(makeElement("span", "eyebrow", "CURRENT CLASS"));
        currentCard.append(makeElement("strong", "", model.scheduleState.current?.[1] || "No active class at local time"));
        currentCard.append(makeElement("small", "", model.scheduleState.current ? `${model.scheduleState.current[0]} · ${model.scheduleState.current[2] || "Instructor not listed"}` : "Today's timetable is shown below"));
        const nextCard = makeElement("div", "room-session-card next");
        nextCard.append(makeElement("span", "eyebrow", "NEXT CLASS"));
        nextCard.append(makeElement("strong", "", model.scheduleState.next?.[1] || "No later class scheduled today"));
        nextCard.append(makeElement("small", "", model.scheduleState.next ? `${model.scheduleState.next[0]} · ${model.scheduleState.next[2] || "Instructor not listed"}` : "Schedule supplied for today only"));
        scheduleSummary.append(currentCard, nextCard);
        roomTimetable.append(scheduleSummary);

        if (!/lab|library/i.test(model.type)) {
            const equipmentSection = makeElement("section", "equipment-section room-equipment-section");
            const heading = makeElement("div", "facility-section-heading");
            heading.append(makeElement("h4", "", "Equipment & Infrastructure"));
            heading.append(makeElement("strong", "equipment-health-summary", `Equipment Health ${model.equipmentHealth}%`));
            equipmentSection.append(heading);
            const equipmentGrid = makeElement("div", "equipment-grid");
            model.equipment.forEach(item => {
                const issue = /not working|offline|maintenance/i.test(item.status);
                const row = makeElement("div", `equipment-item ${issue ? "warning" : "healthy"}`);
                row.append(makeElement("span", "equipment-status-icon", issue ? "⚠" : "✓"));
                const text = makeElement("div", "equipment-item-text");
                text.append(makeElement("strong", "", item.name), makeElement("span", "", item.status));
                row.append(text);
                if (issue) row.append(makeElement("small", "equipment-issue-detail", "Simulated demo status · not a confirmed physical fault"));
                equipmentGrid.append(row);
            });
            equipmentSection.append(equipmentGrid);
            equipmentSection.append(makeElement("p", "facility-source-note", "Database equipment flags indicate availability only. Functional states shown here are simulated until connected to equipment telemetry."));
            roomTimetable.append(equipmentSection);
        }

        if (model.alerts.length) {
            const issues = makeElement("div", "facility-detail-issues");
            issues.append(makeElement("strong", "", "Active room alerts"));
            model.alerts.forEach(alert => {
                const button = makeElement("button", "facility-issue-button warning", `⚠ ${alert.title}`);
                button.type = "button";
                button.addEventListener("click", () => openFacilityAlert(alert));
                issues.append(button);
            });
            roomTimetable.append(issues);
        }

        const timetableHeader = makeElement("div", "timetable-header full-timetable-header");
        const timetableTitle = makeElement("div");
        timetableTitle.append(makeElement("span", "eyebrow", "TODAY'S SCHEDULE"));
        timetableTitle.append(makeElement("h4", "", "Timetable"));
        timetableHeader.append(timetableTitle);
        const fullScheduleButton = makeElement("button", "facility-back-button", "View Full Timetable");
        fullScheduleButton.type = "button";
        fullScheduleButton.addEventListener("click", () => roomTimetable.querySelector(".timetable-list")?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
        timetableHeader.append(fullScheduleButton);
        roomTimetable.append(timetableHeader);

        const timetableList = makeElement("div", "timetable-list");
        timetable.forEach(item => {
            const row = makeElement("div", "timetable-row");
            row.append(makeElement("div", "time-slot", item[0]));
            const classInfo = makeElement("div", "class-info");
            classInfo.append(makeElement("strong", "", item[1]), makeElement("span", "", item[2] || "Instructor not listed"));
            row.append(classInfo);
            timetableList.append(row);
        });
        if (!timetable.length) timetableList.append(makeElement("p", "facility-source-note", "No scheduled classes are available for this room."));
        roomTimetable.append(timetableList);
        roomTimetable.hidden = false;
        roomTimetable.classList.add("show");
        if (updateHistory) {
            const roomHash = `#buildings/${encodeURIComponent(buildingName)}/room/${encodeURIComponent(roomName)}`;
            if (window.location.hash !== roomHash) {
                window.history.pushState({ page: "buildings", buildingName, roomName }, "", roomHash);
            }
        }
        setTimeout(() => roomTimetable.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
    }


    /* =====================================================
       CLOSE BUILDING ROOM VIEW
    ===================================================== */

    if (closeBuildingView) {

        closeBuildingView.addEventListener(
            "click",
            () => {

                const buildingName = buildingRoomView?.dataset.building;

                if (buildingRoomView) {

                    buildingRoomView.classList.remove(
                        "show"
                    );

                    buildingRoomView.hidden =
                        true;

                }


                if (roomTimetable) {

                    roomTimetable.hidden =
                        true;

                    roomTimetable.innerHTML =
                        "";

                }


                if (roomGrid) {

                    roomGrid.innerHTML =
                        "";

                }

                if (buildingName) {
                    window.history.replaceState({ page: "buildings" }, "", "#buildings");
                }

            }
        );

    }


    /* =====================================================
       FLASK & MYSQL BACKEND INTEGRATION
    ===================================================== */

    const API_BASE = window.location.protocol.startsWith("http") ? "" : "http://127.0.0.1:5000";

    const backendStatusPill = document.querySelector("#backend-status-pill");
    const backendStatusText = document.querySelector("#backend-status-text");

    async function checkBackendHealth() {
        try {
            const res = await fetch(`${API_BASE}/api/health`);
            const data = await res.json();
            if (data.status === "online" && data.database?.status === "connected") {
                backendConnected = true;
                if (backendStatusPill) {
                    backendStatusPill.classList.remove("offline");
                    backendStatusPill.title = `MySQL 8.0 Connected (${data.database.database} @ ${data.database.host})`;
                }
                if (backendStatusText) {
                    backendStatusText.textContent = "MySQL Connected";
                }
                const alertsBadge = document.querySelector("#alerts-db-badge");
                const settingsBadge = document.querySelector("#settings-db-badge");
                const analyticsNote = document.querySelector("#analytics-data-note");
                if (alertsBadge) alertsBadge.textContent = "Live MySQL Database";
                if (settingsBadge) settingsBadge.textContent = "Stored in MySQL Database";
                if (analyticsNote) analyticsNote.hidden = true;
                return true;
            } else {
                throw new Error(data.database?.message || "Database not connected");
            }
        } catch (err) {
            backendConnected = false;
            if (backendStatusPill) {
                backendStatusPill.classList.add("offline");
                const reason = err instanceof Error ? err.message : String(err);
                backendStatusPill.title = `MySQL connection failed: ${reason}`;
            }
            if (backendStatusText) {
                backendStatusText.textContent = "MySQL Offline";
            }
            const alertsBadge = document.querySelector("#alerts-db-badge");
            const settingsBadge = document.querySelector("#settings-db-badge");
            const analyticsNote = document.querySelector("#analytics-data-note");
            if (alertsBadge) alertsBadge.textContent = "Deterministic Demo Alerts";
            if (settingsBadge) settingsBadge.textContent = "Saved in this browser";
            if (analyticsNote) analyticsNote.hidden = false;
            return false;
        }
    }

    async function loadBackendStats() {
        try {
            const res = await fetch(`${API_BASE}/api/stats`);
            const data = await res.json();
            if (data.success && data.stats) {
                const s = data.stats;
                campusStats = { ...campusStats, ...s };
                const bldEl = document.querySelector("#stat-total-buildings");
                const netEl = document.querySelector("#stat-network-status");
                const issEl = document.querySelector("#stat-active-issues");
                const covEl = document.querySelector("#stat-campus-coverage");

                if (bldEl && s.total_buildings) bldEl.textContent = s.total_buildings;
                if (netEl && s.network_status) netEl.textContent = s.network_status;
                if (issEl && s.active_issues) issEl.textContent = s.active_issues;
                if (covEl && s.campus_coverage) covEl.textContent = s.campus_coverage;
                updateAlertStats();
            }
        } catch (e) {
            console.warn("Could not load backend stats:", e);
        }
    }

    async function loadBackendBuildings() {
        try {
            const res = await fetch(`${API_BASE}/api/buildings`);
            const data = await res.json();
            if (data.success && data.twin_3d) {
                buildingData = Object.assign(buildingData, data.twin_3d);
            }
            if (data.success && Array.isArray(data.buildings)) {
                campusBuildings = data.buildings.map(building => {
                    const fallback = demoBuildings.find(item => item.name === building.name) || {};
                    return { ...fallback, ...building, mapped: fallback.mapped, network: fallback.network };
                });
                document.querySelectorAll("#buildings-section .building-card").forEach(card => {
                    const name = card.querySelector("h3")?.textContent.trim();
                    const building = campusBuildings.find(item => item.name === name);
                    if (!building) return;
                    const stats = card.querySelectorAll(".building-card-stats strong");
                    if (stats[0]) stats[0].textContent = building.occupancy ?? 0;
                    if (stats[1]) stats[1].textContent = `${building.energy_kw ?? 0} kW`;
                    if (stats[2]) stats[2].textContent = building.active_sensors ?? 0;
                    const type = card.querySelector(".building-card > p");
                    if (type) type.textContent = building.type || "Campus Building";
                    const badge = card.querySelector(".building-status");
                    if (badge) {
                        const status = building.status || "Normal";
                        badge.className = `building-status ${["normal", "online"].includes(status.toLowerCase()) ? "normal" : "warning"}`;
                        badge.lastChild.textContent = status;
                    }
                });
                renderCoverageView();
                renderAnalyticsView();
            }
        } catch (e) {
            console.warn("Could not load buildings:", e);
        }
    }

    async function loadBackendBuildingRooms(buildingName) {
        if (!backendConnected) return;
        try {
            const response = await fetch(`${API_BASE}/api/buildings/${encodeURIComponent(buildingName)}/rooms`);
            const data = await response.json();
            if (!response.ok || !data.success || !Array.isArray(data.rooms)) return;
            buildingRoomRecords[buildingName] = data;
            if (data.building_details) {
                const existing = campusBuildings.find(building => building.name === buildingName);
                if (existing) Object.assign(existing, data.building_details);
            }
            if (buildingRoomView?.dataset.building !== buildingName || buildingRoomView.hidden) return;
            const selectedRoom = roomGrid.querySelector(".room-card.selected")?.dataset.room;
            const selectedDetails = selectedRoom && !roomTimetable.hidden;
            openBuildingRooms(buildingName, false);
            if (selectedDetails && selectedRoom) showRoomTimetable(buildingName, selectedRoom);
        } catch (error) {
            console.warn(`Could not load room details for ${buildingName}:`, error);
        }
    }

    async function loadBackendEnergy() {
        try {
            const response = await fetch(`${API_BASE}/api/energy`);
            const data = await response.json();
            if (!data.success) return;
            weeklyEnergy = data.weekly_usage || weeklyEnergy;
            if (data.summary) {
                campusStats.total_energy = String(data.summary.total_consumption || campusStats.total_energy).replace(/[^\d.]/g, "");
                document.querySelectorAll("#energy-section .energy-stat-card strong").forEach((element, index) => {
                    const values = [data.summary.total_consumption, data.summary.solar_production, data.summary.peak_load, data.summary.efficiency];
                    if (values[index]) element.textContent = values[index];
                });
            }
            renderAnalyticsView();
        } catch (error) {
            console.warn("Could not load energy data:", error);
        }
    }

    async function loadBackendOccupancy() {
        try {
            const response = await fetch(`${API_BASE}/api/occupancy`);
            const data = await response.json();
            if (!data.success || !data.summary) return;
            campusStats.total_occupancy = data.summary.people_on_campus || campusStats.total_occupancy;
            const people = document.querySelector("#occupancy-section .occupancy-stat-card strong");
            if (people) people.textContent = campusStats.total_occupancy;
            renderAnalyticsView();
        } catch (error) {
            console.warn("Could not load occupancy data:", error);
        }
    }

    async function loadBackendRoomData() {
        try {
            const res = await fetch(`${API_BASE}/api/all-rooms-data`);
            const data = await res.json();
            if (data.success && data.roomData) {
                roomData = Object.assign(roomData, data.roomData);
            }
        } catch (e) {
            console.warn("Could not load room timetables:", e);
        }
    }

    async function loadBackendSensors() {
        try {
            const res = await fetch(`${API_BASE}/api/sensors`);
            const data = await res.json();
            if (!data.success) return;
            sensorRecords = Array.isArray(data.sensors) ? data.sensors : [];

            // Update sensor stats counters
            if (data.counts) {
                const totalEl = document.querySelector("#sensor-stat-total");
                const activeEl = document.querySelector("#sensor-stat-active");
                const warnEl = document.querySelector("#sensor-stat-warning");
                const offEl = document.querySelector("#sensor-stat-offline");

                if (totalEl && data.counts.total !== undefined) totalEl.textContent = data.counts.total;
                if (activeEl && data.counts.active !== undefined) activeEl.textContent = data.counts.active;
                if (warnEl && data.counts.warning !== undefined) warnEl.textContent = data.counts.warning;
                if (offEl && data.counts.offline !== undefined) offEl.textContent = data.counts.offline;
            }
            searchSensors = data.sensors.map(sensor => ({
                name: sensor.name,
                location: sensor.location || sensor.building_name || "Campus",
                code: sensor.sensor_code
            }));
            if (searchInput?.value.trim()) renderSearchResults();

            // Update sensor list rows
            const sensorCard = document.querySelector("#sensors-section .sensor-list-card");
            if (sensorCard && data.sensors && data.sensors.length > 0) {
                // Remove existing sensor rows
                sensorCard.querySelectorAll(".sensor-row").forEach(r => r.remove());

                // Append new dynamic rows from MySQL
                data.sensors.forEach(s => {
                    const row = document.createElement("div");
                    row.className = "sensor-row";
                    row.tabIndex = 0;
                    row.dataset.code = s.sensor_code;

                    row.innerHTML = `
                        <div class="sensor-device-icon ${s.icon_class || 'green'}">
                            ${s.icon_symbol || '°'}
                        </div>
                        <div class="sensor-device">
                            <strong>${s.name}</strong>
                            <span>${s.location || s.building_name}</span>
                        </div>
                        <div class="sensor-reading">
                            <strong>${s.reading_value} ${s.reading_unit || ''}</strong>
                            <span>Live MySQL</span>
                        </div>
                        <span class="sensor-status ${s.status}">
                            ${s.status ? s.status.charAt(0).toUpperCase() + s.status.slice(1) : 'Active'}
                        </span>
                    `;

                    row.addEventListener("click", () => {
                        if (typeof showSensorMessage === "function") {
                            showSensorMessage(row);
                        }
                    });

                    sensorCard.appendChild(row);
                });
            }
        } catch (e) {
            console.warn("Could not load backend sensors:", e);
        }
    }

    async function loadBackendAlerts() {
        try {
            const res = await fetch(`${API_BASE}/api/alerts`);
            const data = await res.json();
            if (!data.success || !Array.isArray(data.alerts)) return;
            alertRecords = data.alerts.map(alert => ({
                ...alert,
                severity: alert.severity || "info",
                status: alert.status || "active"
            }));
            renderAlertsList();
            updateAlertStats();
            const count = document.querySelector("#notifications-button b");
            if (count) count.textContent = alertRecords.filter(alert => alert.status === "active").length;
        } catch (e) {
            console.warn("Could not load backend alerts:", e);
        }
    }

    async function loadBackendSettings() {
        try {
            const res = await fetch(`${API_BASE}/api/settings`);
            const data = await res.json();
            if (data.success && data.settings) {
                applySettings(data.settings);
                // Also update controls
                Object.entries(data.settings).forEach(([key, val]) => {
                    const ctrl = settingsControls[key];
                    if (ctrl) {
                        if (ctrl.type === "checkbox") {
                            ctrl.checked = Boolean(val);
                        } else {
                            ctrl.value = val;
                        }
                    }
                });
            }
        } catch (e) {
            console.warn("Could not load backend settings:", e);
        }
    }

    // Connect Live Data button to trigger MySQL sensor refresh simulation
    const sensorLiveDataBtn = document.querySelector("#sensor-live-data");
    if (sensorLiveDataBtn) {
        sensorLiveDataBtn.addEventListener("click", async () => {
            try {
                sensorLiveDataBtn.textContent = "Updating MySQL...";
                await fetch(`${API_BASE}/api/sensors/refresh`, { method: "POST" });
                await loadBackendSensors();
                sensorLiveDataBtn.textContent = "Live Data ▾";
            } catch (e) {
                sensorLiveDataBtn.textContent = "Live Data ▾";
            }
        });
    }

    // Initialize backend integration
    (async function init() {
        const isOnline = await checkBackendHealth();
        if (isOnline) {
            await Promise.all([
                loadBackendStats(),
                loadBackendBuildings(),
                loadBackendEnergy(),
                loadBackendOccupancy(),
                loadBackendRoomData(),
                loadBackendSensors(),
                loadBackendAlerts(),
                loadBackendSettings()
            ]);
        }
    })();

    restoreDashboardHash();

});