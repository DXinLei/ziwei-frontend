# 紫微斗数排盘系统 - 前端

🔮 **专业的紫微斗数在线排盘分析工具** - 现代化的Web界面，提供传统紫微斗数命盘的数字化展示与分析。

![紫微斗数](https://img.shields.io/badge/紫微斗数-传统命理-blue)
![Vue.js](https://img.shields.io/badge/Vue.js-3.4+-green)
![Vite](https://img.shields.io/badge/Vite-5.0+-yellow)
![License](https://img.shields.io/badge/License-MIT-orange)

## ✨ 主要特性

### 🎯 专业命盘展示
- **传统十二宫位布局** - 完整呈现紫微斗数命宫、夫妻、财帛等十二宫
- **专业星辰显示** - 甲级星、乙级星、丙级星完整展示
- **四化星系统** - 化禄、化权、化科、化忌清晰标注
- **亮度状态指示** - 庙、旺、得地、利益、平和、不得地、陷七种状态

### 🎨 现代化设计
- **专业配色方案** - 参考ziwei.pub等专业紫微斗数网站标准
- **甲级星红色突出** - 重要星耀一目了然
- **方框化设计** - 亮度状态和四化星采用方框包围，层次分明
- **纵排优化** - 节省空间，传统与现代完美结合
- **响应式布局** - 适配各种屏幕尺寸

### 🔧 强大功能
- **实时排盘** - 输入出生信息即可生成完整命盘
- **三方四正连线** - 可视化宫位关系
- **交互式界面** - 点击宫位查看详情
- **导出功能** - 支持命盘图片导出（开发中）
- **多端适配** - PC端和移动端完美支持

## 🛠️ 技术栈

### 前端核心
- **Vue.js 3.4+** - 现代化前端框架
- **TypeScript** - 类型安全的JavaScript
- **Vite 5.0+** - 快速构建工具
- **Element Plus** - UI组件库

### 开发工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **SCSS** - CSS预处理器
- **Hot Module Replacement** - 开发热更新

### 设计标准
- **CSS Grid Layout** - 命盘十二宫位布局
- **Flexbox** - 灵活的项目布局
- **CSS Variables** - 主题色彩系统
- **Writing Mode** - 纵排文字支持

## 📦 项目结构

```
frontend/
├── public/                 # 静态资源
│   ├── favicon.ico        # 网站图标
│   └── index.html         # HTML模板
├── src/                   # 源代码
│   ├── api/              # API接口
│   │   ├── index.ts      # API配置
│   │   └── types.ts      # 类型定义
│   ├── assets/           # 资源文件
│   │   └── main.css      # 全局样式
│   ├── components/       # Vue组件
│   │   ├── GongWei.vue   # 宫位组件
│   │   ├── MingPanDisplay.vue  # 命盘展示
│   │   ├── StarDisplay.vue    # 星辰显示
│   │   └── UserInfoForm.vue   # 用户信息表单
│   ├── router/           # 路由配置
│   │   └── index.ts
│   ├── stores/           # 状态管理
│   │   └── index.ts
│   ├── utils/            # 工具函数
│   │   ├── index.ts
│   │   └── types.ts
│   ├── App.vue           # 根组件
│   └── main.ts           # 入口文件
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript配置
├── vite.config.ts        # Vite配置
└── README.md             # 项目文档
```

## 🚀 快速开始

### 环境要求
- Node.js 16.0+
- npm 8.0+ 或 yarn 1.22+

### 安装依赖
```bash
# 克隆项目
git clone <repository-url>
cd doushu/frontend

# 安装依赖
npm install
# 或
yarn install
```

### 启动开发服务器
```bash
# 启动开发服务器
npm run dev
# 或
yarn dev

# 应用将在 http://localhost:3000 启动
```

### 构建生产版本
```bash
# 构建生产版本
npm run build
# 或
yarn build

# 预览生产版本
npm run preview
# 或
yarn preview
```

### 代码检查和格式化
```bash
# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 🔌 后端API配置

### API端点
项目需要连接后端API服务，默认配置：

```typescript
// src/api/index.ts
const API_BASE_URL = 'http://localhost:8080/api'
```

### 主要API接口
- `POST /api/arrange` - 紫微斗数排盘计算
- `GET /api/health` - 健康检查

### 排盘请求参数
```typescript
interface ArrangeRequest {
  name: string;          // 姓名
  gender: 'male' | 'female';  // 性别
  date: string;          // 出生日期时间 (YYYY-MM-DD HH:mm:ss)
  type: 'solar' | 'lunar';    // 历法类型
  location: {            // 出生地点
    province: string;
    city: string;
    district?: string;
  };
}
```

## 🎨 设计系统

### 颜色方案
- **甲级星**: 红色 (#d32f2f) - 突出重要性
- **四化星**: 彩色方框
  - 化禄: 红色 (#ffebee背景)
  - 化权: 蓝色 (#e3f2fd背景)
  - 化科: 绿色 (#e8f5e8背景)
  - 化忌: 黑色 (#f5f5f5背景)
- **亮度状态**: 彩色方框
  - 庙: 红色 (#ffebee背景)
  - 旺: 橙色 (#fff3e0背景)
  - 得地: 绿色 (#e8f5e8背景)
  - 利益: 蓝色 (#e3f2fd背景)
  - 平和: 灰色 (#fafafa背景)
  - 不得地: 黄色 (#fff8e1背景)
  - 陷: 浅灰 (#f5f5f5背景)

### 字体规范
- **星辰名称**: 9-11px, font-weight: 600-800
- **状态标识**: 7px, font-weight: 600
- **四化标识**: 7px, font-weight: 700

### 布局特色
- **十二宫位**: CSS Grid 3x4布局
- **垂直文字**: `writing-mode: vertical-rl`
- **方框设计**: 圆角边框，突出重要信息
- **两列布局**: 甲级星左列，乙级/丙级星右列

## 🎯 核心功能说明

### 命盘布局
- 采用传统紫微斗数十二宫位排列
- 每个宫位显示宫名、地支、星辰、亮度状态
- 支持三方四正连线显示

### 星辰系统
- **甲级星** (14颗): 紫微、天机、太阳、武曲、天同、廉贞、天府、太阴、贪狼、巨门、天相、天梁、七杀、破军
- **乙级星**: 辅助星耀
- **丙级星**: 杂耀星
- **四化星**: 禄、权、科、忌

### 亮度等级
- **庙**: 最佳状态
- **旺**: 优秀状态
- **得地**: 良好状态
- **利益**: 较好状态
- **平和**: 普通状态
- **不得地**: 较差状态
- **陷**: 最差状态

## 🔧 自定义配置

### 修改API地址
```typescript
// src/api/index.ts
export const API_BASE_URL = 'your-api-server-url'
```

### 自定义主题色彩
```scss
// src/assets/main.css
:root {
  --jia-star-color: #d32f2f;    // 甲级星颜色
  --lu-color: #d32f2f;           // 化禄颜色
  --quan-color: #1976d2;         // 化权颜色
  --ke-color: #388e3c;           // 化科颜色
  --ji-color: #212121;           // 化忌颜色
}
```

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发规范
- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 和 Prettier 代码规范
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case
- 提交信息采用 Conventional Commits 规范

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 现代化前端框架
- [Element Plus](https://element-plus.org/) - Vue 3 UI组件库
- [Vite](https://vitejs.dev/) - 快速构建工具
- [ziwei.pub](https://ziwei.pub/) - 紫微斗数专业参考网站

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](../../issues)
- 邮箱: your-email@example.com

---

⭐ **如果这个项目对您有帮助，请给我们一个 Star！**