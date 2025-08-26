# 🖼️ image-processor-web

> A pure client-side web tool for image optimization, compression, and format conversion — all in your browser, no server required.
> 基于纯浏览器端的图像处理工具，支持压缩、优化与格式转换，无需服务器即可完成。

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare_Pages-orange)](https://pages.cloudflare.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Stars](https://img.shields.io/github/stars/Duri686/image-processor-web?style=social&logo=github&cacheSeconds=300)](https://github.com/Duri686/image-processor-web)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Duri686/image-processor-web)

🌐 **Live Demo:** [img.geo4ai.com](https://img.geo4ai.com)

---

## 📜 Scripts / 脚本说明（来自 `package.json`）

```jsonc
{
  "dev": "next dev",        // 本地开发，默认 http://localhost:3000
  "build": "next build",    // 生产构建
  "start": "next start",    // 生产启动（需先 build）
  "lint": "next lint"       // 代码检查
}
```

## ⚠️ Peer Deps 提示

使用 Yarn PnP + React 19，部分依赖标注了 React 18 的 peer 要求，Yarn 可能给出非阻断性警告（non-overlapping ranges）。功能不受影响；若需消除警告，可关注这些库的后续版本或锁定兼容范围。

## ✨ Features / 功能特性

* 📥 **Upload & Preview** – Drag & drop or select images for instant preview
* ⚡ **Compression** – Adjustable quality, reduce file size in real time
* 🔄 **Format Conversion** – Convert images to **WebP/PNG/JPEG**
* 🖼️ **Favicon Generator** – Create `16x16` / `32x32` PNG favicon
* 📰 **OG Image Generator** – Simple background + text overlay for social sharing
* 💻 **Pure Client-side** – Runs 100% in your browser, no server required

---

## 🛠 Tech Stack / 技术栈

* [Next.js 15 (App Router)](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) for UI
* [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) + [browser-image-compression](https://www.npmjs.com/package/browser-image-compression)
* [Cloudflare Pages](https://pages.cloudflare.com/) for deployment

---

## 🚀 Getting Started / 快速开始

### 0. Prerequisites / 环境要求

* Node.js 18+（推荐 20+）
* Yarn 4（已使用 Yarn PnP）
  * 首次使用可执行：`corepack enable && corepack prepare yarn@stable --activate`
  * 若 IDE 无法识别依赖，请启用 Yarn PnP 支持或使用 SDK 提示

### 1. Clone the repo

```bash
git clone https://github.com/Duri686/image-processor-web.git
cd image-processor-web
```

### 2. Install dependencies

```bash
# 推荐使用 Yarn（若首次使用，可先启用 Corepack）
# corepack enable && corepack prepare yarn@stable --activate
yarn install
```

### 3. Run locally

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build & Deploy

本项目推荐使用 **Cloudflare Pages + @cloudflare/next-on-pages** 部署 / Deploy with Cloudflare Pages + next-on-pages：

* Build Command / 构建命令：

```bash
npx @cloudflare/next-on-pages@1
```

* Output Directory / 输出目录：

```text
.vercel/output/static
```

* Runtime Compatibility Flag / 运行时兼容标志：在 Pages 控制台 Settings → Functions/Runtime 中为 Production/Preview 添加：
  * `nodejs_compat`（若列表无此项，可选择 `node` 宏标志）

Notes / 说明：

* 本项目为纯前端（无后端接口），`next.config.mjs` 中 `images.unoptimized = true`。
* 已在仓库加入 `wrangler.toml` 声明 `compatibility_flags = ["nodejs_compat"]`（建议在控制台也开启）。

#### Other scripts / 其他脚本

```bash
# Lint
yarn lint

# Production start (after build)
yarn start
```

---

## 📸 Screenshots / 界面预览

> （这里可以放几张工具运行截图，比如上传界面、压缩对比图、favicon 导出结果）

---

## 📦 Roadmap / 未来规划

* [ ] 支持 AVIF 格式
* [ ] 批量处理 / zip 导出
* [ ] 图像裁剪 / 水印功能
* [ ] 更丰富的 OG 图模板

---

## 🤝 Contributing / 参与贡献

PRs and issues are welcome!
欢迎通过 PR 或 Issue 一起改进项目。

---

## 📄 License

[MIT License](LICENSE)

---

## 🔗 Related

* 🌍 Main site / 主站: [geo4ai.com](https://geo4ai.com)
* 🛠 Tools subdomain / 工具域名: [img.geo4ai.com](https://img.geo4ai.com)

---
