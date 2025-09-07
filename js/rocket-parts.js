// 火箭部件数据库
class RocketParts {
    static parts = {
        'command-pod-mk1': {
            id: 'command-pod-mk1',
            nameKey: 'parts.commandPod.name',
            category: 'command',
            type: 'command',
            mass: 0.84,
            cost: 600,
            crew_capacity: 1,
            dimensions: { width: 1.25, height: 1.2 },
            attachment_points: {
                top: { x: 0, y: -0.6, size: 1.25 },
                bottom: { x: 0, y: 0.6, size: 1.25 }
            },
            image_path: 'imgs/cmd-pod.png',
            descriptionKey: 'parts.commandPod.description',
            stats: {
                electric_capacity: 150,
                torque: 5.0,
                impact_tolerance: 14,
                max_temp: 2400
            }
        },

        'lv-909-engine': {
            id: 'lv-909-engine',
            nameKey: 'parts.liquidEngine909.name',
            category: 'propulsion',
            type: 'engine',
            mass: 0.5, // 吨
            cost: 390,
            thrust: 1000, // kN（真空）
            thrust_atm: 950, // kN（海平面）
            isp_vacuum: 345, // 秒
            isp_atm: 300, // 秒
            dimensions: { width: 1.25, height: 0.9 },// 米
            attachment_points: {
                top: { x: 0, y: -0.45, size: 1.25 },
                bottom: { x: 0, y: 0.45, size: 1.25 }
            },
            image_path: 'imgs/liquid-engine-1.png',
            descriptionKey: 'parts.liquidEngine909.description',
            fuel_consumption: {
                liquid_fuel: 1.4, // 秒
                oxidizer: 1.7 // 秒
            },
            stats: {
                max_temp: 2000,
                gimbal_range: 4.0,
                throttle_range: { min: 0.0, max: 1.0 }
            }
        },

        'lv-25k-engine': {
            id: 'lv-25k-engine',
            nameKey: 'parts.liquidEngine25k.name',
            category: 'propulsion',
            type: 'engine',
            mass: 1,
            cost: 390,
            thrust: 2500,
            thrust_atm: 2000,
            isp_vacuum: 345,
            isp_atm: 300, dimensions: { width: 1.25, height: 1.5 },
            attachment_points: {
                top: { x: 0, y: -0.75, size: 1.25 },
                bottom: { x: 0, y: 0.75, size: 1.25 }
            },
            image_path: 'imgs/liquid-engine-2.png',
            descriptionKey: 'parts.liquidEngine25k.description',
            fuel_consumption: {
                liquid_fuel: 5.6,
                oxidizer: 6.8
            },
            stats: {
                max_temp: 2000,
                gimbal_range: 4.0,
                throttle_range: { min: 0.0, max: 1.0 }
            }
        },

        'fl-t100-fuel-tank': {
            id: 'fl-t100-fuel-tank',
            nameKey: 'parts.fuelTankSmall.name',
            category: 'propulsion',
            type: 'fuel-tank',
            mass: 0.56,
            cost: 150,
            fuel_capacity: {
                liquid_fuel: 45,
                oxidizer: 55
            },
            dimensions: { width: 1.25, height: 0.8 }, attachment_points: {
                top: { x: 0, y: -0.4, size: 1.25 },
                bottom: { x: 0, y: 0.4, size: 1.25 },
                left: { x: -0.625, y: 0, size: 0.8 },
                right: { x: 0.625, y: 0, size: 0.8 }
            },
            image_path: 'imgs/fuel-tank-100.png',
            descriptionKey: 'parts.fuelTankSmall.description',
            stats: {
                max_temp: 2000,
                impact_tolerance: 6
            }
        },
        'fl-t400-fuel-tank': {
            id: 'fl-t400-fuel-tank',
            nameKey: 'parts.fuelTankMedium.name',
            category: 'propulsion',
            type: 'fuel-tank',
            mass: 2.25,
            cost: 500,
            fuel_capacity: {
                liquid_fuel: 180,
                oxidizer: 220
            },
            dimensions: { width: 1.25, height: 1.875 },
            attachment_points: {
                top: { x: 0, y: -0.9375, size: 1.25 },
                bottom: { x: 0, y: 0.9375, size: 1.25 },
                left: { x: -0.625, y: 0, size: 0.625 },
                right: { x: 0.625, y: 0, size: 0.625 }
            },
            image_path: 'imgs/fuel-tank-400.png',
            descriptionKey: 'parts.fuelTankMedium.description',
            stats: {
                max_temp: 2000,
                impact_tolerance: 6
            }
        },

        'td-12-decoupler': {
            id: 'td-12-decoupler',
            nameKey: 'parts.decoupler.name',
            category: 'structural',
            type: 'decoupler',
            mass: 0.4,
            cost: 400,
            dimensions: { width: 1.25, height: 0.4 },
            attachment_points: {
                top: { x: 0, y: -0.2, size: 1.25 },
                bottom: { x: 0, y: 0.2, size: 1.25 }
            },
            image_path: 'imgs/decoupler.png',
            descriptionKey: 'parts.decoupler.description',
            separation_force: 2500,
            stats: {
                max_temp: 2000,
                impact_tolerance: 9,
                ejection_force: 25
            },
            decoupler_properties: {
                can_separate: true,
                separation_direction: 'both',
                staged: true,
                stage_priority: 1
            }
        }
    };

