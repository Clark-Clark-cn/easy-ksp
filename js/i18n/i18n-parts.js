/**
 * 国际化部件数据管理器
 * 处理部件名称、描述等文本的多语言支持
 */

class I18nRocketParts {
    constructor() {
        this.originalParts = null;
    }

    /**
     * 初始化国际化部件数据
     */
    async init() {
        // 等待i18n系统准备就绪
        if (window.i18n && !window.i18n.isReady()) {
            await new Promise(resolve => {
                const checkReady = () => {
                    if (window.i18n.isReady()) {
                        resolve();
                    } else {
                        setTimeout(checkReady, 50);
                    }
                };
                checkReady();
            });
        }
        
        // 备份原始部件数据
        if (!this.originalParts && window.RocketParts) {
            this.originalParts = JSON.parse(JSON.stringify(window.RocketParts.parts));
        }
        
        // 更新部件数据的文本内容
        this.updatePartsTranslations();
        
        // 监听语言切换事件
        window.addEventListener('languageChanged', () => {
            this.updatePartsTranslations();
        });
    }

    /**
     * 更新部件翻译
     */
    updatePartsTranslations() {
        if (!window.RocketParts || !this.originalParts || !window.i18n) {
            return;
        }

        const updatedParts = {};
        
        for (const [partId, partData] of Object.entries(this.originalParts)) {
            updatedParts[partId] = {
                ...partData,
                name: this.getPartTranslation(partId, 'name'),
                description: this.getPartTranslation(partId, 'description')
            };
        }

        // 更新全局部件数据
        window.RocketParts.parts = updatedParts;
        
        // 触发部件数据更新事件
        window.dispatchEvent(new CustomEvent('partsTranslationUpdated', {
            detail: { parts: updatedParts }
        }));
    }

    /**
     * 获取部件翻译
     */
    getPartTranslation(partId, field) {
        // 尝试从部件ID映射获取翻译键
        const translationKey = this.getTranslationKey(partId, field);
        
        if (translationKey && window.i18n) {
            const translation = window.i18n.t(translationKey);
            // 如果翻译存在且不等于键本身，则返回翻译
            if (translation && translation !== translationKey) {
                return translation;
            }
        }

        // 回退到原始数据
        return this.originalParts[partId]?.[field] || '';
    }

    /**
     * 根据部件ID获取翻译键
     */
    getTranslationKey(partId, field) {
        // 部件ID到翻译键的映射
        const partKeyMap = {
            'command-pod-mk1': 'commandPod',
            'lv-909-engine': 'liquidEngine909',
            'lv-25k-engine': 'liquidEngine25k',
            'lv-t30-engine': 'liquidEngine',
            'rt-10-booster': 'solidBooster',
            'fl-t100-fuel-tank': 'fuelTankSmall',
            'fl-t200-tank': 'fuelTankSmall',
            'fl-t400-fuel-tank': 'fuelTankMedium',
            'fl-t400-tank': 'fuelTankMedium',
            'fl-t800-tank': 'fuelTankLarge',
            'td-12-decoupler': 'decoupler',
            'nose-cone-a': 'noseCone'
        };

        const translationKey = partKeyMap[partId];
        if (translationKey) {
            return `parts.${translationKey}.${field}`;
        }

        return null;
    }

    /**
     * 获取分类翻译
     */
    getCategoryTranslation(category) {
        const categoryMap = {
            'all': 'rocketBuilder.partsLibrary.categories.all',
            'command': 'rocketBuilder.partsLibrary.categories.command',
            'propulsion': 'rocketBuilder.partsLibrary.categories.engines',
            'structural': 'rocketBuilder.partsLibrary.categories.structural',
            'fuel': 'rocketBuilder.partsLibrary.categories.fuel',
            'engines': 'rocketBuilder.partsLibrary.categories.engines',
            'science': 'rocketBuilder.partsLibrary.categories.science'
        };

        const translationKey = categoryMap[category];
        if (translationKey && window.i18n) {
            return window.i18n.t(translationKey);
        }

        return category;
    }

    /**
     * 获取单位翻译
     */
    getUnitTranslation(unit) {
        const unitMap = {
            't': window.i18n?.t('rocketBuilder.infoPanel.units.kg') || 't',
            'kg': window.i18n?.t('rocketBuilder.infoPanel.units.kg') || 'kg',
            'm': window.i18n?.t('launchPad.units.meters') || 'm',
            'm/s': window.i18n?.t('launchPad.units.metersPerSecond') || 'm/s',
            'm/s²': window.i18n?.t('launchPad.units.metersPerSecondSquared') || 'm/s²',
            '%': window.i18n?.t('launchPad.units.percent') || '%',
            'kN': 'kN',
            '资金': window.i18n?.t('rocketBuilder.infoPanel.units.funds') || '资金',
            'Funds': window.i18n?.t('rocketBuilder.infoPanel.units.funds') || 'Funds'
        };

        return unitMap[unit] || unit;
    }

    /**
     * 格式化数值和单位
     */
    formatValueWithUnit(value, unit) {
        if (typeof value === 'number') {
            // 根据当前语言格式化数字
            const formattedValue = window.i18n ? 
                window.i18n.formatNumber(value, { maximumFractionDigits: 2 }) : 
                value.toFixed(2);
            
            const translatedUnit = this.getUnitTranslation(unit);
            return `${formattedValue} ${translatedUnit}`;
        }
        
        return `${value} ${this.getUnitTranslation(unit)}`;
    }

    /**
     * 获取状态文本翻译
     */
    getStatusTranslation(status) {
        const statusMap = {
            'ready': 'launchPad.status.ready',
            'launching': 'launchPad.status.launching',
            'flying': 'launchPad.status.flying',
            'landed': 'launchPad.status.landed',
            'crashed': 'launchPad.status.crashed',
            'orbit': 'launchPad.status.orbit'
        };

        const translationKey = statusMap[status];
        if (translationKey && window.i18n) {
            return window.i18n.t(translationKey);
        }

        return status;
    }
}

// 创建全局实例
window.i18nRocketParts = new I18nRocketParts();

// 在国际化系统初始化后自动初始化部件国际化
window.addEventListener('languageChanged', () => {
    if (window.i18nRocketParts) {
        window.i18nRocketParts.updatePartsTranslations();
    }
});

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18nRocketParts;
}
