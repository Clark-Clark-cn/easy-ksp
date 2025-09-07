// 火箭装配器主类
class RocketBuilder {
    constructor() {
        this.assembly = new RocketAssembly();
        this.selectedPart = null;
        this.draggedPart = null;
        this.canvas = null;
        this.canvasOffset = { x: 0, y: 0 };
        this.canvasZoom = 1.0;
        
        this.init();
    }

    async init() {
        this.canvas = document.getElementById('assemblyCanvas');
        if (!this.canvas) {
            console.error('找不到装配画布元素');
            return;
        }

        this.setupCanvas();
        this.setupEventListeners();
        
        await this.loadPartsPanel();
        
        this.updateUI();
    }

    getEventCoordinates(e) {
        if (e.touches && e.touches.length > 0) {
            return {
                clientX: e.touches[0].clientX,
                clientY: e.touches[0].clientY
            };
        } else if (e.changedTouches && e.changedTouches.length > 0) {
            return {
                clientX: e.changedTouches[0].clientX,
                clientY: e.changedTouches[0].clientY
            };
        } else {
            return {
                clientX: e.clientX,
                clientY: e.clientY
            };
        }
    }

    addPointerEventListeners(element, onStart, onMove, onEnd) {
        element.addEventListener('mousedown', onStart);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
        
        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            onStart(e);
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            onMove(e);
        }, { passive: false });
        
        document.addEventListener('touchend', onEnd);
        document.addEventListener('touchcancel', onEnd);
    }

    // 设置画布
    setupCanvas() {
        this.canvas.style.width = '800px';
        this.canvas.style.height = '600px';
        
        this.canvas.innerHTML = `
            <div class="rocket-assembly" id="rocketAssembly"></div>
        `;
        
        this.updateCanvasTransform();
    }

    setupEventListeners() {
        this.canvas.addEventListener('wheel', (e) => this.handleCanvasZoom(e));
        this.canvas.addEventListener('drop', (e) => this.handleCanvasDrop(e));
        this.canvas.addEventListener('dragover', (e) => e.preventDefault());
        
        this.setupCanvasPanning();
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterParts(e.target.dataset.category));
        });

        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        
        document.addEventListener('languageChanged', () => {
            this.loadPartsPanel();
            this.updateUI();
        });
        
        this.setupMobilePanelToggle();
    }

    // 设置移动端面板切换
    setupMobilePanelToggle() {
        const toggleButtons = document.querySelectorAll('.panel-toggle-btn');
        const partsPanel = document.getElementById('partsPanel');
        const infoPanel = document.getElementById('infoPanel');
        const assemblyArea = document.querySelector('.assembly-area');

        toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const targetPanel = e.target.dataset.panel;
                
                toggleButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                partsPanel.classList.remove('active');
                infoPanel.classList.remove('active');
                assemblyArea.classList.remove('mobile-hidden');
                
                switch(targetPanel) {
                    case 'parts':
                        partsPanel.classList.add('active');
                        assemblyArea.classList.add('mobile-hidden');
                        break;
                    case 'info':
                        infoPanel.classList.add('active');
                        assemblyArea.classList.add('mobile-hidden');
                        break;
                    default:
                        break;
                }
                
                if (typeof showNotification === 'function') {
                    const panelNameKeys = {
                        'assembly': 'notifications.panelSwitch.assembly',
                        'parts': 'notifications.panelSwitch.parts',
                        'info': 'notifications.panelSwitch.info'
                    };
                    showNotification('notifications.panelSwitch.title', panelNameKeys[targetPanel], 'info');
                }
            });
        });
    }

    // 加载部件面板
    async loadPartsPanel() {
        const partsList = document.getElementById('partsList');
        if (!partsList) return;

        if (!window.i18n.isInitialized()) {
            await new Promise(resolve => {
                document.addEventListener('i18nReady', resolve, { once: true });
            });
        }

        const allParts = RocketParts.getAllParts();
        
        allParts.forEach(part => {
            if (part.nameKey && window.i18n) {
                const translatedName = window.i18n.t(part.nameKey);
                if (translatedName !== part.nameKey) {
                    part.name = translatedName;
                }
            }
            if (part.descriptionKey && window.i18n) {
                const translatedDesc = window.i18n.t(part.descriptionKey);
                if (translatedDesc !== part.descriptionKey) {
                    part.description = translatedDesc;
                }
            }
        });
        
        partsList.innerHTML = '';

        for (const part of allParts) {
            const partElement = await this.createPartElement(part);
            partsList.appendChild(partElement);
        }
    }

    // 创建部件元素
    async createPartElement(part) {
        const partDiv = document.createElement('div');
        partDiv.className = 'part-item';
        partDiv.dataset.partId = part.id;
        partDiv.draggable = true;

        const imgContent = await RocketParts.loadPartImage(part);

        let displayName = part.name;
        if (part.nameKey && window.i18n) {
            const translatedName = window.i18n.t(part.nameKey);
            if (translatedName !== part.nameKey) {
                displayName = translatedName;
            }
        }
        
        const massLabel = window.i18n ? window.i18n.t('rocketBuilder.partsPanel.mass') : 'Mass';
        const thrustLabel = window.i18n ? window.i18n.t('rocketBuilder.partsPanel.thrust') : 'Thrust';
        const crewLabel = window.i18n ? window.i18n.t('rocketBuilder.partsPanel.crew') : 'Crew';
        
        partDiv.innerHTML = `
            <div class="part-icon">
                ${imgContent}
            </div>
            <div class="part-info">
                <div class="part-name">${displayName}</div>
                <div class="part-stats">
                    ${massLabel}: ${part.mass}t | 
                    ${part.thrust ? `${thrustLabel}: ${part.thrust}kN` : `${crewLabel}: ${part.crew_capacity || 0}`}
                </div>
            </div>
        `;

        partDiv.addEventListener('dragstart', (e) => this.handlePartDragStart(e, part));
        partDiv.addEventListener('click', () => this.selectPartType(part));

        this.setupPartTouchDrag(partDiv, part);

        return partDiv;
    }

    setupPartTouchDrag(partElement, part) {
        let isDragging = false;
        let dragClone = null;
        let startPos = { x: 0, y: 0 };

        const handleTouchStart = (e) => {
            if (e.touches.length !== 1) return;
            
            isDragging = true;
            const coords = this.getEventCoordinates(e);
            startPos = { x: coords.clientX, y: coords.clientY };
            
            this.draggedPart = part;
            
            dragClone = partElement.cloneNode(true);
            dragClone.style.position = 'fixed';
            dragClone.style.zIndex = '10000';
            dragClone.style.pointerEvents = 'none';
            dragClone.style.opacity = '0.8';
            dragClone.style.transform = 'scale(0.8)';
            dragClone.style.left = (coords.clientX - 40) + 'px';
            dragClone.style.top = (coords.clientY - 40) + 'px';
            document.body.appendChild(dragClone);
            
            partElement.classList.add('dragging');
        };

        const handleTouchMove = (e) => {
            if (!isDragging || !dragClone) return;
            
            const coords = this.getEventCoordinates(e);
            dragClone.style.left = (coords.clientX - 40) + 'px';
            dragClone.style.top = (coords.clientY - 40) + 'px';
        };

        const handleTouchEnd = (e) => {
            if (!isDragging) return;
            
            isDragging = false;
            partElement.classList.remove('dragging');
            
            if (dragClone) {
                dragClone.remove();
                dragClone = null;
            }
            
            const coords = this.getEventCoordinates(e);
            const elementAtPoint = document.elementFromPoint(coords.clientX, coords.clientY);
            
            if (elementAtPoint && (elementAtPoint.closest('.assembly-canvas') || elementAtPoint.closest('.rocket-assembly'))) {
                const canvasRect = this.canvas.getBoundingClientRect();
                const fakeEvent = {
                    preventDefault: () => {},
                    clientX: coords.clientX,
                    clientY: coords.clientY
                };
                this.handleCanvasDrop(fakeEvent);
            }
            
            this.draggedPart = null;
        };

        partElement.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
        document.addEventListener('touchcancel', handleTouchEnd);
    }

    handlePartDragStart(e, part) {
        this.draggedPart = part;
        e.dataTransfer.setData('text/plain', JSON.stringify(part));
        
        e.target.classList.add('dragging');
        setTimeout(() => e.target.classList.remove('dragging'), 100);
    }

    // 处理画布拖放
    handleCanvasDrop(e) {
        e.preventDefault();
        
        if (!this.draggedPart) return;

        const canvasRect = this.canvas.getBoundingClientRect();
        const mousePosition = {
            x: e.clientX - canvasRect.left,
            y: e.clientY - canvasRect.top
        };

        if (this.canvasZoom !== 1.0) {
            this.resetCanvasZoom();
            
            setTimeout(() => {
                this.placePartAtMousePosition(mousePosition);
            }, 350);
        } else {
            this.placePartAtMousePosition(mousePosition);
        }
    }

    // 在指定位置放置部件的辅助函数
    placePartAtPosition(e) {
        const canvasRect = this.canvas.getBoundingClientRect();
        const mousePosition = {
            x: e.clientX - canvasRect.left,
            y: e.clientY - canvasRect.top
        };
        this.placePartAtMousePosition(mousePosition);
    }

    // 在鼠标位置放置部件
    placePartAtMousePosition(mousePosition) {
        if (!this.draggedPart) return;

        let position;
        let autoConnection = null;

        console.log('开始放置部件:', this.draggedPart.name, '鼠标位置:', mousePosition);

        if (this.assembly.getPartCount() === 0) {
            position = { x: 400, y: 300 };
            
            const partWidth = this.draggedPart.dimensions.width * 40;
            const partHeight = this.draggedPart.dimensions.height * 40;
            position.x -= partWidth / 2;
            position.y -= partHeight / 2;

            console.log('根部件放置位置:', position);

            if (typeof showNotification === 'function') {
                showNotification('notifications.rootPart.title', 'notifications.rootPart.message', 'info');
            }
        } else {
            let x = (mousePosition.x - this.canvasOffset.x) / this.canvasZoom;
            let y = (mousePosition.y - this.canvasOffset.y) / this.canvasZoom;
            
            const partWidth = this.draggedPart.dimensions.width * 40;
            const partHeight = this.draggedPart.dimensions.height * 40;
            x -= partWidth / 2;
            y -= partHeight / 2;
            
            position = { x, y };

            autoConnection = this.attemptAutoConnect(position, this.draggedPart);
            if (autoConnection) {
                position = autoConnection.adjustedPosition;
            }
        }

        const assemblyPart = this.assembly.addPart(this.draggedPart, position);
        
        if (autoConnection) {
            const connectionResult = this.assembly.connectParts(
                autoConnection.existingPart.id, 
                autoConnection.existingPoint,
                assemblyPart.id, 
                autoConnection.newPoint
            );
        }
        
        this.addPartToCanvas(assemblyPart);
        this.updateUI();
        this.updateConnectionLines();
        
        this.draggedPart = null;
    }

    // 尝试自动连接到最近的兼容连接点
    attemptAutoConnect(newPartPosition, newPartData) {
        if (this.assembly.parts.length === 0) return null;
        
        const connectionRange = 120;
        let bestConnection = null;
        let minDistance = connectionRange;

        this.assembly.parts.forEach(existingPart => {
            
            if (!existingPart.data.attachment_points) {
                return;
            }

            // 计算现有部件的连接点位置
            Object.entries(existingPart.data.attachment_points).forEach(([pointName, pointData]) => {
                const existingPartCenterX = existingPart.position.x + (existingPart.data.dimensions.width * 20);
                const existingPartCenterY = existingPart.position.y + (existingPart.data.dimensions.height * 20);
                const existingPointX = existingPartCenterX + (pointData.x * 40);
                const existingPointY = existingPartCenterY + (pointData.y * 40);

                if (newPartData.attachment_points) {
                    Object.entries(newPartData.attachment_points).forEach(([newPointName, newPointData]) => {
                        const newPartCenterX = newPartPosition.x + (newPartData.dimensions.width * 20);
                        const newPartCenterY = newPartPosition.y + (newPartData.dimensions.height * 20);
                        const newPointX = newPartCenterX + (newPointData.x * 40);
                        const newPointY = newPartCenterY + (newPointData.y * 40);

                        const distance = Math.sqrt(
                            Math.pow(existingPointX - newPointX, 2) + 
                            Math.pow(existingPointY - newPointY, 2)
                        );

                        if (distance < minDistance) {
                            if (Math.abs(pointData.size - newPointData.size) < 0.1) {
                                
                                const offsetX = existingPointX - newPointX;
                                const offsetY = existingPointY - newPointY;
                                
                                const adjustedPosition = {
                                    x: newPartPosition.x + offsetX,
                                    y: newPartPosition.y + offsetY
                                };

                                minDistance = distance;
                                bestConnection = {
                                    existingPart: existingPart,
                                    existingPoint: pointName,
                                    newPoint: newPointName,
                                    distance: distance,
                                    adjustedPosition: adjustedPosition
                                };
                            }
                        }
                    });
                }
            });
        });

        // 如果找到了好的连接点，显示提示
        if (bestConnection) {
            if (typeof showNotification === 'function') {
                const title = window.i18n ? window.i18n.t('notifications.autoConnect.title') : '自动连接';
                const message = window.i18n ? 
                    window.i18n.t('notifications.autoConnect.message', { partName: bestConnection.existingPart.data.name }) :
                    `部件已自动连接到 ${bestConnection.existingPart.data.name}`;
                showNotification(title, message, 'success');
            }
        }

        return bestConnection;
    }

    // 添加部件到画布
    addPartToCanvas(assemblyPart) {
        const rocketAssembly = document.getElementById('rocketAssembly');
        if (!rocketAssembly) return;

        const partElement = document.createElement('div');
        partElement.className = 'assembly-part';
        partElement.dataset.partId = assemblyPart.id;
        partElement.style.left = `${assemblyPart.position.x}px`;
        partElement.style.top = `${assemblyPart.position.y}px`;
        partElement.style.position = 'absolute';
        partElement.style.cursor = 'pointer';
        partElement.style.width = `${assemblyPart.data.dimensions.width * 40}px`;
        partElement.style.height = `${assemblyPart.data.dimensions.height * 40}px`;

        RocketParts.loadPartImage(assemblyPart.data).then(img => {
            partElement.innerHTML = img;
            const imgElement = partElement.querySelector('img');
            const svgElement = partElement.querySelector('svg');
            
            if (imgElement) {
                imgElement.style.width = '100%';
                imgElement.style.height = '100%';
            }
            if (svgElement) {
                svgElement.style.width = '100%';
                svgElement.style.height = '100%';
            }
        });

        partElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.removeAssemblyPart(assemblyPart.id);
        });

        this.makePartDraggable(partElement, assemblyPart);

        rocketAssembly.appendChild(partElement);
    }

    // 使部件可拖拽移动
    makePartDraggable(partElement, assemblyPart) {
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };
        let startPosition = { x: 0, y: 0 };
        let hasMoved = false;
        let initialPointerPosition = { x: 0, y: 0 };
        const MOVE_THRESHOLD = 5;

        const handlePointerDown = (e) => {
            if (e.type === 'mousedown' && e.button !== 0) return;

            isDragging = true;
            hasMoved = false;
            partElement.classList.add('dragging');
            
            const coords = this.getEventCoordinates(e);
            
            initialPointerPosition.x = coords.clientX;
            initialPointerPosition.y = coords.clientY;
            
            const canvasRect = this.canvas.getBoundingClientRect();
            const pointerCanvasX = coords.clientX - canvasRect.left;
            const pointerCanvasY = coords.clientY - canvasRect.top;
            
            const partCanvasX = (assemblyPart.position.x * this.canvasZoom) + this.canvasOffset.x;
            const partCanvasY = (assemblyPart.position.y * this.canvasZoom) + this.canvasOffset.y;
            
            dragOffset.x = pointerCanvasX - partCanvasX;
            dragOffset.y = pointerCanvasY - partCanvasY;
            
            startPosition.x = assemblyPart.position.x;
            startPosition.y = assemblyPart.position.y;
            
            e.preventDefault();
            e.stopPropagation();
        };

        // 统一的移动处理
        const handlePointerMove = (e) => {
            if (!isDragging) return;

            const coords = this.getEventCoordinates(e);
            
            const moveDistance = Math.sqrt(
                Math.pow(coords.clientX - initialPointerPosition.x, 2) + 
                Math.pow(coords.clientY - initialPointerPosition.y, 2)
            );
            
            if (moveDistance > MOVE_THRESHOLD) {
                hasMoved = true;
            }
            
            if (!hasMoved) return;

            const canvasRect = this.canvas.getBoundingClientRect();
            
            const pointerX = coords.clientX - canvasRect.left;
            const pointerY = coords.clientY - canvasRect.top;
            
            let newX = (pointerX - this.canvasOffset.x - dragOffset.x) / this.canvasZoom;
            let newY = (pointerY - this.canvasOffset.y - dragOffset.y) / this.canvasZoom;

            assemblyPart.position.x = newX;
            assemblyPart.position.y = newY;
            
            partElement.style.left = `${newX}px`;
            partElement.style.top = `${newY}px`;
        };

        // 统一的结束拖拽处理
        const handlePointerUp = () => {
            if (isDragging) {
                isDragging = false;
                partElement.classList.remove('dragging');
                
                if (!hasMoved) {
                    this.selectAssemblyPart(assemblyPart);
                } else {
                    this.logPartMovementDebugInfo(assemblyPart, startPosition);
                    
                    const brokenConnections = this.assembly.checkAndBreakInvalidConnections();
                    if (brokenConnections.length > 0 && typeof showNotification === 'function') {
                        const title = window.i18n ? window.i18n.t('notifications.connectionBroken.title') : '连接断开';
                        const message = window.i18n ? 
                            window.i18n.t('notifications.connectionBroken.message', { count: brokenConnections.length }) :
                            `${brokenConnections.length}个连接因距离过远而自动断开`;
                        showNotification(title, message, 'warning');
                    }
                    
                    const newConnection = this.attemptAutoConnectForMovedPart(assemblyPart);
                    if (newConnection && typeof showNotification === 'function') {
                        const title = window.i18n ? window.i18n.t('notifications.autoConnect.title') : '自动连接';
                        const message = window.i18n ? 
                            window.i18n.t('notifications.autoConnect.afterMove', { partName: newConnection.targetPart.data.name }) :
                            `部件移动后自动连接到 ${newConnection.targetPart.data.name}`;
                        showNotification(title, message, 'success');
                    }
                    
                    this.updateConnectionLines();
                }
                
                this.assembly.modified = new Date();
                this.updateUI();
            }
        };

        partElement.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('mousemove', handlePointerMove);
        document.addEventListener('mouseup', handlePointerUp);

        partElement.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handlePointerDown(e);
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                e.preventDefault();
                handlePointerMove(e);
            }
        }, { passive: false });
        
        document.addEventListener('touchend', handlePointerUp);
        document.addEventListener('touchcancel', handlePointerUp);
    }

    // 选择组装中的部件
    selectAssemblyPart(assemblyPart) {
        document.querySelectorAll('.assembly-part').forEach(el => {
            el.classList.remove('part-selected');
        });

        const partElement = document.querySelector(`[data-part-id="${assemblyPart.id}"]`);
        if (partElement) {
            partElement.classList.add('part-selected');
        }

        this.selectedPart = assemblyPart;
        this.updatePartInfo();
        
        if (window.innerWidth <= 768) {
            this.switchToInfoPanel();
            
            if (typeof showNotification === 'function') {
                const title = window.i18n ? window.i18n.t('notifications.partSelected.title') : '部件选中';
                const message = window.i18n ? 
                    window.i18n.t('notifications.partSelected.message', { partName: assemblyPart.data.name }) :
                    `已选中 ${assemblyPart.data.name}，自动切换到信息面板`;
                showNotification(title, message, 'info');
            }
        }
    }

    // 移除组装部件
    removeAssemblyPart(partId) {
        this.assembly.removePart(partId);
        
        const partElement = document.querySelector(`[data-part-id="${partId}"]`);
        if (partElement) {
            partElement.remove();
        }

        if (this.selectedPart && this.selectedPart.id === partId) {
            this.selectedPart = null;
        }

        this.updateUI();
        this.updateConnectionLines();
    }

    // 更新部件信息面板
    updatePartInfo() {
        const infoPanel = document.getElementById('selectedPartInfo');
        if (!infoPanel) return;

        if (!this.selectedPart) {
            const noSelectionText = window.i18n ? window.i18n.t('rocketBuilder.selectedPart.none') : '未选中任何部件';
            infoPanel.innerHTML = `<p class="no-selection">${noSelectionText}</p>`;
            return;
        }

        const part = this.selectedPart.data;
        let fuelControlsHtml = '';
        
        const fuelControlTitle = window.i18n ? window.i18n.t('rocketBuilder.partInfo.fuelControls') : '燃料控制';
        const liquidFuelLabel = window.i18n ? window.i18n.t('rocketBuilder.partInfo.liquidFuel') : '液体燃料';
        const oxidizerLabel = window.i18n ? window.i18n.t('rocketBuilder.partInfo.oxidizer') : '氧化剂';
        const unitsLabel = window.i18n ? window.i18n.t('rocketBuilder.partInfo.units') : '单位';
        const fullLoadBtn = window.i18n ? window.i18n.t('rocketBuilder.partInfo.fullLoad') : '满载';
        const halfLoadBtn = window.i18n ? window.i18n.t('rocketBuilder.partInfo.halfLoad') : '半载';
        const emptyLoadBtn = window.i18n ? window.i18n.t('rocketBuilder.partInfo.emptyLoad') : '空载';
        
        if (part.type === 'fuel-tank' && this.selectedPart.fuelStatus) {
            const liquidFuelMax = part.fuel_capacity.liquid_fuel;
            const oxidizerMax = part.fuel_capacity.oxidizer;
            const currentLiquid = this.selectedPart.fuelStatus.liquid_fuel;
            const currentOxidizer = this.selectedPart.fuelStatus.oxidizer;
            
            fuelControlsHtml = `
                <div class="fuel-controls">
                    <h5>${fuelControlTitle}</h5>
                    <div class="fuel-type">
                        <label>${liquidFuelLabel}: ${currentLiquid.toFixed(1)} / ${liquidFuelMax} ${unitsLabel}</label>
                        <input type="range" 
                               id="liquidFuelSlider" 
                               min="0" 
                               max="${liquidFuelMax}" 
                               step="0.1"
                               value="${currentLiquid}"
                               oninput="rocketBuilder.updateFuelAmount('liquid_fuel', this.value)">
                        <div class="fuel-percentage">${((currentLiquid / liquidFuelMax) * 100).toFixed(1)}%</div>
                    </div>
                    <div class="fuel-type">
                        <label>${oxidizerLabel}: ${currentOxidizer.toFixed(1)} / ${oxidizerMax} ${unitsLabel}</label>
                        <input type="range" 
                               id="oxidizerSlider" 
                               min="0" 
                               max="${oxidizerMax}" 
                               step="0.1"
                               value="${currentOxidizer}"
                               oninput="rocketBuilder.updateFuelAmount('oxidizer', this.value)">
                        <div class="fuel-percentage">${((currentOxidizer / oxidizerMax) * 100).toFixed(1)}%</div>
                    </div>
                    <div class="fuel-quick-actions">
                        <button onclick="rocketBuilder.setFuelLevel(1.0)" class="fuel-action-btn">${fullLoadBtn}</button>
                        <button onclick="rocketBuilder.setFuelLevel(0.5)" class="fuel-action-btn">${halfLoadBtn}</button>
                        <button onclick="rocketBuilder.setFuelLevel(0.0)" class="fuel-action-btn">${emptyLoadBtn}</button>
                    </div>
                </div>
            `;
        }
        
        const decouplerControlTitle = window.i18n ? window.i18n.t('rocketBuilder.partInfo.decouplerControls') : '分离器控制';
        const separationForceLabel = window.i18n ? window.i18n.t('rocketBuilder.partInfo.separationForce') : '分离力';
        const upperStageLabel = window.i18n ? window.i18n.t('rocketBuilder.partInfo.upperStage') : '上级部件';
        const lowerStageLabel = window.i18n ? window.i18n.t('rocketBuilder.partInfo.lowerStage') : '下级部件';
        const testSeparationBtn = window.i18n ? window.i18n.t('rocketBuilder.partInfo.testSeparation') : '测试分离';
        const stagingInfoBtn = window.i18n ? window.i18n.t('rocketBuilder.partInfo.stagingInfo') : '分级信息';
        const countUnit = window.i18n ? window.i18n.t('rocketBuilder.partInfo.countUnit') : '个';
        
        let decouplerControlsHtml = '';
        if (part.type === 'decoupler' && part.decoupler_properties?.can_separate) {
            const separationGroups = this.assembly.getDecouplerSeparationGroups(this.selectedPart.id);
            if (separationGroups) {
                decouplerControlsHtml = `
                    <div class="decoupler-controls">
                        <h5>${decouplerControlTitle}</h5>
                        <div class="decoupler-info">
                            <div class="property-item">
                                <label>${separationForceLabel}:</label>
                                <span>${part.separation_force || 2500} N</span>
                            </div>
                            <div class="property-item">
                                <label>${upperStageLabel}:</label>
                                <span>${separationGroups.upperStage.length} ${countUnit}</span>
                            </div>
                            <div class="property-item">
                                <label>${lowerStageLabel}:</label>
                                <span>${separationGroups.lowerStage.length} ${countUnit}</span>
                            </div>
                        </div>
                        <div class="decoupler-actions">
                            <button onclick="rocketBuilder.testDecouplerSeparation('${this.selectedPart.id}')" class="decoupler-action-btn">
                                ${testSeparationBtn}
                            </button>
                            <button onclick="rocketBuilder.showStagingInfo()" class="decoupler-action-btn">
                                ${stagingInfoBtn}
                            </button>
                        </div>
                    </div>
                `;
            }
        }
        
        const massLabel = window.i18n ? window.i18n.t('rocketBuilder.partInfo.mass') : '质量';
        const costLabel = window.i18n ? window.i18n.t('rocketBuilder.partInfo.cost') : '成本';
        const thrustLabel = window.i18n ? window.i18n.t('rocketBuilder.partInfo.thrust') : '推力';
        const vacuumIspLabel = window.i18n ? window.i18n.t('rocketBuilder.partInfo.vacuumIsp') : '比冲 (真空)';
        const crewCapacityLabel = window.i18n ? window.i18n.t('rocketBuilder.partInfo.crewCapacity') : '载员容量';
        const peopleUnit = window.i18n ? window.i18n.t('rocketBuilder.partInfo.peopleUnit') : '人';
        const dimensionsLabel = window.i18n ? window.i18n.t('rocketBuilder.partInfo.dimensions') : '尺寸';
        const removePartBtn = window.i18n ? window.i18n.t('rocketBuilder.partInfo.removePart') : '移除此部件';
        
        infoPanel.innerHTML = `
            <div class="selected-part-details">
                <h4>${part.name}</h4>
                <p class="part-description">${part.description}</p>
                <div class="part-properties">
                    <div class="property-item">
                        <label>${massLabel}:</label>
                        <span>${this.getPartCurrentMass().toFixed(2)} t</span>
                    </div>
                    <div class="property-item">
                        <label>${costLabel}:</label>
                        <span>${part.cost} √</span>
                    </div>
                    ${part.thrust ? `
                        <div class="property-item">
                            <label>${thrustLabel}:</label>
                            <span>${part.thrust} kN</span>
                        </div>
                        <div class="property-item">
                            <label>${vacuumIspLabel}:</label>
                            <span>${part.isp_vacuum} s</span>
                        </div>
                    ` : ''}
                    ${part.crew_capacity ? `
                        <div class="property-item">
                            <label>${crewCapacityLabel}:</label>
                            <span>${part.crew_capacity} ${peopleUnit}</span>
                        </div>
                    ` : ''}
                    <div class="property-item">
                        <label>${dimensionsLabel}:</label>
                        <span>${part.dimensions.width}m × ${part.dimensions.height}m</span>
                    </div>
                </div>
                ${fuelControlsHtml}
                ${decouplerControlsHtml}
                <button class="remove-part-btn" onclick="rocketBuilder.removeAssemblyPart('${this.selectedPart.id}')">
                    ${removePartBtn}
                </button>
            </div>
        `;
    }

    // 更新UI统计信息
    updateUI() {
        document.getElementById('totalMass').textContent = `${this.assembly.getConnectedMass().toFixed(2)} t`;
        document.getElementById('totalThrust').textContent = `${this.assembly.getThrust().toFixed(1)} kN`;

        this.updatePartInfo();
        
        this.updatePartConnectivityVisuals();
    }

    updatePartConnectivityVisuals() {
        if (this.assembly.parts.length === 0) return;

        const connectedPartIds = this.assembly.getConnectedParts();
        const disconnectedPartIds = this.assembly.getDisconnectedParts();

        document.querySelectorAll('.assembly-part').forEach(partElement => {
            const partId = partElement.dataset.partId;
            const svg = partElement.querySelector('svg');
            
            if (!svg) return;

            if (disconnectedPartIds.includes(partId)) {
                partElement.style.opacity = '0.4';
                partElement.classList.add('disconnected');
                partElement.classList.remove('connected');
                const disconnectedTitle = window.i18n ? 
                    window.i18n.t('rocketBuilder.connectivity.disconnected') : 
                    '未连接到根部件的部件';
                partElement.title = disconnectedTitle;
            } else {
                partElement.style.opacity = '1.0';
                partElement.classList.add('connected');
                partElement.classList.remove('disconnected');
                const connectedTitle = window.i18n ? 
                    window.i18n.t('rocketBuilder.connectivity.connected') : 
                    '已连接到根部件的部件';
                partElement.title = connectedTitle;
            }
        });

        if (this.assembly.rootPart) {
            const rootElement = document.querySelector(`.assembly-part[data-part-id="${this.assembly.rootPart}"]`);
            if (rootElement) {
                rootElement.classList.add('root-part');
                const rootTitle = window.i18n ? window.i18n.t('rocketBuilder.rootPart.title') : '根部件';
                rootElement.title = rootTitle;
                rootElement.style.border = '2px solid #009dffff';
                rootElement.style.borderRadius = '4px';
            }
        }
    }

    // 获取当前选中部件的实际质量
    getPartCurrentMass() {
        if (!this.selectedPart) return 0;
        
        let mass = this.selectedPart.data.mass;
        
        if (this.selectedPart.fuelStatus) {
            const fuelMass = (this.selectedPart.fuelStatus.liquid_fuel * 0.005) + 
                           (this.selectedPart.fuelStatus.oxidizer * 0.0055);
            mass += fuelMass;
        }
        
        return mass;
    }

    updateFuelAmount(fuelType, amount) {
        if (!this.selectedPart || !this.selectedPart.fuelStatus) return;
        
        this.selectedPart.fuelStatus[fuelType] = parseFloat(amount);
        this.assembly.modified = new Date();
        
        this.updatePartInfo();
        this.updateUI();
    }

    // 设置燃料级别
    setFuelLevel(ratio) {
        if (!this.selectedPart || !this.selectedPart.fuelStatus) return;
        
        const part = this.selectedPart.data;
        if (part.fuel_capacity) {
            this.selectedPart.fuelStatus.liquid_fuel = part.fuel_capacity.liquid_fuel * ratio;
            this.selectedPart.fuelStatus.oxidizer = part.fuel_capacity.oxidizer * ratio;
            
            this.assembly.modified = new Date();
            
            const liquidSlider = document.getElementById('liquidFuelSlider');
            const oxidizerSlider = document.getElementById('oxidizerSlider');
            if (liquidSlider) liquidSlider.value = this.selectedPart.fuelStatus.liquid_fuel;
            if (oxidizerSlider) oxidizerSlider.value = this.selectedPart.fuelStatus.oxidizer;
            
            this.updatePartInfo();
            this.updateUI();
        }
    }

    // 处理画布缩放
    handleCanvasZoom(e) {
        if (!e.ctrlKey) return;
        
        e.preventDefault();
        
        const canvasRect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - canvasRect.left;
        const mouseY = e.clientY - canvasRect.top;
        
        const beforeZoomX = (mouseX - this.canvasOffset.x) / this.canvasZoom;
        const beforeZoomY = (mouseY - this.canvasOffset.y) / this.canvasZoom;
        
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
        const newZoom = Math.max(0.3, Math.min(3.0, this.canvasZoom * zoomFactor));
        
        this.canvasOffset.x = mouseX - beforeZoomX * newZoom;
        this.canvasOffset.y = mouseY - beforeZoomY * newZoom;
        this.canvasZoom = newZoom;
        
        this.updateCanvasTransform();
    }

    // 设置画布平移功能
    setupCanvasPanning() {
        let isPanning = false;
        let panStart = { x: 0, y: 0 };
        let panOffset = { x: 0, y: 0 };

        const handlePanStart = (e) => {
            if (e.target === this.canvas || e.target.classList.contains('rocket-assembly')) {
                
                if (e.type === 'mousedown' && e.button !== 0 && e.button !== 1) return;
                
                isPanning = true;
                const coords = this.getEventCoordinates(e);
                panStart.x = coords.clientX;
                panStart.y = coords.clientY;
                panOffset.x = this.canvasOffset.x;
                panOffset.y = this.canvasOffset.y;
                
                this.canvas.style.cursor = 'grabbing';
                e.preventDefault();
            }
        };

        const handlePanMove = (e) => {
            if (!isPanning) return;

            const coords = this.getEventCoordinates(e);
            const deltaX = coords.clientX - panStart.x;
            const deltaY = coords.clientY - panStart.y;
            
            this.canvasOffset.x = panOffset.x + deltaX;
            this.canvasOffset.y = panOffset.y + deltaY;
            
            this.updateCanvasTransform();
        };

        const handlePanEnd = () => {
            if (isPanning) {
                isPanning = false;
                this.canvas.style.cursor = '';
            }
        };

        this.canvas.addEventListener('mousedown', handlePanStart);
        document.addEventListener('mousemove', handlePanMove);
        document.addEventListener('mouseup', handlePanEnd);

        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                handlePanStart(e);
            }
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (isPanning && e.touches.length === 1) {
                e.preventDefault();
                handlePanMove(e);
            }
        }, { passive: false });

        document.addEventListener('touchend', handlePanEnd);
        document.addEventListener('touchcancel', handlePanEnd);

        this.canvas.addEventListener('dblclick', (e) => {
            if (e.target === this.canvas || e.target.classList.contains('rocket-assembly')) {
                this.resetCanvasView();
            }
        });

        let lastTouchDistance = 0;
        let initialZoom = 1.0;

        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                lastTouchDistance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
                initialZoom = this.canvasZoom;
            }
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentDistance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
                
                const scale = currentDistance / lastTouchDistance;
                const newZoom = initialZoom * scale;
                
                this.canvasZoom = Math.max(0.1, Math.min(3.0, newZoom));
                this.updateCanvasTransform();
            }
        }, { passive: false });

        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 1) {
                e.preventDefault();
            }
        });
    }

    // 更新画布变换
    updateCanvasTransform() {
        this.constrainCanvasOffset();
        
        const rocketAssembly = document.getElementById('rocketAssembly');
        if (rocketAssembly) {
            rocketAssembly.style.transform = `translate(${this.canvasOffset.x}px, ${this.canvasOffset.y}px) scale(${this.canvasZoom})`;
        }
    }

    // 限制画布偏移范围
    constrainCanvasOffset() {
        const container = this.canvas.parentElement;
        if (!container) return;
        
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const canvasWidth = 800 * this.canvasZoom;
        const canvasHeight = 600 * this.canvasZoom;
        
        const minVisibleSize = 200;
        const maxOffsetX = containerWidth - minVisibleSize;
        const minOffsetX = -(canvasWidth - minVisibleSize);
        const maxOffsetY = containerHeight - minVisibleSize;
        const minOffsetY = -(canvasHeight - minVisibleSize);
        
        this.canvasOffset.x = Math.max(minOffsetX, Math.min(maxOffsetX, this.canvasOffset.x));
        this.canvasOffset.y = Math.max(minOffsetY, Math.min(maxOffsetY, this.canvasOffset.y));
    }

    // 重置画布视图
    resetCanvasView() {
        this.canvasOffset = { x: 0, y: 0 };
        this.canvasZoom = 1.0;
        this.updateCanvasTransform();
        
        if (typeof showNotification === 'function') {
            const title = window.i18n ? window.i18n.t('notifications.viewReset.title') : '视图重置';
            const message = window.i18n ? window.i18n.t('notifications.viewReset.message') : '画布视图已重置到默认位置';
            showNotification(title, message, 'info');
        }
    }

    // 只重置画布缩放，保持位置不变
    resetCanvasZoom() {
        this.canvasZoom = 1.0;
        this.updateCanvasTransform();
        
        if (typeof showNotification === 'function') {
            const title = window.i18n ? window.i18n.t('notifications.zoomReset.title') : '缩放重置';
            const message = window.i18n ? window.i18n.t('notifications.zoomReset.message') : '画布缩放已重置，位置保持不变';
            showNotification(title, message, 'info');
        }
    }

    // 重置视图
    resetView() {
        this.resetCanvasView();
    }

    handleKeyboard(e) {
        switch(e.key) {
            case 'Delete':
                if (this.selectedPart) {
                    this.removeAssemblyPart(this.selectedPart.id);
                }
                break;
            case 'r':
                this.resetCanvasView();
                break;
        }
    }

    // 显示连接线
    updateConnectionLines() {
        const rocketAssembly = document.getElementById('rocketAssembly');
        if (!rocketAssembly) return;

        rocketAssembly.querySelectorAll('.connection-line').forEach(line => line.remove());

        this.assembly.connections.forEach(connection => {
            const partA = this.assembly.parts.find(p => p.id === connection.partA);
            const partB = this.assembly.parts.find(p => p.id === connection.partB);
            
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

            const line = document.createElement('div');
            line.className = 'connection-line';
            line.dataset.connectionId = connection.id;
            
            const deltaX = pointBX - pointAX;
            const deltaY = pointBY - pointAY;
            const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
            
            line.style.left = `${pointAX}px`;
            line.style.top = `${pointAY}px`;
            line.style.width = `${length}px`;
            line.style.transform = `rotate(${angle}deg)`;
            
            rocketAssembly.appendChild(line);
        });
    }

    // 记录部件移动的调试信息
    logPartMovementDebugInfo(assemblyPart, startPosition) {
        const deltaX = assemblyPart.position.x - startPosition.x;
        const deltaY = assemblyPart.position.y - startPosition.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        const relatedConnections = this.assembly.connections.filter(conn => 
            conn.partA === assemblyPart.id || conn.partB === assemblyPart.id
        );
        
        if (relatedConnections.length > 0) {
            relatedConnections.forEach(connection => {
                const otherPartId = connection.partA === assemblyPart.id ? connection.partB : connection.partA;
                const otherPart = this.assembly.parts.find(p => p.id === otherPartId);
                const thisPoint = connection.partA === assemblyPart.id ? connection.attachPointA : connection.attachPointB;
                const otherPoint = connection.partA === assemblyPart.id ? connection.attachPointB : connection.attachPointA;
                
                if (otherPart && assemblyPart.data.attachment_points && otherPart.data.attachment_points) {
                    const thisAttach = assemblyPart.data.attachment_points[thisPoint];
                    const otherAttach = otherPart.data.attachment_points[otherPoint];
                    
                    if (thisAttach && otherAttach) {
                        const thisCenterX = assemblyPart.position.x + (assemblyPart.data.dimensions.width * 20);
                        const thisCenterY = assemblyPart.position.y + (assemblyPart.data.dimensions.height * 20);
                        const thisPointX = thisCenterX + (thisAttach.x * 40);
                        const thisPointY = thisCenterY + (thisAttach.y * 40);
                        
                        const otherCenterX = otherPart.position.x + (otherPart.data.dimensions.width * 20);
                        const otherCenterY = otherPart.position.y + (otherPart.data.dimensions.height * 20);
                        const otherPointX = otherCenterX + (otherAttach.x * 40);
                        const otherPointY = otherCenterY + (otherAttach.y * 40);
                        
                        const connDistance = Math.sqrt(
                            Math.pow(thisPointX - otherPointX, 2) + 
                            Math.pow(thisPointY - otherPointY, 2)
                        );
                    }
                }
            });
        }
        
        const nearbyParts = this.assembly.parts.filter(part => {
            if (part.id === assemblyPart.id) return false;
            
            const distance = Math.sqrt(
                Math.pow(part.position.x - assemblyPart.position.x, 2) + 
                Math.pow(part.position.y - assemblyPart.position.y, 2)
            );
            return distance <= 200;
        });
        
        if (nearbyParts.length > 0) {
            nearbyParts.forEach(nearbyPart => {
                const distance = Math.sqrt(
                    Math.pow(nearbyPart.position.x - assemblyPart.position.x, 2) + 
                    Math.pow(nearbyPart.position.y - assemblyPart.position.y, 2)
                );
                if (assemblyPart.data.attachment_points && nearbyPart.data.attachment_points) {
                    let minConnectionDistance = Infinity;
                    let potentialConnection = null;
                    
                    Object.entries(assemblyPart.data.attachment_points).forEach(([thisPointName, thisPointData]) => {
                        Object.entries(nearbyPart.data.attachment_points).forEach(([otherPointName, otherPointData]) => {
                            if (Math.abs(thisPointData.size - otherPointData.size) < 0.1) {
                                const thisCenterX = assemblyPart.position.x + (assemblyPart.data.dimensions.width * 20);
                                const thisCenterY = assemblyPart.position.y + (assemblyPart.data.dimensions.height * 20);
                                const thisPointX = thisCenterX + (thisPointData.x * 40);
                                const thisPointY = thisCenterY + (thisPointData.y * 40);
                                
                                const otherCenterX = nearbyPart.position.x + (nearbyPart.data.dimensions.width * 20);
                                const otherCenterY = nearbyPart.position.y + (nearbyPart.data.dimensions.height * 20);
                                const otherPointX = otherCenterX + (otherPointData.x * 40);
                                const otherPointY = otherCenterY + (otherPointData.y * 40);
                                
                                const connDistance = Math.sqrt(
                                    Math.pow(thisPointX - otherPointX, 2) + 
                                    Math.pow(thisPointY - otherPointY, 2)
                                );
                                
                                if (connDistance < minConnectionDistance) {
                                    minConnectionDistance = connDistance;
                                    potentialConnection = {
                                        thisPoint: thisPointName,
                                        otherPoint: otherPointName,
                                        distance: connDistance
                                    };
                                }
                            }
                        });
                    });
                }
            });
        }
    }

    // 为移动后的部件尝试自动连接
    attemptAutoConnectForMovedPart(movedPart) {
        if (!movedPart.data.attachment_points) {
            return null;
        }
        
        const connectionRange = 25;
        let bestConnection = null;
        let minDistance = connectionRange;
        
        const movedPartCenterX = movedPart.position.x + (movedPart.data.dimensions.width * 20);
        const movedPartCenterY = movedPart.position.y + (movedPart.data.dimensions.height * 20);
        
        Object.entries(movedPart.data.attachment_points).forEach(([movedPointName, movedPointData]) => {
            const movedPointX = movedPartCenterX + (movedPointData.x * 40);
            const movedPointY = movedPartCenterY + (movedPointData.y * 40);
            
            const existingConnection = this.assembly.connections.find(conn => 
                (conn.partA === movedPart.id && conn.attachPointA === movedPointName) ||
                (conn.partB === movedPart.id && conn.attachPointB === movedPointName)
            );
            
            if (existingConnection) {
                return;
            }
            
            this.assembly.parts.forEach(targetPart => {
                if (targetPart.id === movedPart.id || !targetPart.data.attachment_points) return;
                
                const targetPartCenterX = targetPart.position.x + (targetPart.data.dimensions.width * 20);
                const targetPartCenterY = targetPart.position.y + (targetPart.data.dimensions.height * 20);
                
                Object.entries(targetPart.data.attachment_points).forEach(([targetPointName, targetPointData]) => {
                    const targetExistingConnection = this.assembly.connections.find(conn => 
                        (conn.partA === targetPart.id && conn.attachPointA === targetPointName) ||
                        (conn.partB === targetPart.id && conn.attachPointB === targetPointName)
                    );
                    
                    if (targetExistingConnection) {
                        return;
                    }
                    
                    const targetPointX = targetPartCenterX + (targetPointData.x * 40);
                    const targetPointY = targetPartCenterY + (targetPointData.y * 40);
                    
                    const distance = Math.sqrt(
                        Math.pow(movedPointX - targetPointX, 2) + 
                        Math.pow(movedPointY - targetPointY, 2)
                    );
                    
                    if (distance < minDistance) {
                        if (Math.abs(movedPointData.size - targetPointData.size) < 0.1) {
                            minDistance = distance;
                            bestConnection = {
                                movedPart: movedPart,
                                movedPoint: movedPointName,
                                targetPart: targetPart,
                                targetPoint: targetPointName,
                                distance: distance
                            };
                        }
                    }
                });
            });
        });
        
        if (bestConnection) {
            this.assembly.connectParts(
                bestConnection.movedPart.id,
                bestConnection.movedPoint,
                bestConnection.targetPart.id,
                bestConnection.targetPoint
            );
            return bestConnection;
        } else {
            return null;
        }
    }

    // 过滤部件
    filterParts(category) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        const parts = RocketParts.getPartsByCategory(category);
        this.displayParts(parts);
    }

    // 显示部件列表
    async displayParts(parts) {
        const partsList = document.getElementById('partsList');
        if (!partsList) return;

        if (!window.i18n.isInitialized()) {
            await new Promise(resolve => {
                document.addEventListener('i18nReady', resolve, { once: true });
            });
        }

        parts.forEach(part => {
            if (part.nameKey && window.i18n) {
                const translatedName = window.i18n.t(part.nameKey);
                if (translatedName !== part.nameKey) {
                    part.name = translatedName;
                }
            }
            if (part.descriptionKey && window.i18n) {
                const translatedDesc = window.i18n.t(part.descriptionKey);
                if (translatedDesc !== part.descriptionKey) {
                    part.description = translatedDesc;
                }
            }
        });

        partsList.innerHTML = '';
        
        for (const part of parts) {
            const partElement = await this.createPartElement(part);
            partsList.appendChild(partElement);
        }
    }

    // 选择部件类型
    selectPartType(part) {
        if (window.innerWidth <= 768) {
            this.autoAddPartToCenter(part);
            this.switchToAssemblyPanel();
        }
    }

    // 自动添加部件到装配区中心
    autoAddPartToCenter(part) {
        const centerPosition = { x: 400, y: 300 };
        
        const partWidth = part.dimensions.width * 40;
        const partHeight = part.dimensions.height * 40;
        centerPosition.x -= partWidth / 2;
        centerPosition.y -= partHeight / 2;

        const assemblyPart = this.assembly.addPart(part, centerPosition);
        
        this.addPartToCanvas(assemblyPart);
        
        this.resetCanvasZoom();
        
        this.updateUI();
        this.updateConnectionLines();
        
        if (typeof showNotification === 'function') {
            const title = window.i18n ? window.i18n.t('rocketBuilder.alerts.partAdded') : '部件添加';
            const message = window.i18n ? 
                window.i18n.t('rocketBuilder.alerts.partAddedMessage', { name: part.name }) :
                `${part.name}已添加到装配区中心`;
            showNotification(title, message, 'success');
        }
    }

    // 切换到装配区面板
    switchToAssemblyPanel() {
        const assemblyButton = document.querySelector('.panel-toggle-btn[data-panel="assembly"]');
        const toggleButtons = document.querySelectorAll('.panel-toggle-btn');
        const partsPanel = document.getElementById('partsPanel');
        const infoPanel = document.getElementById('infoPanel');
        const assemblyArea = document.querySelector('.assembly-area');
        
        if (assemblyButton && toggleButtons.length > 0) {
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            assemblyButton.classList.add('active');
            partsPanel.classList.remove('active');
            infoPanel.classList.remove('active');
            assemblyArea.classList.remove('mobile-hidden');
        }
    }

    // 切换到信息面板
    switchToInfoPanel() {
        const infoButton = document.querySelector('.panel-toggle-btn[data-panel="info"]');
        const toggleButtons = document.querySelectorAll('.panel-toggle-btn');
        const partsPanel = document.getElementById('partsPanel');
        const infoPanel = document.getElementById('infoPanel');
        const assemblyArea = document.querySelector('.assembly-area');
        
        if (infoButton && toggleButtons.length > 0) {
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            infoButton.classList.add('active');
            partsPanel.classList.remove('active');
            infoPanel.classList.add('active');
            assemblyArea.classList.add('mobile-hidden');
        }
    }

    // 清空组装
    clearAssembly() {
        const confirmMessage = window.i18n ? 
            window.i18n.t('rocketBuilder.confirmations.clearAssembly') : 
            '确定要清空当前载具设计吗？';
        if (confirm(confirmMessage)) {
            this.assembly.clear();
            document.getElementById('rocketAssembly').innerHTML = '';
            this.selectedPart = null;
            this.updateUI();
        }
    }

    // 测试分离器分离功能
    testDecouplerSeparation(decouplerId) {
        const result = this.assembly.activateDecoupler(decouplerId);
        
        if (result) {
            const message = `分离器测试成功！\n\n` +
                          `分离器: ${result.decoupler.data.name}\n` +
                          `分离力: ${result.separationForce} N\n` +
                          `断开连接数: ${result.brokenConnections.length}\n` +
                          `上级部件: ${result.upperStage.length} 个\n` +
                          `下级部件: ${result.lowerStage.length} 个\n\n` +
                          `注意: 这只是测试，实际发射时分离器会在指定时机自动激活。`;
            
            alert(message);
            
            // 更新UI以反映断开的连接
            this.updateConnectionLines();
            this.updateUI();
        }
    }

    // 显示分级信息
    showStagingInfo() {
        const stagingInfo = this.assembly.getStagingInfo();
        
        if (stagingInfo.length === 0) {
            const noDecouplerMsg = window.i18n ? 
                window.i18n.t('rocketBuilder.staging.noDecoupler') : 
                '当前载具没有检测到分离器，无法进行分级。\n\n添加分离器部件可以创建多级火箭设计。';
            alert(noDecouplerMsg);
            return;
        }

        const stagingTitle = window.i18n ? window.i18n.t('rocketBuilder.staging.title') : '火箭分级信息';
        const stageLabel = window.i18n ? window.i18n.t('rocketBuilder.staging.stage') : '第';
        const stageUnit = window.i18n ? window.i18n.t('rocketBuilder.staging.stageUnit') : '级';
        const decouplerLabel = window.i18n ? window.i18n.t('rocketBuilder.staging.decoupler') : '分离器';
        const partCountLabel = window.i18n ? window.i18n.t('rocketBuilder.staging.partCount') : '部件数量';
        const totalMassLabel = window.i18n ? window.i18n.t('rocketBuilder.staging.totalMass') : '总质量';
        const deltaVLabel = window.i18n ? window.i18n.t('rocketBuilder.staging.deltaV') : '预估ΔV';
        const totalStagesLabel = window.i18n ? window.i18n.t('rocketBuilder.staging.totalStages') : '总级数';
        const noteLabel = window.i18n ? window.i18n.t('rocketBuilder.staging.note') : '注意: 发射时分离器将按优先级顺序激活。';
        
        let infoMessage = `${stagingTitle}:\n\n`;
        stagingInfo.forEach((stage, index) => {
            infoMessage += `${stageLabel} ${stage.stage} ${stageUnit}:\n`;
            infoMessage += `  ${decouplerLabel}: ${stage.decoupler.data.name}\n`;
            infoMessage += `  ${partCountLabel}: ${stage.partsCount}\n`;
            infoMessage += `  ${totalMassLabel}: ${stage.mass.toFixed(2)} t\n`;
            infoMessage += `  ${deltaVLabel}: ${stage.deltaV.toFixed(0)} m/s\n\n`;
        });

        infoMessage += `${totalStagesLabel}: ${stagingInfo.length}\n`;
        infoMessage += `\n${noteLabel}`;

        alert(infoMessage);
    }

    // 发射火箭
    launchRocket() {
        if (this.assembly.getPartCount() === 0) {
            if (typeof showNotification === 'function') {
                const title = window.i18n ? window.i18n.t('rocketBuilder.alerts.cannotLaunch') : '无法发射';
                const message = window.i18n ? window.i18n.t('rocketBuilder.alerts.noVehicle') : '请先设计一个载具！';
                showNotification(title, message, 'error');
            } else {
                const noVehicleMessage = window.i18n ? 
                    window.i18n.t('rocketBuilder.alerts.noVehicle') : 
                    '请先设计一个载具！';
                alert(noVehicleMessage);
            }
            return;
        }

        const engines = this.assembly.parts.filter(p => p.data.type === 'engine');
        if (engines.length === 0) {
            if (typeof showNotification === 'function') {
                const title = window.i18n ? window.i18n.t('rocketBuilder.alerts.cannotLaunch') : '无法发射';
                const message = window.i18n ? window.i18n.t('rocketBuilder.alerts.noEngine') : '载具需要至少一个引擎才能发射！';
                showNotification(title, message, 'error');
            } else {
                const noEngineMessage = window.i18n ? 
                    window.i18n.t('rocketBuilder.alerts.noEngine') : 
                    '载具需要至少一个引擎才能发射！';
                alert(noEngineMessage);
            }
            return;
        }

        const rocketData = {
            name: this.assembly.name,
            parts: this.assembly.parts.map(part => ({
                id: part.id,
                data: part.data,
                position: part.position,
                fuelStatus: part.fuelStatus || null
            })),
            connections: this.assembly.connections,
            rootPartId: this.assembly.rootPart ? this.assembly.rootPart.id : null,
            totalMass: this.assembly.getTotalMass(),
            totalThrust: this.assembly.getTotalThrust(),
            timestamp: new Date().toISOString()
        };

        try {
            localStorage.setItem('launchRocket', JSON.stringify(rocketData));
            
            if (typeof showNotification === 'function') {
                const title = window.i18n ? window.i18n.t('rocketBuilder.alerts.prepareLaunch') : '准备发射';
                const message = window.i18n ? 
                    window.i18n.t('rocketBuilder.alerts.vehicleReady', { name: this.assembly.name }) :
                    `载具 "${this.assembly.name}" 已准备就绪！正在前往发射台...`;
                showNotification(title, message, 'success');
            }
            
            setTimeout(() => {
                window.location.href = 'launch-pad.html';
            }, 1500);
            
        } catch (error) {
            console.error('保存火箭数据失败:', error);
            if (typeof showNotification === 'function') {
                const title = window.i18n ? window.i18n.t('rocketBuilder.alerts.saveFailed') : '保存失败';
                const message = window.i18n ? window.i18n.t('rocketBuilder.alerts.saveDataFailed') : '无法保存火箭数据，请重试';
                showNotification(title, message, 'error');
            } else {
                const saveFailedMessage = window.i18n ? 
                    window.i18n.t('rocketBuilder.alerts.saveDataFailed') : 
                    '保存火箭数据失败，请重试';
                alert(saveFailedMessage);
            }
        }
    }
}