    // 更新部件的本地化文本
    static updateLocalizedTexts() {
        if (!window.i18n) return;

        for (const partId in this.parts) {
            const part = this.parts[partId];
            if (part.nameKey) {
                part.name = window.i18n.t(part.nameKey);
            }
            if (part.descriptionKey) {
                part.description = window.i18n.t(part.descriptionKey);
            }
        }
    }

    // 获取所有部件
    static getAllParts() {
        this.updateLocalizedTexts();
        return Object.values(this.parts);
    }

    // 按类别获取部件
    static getPartsByCategory(category) {
        if (category === 'all') {
            return this.getAllParts();
        }
        return Object.values(this.parts).filter(part => part.category === category);
    }
    // 通过ID获取部件
    static getPartById(id) {
        return this.parts[id] || null;
    }

    // 获取部件类别列表
    static gretCategories() {
        const categories = new Set();
        Object.values(this.parts).forEach(part => {
            categories.add(part.category);
        });
        return Array.from(categories);
    }


    // 加载图像内容（支持SVG、PNG、JPG、WEBP等）
    static async loadPartImage(part) {
        try {
            const imageType = part.image_type || this.detectImageType(part.image_path);
            
            if (imageType === 'svg') {
                const response = await fetch(part.image_path);
                const svgText = await response.text();
                return svgText;
            } else {
                // For regular images, return an img tag that can be used as innerHTML
                return `<img src="${part.image_path}" alt="${part.name || 'Part'}" style="width: 100%; height: 100%; object-fit: contain;">`;
            }
        } catch (error) {
            console.warn(`Failed to load image for part ${part.id}:`, error);
            return this.getPlaceholderSVG(part);
        }
    }

    // 从文件扩展名检测图像类型
    static detectImageType(imagePath) {
        if (!imagePath) return 'svg';
        
        const extension = imagePath.split('.').pop().toLowerCase();
        const imageTypes = {
            'svg': 'svg',
            'png': 'image',
            'jpg': 'image',
            'jpeg': 'image',
            'webp': 'image',
            'gif': 'image',
            'bmp': 'image'
        };
        
        return imageTypes[extension] || 'image';
    }

    static async loadPartSVG(part) {
        console.warn('loadPartSVG is deprecated, use loadPartImage instead');
        const result = await this.loadPartImage(part);
        
        if (result.type === 'svg') {
            return result.content;
        } else {
            return this.getPlaceholderSVG(part);
        }
    }

    // 获取占位符图像（为了一致性返回SVG）
    static getPlaceholderImage(part) {
        return {
            type: 'svg',
            content: this.getPlaceholderSVG(part)
        };
    }

    // 获取占位符SVG
    static getPlaceholderSVG(part) {
        const color = part.category === 'command' ? '#4ade80' : '#ff6b35';
        return `
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="20" width="60" height="60" rx="5" fill="${color}" stroke="#fff" stroke-width="2"/> 
                <text x="50" y="50" text-anchor="middle" fill="#fff" font-size="10">${part.name}</text>
            </svg>
      `;
    }

    // 验证连接点兼容性
    static canConnect(partA, attachPointA, partB, attachPointB) {
        if (!partA || !partB || !attachPointA || !attachPointB) {
            return false;
        }

        const sizeA = attachPointA.size; const sizeB = attachPointB.size;
        const tolerance = 0.1;

        return Math.abs(sizeA - sizeB) <= tolerance;
    }

    // 添加新部件
    static addPart(partData) {
        if (!partData.id) {
            return false;
        }

        const requiredFields = ['name', 'category', 'type', 'mass', 'dimensions', 'image_path'];
        for (const field of requiredFields) {
            if (!(field in partData)) {
                console.error(`Part missing required field: ${field}`);
                return false;
            }
        }

        // Auto-detect image type if not specified
        if (!partData.image_type) {
            partData.image_type = this.detectImageType(partData.image_path);
        }

        this.parts[partData.id] = partData;
        return true;
    }

