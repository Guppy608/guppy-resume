# Guppy - AI产品经理 & 算法研究员个人简历网站

这是一个现代化的个人简历网站，展示AI产品经理和算法研究员的专业经历、技能和成就。采用响应式设计，支持中英文双语切换和暗色/亮色主题。

## 🌟 项目特点

### 🎨 现代化设计
- **响应式布局**: 完美适配桌面端、平板和移动设备
- **双主题支持**: 优雅的暗色/亮色主题切换
- **渐变视觉**: 现代化的渐变色彩搭配
- **平滑动画**: 丰富的CSS动画和过渡效果
- **玻璃拟态**: 现代化的毛玻璃效果设计

### 🌍 国际化支持
- **双语切换**: 中文/英文无缝切换
- **本地化存储**: 记住用户语言偏好
- **完整翻译**: 所有内容支持双语显示

### 📱 用户体验
- **平滑滚动**: 导航锚点平滑跳转
- **加载动画**: 优雅的页面加载效果
- **交互反馈**: 丰富的hover和点击效果
- **无障碍设计**: 支持键盘导航和屏幕阅读器

### � 专业内容
- **个人经历**: 完整的学术和职业发展时间线
- **技能展示**: 专业技能和技术标签
- **荣誉成就**: 获奖经历和认证展示
- **联系方式**: 多种联系方式和社交媒体链接

## 🛠️ 技术栈

- **HTML5**: 语义化标签、无障碍设计
- **CSS3**: Flexbox、Grid、渐变、动画、响应式设计
- **JavaScript**: ES6+、DOM操作、事件处理、本地存储
- **字体**: Google Fonts (Inter字体)
- **图标**: Unicode Emoji
- **部署**: GitHub Pages / Netlify

## 📁 文件结构

```
项目根目录/
├── index.html          # 主页面 - 个人简历内容
├── css/
│   └── style.css       # 样式文件 - 响应式设计和主题
├── js/
│   └── script.js       # 交互逻辑 - 主题切换和语言切换
├── images/
│   ├── avatar.jpg      # 个人头像
│   └── background.jpg  # 背景图片
└── README.md           # 项目说明文档
```

## 🚀 部署指南

### 📋 部署前准备

1. **确保所有文件完整**
   ```bash
   # 检查必要文件
   ls -la
   # 应该包含: index.html, css/, js/, images/, README.md
   ```

2. **本地测试**
   ```bash
   # 启动本地服务器（推荐）
   python -m http.server 8000
   # 或者使用 Node.js
   npx serve .
   # 或者直接在浏览器打开 index.html
   ```

### 🌐 GitHub Pages 部署（推荐）

1. **创建 GitHub 仓库**
   ```bash
   # 初始化 Git 仓库
   git init
   git add .
   git commit -m "Initial commit: Personal resume website"

   # 添加远程仓库（替换为您的仓库地址）
   git remote add origin https://github.com/Guppy608/guppy-resume.git
   git branch -M main
   git push -u origin main
   ```

2. **启用 GitHub Pages**
   - 进入 GitHub 仓库设置页面
   - 找到 "Pages" 选项
   - Source 选择 "Deploy from a branch"
   - Branch 选择 "main" 分支
   - 文件夹选择 "/ (root)"
   - 点击 "Save"

3. **访问网站**
   - 部署完成后，访问地址为: `https://Guppy608.github.io/guppy-resume`
   - 通常需要等待 5-10 分钟生效

### 🎯 Netlify 部署（备选方案）

1. **方式一：Git 连接**
   - 登录 [Netlify](https://netlify.com)
   - 点击 "New site from Git"
   - 选择 GitHub 并授权
   - 选择您的仓库
   - 构建设置保持默认
   - 点击 "Deploy site"

2. **方式二：拖拽部署**
   - 将整个项目文件夹拖拽到 Netlify 部署区域
   - 自动生成随机域名
   - 可以自定义域名

### ⚙️ 部署配置要点

- ✅ **纯静态网站**: 无需服务器端代码
- ✅ **相对路径**: 所有资源使用相对路径引用
- ✅ **响应式设计**: 自动适配各种设备
- ✅ **SEO 友好**: 包含完整的 meta 标签
- ✅ **快速加载**: 优化的 CSS 和 JavaScript

## 🔧 自定义配置

### 个人信息修改
1. **基本信息**: 编辑 `index.html` 中的个人信息部分
2. **个人经历**: 修改时间线内容和技能标签
3. **联系方式**: 更新社交媒体链接和联系信息
4. **头像图片**: 替换 `images/avatar.jpg`

### 主题定制
1. **颜色方案**: 修改 `css/style.css` 中的 CSS 变量
2. **字体选择**: 更改 Google Fonts 引用
3. **布局调整**: 修改 CSS Grid 和 Flexbox 布局