// 装配大楼相关的全局函数
function goBack() {
    const confirmMessage = window.i18n ?
        window.i18n.t('rocketBuilder.confirmations.goBack') :
        '确定要返回主页吗？当前设计将丢失。';
    if (confirm(confirmMessage)) {
        window.location.href = 'index.html';
    }
}

function clearAssembly() {
    if (window.rocketBuilder) {
        window.rocketBuilder.clearAssembly();
    }
}

function launchRocket() {
    if (window.rocketBuilder) {
        window.rocketBuilder.launchRocket();
    }
}

// 页面加载完成后初始化装配器
document.addEventListener('DOMContentLoaded', async () => {
    console.log('载具装配大楼已加载');
    
    if (!window.i18n.isInitialized()) {
        await new Promise(resolve => {
            document.addEventListener('i18nReady', resolve, { once: true });
        });
    }
    window.rocketBuilder = new RocketBuilder();
    
    setTimeout(() => {
        if (typeof showNotification === 'function') {
            const title = window.i18n ? window.i18n.t('rocketBuilder.welcome.title') : '装配大楼';
            const message = window.i18n ? window.i18n.t('rocketBuilder.welcome.message') : '欢迎来到载具装配大楼！先选择一个根部件，然后逐步构建载具。';
            showNotification(title, message, 'welcome');
        }
    }, 500);
});