    // 移除部件
    static removePart(partId) {
        if (this.parts[partId]) {
            delete this.parts[partId];
            return true;
        }
        return false;
    }
}

// 火箭组装数据结构
class RocketAssembly {
    constructor() {
        this.parts = [];
        this.connections = [];
        this.rootPart = null;
        this.name = this.getDefaultVehicleName();
        this.created = new Date();
        this.modified = new Date();
    }

    // 获取默认载具名称
    getDefaultVehicleName() {
        return window.i18n ? window.i18n.t('rocketBuilder.infoPanel.unnamed') : 'Unnamed Vehicle';
    }

    // 向组装添加部件
    addPart(partData, position = { x: 0, y: 0 }) {
        const assemblyPart = {
            id: this.generatePartId(),
            partId: partData.id,
            position: position,
            rotation: 0,
            data: partData,
            connections: []
        };

        if ((partData.type === 'fuel-tank' || partData.type === 'engine') && partData.fuel_capacity) {
            assemblyPart.fuelStatus = {
                liquid_fuel: partData.fuel_capacity.liquid_fuel || 0,
                oxidizer: partData.fuel_capacity.oxidizer || 0
            };
        }

        this.parts.push(assemblyPart);

        if (this.parts.length === 1) {
            this.rootPart = assemblyPart.id;
        }

        this.modified = new Date();
        return assemblyPart;
    }

