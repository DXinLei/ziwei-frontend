# 贡献指南

感谢您对紫微斗数排盘系统前端项目的关注！我们欢迎任何形式的贡献。

## 🤝 如何贡献

### 报告问题
- 使用 [Issues](../../issues) 报告 bug
- 提供详细的问题描述和重现步骤
- 包含相关的错误信息和截图

### 提交功能请求
- 使用 [Issues](../../issues) 提交功能请求
- 详细描述期望的功能和用途
- 说明功能的使用场景

### 提交代码
1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add some amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

## 📝 开发规范

### 代码风格
- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 和 Prettier 配置
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case
- 常量命名使用 UPPER_SNAKE_CASE

### 提交信息规范
使用 Conventional Commits 规范：

```
type(scope): description

feat(ziwei): 添加新的命盘计算功能
fix(gongwei): 修复宫位显示问题
docs(readme): 更新文档
style(stars): 调整星辰样式
refactor(api): 重构API接口
test(components): 添加组件测试
chore(deps): 更新依赖包
```

### 分支命名
- `feature/功能名称` - 新功能开发
- `fix/问题描述` - 问题修复
- `docs/文档类型` - 文档更新
- `refactor/重构内容` - 代码重构

## 🧪 测试

### 运行测试
```bash
# 运行单元测试
npm run test

# 运行端到端测试
npm run test:e2e

# 生成测试覆盖率报告
npm run test:coverage
```

### 测试规范
- 为新功能编写测试用例
- 确保测试覆盖率不低于80%
- 使用描述性的测试名称

## 📋 Pull Request 流程

### 提交前检查
- [ ] 代码通过 ESLint 检查
- [ ] 代码通过 Prettier 格式化
- [ ] 所有测试通过
- [ ] 更新相关文档
- [ ] 添加必要的测试用例

### PR 描述模板
```markdown
## 变更类型
- [ ] Bug修复
- [ ] 新功能
- [ ] 重构
- [ ] 文档更新
- [ ] 样式调整
- [ ] 测试相关
- [ ] 其他

## 变更描述
简要描述本次变更的内容

## 测试
描述如何测试这些变更

## 截图
如果涉及UI变更，请提供截图

## 相关Issue
Closes #issue_number
```

## 🎨 UI/UX 贡献

### 设计规范
- 遵循现有的设计系统
- 保持颜色、字体、间距的一致性
- 确保响应式设计
- 考虑可访问性

### 紫微斗数专业规范
- 遵循传统紫微斗数排盘规则
- 星辰显示要准确无误
- 亮度状态要符合专业标准
- 四化星标注要正确

## 📖 文档贡献

### 文档类型
- API文档
- 组件文档
- 使用指南
- 开发文档

### 文档规范
- 使用清晰的标题结构
- 提供代码示例
- 包含必要的截图
- 保持文档的时效性

## 🏷️ 发布流程

### 版本号规范
遵循语义化版本控制 (SemVer)：
- `MAJOR.MINOR.PATCH`
- 主版本号：不兼容的API修改
- 次版本号：向下兼容的功能性新增
- 修订号：向下兼容的问题修正

### 发布检查清单
- [ ] 更新版本号
- [ ] 更新 CHANGELOG.md
- [ ] 运行完整测试套件
- [ ] 构建生产版本
- [ ] 创建发布标签

## 🤔 有问题？

如果您有任何疑问，请：

1. 查看现有的 [Issues](../../issues)
2. 查看项目文档
3. 在 Issue 中提问

## 📞 联系方式

- 项目维护者：[Your Name]
- 邮箱：your-email@example.com
- 项目主页：[Project URL]

---

再次感谢您的贡献！🎉