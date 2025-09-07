export default {
    // Common
    common: {
        back: 'Back',
        save: 'Save',
        cancel: 'Cancel',
        confirm: 'Confirm',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        warning: 'Warning',
        info: 'Information',
        close: 'Close',
        home: 'Home',
        settings: 'Settings',
        help: 'Help',
        clear: 'Clear',
        resetView: 'Reset View',
        snapToGrid: 'Snap to Grid'
    },

    // Main page
    main: {
        gameTitle: 'easy-ksp',
        rocketBuilder: {
            title: 'Vehicle Assembly',
            description: 'build your rockets',
            button: 'Let\'s Build'
        },
        trackingStation: {
            title: 'Tracking Station',
            description: 'Monitor your vehicles',
            button: 'Let\'s Track'
        },
        comingSoon: 'Coming Soon!'
    },

    // Rocket Builder
    rocketBuilder: {
        title: 'Vehicle Assembly Building',
        backToHome: 'Back to Home',
        saveDesign: 'Save Design',
        launch: 'Launch',
        panels: {
            assembly: 'Assembly',
            parts: 'Parts',
            info: 'Info'
        },
        partsLibrary: {
            title: 'Parts Library',
            categories: {
                all: 'All',
                command: 'Command',
                fuel: 'Fuel Tanks',
                engines: 'Engines',
                structural: 'Structural',
                science: 'Science'
            },
            searchPlaceholder: 'Search parts...'
        },
        partsPanel: {
            mass: 'Mass',
            thrust: 'Thrust',
            crew: 'Crew'
        },
        assemblyArea: {
            title: 'Assembly Area',
            dragHint: 'Drag parts from the left panel here',
            emptyHint: 'Start building your rocket!'
        },
        infoPanel: {
            title: 'Vehicle Info',
            rocketName: 'Vehicle Name',
            unnamed: 'Unnamed Vehicle',
            stats: {
                totalMass: 'Total Mass',
                totalCost: 'Total Cost',
                totalThrust: 'Total Thrust',
                partCount: 'Part Count',
                stages: 'Stages'
            },
            units: {
                kg: 'kg',
                funds: 'Funds'
            }
        },
        selectedPart: {
            title: 'Selected Part',
            none: 'No part selected'
        },
        partInfo: {
            // Fuel controls
            fuelControls: 'Fuel Controls',
            liquidFuel: 'Liquid Fuel',
            oxidizer: 'Oxidizer',
            units: 'units',
            fullLoad: 'Full Load',
            halfLoad: 'Half Load',
            emptyLoad: 'Empty',
            
            // Decoupler controls
            decouplerControls: 'Decoupler Controls',
            separationForce: 'Separation Force',
            upperStage: 'Upper Stage Parts',
            lowerStage: 'Lower Stage Parts',
            testSeparation: 'Test Separation',
            stagingInfo: 'Staging Info',
            countUnit: '',
            
            // Part properties
            mass: 'Mass',
            cost: 'Cost',
            thrust: 'Thrust',
            vacuumIsp: 'ISP (Vacuum)',
            crewCapacity: 'Crew Capacity',
            peopleUnit: 'crew',
            dimensions: 'Dimensions',
            removePart: 'Remove Part'
        },
        help: {
            title: 'Controls Help',
            dragRoot: '• First drag a part as the root part (automatically centered)',
            dragConnect: '• Continue dragging parts to connect to existing parts',
            dragMove: '• Drag parts to move position',
            dragView: '• Drag empty area to move view',
            clickInfo: '• Click part to view detailed information',
            rightClick: '• Right-click or delete in info panel to remove part',
            zoom: '• Ctrl+scroll or two-finger zoom',
            controls: '• Use bottom control buttons: reset view, toggle grid snap',
        },
        notifications: {
            saved: 'Design saved',
            launched: 'Preparing to launch vehicle',
            partAdded: 'Part added',
            partRemoved: 'Part removed',
            invalidRocket: 'Invalid vehicle design'
        },
        staging: {
            noDecoupler: 'Current vehicle has no decouplers detected, cannot perform staging.\n\nAdd decoupler parts to create multi-stage rocket designs.',
            title: 'Rocket Staging Information',
            stage: 'Stage',
            stageUnit: '',
            decoupler: 'Decoupler',
            partCount: 'Part Count',
            totalMass: 'Total Mass',
            deltaV: 'Estimated ΔV',
            totalStages: 'Total Stages',
            note: 'Note: Decouplers will be activated in priority order during launch.'
        },
        connectivity: {
            connected: 'Part connected to root part',
            disconnected: 'Part not connected to root',
        },
        welcome: {
            title: 'Vehicle Assembly Building',
            message: 'Welcome to the Vehicle Assembly Building! Select a root part first, then build your vessel step by step.'
        },
        rootPart: {
            title: 'Root Part'
        },
        confirmations: {
            goBack: 'Are you sure you want to return to the homepage? Unsaved designs will be lost.',
            clearAssembly: 'Are you sure you want to clear the current vehicle design?'
        },
        alerts: {
            designSaved: 'Design saved to downloads folder',
            decouplerTestFailed: 'Decoupler test failed! Please check if the decoupler is properly connected.',
            noVehicle: 'Please design a vehicle first!',
            noEngine: 'Vehicle needs at least one engine to launch!',
            saveDataFailed: 'Failed to save rocket data, please try again',
            prepareLaunch: 'Preparing for launch...',
            vehicleReady: 'Vehicle is ready for launch'
        }
    },

    // Launch Pad
    launchPad: {
        title: 'Launch Pad',
        backToAssembly: 'Back to Assembly',
        igniteAndLaunch: 'Launch',
        flightData: {
            title: 'Flight Data',
            altitude: 'Altitude',
            totalVelocity: 'Total Velocity',
            fuel: 'Liquid Fuel'
        },
        controlsHint: {
            title: 'Controls',
            steering: 'Left/Right Turn',
            throttleAdjust: '±1% Throttle',
            throttleMinMax: '100%/0% Throttle',
        },
        controls: {
            title: 'Flight Controls',
            launch: 'Launch',
            abort: 'Abort',
            staging: 'Staging Control',
            stage: 'Stage',
            throttleUp: 'Throttle Up',
            throttleDown: 'Throttle Down',
            stage: 'Stage',
            sas: 'SAS',
            rcs: 'RCS',
            turnLeft: 'Turn Left',
            turnRight: 'Turn Right',
            timeAcceleration: 'Time Acceleration'
        },
        throttle: {
            title: 'Throttle Control',
            current: 'Current Throttle',
            min: 'Min',
            max: 'Max',
            minimum: 'Set to minimum throttle',
            maximum: 'Set to maximum throttle',
            activeEngines: 'Active Engines',
            currentThrust: 'Current Thrust',
            engineThrottle: 'Engine Throttle',
            keyboardHint: 'Shift/Ctrl: ±1% z/x 100%/0%'
        },
        steering: {
            title: 'Steering Control',
            angle: 'Steering Angle',
            keyboardHint: 'A/D: Left/Right Turn'
        },
        touchControls: {
            title: 'Touch Controls',
            steeringPad: 'Steering Pad',
            throttleSlider: 'Throttle Slider',
            mainControls: 'Main Controls',
            launch: 'Launch',
            stage: 'Stage',
            abort: 'Abort',
            angle: 'Angle',
            throttle: 'Throttle'
        },
        status: {
            ready: 'Ready',
            launching: 'Launching',
            flying: 'Flying',
            landed: 'Landed',
            crashed: 'Crashed',
            orbit: 'In Orbit',
            takeoff: 'Taking Off',
            timeAcceleration: 'Time Acceleration'
        },
        units: {
            meters: 'm',
            metersPerSecond: 'm/s',
            metersPerSecondSquared: 'm/s²',
            percent: '%'
        },
        notifications: {
            launchSuccess: 'Launch successful!',
            stageEmpty: 'Current stage fuel depleted',
            missionComplete: 'Mission complete',
            vehicleLost: 'Vehicle lost',
            takeoff: {
                title: 'Taking Off',
                message: 'Rocket lifting off!'
            },
            landing: {
                title: 'Mission Success',
                message: 'Rocket landed safely!'
            },
            crash: {
                title: 'Mission Failed',
                message: 'Rocket crashed!'
            },
            staging: {
                title: 'Staging',
                message: 'Stage {stage} separated, activating stage {next}',
                failed: 'Staging Failed',
                noMoreStages: 'No more stages to separate',
                notLaunched: 'Rocket has not launched yet'
            }
        },
        
        // Orbital information
        orbital: {
            title: 'Orbital Info',
            periapsis: 'Periapsis',
            apoapsis: 'Apoapsis',
        },
        
        // Control hints
        controlsHints: {
            title: 'Controls',
            steering: 'Left/Right Turn',
            throttleAdjust: '±1% Throttle',
            throttleMinMax: '100%/0% Throttle',
            mapView: 'Map View',
            timeAcceleration: 'Time Acceleration',
        },
        
        // Staging and rocket details
        singleStage: 'Single Stage Rocket',
        noStagingInfo: 'No Staging Info',
        stage: 'Stage',
        stageUnit: '',
        parts: 'Parts',
        mass: 'Mass',
        engines: 'Engines',
        withDecoupler: 'With Decoupler',
        withoutDecoupler: 'No Decoupler',
        countdownInProgress: 'Countdown...',
        launched: 'Launched',
        launchCountdown: 'Launch Countdown',
        launch: 'Launch!'
    },

    // Rocket Parts
    parts: {
        // Command
        commandPod: {
            name: 'Mk1 Command Pod',
            description: 'Basic crew capsule for controlling the vehicle',
            category: 'command'
        },
        
        // Fuel Tanks
        fuelTankSmall: {
            name: 'FL-T100 Fuel Tank',
            description: 'Small liquid fuel tank, suitable for light vehicles. Supports top, bottom and side connections.',
            category: 'fuel'
        },
        fuelTankMedium: {
            name: 'FL-T400 Fuel Tank',
            description: 'Large liquid fuel tank providing ample fuel storage. Supports top, bottom and side connections.',
            category: 'fuel'
        },
        fuelTankLarge: {
            name: 'FL-T800 Fuel Tank',
            description: 'Extra-large liquid fuel tank, suitable for heavy vehicles and long-range missions',
            category: 'fuel'
        },

        // Engines
        liquidEngine909: {
            name: 'LV-909 Liquid Fuel Engine',
            description: 'Efficient vacuum engine, suitable for upper stages',
            category: 'engines'
        },
        liquidEngine25k: {
            name: 'LV-25K Liquid Fuel Engine',
            description: 'Powerful liquid fuel engine, suitable for heavy launch vehicles',
            category: 'engines'
        },
        liquidEngine: {
            name: 'LV-T30 Liquid Fuel Engine',
            description: 'Reliable liquid fuel rocket engine',
            category: 'engines'
        },
        solidBooster: {
            name: 'RT-10 Solid Fuel Booster',
            description: 'Simple solid fuel engine',
            category: 'engines'
        },

        // Structural
        decoupler: {
            name: 'TD-12 Decoupler',
            description: 'Decoupler for rocket staging. Can separate upper and lower rocket stages at specified times, enabling multi-stage rocket design. Produces separation force when activated.',
            category: 'structural'
        },
        noseCone: {
            name: 'Aerodynamic Nose Cone',
            description: 'Nose cone to reduce air resistance',
            category: 'structural'
        }
    },

    // Notification messages
    notifications: {
        welcome: {
            title: 'Welcome to KSP Web',
            message: 'Your journey to explore the vast universe is about to begin!'
        },
        gridSnap: {
            title: 'Grid Snap',
            enabled: 'Grid snap enabled',
            disabled: 'Grid snap disabled'
        },
        panelSwitch: {
            title: 'Panel Switch',
            assembly: 'Switched to Assembly area',
            parts: 'Switched to Parts library',
            info: 'Switched to Info panel'
        },
        rootPart: {
            title: 'Root Part',
            message: 'Root part placed at center position, now you can add other parts'
        },
        autoConnect: {
            title: 'Auto Connect',
            message: 'Part automatically connected to {partName}',
            afterMove: 'Part automatically connected to {partName} after move'
        },
        connectionBroken: {
            title: 'Connection Broken',
            message: '{count} connection(s) automatically broken due to excessive distance'
        },
        partSelected: {
            title: 'Part Selected',
            message: 'Selected {partName}, automatically switched to info panel'
        },
        viewReset: {
            title: 'View Reset',
            message: 'Canvas view has been reset to default position'
        },
        zoomReset: {
            title: 'Zoom Reset',
            message: 'Canvas zoom has been reset, position unchanged'
        },
        gridSnap: {
            title: 'Grid Snap',
            enabled: 'Grid snap enabled',
            disabled: 'Grid snap disabled'
        },
        connection: {
            autoConnected: 'Part automatically connected',
            connected: 'Part connected',
            disconnected: 'Part disconnected'
        },
        staging: {
            failed: 'Staging failed',
            noMoreStages: 'No more stages to activate',
            notLaunched: 'Rocket not launched yet',
            activated: 'Stage activated',
            separated: 'Decoupler activated'
        },
        loading: {
            rocketData: 'Loading rocket data...',
            complete: 'Loading complete'
        }
    },

    // Error messages
    errors: {
        networkError: 'Network connection error',
        fileNotFound: 'File not found',
        invalidData: 'Invalid data format',
        saveError: 'Save failed',
        loadError: 'Load failed',
        noRocketData: 'No rocket data found, please create a rocket in the assembly building first',
        invalidRocketData: 'Invalid rocket data, please reload',
        loadRocketDataFailed: 'Failed to load rocket data'
    },

    // Language selection
    language: {
        title: 'Language',
        current: 'Current Language',
        switch: 'Switch Language',
        chinese: '简体中文',
        english: 'English'
    },

    // Orbital Map
    map: {
        title: 'Orbital Map',
        closeHint: 'Press M key to close map | Touch to zoom and drag',
        altitude: 'Altitude',
        velocity: 'Velocity',
        angle: 'Angle',
        km: 'km',
        ms: 'm/s',
        degrees: '°',
        altitudeLabel: 'Altitude:',
        velocityLabel: 'Velocity:',
        angleLabel: 'Angle:'
    }
};
