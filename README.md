# 🖼️ image-processor-web

> A pure client-side web tool for image optimization, compression, and format conversion — all in your browser, no server required.
> 基于纯浏览器端的图像处理工具，支持压缩、优化与格式转换，无需服务器即可完成。

🌐 **Live Demo:** [img.geo4ai.com](https://img.geo4ai.com)

---

## 🧱 Project Structure / 目录结构

```text
app/                    # App Router 页面与布局
  layout.tsx            # 根布局
  page.tsx              # 首页：集成图片上传、压缩/转换、生成器入口
components/             # 组件
  compression-controls.tsx
  download-manager.tsx
  favicon-generator.tsx
  format-converter.tsx
  image-preview.tsx
  image-uploader.tsx
  og-image-generator.tsx
  webp-converter.tsx
  ui/                   # 基于 shadcn/ui 的 UI 组件
lib/                    # 业务逻辑与工具函数
  image-processing.ts   # 核心图像处理逻辑（压缩、转换等）
  download-manager.ts   # 下载与打包处理
  utils.ts
public/                 # 静态资源
styles/                 # 全局样式（Tailwind 4）
next.config.mjs         # Next.js 配置（忽略构建 ESLint/TS 错误、images.unoptimized）
postcss.config.mjs      # 使用 @tailwindcss/postcss（Tailwind v4）
```

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
git clone https://github.com/your-username/image-processor-web.git
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

```bash
yarn build
```

Deploy to **Cloudflare Pages** → set **Build Command** = `yarn build` & **Output Directory** = `.next`

Notes / 说明：

* 本项目为纯前端（无后端接口），`next.config.mjs` 中 `images.unoptimized = true`，无需 Next Image 优化服务。
* 若使用 Cloudflare Pages 原生 Next.js 支持，请确保不依赖 SSR/边缘函数；本项目以客户端渲染为主。

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

* 🌍 Main site: [geo4ai.com](https://geo4ai.com)
* 🛠 Tools subdomain: [img.geo4ai.com](https://img.geo4ai.com)

---