    // 生成唯一部件ID
    generatePartId() {
        return `part_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // 移除部件
    removePart(partId) {
        const index = this.parts.findIndex(p => p.id === partId);
        if (index === -1) return false;

        this.connections = this.connections.filter(conn =>
            conn.partA !== partId && conn.partB !== partId);

        if (this.rootPart === partId && this.parts.length > 1) {
            this.rootPart = this.parts.find(p => p.id !== partId)?.id || null;
        }

        this.parts.splice(index, 1);
        this.modified = new Date();
        return true;
    }

    // 连接两个部件
    connectParts(partAId, attachPointA, partBId, attachPointB) {
        const partA = this.parts.find(p => p.id === partAId);
        const partB = this.parts.find(p => p.id === partBId);

        if (!partA || !partB) return false;

        const attachA = partA.data.attachment_points[attachPointA];
        const attachB = partB.data.attachment_points[attachPointB];

        if (!attachA || !attachB) return false;

        if (!RocketParts.canConnect(partA.data, attachA, partB.data, attachB)) {
            return false;
        }

        const connection = {
            id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            partA: partAId,
            attachPointA: attachPointA,
            partB: partBId,
            attachPointB: attachPointB,
            created: new Date()
        };

        this.connections.push(connection);

        partA.connections.push(connection.id);
        partB.connections.push(connection.id);

        this.modified = new Date();
        return connection;
    }

    // 断开部件连接
    disconnectParts(connectionId) {
        const connectionIndex = this.connections.findIndex(conn => conn.id === connectionId);
        if (connectionIndex === -1) return false;

        const connection = this.connections[connectionIndex];

        this.connections.splice(connectionIndex, 1);

        const partA = this.parts.find(p => p.id === connection.partA);
        const partB = this.parts.find(p => p.id === connection.partB);
        if (partA) {
            partA.connections = partA.connections.filter(id => id !== connectionId);
        }
        if (partB) {
            partB.connections = partB.connections.filter(id => id !== connectionId);
        }

        this.modified = new Date();
        return true;
    }

    // 检查并断开因位置移动而失效的连接
    checkAndBreakInvalidConnections() {
        const disconnectionTolerance = 50; // pixels
        const brokenConnections = [];

        this.connections.forEach(connection => {
            const partA = this.parts.find(p => p.id === connection.partA);
            const partB = this.parts.find(p => p.id === connection.partB);

            if (!partA || !partB) return;

            const attachA = partA.data.attachment_points[connection.attachPointA];
            const attachB = partB.data.attachment_points[connection.attachPointB];

            if (!attachA || !attachB) return;

            const partACenterX = partA.position.x + (partA.data.dimensions.width * 20);
            const partACenterY = partA.position.y + (partA.data.dimensions.height * 20);
            const pointAX = partACenterX + (attachA.x * 40);
            const pointAY = partACenterY + (attachA.y * 40);

            const partBCenterX = partB.position.x + (partB.data.dimensions.width * 20);
            const partBCenterY = partB.position.y + (partB.data.dimensions.height * 20);
            const pointBX = partBCenterX + (attachB.x * 40);
            const pointBY = partBCenterY + (attachB.y * 40);

            const distance = Math.sqrt(
                Math.pow(pointAX - pointBX, 2) +
                Math.pow(pointAY - pointBY, 2)
            );

            if (distance > disconnectionTolerance) {
                brokenConnections.push(connection.id);
            }
        });

        brokenConnections.forEach(connectionId => {
            this.disconnectParts(connectionId);
        });

        return brokenConnections;
    }

    // 计算总质量
    getTotalMass() {
        return this.parts.reduce((total, part) => {
            let partMass = part.data.mass;

            if (part.fuelStatus) {
                const fuelMass = (part.fuelStatus.liquid_fuel * 0.005) +
                    (part.fuelStatus.oxidizer * 0.0055);
                partMass += fuelMass;
            }

            return total + partMass;
        }, 0);
    }

    // 计算总推力
    getTotalThrust() {
        return this.parts.filter(part => part.data.type === 'engine')
            .reduce((total, part) => total + (part.data.thrust || 0), 0);
    }

    // 获取部件数量
    getPartCount() {
        return this.parts.length;
    }

    // 获取连接到根部件的所有部件
    getConnectedParts() {
        if (!this.rootPart) return [];

        const connectedParts = new Set();
        const visited = new Set();

        const dfs = (partId) => {
            if (visited.has(partId)) return;
            visited.add(partId);
            connectedParts.add(partId);

            this.connections.forEach(connection => {
                let connectedPartId = null;
                if (connection.partA === partId) {
                    connectedPartId = connection.partB;
                } else if (connection.partB === partId) {
                    connectedPartId = connection.partA;
                }

                if (connectedPartId && !visited.has(connectedPartId)) {
                    dfs(connectedPartId);
                }
            });
        };

        dfs(this.rootPart);

        return Array.from(connectedParts);
    }

    // 获取未连接的部件
    getDisconnectedParts() {
        const connectedParts = this.getConnectedParts();
        return this.parts.filter(part => !connectedParts.includes(part.id)).map(part => part.id);
    }

    // 检查部件是否连接到根部件
    isPartConnectedToRoot(partId) {
        return this.getConnectedParts().includes(partId);
    }

    // 计算仅连接部件的总质量
    getConnectedMass() {
        const connectedPartIds = this.getConnectedParts();

        return this.parts.filter(part => connectedPartIds.includes(part.id))
            .reduce((total, part) => {
                let partMass = part.data.mass;

                if (part.fuelStatus) {
                    const fuelMass = (part.fuelStatus.liquid_fuel * 0.005) +
                        (part.fuelStatus.oxidizer * 0.0055);
                    partMass += fuelMass;
                }

                return total + partMass;
            }, 0);
    }

    // 计算仅连接部件的推力
    getThrust() {
        const connectedPartIds = this.getConnectedParts();

        return this.parts.filter(part => connectedPartIds.includes(part.id) && part.data.type === 'engine')
            .reduce((total, part) => total + (part.data.thrust || 0), 0);
    }

    // 获取连接部件数量
    getConnectedPartCount() {
        return this.getConnectedParts().length;
    }


    // 导出到JSON
    toJSON() {
        return {
            name: this.name,
            parts: this.parts,
            connections: this.connections,
            rootPart: this.rootPart,
            created: this.created,
            modified: this.modified
        };
    }

    // 从JSON导入
    fromJSON(data) {
        this.name = data.name || (window.i18n ? i18n.t('vehicle.unnamedVehicle') : 'Unnamed Vehicle');
        this.parts = data.parts || [];
        this.connections = data.connections || [];
        this.rootPart = data.rootPart || null;
        this.created = new Date(data.created) || new Date();
        this.modified = new Date(data.modified) || new Date();
    }

    // 获取所有分离器部件
    getDecouplers() {
        return this.parts.filter(part =>
            part.data.type === 'decoupler' &&
            part.data.decoupler_properties?.can_separate);
    }

    // 检查部件是否在分离器上方
    isPartAboveDecoupler(partId, decouplerId) {
        const part = this.parts.find(p => p.id === partId);
        const decoupler = this.parts.find(p => p.id === decouplerId);

        if (!part || !decoupler) return false;

        return part.position.y < decoupler.position.y;
    }

    // 获取连接到分离器的上部和下部部件组
    getDecouplerSeparationGroups(decouplerId) {
        const decoupler = this.parts.find(p => p.id === decouplerId);
        if (!decoupler || decoupler.data.type !== 'decoupler') return null;

        // Get decoupler connections
        const decouplerConnections = this.connections.filter(conn =>
            conn.partA === decouplerId || conn.partB === decouplerId);

        const upperParts = new Set();
        const lowerParts = new Set();

        decouplerConnections.forEach(connection => {
            const otherPartId = connection.partA === decouplerId ? connection.partB : connection.partA;
            const otherPart = this.parts.find(p => p.id === otherPartId);

            if (otherPart) {
                if (this.isPartAboveDecoupler(otherPartId, decouplerId)) {
                    upperParts.add(otherPartId);
                    this.getConnectedPartsRecursive(otherPartId, upperParts, [decouplerId]);
                } else {
                    lowerParts.add(otherPartId);
                    this.getConnectedPartsRecursive(otherPartId, lowerParts, [decouplerId]);
                }
            }
        });

        return {
            decoupler: decoupler,
            upperStage: Array.from(upperParts).map(id => this.parts.find(p => p.id === id)),
            lowerStage: Array.from(lowerParts).map(id => this.parts.find(p => p.id === id))
        };
    }

    // 递归获取连接部件
    getConnectedPartsRecursive(partId, resultSet, excludeIds = []) {
        if (excludeIds.includes(partId)) return;

        const directConnections = this.connections.filter(conn =>
            (conn.partA === partId || conn.partB === partId) &&
            !excludeIds.includes(conn.partA) && !excludeIds.includes(conn.partB)
        );
        directConnections.forEach(connection => {
            const otherPartId = connection.partA === partId ? connection.partB : connection.partA;

            if (!resultSet.has(otherPartId) && !excludeIds.includes(otherPartId)) {
                resultSet.add(otherPartId);
                this.getConnectedPartsRecursive(otherPartId, resultSet, excludeIds);
            }
        });
    }

    // 模拟分离器激活
    activateDecoupler(decouplerId) {
        const separationGroups = this.getDecouplerSeparationGroups(decouplerId);
        if (!separationGroups) return null;

        const decouplerConnections = this.connections.filter(conn =>
            conn.partA === decouplerId || conn.partB === decouplerId);

        const brokenConnections = [];
        decouplerConnections.forEach(connection => {
            if (this.disconnectParts(connection.id)) {
                brokenConnections.push(connection);
            }
        });

        return {
            ...separationGroups,
            brokenConnections: brokenConnections,
            separationForce: separationGroups.decoupler.data.separation_force || 2500
        };
    }

    // 获取火箭分级信息
    getStagingInfo() {
        const decouplers = this.getDecouplers();
        const stages = [];
        decouplers.sort((a, b) => {
            const priorityA = a.data.decoupler_properties?.stage_priority || 999;
            const priorityB = b.data.decoupler_properties?.stage_priority || 999;
            return priorityA - priorityB;
        });

        decouplers.forEach((decoupler, index) => {
            const groups = this.getDecouplerSeparationGroups(decoupler.id);
            if (groups) {
                const upperStageEngines = groups.upperStage.filter(part => part.data.type === 'engine');
                const lowerStageEngines = groups.lowerStage.filter(part => part.data.type === 'engine');

                const isFirstStage = index === 0;
                const stagePartsCount = isFirstStage ?
                    groups.lowerStage.length + 1 :
                    groups.upperStage.length;

                const stageEngines = isFirstStage ? lowerStageEngines : upperStageEngines;

                stages.push({
                    stage: index + 1, decoupler: groups.decoupler,
                    partsCount: stagePartsCount,
                    mass: this.calculateStageMass(groups),
                    engines: stageEngines,
                    upperStageEngines: upperStageEngines,
                    lowerStageEngines: lowerStageEngines,
                    upperStage: groups.upperStage,
                    lowerStage: groups.lowerStage
                });
            }
        });

        return stages;
    }

    // 计算单级质量
    calculateStageMass(stageGroups) {
        let totalMass = 0;
        const allParts = [...stageGroups.upperStage, ...stageGroups.lowerStage, stageGroups.decoupler];

        allParts.forEach(part => {
            totalMass += part.data.mass;
            if (part.fuelStatus) {
                totalMass += (part.fuelStatus.liquid_fuel * 0.005) +
                    (part.fuelStatus.oxidizer * 0.0055);
            }
        });

        return totalMass;
    }

    clear() {
        this.parts = [];
        this.connections = [];
        this.rootPart = null;
        this.name = 'Unnamed Vehicle';
        this.modified = new Date();
    }
}

// 导出供其他模块使用
window.RocketParts = RocketParts;
window.RocketAssembly = RocketAssembly;
