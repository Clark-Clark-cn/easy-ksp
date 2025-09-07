export default {
    // 通用
    common: {
        back: '返回',
        save: '保存',
        cancel: '取消',
        confirm: '确认',
        loading: '加载中...',
        error: '错误',
        success: '成功',
        warning: '警告',
        info: '信息',
        close: '关闭',
        home: '主页',
        settings: '设置',
        help: '帮助',
        clear: '清空',
        resetView: '重置视图',
        snapToGrid: '网格吸附'
    },

    // 主页面
    main: {
        gameTitle: '太空计划',
        rocketBuilder: {
            title: '载具装配',
            description: '建造你的火箭',
            button: '进入装配'
        },
        trackingStation: {
            title: '追踪站',
            description: '监控你的载具',
            button: '进入追踪'
        },
        comingSoon: '即将推出！'
    },

    // 火箭建造器
    rocketBuilder: {
        title: '载具装配大楼',
        backToHome: '返回主页',
        saveDesign: '保存设计',
        launch: '发射',
        panels: {
            assembly: '装配区',
            parts: '部件库',
            info: '信息'
        },
        partsLibrary: {
            title: '部件库',
            categories: {
                all: '全部',
                command: '指挥舱',
                fuel: '燃料箱',
                engines: '引擎',
                structural: '结构件',
                science: '科学仪器'
            },
            searchPlaceholder: '搜索部件...'
        },
        partsPanel: {
            mass: '质量',
            thrust: '推力',
            crew: '载员'
        },
        assemblyArea: {
            title: '装配区域',
            dragHint: '从左侧拖拽部件到这里',
            emptyHint: '开始建造你的火箭！'
        },
        infoPanel: {
            title: '载具信息',
            rocketName: '载具名称',
            unnamed: '未命名载具',
            stats: {
                totalMass: '总质量',
                totalCost: '总成本',
                totalThrust: '总推力',
                partCount: '部件数量',
                stages: '级数'
            },
            units: {
                kg: 'kg',
                funds: '资金'
            }
        },
        selectedPart: {
            title: '选中部件',
            none: '未选中任何部件'
        },
        partInfo: {
            // 燃料控制
            fuelControls: '燃料控制',
            liquidFuel: '液体燃料',
            oxidizer: '氧化剂',
            units: '单位',
            fullLoad: '满载',
            halfLoad: '半载',
            emptyLoad: '空载',
            
            // 分离器控制
            decouplerControls: '分离器控制',
            separationForce: '分离力',
            upperStage: '上级部件',
            lowerStage: '下级部件',
            testSeparation: '测试分离',
            stagingInfo: '分级信息',
            countUnit: '个',
            
            // 部件属性
            mass: '质量',
            cost: '成本',
            thrust: '推力',
            vacuumIsp: '比冲 (真空)',
            crewCapacity: '载员容量',
            peopleUnit: '人',
            dimensions: '尺寸',
            removePart: '移除此部件'
        },
        help: {
            title: '操作提示',
            dragRoot: '• 首先拖拽一个部件作为根部件（自动居中）',
            dragConnect: '• 继续拖拽部件连接到已有部件',
            dragMove: '• 拖拽部件移动位置',
            dragView: '• 拖拽空白区域移动视图',
            clickInfo: '• 点击部件查看详细信息',
            rightClick: '• 右键或在信息界面删除部件',
            zoom: '• Ctrl+滚轮或双指缩放'
        },
        notifications: {
            saved: '设计已保存',
            launched: '准备发射载具',
            partAdded: '部件已添加',
            partRemoved: '部件已移除',
            invalidRocket: '无效的载具设计'
        },
        staging: {
            noDecoupler: '当前载具没有检测到分离器，无法进行分级。\n\n添加分离器部件可以创建多级火箭设计。',
            title: '火箭分级信息',
            stage: '第',
            stageUnit: '级',
            decoupler: '分离器',
            partCount: '部件数量',
            totalMass: '总质量',
            deltaV: '预估ΔV',
            totalStages: '总级数',
            note: '注意: 发射时分离器将按优先级顺序激活。'
        },
        connectivity: {
            connected: '已连接到根部件的部件',
            disconnected: '未连接到根部件的部件',
        },
        welcome: {
            title: '装配大楼',
            message: '欢迎来到载具装配大楼！先选择一个根部件，然后逐步构建载具。'
        },
        rootPart: {
            title: '根部件'
        },
        confirmations: {
            goBack: '确定要返回主页吗？未保存的设计将丢失。',
            clearAssembly: '确定要清空当前载具设计吗？'
        },
        alerts: {
            designSaved: '设计已保存到下载文件夹',
            decouplerTestFailed: '分离器测试失败！请检查分离器是否正确连接。',
            noVehicle: '请先设计一个载具！',
            noEngine: '载具需要至少一个引擎才能发射！',
            saveDataFailed: '保存火箭数据失败，请重试',
            prepareLaunch: '准备发射...',
            vehicleReady: '载具已准备好发射'
        }
    },

    // 发射台
    launchPad: {
        title: '发射台',
        backToAssembly: '返回装配',
        igniteAndLaunch: '发射',
        flightData: {
            title: '飞行数据',
            altitude: '高度',
            totalVelocity: '总速度',
            fuel: '液体燃料'
        },
        controlsHint: {
            title: '操作说明',
            steering: '左右转向',
            throttleAdjust: '±1% 推力',
            throttleMinMax: '100%/0% 推力',
        },
        controls: {
            title: '飞行控制',
            launch: '发射',
            abort: '紧急中止',
            staging: '分级控制',
            throttleUp: '增加推力',
            throttleDown: '减少推力',
            stage: '分离',
            sas: '姿态稳定系统',
            rcs: '反应控制系统',
            turnLeft: '左转',
            turnRight: '右转',
            timeAcceleration: '时间加速'
        },
        throttle: {
            title: '推力控制',
            current: '当前推力',
            min: '最小',
            max: '最大',
            minimum: '设置为最小推力',
            maximum: '设置为最大推力',
            activeEngines: '活跃引擎',
            currentThrust: '当前推力',
            engineThrottle: '引擎节流阀',
            keyboardHint: 'Shift/Ctrl: ±1% z/x 100%/0%'
        },
        steering: {
            title: '转向控制',
            angle: '转向角度',
            keyboardHint: 'A/D: 左/右转向'
        },
        touchControls: {
            title: '触屏控制',
            steeringPad: '转向控制盘',
            throttleSlider: '推力滑块',
            mainControls: '主控制',
            launch: '发射',
            stage: '分离',
            abort: '中止',
            angle: '角度',
            throttle: '推力'
        },
        status: {
            ready: '准备就绪',
            launching: '发射中',
            flying: '飞行中',
            landed: '已着陆',
            crashed: '坠毁',
            orbit: '轨道中',
            takeoff: '重新起飞',
            timeAcceleration: '时间加速'
        },
        units: {
            meters: 'm',
            metersPerSecond: 'm/s',
            metersPerSecondSquared: 'm/s²',
            percent: '%'
        },
        notifications: {
            launchSuccess: '发射成功！',
            stageEmpty: '当前级燃料耗尽',
            missionComplete: '任务完成',
            vehicleLost: '载具失联',
            takeoff: {
                title: '重新起飞',
                message: '火箭离开地面！'
            },
            landing: {
                title: '任务成功',
                message: '火箭成功着陆！'
            },
            crash: {
                title: '任务失败',
                message: '火箭撞毁了！'
            },
            staging: {
                title: '分级',
                message: '第 {stage} 级已分离，激活第 {next} 级',
                failed: '分级失败',
                noMoreStages: '没有更多级可分离',
                notLaunched: '火箭尚未发射'
            }
        },
        
        // 轨道信息
        orbital: {
            title: '轨道信息',
            periapsis: '近地点',
            apoapsis: '远地点',
        },
        
        // 控制提示
        controlsHints: {
            title: '控制提示',
            steering: '左右转向',
            throttleAdjust: '±1% 推力',
            throttleMinMax: '100%/0% 推力',
            mapView: '地图视图',
            timeAcceleration: '时间加速',
        },
        
        // 分级和火箭详情
        singleStage: '单级火箭',
        noStagingInfo: '无分级信息',
        stage: '第',
        stageUnit: '级',
        parts: '部件',
        mass: '质量',
        engines: '引擎',
        withDecoupler: '有分离器',
        withoutDecoupler: '无分离器',
        countdownInProgress: '倒计时中...',
        launched: '已发射',
        launchCountdown: '发射倒计时',
        launch: '发射！'
    },

    // 火箭部件
    parts: {
        // 指挥舱
        commandPod: {
            name: 'Mk1 指令舱',
            description: '单人指令舱，用于控制载具',
            category: 'command'
        },
        
        // 燃料箱
        fuelTankSmall: {
            name: 'FL-T100 燃料罐',
            description: '小型液体燃料罐，适合轻型载具。支持顶部、底部和侧面连接。',
            category: 'fuel'
        },
        fuelTankMedium: {
            name: 'FL-T400 燃料罐',
            description: '大型液体燃料罐，提供充足的燃料储存。支持顶部、底部和侧面连接。',
            category: 'fuel'
        },
        fuelTankLarge: {
            name: 'FL-T800 燃料罐',
            description: '超大型液体燃料罐，适合重型载具和长距离任务',
            category: 'fuel'
        },

        // 引擎
        liquidEngine909: {
            name: 'LV-909 液体燃料引擎',
            description: '高效真空引擎，适合上面级使用',
            category: 'engines'
        },
        liquidEngine25k: {
            name: 'LV-25K 液体燃料引擎',
            description: '强大的液体燃料引擎，适合重型发射载具',
            category: 'engines'
        },
        liquidEngine: {
            name: 'LV-T30 液体燃料引擎',
            description: '可靠的液体燃料火箭引擎',
            category: 'engines'
        },
        solidBooster: {
            name: 'RT-10 固体燃料助推器',
            description: '简单的固体燃料引擎',
            category: 'engines'
        },

        // 结构件
        decoupler: {
            name: 'TD-12 分离连接器',
            description: '用于火箭分级的分离连接器。可在指定时机分离上下两级火箭，实现多级火箭设计。分离时会产生一定的分离力。',
            category: 'structural'
        },
        noseCone: {
            name: '空气动力鼻锥',
            description: '减少空气阻力的鼻锥',
            category: 'structural'
        }
    },

    // 通知消息
    notifications: {
        welcome: {
            title: '欢迎来到 KSP Web',
            message: '探索浩瀚宇宙的旅程即将开始！'
        },
        gridSnap: {
            title: '网格吸附',
            enabled: '网格吸附已开启',
            disabled: '网格吸附已关闭'
        },
        panelSwitch: {
            title: '面板切换',
            assembly: '已切换到装配区',
            parts: '已切换到部件库',
            info: '已切换到信息面板'
        },
        rootPart: {
            title: '根部件',
            message: '根部件已放置在中心位置，现在可以添加其他部件'
        },
        autoConnect: {
            title: '自动连接',
            message: '部件已自动连接到 {partName}',
            afterMove: '部件移动后自动连接到 {partName}'
        },
        connectionBroken: {
            title: '连接断开',
            message: '{count}个连接因距离过远而自动断开'
        },
        partSelected: {
            title: '部件选中',
            message: '已选中 {partName}，自动切换到信息面板'
        },
        viewReset: {
            title: '视图重置',
            message: '画布视图已重置到默认位置'
        },
        zoomReset: {
            title: '缩放重置',
            message: '画布缩放已重置，位置保持不变'
        },
        gridSnap: {
            title: '网格吸附',
            enabled: '网格吸附已开启',
            disabled: '网格吸附已关闭'
        },
        connection: {
            autoConnected: '部件已自动连接',
            connected: '部件已连接',
            disconnected: '部件已断开连接'
        },
        staging: {
            failed: '分级失败',
            noMoreStages: '没有更多分级可以激活',
            notLaunched: '火箭尚未发射',
            activated: '分级已激活',
            separated: '分离器已激活'
        },
        loading: {
            rocketData: '加载火箭数据中...',
            complete: '加载完成'
        }
    },

    // 错误消息
    errors: {
        networkError: '网络连接错误',
        fileNotFound: '文件未找到',
        invalidData: '数据格式错误',
        saveError: '保存失败',
        loadError: '加载失败',
        noRocketData: '没有找到火箭数据，请先在装配厂创建火箭',
        invalidRocketData: '火箭数据无效，请重新加载',
        loadRocketDataFailed: '加载火箭数据失败'
    },

    // 语言选择
    language: {
        title: '语言',
        current: '当前语言',
        switch: '切换语言',
        chinese: '简体中文',
        english: 'English'
    },

    // 轨道地图
    map: {
        title: '轨道地图',
        closeHint: '按 M 键关闭地图 | 触屏缩放和拖动',
        altitude: '高度',
        velocity: '速度',
        angle: '角度',
        km: 'km',
        ms: 'm/s',
        degrees: '°',
        altitudeLabel: '高度:',
        velocityLabel: '速度:',
        angleLabel: '角度:'
    }
};
