/**
 * 语言切换器组件
 */

class LanguageSwitcher {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? 
                        document.querySelector(container) : container;
        this.options = {
            style: 'dropdown', // 'dropdown', 'buttons', 'simple'
            showFlag: true,
            showText: true,
            position: 'top-right',
            ...options
        };
        
        this.languages = [
            { code: 'zh-CN', name: '简体中文', flag: 'cn' },
            { code: 'en-US', name: 'English', flag: 'us' }
        ];
        
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        if (!this.container) return;

        const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'zh-CN';
        const currentLangInfo = this.languages.find(lang => lang.code === currentLang) || this.languages[0];

        let html = '';

        switch (this.options.style) {
            case 'dropdown':
                html = this.renderDropdown(currentLangInfo);
                break;
            case 'buttons':
                html = this.renderButtons(currentLang);
                break;
            default:
                html = this.renderSimple(currentLangInfo);
        }

        this.container.innerHTML = html;
        this.container.className = `language-switcher ${this.options.style} ${this.options.position}`;
    }

    renderDropdown(currentLangInfo) {
        return `
            <div class="lang-dropdown">
                <button class="lang-current" type="button">
                    ${this.options.showFlag ? `<span class="lang-flag">${currentLangInfo.flag}</span>` : ''}
                    ${this.options.showText ? `<span class="lang-text">${currentLangInfo.name}</span>` : ''}
                    <svg class="lang-arrow" width="12" height="12" viewBox="0 0 12 12">
                        <path d="M6 8l-4-4h8z" fill="currentColor"/>
                    </svg>
                </button>
                <ul class="lang-options">
                    ${this.languages.map(lang => `
                        <li>
                            <button class="lang-switch ${lang.code === currentLangInfo.code ? 'active' : ''}" 
                                    data-lang="${lang.code}" type="button">
                                ${this.options.showFlag ? `<span class="lang-flag">${lang.flag}</span>` : ''}
                                <span class="lang-text">${lang.name}</span>
                            </button>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    renderButtons(currentLang) {
        return `
            <div class="lang-buttons">
                ${this.languages.map(lang => `
                    <button class="lang-switch ${lang.code === currentLang ? 'active' : ''}" 
                            data-lang="${lang.code}" type="button" 
                            title="${lang.name}">
                        ${this.options.showFlag ? `<span class="lang-flag">${lang.flag}</span>` : ''}
                        ${this.options.showText ? `<span class="lang-text">${lang.name}</span>` : ''}
                    </button>
                `).join('')}
            </div>
        `;
    }

    renderSimple(currentLangInfo) {
        const otherLang = this.languages.find(lang => lang.code !== currentLangInfo.code);
        return `
            <button class="lang-switch simple" data-lang="${otherLang.code}" type="button" 
                    title="Switch to ${otherLang.name}">
                ${this.options.showFlag ? `<span class="lang-flag">${otherLang.flag}</span>` : ''}
                ${this.options.showText ? `<span class="lang-text">${otherLang.name}</span>` : ''}
            </button>
        `;
    }

    bindEvents() {
        // 下拉菜单展开/收起
        this.container.addEventListener('click', (e) => {
            if (e.target.closest('.lang-current')) {
                const dropdown = e.target.closest('.lang-dropdown');
                if (dropdown) {
                    dropdown.classList.toggle('open');
                }
            }
        });

        // 点击其他地方关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.language-switcher')) {
                const openDropdown = this.container.querySelector('.lang-dropdown.open');
                if (openDropdown) {
                    openDropdown.classList.remove('open');
                }
            }
        });

        // 监听语言变化事件
        window.addEventListener('languageChanged', () => {
            this.render();
        });
    }

    // 静态方法：创建简单的语言切换按钮
    static createSimple(container, options = {}) {
        return new LanguageSwitcher(container, { 
            style: 'simple', 
            showFlag: false,
            ...options 
        });
    }

    // 静态方法：创建下拉式语言切换器
    static createDropdown(container, options = {}) {
        return new LanguageSwitcher(container, { 
            style: 'dropdown',
            ...options 
        });
    }

    // 静态方法：创建按钮组式语言切换器
    static createButtons(container, options = {}) {
        return new LanguageSwitcher(container, { 
            style: 'buttons',
            ...options 
        });
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageSwitcher;
} else {
    window.LanguageSwitcher = LanguageSwitcher;
}
