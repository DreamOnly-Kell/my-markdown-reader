# Markdown Reader

本地轻量 Markdown 阅读器：通用 Markdown（GFM 风格）、Mermaid 图示、KaTeX 公式。

仓库：https://github.com/DreamOnly-Kell/my-markdown-reader

## 功能

- **通用 Markdown**：标题、列表、引用、链接、表格、代码块与语法高亮
- **图示**：` ```mermaid ` 代码块（flowchart / sequence 等）
- **公式**：行内 `$...$`、块级 `$$...$$`（KaTeX）
- **本地文件**：按钮打开、拖拽 `.md` 到预览区；内置样例一键加载

## 要求

- Node.js 18+（本项目固定 Vite 5，避免 Vite 8/rolldown 在部分 Node 版本上的原生绑定问题）

## 快速开始

```bash
git clone git@github.com:DreamOnly-Kell/my-markdown-reader.git
cd my-markdown-reader
npm install
npm run dev
```

浏览器打开终端提示的本地地址（默认 `http://localhost:5173`）。

## 构建

```bash
npm run build
npm run preview
```

## 脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 开发服务器 |
| `npm run build` | TypeScript 检查 + 生产构建 |
| `npm run preview` | 预览构建产物 |
| `npm run verify:render` | 渲染冒烟校验 |

## 样例

启动后默认加载 `src/sample.md`，也可点击 **加载样例**。  
自行编写时参考该文件中的 GFM / 公式 / Mermaid 写法。

## 技术栈

Vite · TypeScript · markdown-it · markdown-it-texmath · KaTeX · Mermaid · highlight.js

## License

MIT
