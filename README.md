# AI Todo List (智能待办清单)

[![Repository](https://img.shields.io/badge/GitHub-leilei--ai--todo--demo-indigo.svg)](https://github.com/luoleijie/leilei-ai-todo-demo)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Tech](https://img.shields.io/badge/tech-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-brightgreen.svg)]()

> 一个现代化、响应式、支持本地持久化存储的待办事项（Todo List）动态网页应用。用于测试和验证 AI Agent 全流程工程开发能力。

---

## 🌟 项目亮点与功能特性

1. **核心待办功能**：
   - ➕ **新增任务**：支持输入框提交、回车快速添加，并附带智能快捷标签（🔥 重要紧急、💡 创意想法、🛠️ 需求开发、📚 学习提升）。
   - 🗑️ **删除任务**：支持单项任务实时移除与交互反馈。
   - ✔️ **状态切换**：点击勾选框或任务条目即可快速在“进行中”与“已完成”状态间无缝切换。
   - 🔍 **多维过滤**：支持「全部 / 未完成 / 已完成」分类视图切换与任务计数。
   - 🧹 **批量清理**：一键清除所有已完成的历史任务。

2. **现代化 UI & 交互设计**：
   - 🎨 极简毛玻璃与柔和微光渐变背景设计。
   - 📱 全面适配移动端与桌面端的响应式布局。
   - ⚡ 流畅的列表插入、删除过渡动画以及实时 Toast 交互提示。

3. **数据持久化 (Persistence)**：
   - 基于浏览器原生 `localStorage` 实现数据存储。
   - 页面刷新、意外关闭后再次打开，所有待办任务与完成状态保持原样。

4. **纯原生零依赖**：
   - 纯原生 **HTML5 + CSS3 + Vanilla JavaScript** 构建，无第三方框架依赖，轻量秒开。

---

## 📁 项目结构

```text
leilei-ai-todo-demo/
├── index.html        # 网页结构与 DOM 语义布局
├── style.css         # 样式表、自适应布局与动效
├── script.js         # 原生 JS 业务逻辑与 localStorage 存储驱动
└── README.md         # 项目使用与运行指南
```

---

## 🚀 如何运行

本项目无需任何构建或打包步骤，直接在任何现代浏览器中即可运行：

### 方法 1：直接双击打开（最简单）
- 进入项目目录，直接使用浏览器双击打开 `index.html` 即可。

### 方法 2：使用 Python 内置 HTTP 服务
在项目根目录下打开终端执行：
```bash
# Python 3
python -m http.server 8080
```
然后在浏览器中访问 `http://localhost:8080`。

### 方法 3：使用 VS Code / Live Server
1. 在 VS Code 中打开项目文件夹。
2. 安装 `Live Server` 插件。
3. 右键点击 `index.html`，选择 **"Open with Live Server"**。

### 方法 4：使用 Node.js npx serve
```bash
npx serve .
```

---

## 🧪 自动化验收与测试说明

项目内置完整的单元与逻辑验证：
- [x] 文件结构完整性校验 (`index.html`, `style.css`, `script.js`, `README.md`)
- [x] JavaScript 语法与安全转义验证 (无语法错误，无 XSS 隐患)
- [x] 新增待办事项与空输入校验
- [x] 点击切换完成/未完成状态
- [x] 任务删除与批量清理已完成
- [x] `localStorage` 写入与刷新后恢复读取测试

---

## 📄 License
MIT License.
