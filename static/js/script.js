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


    /* =====================================================
       NAV CLICK
    ===================================================== */

    navItems.forEach(item => {

        item.addEventListener(
            "click",
            event => {

                event.preventDefault();


                navItems.forEach(nav => {

                    nav.classList.remove(
                        "active"
                    );

                });


                item.classList.add(
                    "active"
                );


                const sectionName =
                    item.querySelector("p")
                    ?.textContent
                    .trim();


                if (
                    sectionName ===
                    "Overview"
                ) {

                    showOverview();

                } else if (
                    sectionName ===
                    "Buildings"
                ) {

                    showBuildings();

                } else if (
                    sectionName ===
                    "Energy"
                ) {

                    showEnergy();

                } else if (
                    sectionName ===
                    "Occupancy"
                ) {

                    showOccupancy();

                } else if (
                    sectionName ===
                    "Sensors"
                ) {

                    showSensors();

                } else if (
                    sectionName ===
                    "Alerts"
                ) {

                    showAlerts();

                } else if (
                    sectionName ===
                    "Settings"
                ) {

                    showSettings();

                } else {

                    showOverview();

                    console.log(
                        sectionName +
                        " section will be added next."
                    );

                }

            }
        );

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

    const alertRows =
        document.querySelectorAll(
            "#alerts-list .alert-page-row"
        );


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


    function updateAlertStats() {

        const visibleAlerts =
            [
                ...alertRows
            ].filter(
                row => !row.hidden
            );


        const countSeverity =
            severity =>
                [
                    ...alertRows
                ].filter(
                    row =>
                        row.dataset.severity ===
                            severity &&
                        row.dataset.status !==
                            "dismissed"
                ).length;


        const countResolved =
            [
                ...alertRows
            ].filter(
                row =>
                    row.dataset.status ===
                    "resolved"
            ).length;


        const total =
            document.querySelector(
                "#alerts-total"
            );


        const critical =
            document.querySelector(
                "#alerts-critical"
            );


        const warning =
            document.querySelector(
                "#alerts-warning"
            );


        const resolved =
            document.querySelector(
                "#alerts-resolved"
            );


        if (total) {

            total.textContent =
                [
                    ...alertRows
                ].filter(
                    row =>
                        row.dataset.status !==
                        "dismissed"
                ).length;

        }


        if (critical)
            critical.textContent =
                countSeverity(
                    "critical"
                );


        if (warning)
            warning.textContent =
                countSeverity(
                    "warning"
                );


        if (resolved)
            resolved.textContent =
                countResolved;


        const emptyState =
            document.querySelector(
                ".alerts-empty"
            );


        if (emptyState) {

            emptyState.hidden =
                visibleAlerts.length > 0;

        }

    }


    function filterAlerts(
        filter = "all"
    ) {

        const searchTerm =
            alertSearch
                ? alertSearch.value
                    .trim()
                    .toLowerCase()
                : "";


        alertRows.forEach(row => {

            const matchesFilter =
                filter === "all" ||
                row.dataset.severity ===
                    filter ||
                row.dataset.status ===
                    filter;


            const matchesSearch =
                !searchTerm ||
                row.textContent
                    .toLowerCase()
                    .includes(
                        searchTerm
                    );


            row.hidden =
                !(
                    matchesFilter &&
                    matchesSearch
                );

        });


        updateAlertStats();

    }


    alertFilters.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                alertFilters.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                filterAlerts(
                    button.dataset.alertFilter
                );

            }
        );

    });


    if (alertSearch) {

        alertSearch.addEventListener(
            "input",
            () => {

                const activeFilter =
                    document.querySelector(
                        ".alert-filter.active"
                    )?.dataset
                        .alertFilter ||
                    "all";


                filterAlerts(
                    activeFilter
                );

            }
        );

    }


    alertRows.forEach(row => {

        row.querySelector(
            ".resolve-alert"
        )?.addEventListener(
            "click",
            () => {

                row.dataset.status =
                    "resolved";

                row.dataset.severity =
                    "resolved";


                const status =
                    row.querySelector(
                        ".alert-status"
                    );


                if (status) {

                    status.textContent =
                        "Resolved";

                    status.className =
                        "alert-status resolved";

                }


                const button =
                    row.querySelector(
                        ".resolve-alert"
                    );


                if (button) {

                    button.textContent =
                        "Resolved";

                    button.disabled =
                        true;

                }


                filterAlerts(
                    document.querySelector(
                        ".alert-filter.active"
                    )?.dataset
                        .alertFilter ||
                    "all"
                );

            }
        );


        row.querySelector(
            ".dismiss-alert"
        )?.addEventListener(
            "click",
            () => {

                row.dataset.status =
                    "dismissed";

                row.hidden = true;

                updateAlertStats();

            }
        );

    });


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

    function openBuildingRooms(
        buildingName
    ) {

        if (
            !buildingRoomView ||
            !roomGrid
        ) {
            console.error(
                "Building room HTML not found."
            );

            return;
        }


        const rooms =
            roomData[
                buildingName
            ] || {};


        if (selectedBuildingName) {

            selectedBuildingName.textContent =
                buildingName;

        }


        /* ---------------------------------------------
           IMPORTANT:
           TIMETABLE HIDDEN WHEN BUILDING OPENS
        --------------------------------------------- */

        if (roomTimetable) {

            roomTimetable.hidden =
                true;

            roomTimetable.innerHTML =
                "";

        }


        /* ---------------------------------------------
           CREATE ROOMS
        --------------------------------------------- */

        roomGrid.innerHTML =
            "";


        Object.keys(rooms).forEach(
            roomName => {

                const roomButton =
                    document.createElement(
                        "button"
                    );


                roomButton.type =
                    "button";


                roomButton.className =
                    "room-card";


                roomButton.dataset.room =
                    roomName;


                roomButton.innerHTML = `

                    <span class="room-icon">
                        ▦
                    </span>

                    <span class="room-name">
                        ${roomName}
                    </span>

                    <span class="room-action">
                        View timetable →
                    </span>

                `;


                roomButton.addEventListener(
                    "click",
                    () => {

                        /* Remove old selection */

                        roomGrid
                            .querySelectorAll(
                                ".room-card"
                            )
                            .forEach(
                                btn => {

                                    btn.classList.remove(
                                        "selected"
                                    );

                                }
                            );


                        /* Select clicked room */

                        roomButton.classList.add(
                            "selected"
                        );


                        /* Show ONLY this room */

                        showRoomTimetable(
                            buildingName,
                            roomName
                        );

                    }
                );


                roomGrid.appendChild(
                    roomButton
                );

            }
        );


        /* Show building room view */

        buildingRoomView.hidden =
            false;


        buildingRoomView.classList.add(
            "show"
        );


        /* Scroll to room section */

        setTimeout(() => {

            buildingRoomView.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);

    }


    /* =====================================================
       SHOW ONLY SELECTED ROOM TIMETABLE
    ===================================================== */

    function showRoomTimetable(
        buildingName,
        roomName
    ) {

        if (!roomTimetable)
            return;


        const timetable =
            roomData[
                buildingName
            ]?.[
                roomName
            ];


        if (!timetable)
            return;


        roomTimetable.innerHTML = `

            <div class="timetable-header">

                <div>

                    <span class="eyebrow">
                        ROOM TIMETABLE
                    </span>

                    <h3>
                        ${roomName}
                    </h3>

                    <p>
                        Today's scheduled classes
                    </p>

                </div>

            </div>


            <div class="timetable-list">

                ${timetable.map(
                    item => `

                        <div class="timetable-row">

                            <div class="time-slot">
                                ${item[0]}
                            </div>

                            <div class="class-info">

                                <strong>
                                    ${item[1]}
                                </strong>

                                <span>
                                    ${item[2]}
                                </span>

                            </div>

                        </div>

                    `
                ).join("")}

            </div>

        `;


        /* ---------------------------------------------
           SHOW TIMETABLE ONLY NOW
        --------------------------------------------- */

        roomTimetable.hidden =
            false;


        roomTimetable.classList.add(
            "show"
        );


        setTimeout(() => {

            roomTimetable.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });

        }, 100);

    }


    /* =====================================================
       CLOSE BUILDING ROOM VIEW
    ===================================================== */

    if (closeBuildingView) {

        closeBuildingView.addEventListener(
            "click",
            () => {

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

            }
        );

    }


    /* =====================================================
       FLASK & MYSQL BACKEND INTEGRATION
    ===================================================== */

    const API_BASE = window.location.origin.startsWith("http") && (window.location.port === "5000" || window.location.port === "")
        ? ""
        : "http://127.0.0.1:5000";

    const backendStatusPill = document.querySelector("#backend-status-pill");
    const backendStatusText = document.querySelector("#backend-status-text");

    async function checkBackendHealth() {
        try {
            const res = await fetch(`${API_BASE}/api/health`);
            const data = await res.json();
            if (data.status === "online" && data.database?.status === "connected") {
                if (backendStatusPill) {
                    backendStatusPill.classList.remove("offline");
                    backendStatusPill.title = `MySQL 8.0 Connected (${data.database.database} @ ${data.database.host})`;
                }
                if (backendStatusText) {
                    backendStatusText.textContent = "MySQL Connected";
                }
                return true;
            } else {
                throw new Error("Database not connected");
            }
        } catch (err) {
            if (backendStatusPill) {
                backendStatusPill.classList.add("offline");
                backendStatusPill.title = "Backend unreachable. Running with local fallback data.";
            }
            if (backendStatusText) {
                backendStatusText.textContent = "MySQL Offline";
            }
            return false;
        }
    }

    async function loadBackendStats() {
        try {
            const res = await fetch(`${API_BASE}/api/stats`);
            const data = await res.json();
            if (data.success && data.stats) {
                const s = data.stats;
                const bldEl = document.querySelector("#stat-total-buildings");
                const netEl = document.querySelector("#stat-network-status");
                const issEl = document.querySelector("#stat-active-issues");
                const covEl = document.querySelector("#stat-campus-coverage");

                if (bldEl && s.total_buildings) bldEl.textContent = s.total_buildings;
                if (netEl && s.network_status) netEl.textContent = s.network_status;
                if (issEl && s.active_issues) issEl.textContent = s.active_issues;
                if (covEl && s.campus_coverage) covEl.textContent = s.campus_coverage;
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
        } catch (e) {
            console.warn("Could not load buildings:", e);
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
            if (!data.success || !data.alerts) return;

            const alertsList = document.querySelector("#alerts-list");
            if (!alertsList) return;

            alertsList.innerHTML = "";

            data.alerts.forEach(alert => {
                const article = document.createElement("article");
                article.className = "alert alert-page-row";
                article.dataset.id = alert.id;
                article.dataset.severity = alert.severity;
                article.dataset.status = alert.status;
                if (alert.status === "dismissed") article.hidden = true;

                const iconSymbol = alert.severity === "critical" ? "!" : (alert.status === "resolved" ? "✓" : "ϟ");
                const iconColor = alert.severity === "critical" ? "red" : (alert.status === "resolved" ? "green" : "yellow");
                const statusBadgeClass = alert.status === "resolved" ? "resolved" : `${alert.severity}-status`;
                const statusBadgeText = alert.status === "resolved" ? "Resolved" : (alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1));

                article.innerHTML = `
                    <div class="alert-icon ${iconColor}">
                        ${iconSymbol}
                    </div>
                    <div class="alert-text">
                        <strong>${alert.title}</strong>
                        <small>${alert.location || 'Campus'} · ${alert.category || 'System'} · ${alert.status.toUpperCase()} · MySQL Live</small>
                        <p>${alert.description}</p>
                    </div>
                    <span class="alert-status ${statusBadgeClass}">
                        ${statusBadgeText}
                    </span>
                    <button class="alert-action ${alert.status === 'resolved' ? 'resolve-alert' : 'dismiss-alert'}" type="button">
                        ${alert.status === 'resolved' ? 'Resolved' : 'Dismiss'}
                    </button>
                    ${alert.status !== 'resolved' ? '<button class="alert-action resolve-alert" type="button" style="margin-left: 6px;">Resolve</button>' : ''}
                `;

                // Wire action buttons to MySQL
                const dismissBtn = article.querySelector(".dismiss-alert");
                if (dismissBtn) {
                    dismissBtn.addEventListener("click", async () => {
                        try {
                            await fetch(`${API_BASE}/api/alerts/${alert.id}/dismiss`, { method: "POST" });
                            article.dataset.status = "dismissed";
                            article.hidden = true;
                            loadBackendAlerts();
                        } catch (err) {
                            article.hidden = true;
                        }
                    });
                }

                const resolveBtn = article.querySelector(".resolve-alert");
                if (resolveBtn && alert.status !== "resolved") {
                    resolveBtn.addEventListener("click", async () => {
                        try {
                            await fetch(`${API_BASE}/api/alerts/${alert.id}/resolve`, { method: "POST" });
                            loadBackendAlerts();
                        } catch (err) {
                            console.warn("Error resolving alert:", err);
                        }
                    });
                }

                alertsList.appendChild(article);
            });

            // Update counters from stats
            if (data.stats) {
                const total = document.querySelector("#alerts-total");
                const critical = document.querySelector("#alerts-critical");
                const warning = document.querySelector("#alerts-warning");
                const resolved = document.querySelector("#alerts-resolved");

                if (total) total.textContent = data.stats.total || 0;
                if (critical) critical.textContent = data.stats.critical || 0;
                if (warning) warning.textContent = data.stats.warning || 0;
                if (resolved) resolved.textContent = data.stats.resolved || 0;
            }
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
                loadBackendRoomData(),
                loadBackendSensors(),
                loadBackendAlerts(),
                loadBackendSettings()
            ]);
        }
    })();

});