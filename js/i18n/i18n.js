/**
 * 国际化 (i18n) 核心库
 * 支持多语言切换和文本翻译
 */

class I18n {
    constructor() {
        this.currentLang = this.getStoredLanguage() || this.detectBrowserLanguage();
        this.translations = {};
        this.fallbackLang = 'zh-CN';
        this.initialized = false; // 添加初始化状态标记
        
        // 绑定语言切换事件
        this.bindLanguageSwitch();
    }

    /**
     * 获取存储的语言设置
     */
    getStoredLanguage() {
        return localStorage.getItem('wsp-language');
    }

    /**
     * 检测浏览器语言
     */
    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        // 支持的语言列表
        const supportedLangs = ['zh-CN', 'en-US'];
        
        // 精确匹配
        if (supportedLangs.includes(browserLang)) {
            return browserLang;
        }
        
        // 模糊匹配 (例如 zh-TW -> zh-CN)
        const langPrefix = browserLang.split('-')[0];
        const matchedLang = supportedLangs.find(lang => lang.startsWith(langPrefix));
        
        return matchedLang || 'zh-CN';
    }

    /**
     * 加载语言包
     */
    async loadLanguage(lang) {
        if (this.translations[lang]) {
            return this.translations[lang];
        }

        try {
            const response = await fetch(`js/i18n/locales/${lang}.js`);
            if (!response.ok) {
                throw new Error(`Failed to load language pack: ${lang}`);
            }
            
            const text = await response.text();
            // 使用 Function 构造器执行语言文件
            const langData = new Function('return ' + text.replace(/^export\s+default\s+/, ''))();
            this.translations[lang] = langData;
            
            return langData;
        } catch (error) {
            console.warn(`Failed to load language pack for ${lang}:`, error);
            return this.translations[this.fallbackLang] || {};
        }
    }

    /**
     * 获取翻译文本
     */
    t(key, params = {}) {
        const translation = this.getNestedValue(this.translations[this.currentLang] || {}, key) ||
                          this.getNestedValue(this.translations[this.fallbackLang] || {}, key) ||
                          key;

        // 参数替换
        return this.interpolate(translation, params);
    }

    /**
     * 获取嵌套对象的值
     */
    getNestedValue(obj, path) {
        return path.split('.').reduce((o, p) => o && o[p], obj);
    }

    /**
     * 插值替换
     */
    interpolate(text, params) {
        return text.replace(/\{(\w+)\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    }

    /**
     * 切换语言
     */
    async setLanguage(lang) {
        await this.loadLanguage(lang);
        this.currentLang = lang;
        localStorage.setItem('wsp-language', lang);
        document.documentElement.lang = lang;
        
        // 更新页面内容
        this.updatePageContent();
        
        this.initialized = true; // 确保标记为已初始化
        
        // 触发语言切换事件
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: lang } 
        }));
        
        // 触发初始化完成事件（如果是首次切换）
        document.dispatchEvent(new CustomEvent('i18nReady'));
    }

    /**
     * 获取当前语言
     */
    getCurrentLanguage() {
        return this.currentLang;
    }

    /**
     * 更新页面内容
     */
    updatePageContent() {
        // 更新所有带有 data-i18n 属性的元素
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.hasAttribute('data-i18n-html')) {
                element.innerHTML = translation;
            } else {
                element.textContent = translation;
            }
        });

        // 更新所有带有 data-i18n-placeholder 属性的输入框
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // 更新所有带有 data-i18n-title 属性的元素
        const titleElements = document.querySelectorAll('[data-i18n-title]');
        titleElements.forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });

        // 更新页面标题
        const titleKey = document.documentElement.getAttribute('data-i18n-title');
        if (titleKey) {
            document.title = this.t(titleKey);
        }
    }

    /**
     * 绑定语言切换按钮事件
     */
    bindLanguageSwitch() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('lang-switch') || 
                e.target.closest('.lang-switch')) {
                const button = e.target.classList.contains('lang-switch') ? 
                             e.target : e.target.closest('.lang-switch');
                const lang = button.getAttribute('data-lang');
                if (lang) {
                    this.setLanguage(lang);
                }
            }
        });
    }

    /**
     * 初始化国际化
     */
    async init() {
        await this.loadLanguage(this.currentLang);
        await this.loadLanguage(this.fallbackLang); // 预加载备用语言
        
        document.documentElement.lang = this.currentLang;
        this.updatePageContent();
        
        this.initialized = true; // 标记为已初始化
        
        // 触发初始化完成事件
        document.dispatchEvent(new CustomEvent('i18nReady'));
        
        return this;
    }

    /**
     * 检查是否已初始化
     */
    isInitialized() {
        return this.initialized;
    }

    /**
     * 格式化数字
     */
    formatNumber(number, options = {}) {
        const locale = this.currentLang.replace('-', '_');
        return new Intl.NumberFormat(locale, options).format(number);
    }

    /**
     * 格式化日期
     */
    formatDate(date, options = {}) {
        return new Intl.DateTimeFormat(this.currentLang, options).format(date);
    }

    /**
     * 获取语言显示名称
     */
    getLanguageDisplayName(lang = this.currentLang) {
        const names = {
            'zh-CN': '简体中文',
            'en-US': 'English'
        };
        return names[lang] || lang;
    }
}

// 创建全局实例
window.i18n = new I18n();

// 自动初始化
document.addEventListener('DOMContentLoaded', async () => {
    if (!window.i18n.isInitialized()) {
        await window.i18n.init();
    }
});

// 导出类以便在其他模块中使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}
