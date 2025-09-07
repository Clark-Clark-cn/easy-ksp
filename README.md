# Easy-KSP

一个简化的Kerbal Space Program (KSP) 模拟器网页应用，帮助用户体验火箭建造和发射模拟。

## 功能特性

- **火箭建造**：使用各种部件（如燃料箱、发动机、分离器）建造火箭
- **发射模拟**：模拟火箭发射过程
- **多语言支持**：支持英文和中文界面
- **响应式设计**：适配不同设备屏幕

## 技术栈

- HTML5
- CSS3
- JavaScript (ES6+)
- 图片资源

## 文件结构

``` text
easy-ksp/
├── index.html          # 主页面
├── launch-pad.html     # 发射台页面
├── rocket-build.html   # 火箭建造页面
├── 404.html           # 404错误页面
├── css/               # 样式文件
│   ├── style.css
│   ├── launch-pad.css
│   ├── rocket-build.css
│   └── i18n.css
├── js/                # JavaScript文件
│   ├── main.js
│   ├── launch-pad.js
│   ├── rocket-build.js
│   ├── rocket-parts.js
│   └── launch-simulation.js
├── i18n/              # 国际化文件
│   ├── i18n.js
│   ├── i18n-parts.js
│   ├── language-switcher.js
│   └── locales/
│       ├── en-US.js
│       └── zh-CN.js
└── imgs/              # 图片资源
    ├── rocket.svg
    ├── earth.png
    ├── fuel-tank-100.png
    └── ...
```

## 安装和运行

1. 克隆项目到本地：

   ```bash
   git clone https://github.com/Clark-Clark-cn/easy-ksp.git
   ```

2. 进入项目目录：

   ```bash
   cd easy-ksp
   ```

3. 使用浏览器打开 `index.html` 文件，或使用本地服务器运行：
   - Python: `python -m http.server 8000`
   - Node.js: `npx http-server`

## 使用方法

1. 打开 `index.html` 进入主页面
2. 点击"火箭建造"进入火箭设计界面
3. 拖拽部件建造火箭
4. 切换到发射台进行发射模拟
5. 享受太空探索的乐趣！

## 国际化

项目支持多语言：

- 英文 (en-US)
- 中文 (zh-CN)

语言切换通过页面上的语言选择器实现。

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

本项目采用MIT许可证。
