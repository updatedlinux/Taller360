# Taller360

Corporate website for Taller360, a SUDEBAN-authorized currency exchange house based in Caracas, Venezuela. Built with React, TypeScript, and Vite.

**Live site:** [taller360.local](https://taller360.local)

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (included with Node.js)

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`.

## Build & Preview

```bash
# Production build
npm run build

# Preview the production build locally
npm run preview
```

The built files are output to the `dist/` directory.

## Deployment

This project deploys to GoDaddy shared hosting via FTP. Deployment is automated through GitHub Actions when pushing to the `godaddy-deployment` branch.

See [GODADDY-DEPLOYMENT.md](GODADDY-DEPLOYMENT.md) for full setup instructions, including:

- FTP credentials configuration
- GitHub Secrets setup
- Manual deployment steps
- Troubleshooting

## Project Structure

```
src/
├── api/                # Exchange rate data (BCV API integration)
├── app/                # Root application component and layout
├── components/         # Reusable UI components
│   ├── Accordion/
│   ├── AnimatedButton/
│   ├── AnimatedLogo/
│   ├── Card/
│   ├── Carousel/
│   ├── ChatDrawer/
│   ├── CountryList/
│   ├── CTAButton/
│   ├── Footer/
│   ├── Header/
│   ├── ImageGallerySlider/
│   ├── InsaChatbot/
│   ├── MapModal/
│   ├── Modal/
│   ├── PartnersMarquee/
│   ├── RateCards/
│   ├── SEO/
│   └── Section/
├── pages/              # Route-level page components
│   ├── Home/
│   ├── Conocenos/
│   ├── Servicios/
│   ├── Aliados/
│   ├── Contacto/
│   ├── Legal/
│   └── KnowledgeBase/
├── styles/             # Global styles and design tokens
│   ├── globals.css
│   ├── variables.css
│   └── typography.css
├── types/              # TypeScript type definitions
├── utils/              # Utility functions (animations, helpers)
├── main.tsx            # Application entry point
└── router.tsx          # React Router configuration
```

## Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Vite 5](https://vite.dev/) | Build tool and dev server |
| [React Router 7](https://reactrouter.com/) | Client-side routing |
| [GSAP](https://gsap.com/) | Scroll-triggered animations |
| [Swiper](https://swiperjs.com/) | Image gallery carousels |
| [Lucide React](https://lucide.dev/) | Icon library |
| [React Helmet Async](https://github.com/staylor/react-helmet-async) | SEO meta tags |

## Developer Access

To contribute to this project:

1. **Request access** — Ask the repository owner to add you as a collaborator on GitHub (Settings > Collaborators > Add).
2. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd insular-cambios
   npm install
   ```
3. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Push your changes:**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Deploy** — Merge into `godaddy-deployment` to trigger an automatic deployment to production.

### GitHub Secrets (required for deployment)

The repository owner must configure these secrets in GitHub (Settings > Secrets and variables > Actions):

| Secret | Description |
|---|---|
| `FTP_SERVER` | GoDaddy FTP server address |
| `FTP_USERNAME` | GoDaddy FTP username |
| `FTP_PASSWORD` | GoDaddy FTP password |

## License

All rights reserved. Taller360, 2025.
