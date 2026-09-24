<div align="center">

# ☕ Baleno Cinematic Digital Menu
### Luxury Digital Dining Experience & Interactive Café Menu Platform

[![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/UI-shadcn%2Fui-black?style=for-the-badge)](https://ui.shadcn.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellowgreen?style=for-the-badge)](LICENSE)
[![Author](https://img.shields.io/badge/Author-Omar%20Alfarouk-orange?style=for-the-badge&logo=github&logoColor=white)](https://github.com/OmarAlfar0uk)

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-system-architecture">System Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-author">Author</a>
</p>

</div>

---

## 📌 Executive Overview

**Baleno Cinematic Digital Menu** is an ultra-premium, interactive digital menu and order management experience created for high-end cafés, bistros, and restaurants. Featuring smooth cinematic transitions, dynamic category filtering, interactive product modals, and an integrated **Admin Portal** for real-time inventory and pricing management, it transforms physical dining into an immersive digital journey.

> [!NOTE]
> Built with **React 18**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui** components, optimized with **Vite** for sub-second page loads and seamless mobile responsiveness.

---

## ✨ Key Features

| ⚡ Feature | 💡 Description | 🛠 Engineering & UX Detail |
|---|---|---|
| **🎬 Cinematic Curtain Opening** | Elegant grand opening animation when launching the menu | Smooth CSS transitions and stateful intro sequence |
| **🛍️ Floating Cart & Drawer** | Persistent order drawer with item counter and real-time total | Slide-over drawer with instant recalculations |
| **🔍 Interactive Product Modal** | Detailed item descriptions, ingredients, allergens, and photos | Accessible Radix UI Dialog with smooth backdrop blur |
| **⚙️ Admin Dashboard** | Full backoffice management for categories, menu items, and prices | Secure admin gate with CRUD controls and reports |
| **📱 Mobile-First Responsive** | Optimized touch targets, smooth swipe navigation, and dark mode | Tailwind CSS utility-first responsive layout |
| **🧪 End-to-End Testing** | Automated UI verification with Playwright | Robust test coverage for ordering flows and navigation |

---

## 🏛 System Architecture

```mermaid
flowchart TD
    subgraph Client["🖥️ Consumer Experience"]
        Curtain["🎬 Opening Curtain"] --> Hero["🌟 Hero & Brand Story"]
        Hero --> MenuNav["📑 Category Navigation"]
        MenuNav --> MenuGrid["🍽️ Menu Sections & Cards"]
        MenuGrid --> Modal["🔍 Product Details Modal"]
        MenuGrid --> Cart["🛍️ Floating Cart & Drawer"]
    end

    subgraph AdminPortal["🛠️ Administration Portal"]
        AdminGate["🔐 Admin Authentication Gate"]
        Dashboard["📊 Admin Dashboard"]
        ItemsMgr["🍕 Menu Items CRUD"]
        CatMgr["📁 Categories Manager"]
        Reports["📈 Sales & Order Reports"]

        AdminGate --> Dashboard
        Dashboard --> ItemsMgr
        Dashboard --> CatMgr
        Dashboard --> Reports
    end

    subgraph Serverless["⚡ Netlify Serverless API"]
        AuthAPI["api/admin/login"]
        ContentAPI["api/site-content"]
        PublishAPI["api/admin/publish"]
    end

    AdminPortal --> Serverless
```

---

## ⚡ Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | ![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | Component architecture and type-safe UI logic |
| **Build & Tooling** | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | Blazing-fast HMR and bundle optimization |
| **Styling & Components**| ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-black?style=flat-square) | Modern aesthetic design tokens and accessible primitives |
| **Testing** | ![Playwright](https://img.shields.io/badge/Playwright-E2E-orange?style=flat-square) ![Vitest](https://img.shields.io/badge/Vitest-Unit-yellowgreen?style=flat-square) | End-to-end user journey and component testing |
| **Serverless API** | ![Netlify](https://img.shields.io/badge/Netlify-Functions-00C7B7?style=flat-square&logo=netlify&logoColor=white) | Lightweight serverless endpoints for administrative actions |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js 18+](https://nodejs.org/) or [Bun](https://bun.sh/)

### Installation & Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/OmarAlfar0uk/baleno-cinematic-menu-main.git
   cd baleno-cinematic-menu-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or with bun: bun install
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:5173` in your browser.

4. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 👨‍💻 Author

**Omar Alfarouk**  
*Full-Stack .NET & Software Engineer*  

- 🌐 **GitHub:** [@OmarAlfar0uk](https://github.com/OmarAlfar0uk)
- 💼 **LinkedIn:** [omar-alfarouk](https://www.linkedin.com/in/omar-alfarouk-252471251/)
- 📧 **Email:** [omaralfarouk646@gmail.com](mailto:omaralfarouk646@gmail.com)

---

<div align="center">
  <sub>Built with ❤️ by Omar Alfarouk. Licensed under the <a href="LICENSE">MIT License</a>.</sub>
</div>
