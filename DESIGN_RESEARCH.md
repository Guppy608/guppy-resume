# CV_online 视觉与交互调研记录

调研时间：2026-07-30

原则：仅借鉴公开项目的设计语言、信息组织和交互模式；本次实现未直接复制第三方项目代码，也未引入它们的专有素材。

## 参考项目

| 项目 | 主要特点与动效 | 技术实现 | 协议检查 | 对本站的适用性 |
| --- | --- | --- | --- | --- |
| [brunosimon/folio-2025](https://github.com/brunosimon/folio-2025) | 把个人主页做成可驾驶探索的 3D 世界，空间叙事、昼夜与物理反馈非常完整 | Three.js / WebGPU、Rapier、Howler、Vite | MIT；作者官网也明确说明源代码与 Blender 文件开放 | 高启发、低直接复用。适合借鉴“个人经历是一段可探索旅程”的观念，但不适合把研究与产品履历做成游戏 |
| [craftzdog/craftzdog-homepage](https://github.com/craftzdog/craftzdog-homepage) | 页面主体克制，首屏用一个 3D voxel 角色形成记忆点；转场和卡片微动效轻盈 | Next.js、Chakra UI、Three.js、Framer Motion | 自定义 MIT 条款；要求回链，且明确禁止使用其 3D voxel dog | 很适合借鉴“3D 只做点睛”的比例；不复用角色与代码 |
| [bchiang7/v4](https://github.com/bchiang7/v4) | 强内容层级、滚动 reveal、时间线与项目卡片；在动效与阅读效率之间平衡很好 | Gatsby、Styled Components | MIT；README 额外要求使用时给予署名与回链 | 适合借鉴信息密度、固定导航和渐进出现，但视觉上需要更个性化 |
| [ankitpathak62/3D_Portfolio](https://github.com/ankitpathak62/3D_Portfolio) | 全屏 WebGL、GSAP 驱动的滚动节奏和空间转场，画面张力强 | React、TypeScript、Three.js、WebGL、GSAP | MIT；但仓库说明包含 GSAP trial 插件，试用插件不能直接用于线上部署 | 适合参考首屏层次与滚动节奏；不应复用其试用插件或整套重量级实现 |
| [ladunjexa/reactjs18-3d-portfolio](https://github.com/ladunjexa/reactjs18-3d-portfolio) | 3D 场景、时间线、倾斜卡片和分段 reveal，移动端方案相对完整 | React、Three.js、Tailwind CSS、Framer Motion、EmailJS | MIT | 适合参考卡片、时间线与 3D/文本的组合；太偏典型“开发者作品集”，不适合作为主视觉 |
| [Justinianus2001/my-portfolio](https://github.com/Justinianus2001/my-portfolio) | 用完整桌面操作系统隐喻来承载履历，包含开机、窗口、音效和手势 | 原生 HTML / CSS / JavaScript、PWA | MIT | 适合参考“一个统一隐喻贯穿全站”；对本站而言游戏化和操作成本过高 |
| [sanidhyy/space-portfolio](https://github.com/sanidhyy/space-portfolio) | 星空、粒子、3D 背景、分屏叙事和 Framer Motion 转场 | Next.js 14、TypeScript、Three.js、Framer Motion、Tailwind CSS | MIT | 适合参考纵深与分屏节奏；太偏太空/赛博，不符合本站希望的温度感 |

## 最终采用的方向

主方向是“编辑部式叙事 + 轻量空间动效”：

- 借鉴 Bruno Simon 的空间叙事感，但不把页面做成游戏。
- 借鉴 Craftzdog 的动效比例：首屏形成记忆点，其余屏幕服务阅读。
- 借鉴 Brittany Chiang 的内容优先原则，让长履历可快速扫读、也可展开细看。
- 保留纯静态 HTML/CSS/JS；首屏关系网络为本站独立编写的 Canvas 动效，没有引入 Three.js、GSAP 或前端框架。

## 新版信息架构

1. **Hero**：姓名、身份切换、个人坐标、首屏照片和空间关系网络。
2. **Profile**：背景概览、五个能力关键词、三步方法论、四组结果指标。
3. **Education**：本科、硕士、访问研究三张横向章节卡。
4. **Work**：AI 产品与京东物流两张横向案例卡，优先展示业务结果。
5. **Life Atlas**：八个国家/地区的横向旅行札记，并按大洲统一配色。
6. **Contact**：邮件、GitHub、知乎和明确的合作邀请。
