# Baleno Cinematic Menu

![Language](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Framework](https://img.shields.io/badge/Framework-React%2018-61DAFB?style=for-the-badge&logo=react&logoColor=black)

A cinematic restaurant menu web app with an animated opening curtain, floating cart, product details modal, real-time order management, and a full admin dashboard.

## Features
- Animated UI components (Opening Curtain, Floating Cart)
- Menu browsing and product details modal
- Admin dashboard (Categories, Menu Items, Orders, Reports, Settings)
- Netlify serverless functions integration
- GitHub-based content management via Decap CMS

## Tech Stack
| Technology | Description |
|---|---|
| React 18 & TypeScript | Frontend UI |
| Vite 5 | Build Tool |
| Tailwind CSS 3 & shadcn/ui | Styling & Components |
| Framer Motion 12 | Animations |
| Zustand 5 & TanStack Query 5 | State & Data Management |
| React Router DOM 6 | Routing |
| Vitest & Playwright | Testing |

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/OmarAlfar0uk/baleno-cinematic-menu-main.git
   ```
2. Install dependencies (supports npm or bun):
   ```bash
   npm install
   # or
   bun install
   ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   bun dev
   ```

## Project Structure
- `api/`: Netlify serverless functions
- `public/admin/`: Decap CMS configuration
- UI Components: `AboutStrip`, `CartDrawer`, `FloatingCart`, `MenuCard`, `OpeningCurtain`, etc.
- Admin Components: `AdminDashboard`, `AdminOrders`, `AdminSettings`, etc.

## Author
- GitHub: [OmarAlfar0uk](https://github.com/OmarAlfar0uk)
- LinkedIn: [omar-alfarouk-252471251](https://www.linkedin.com/in/omar-alfarouk-252471251/)
- Email: omaralfarouk646@gmail.com
