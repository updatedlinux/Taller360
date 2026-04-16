# Insular Casa de Cambio

Sitio web corporativo de Insular Casa de Cambio, casa de cambio autorizada por SUDEBAN con sede en Caracas, Venezuela. Desarrollado con React, TypeScript y Vite.

**Sitio en produccion:** [insularcasadecambio.com](https://insularcasadecambio.com)

---

## Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm (incluido con Node.js)

## Inicio Rapido

```bash
# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

La aplicacion estara disponible en `http://localhost:5173`.

## Compilacion y Vista Previa

```bash
# Compilar para produccion
npm run build

# Vista previa de la compilacion de produccion
npm run preview
```

Los archivos compilados se generan en el directorio `dist/`.

## Despliegue

Este proyecto se despliega en hosting compartido de GoDaddy mediante FTP. El despliegue es automatico a traves de GitHub Actions al hacer push a la rama `godaddy-deployment`.

Consulte [GODADDY-DEPLOYMENT.md](GODADDY-DEPLOYMENT.md) para instrucciones completas, incluyendo:

- Configuracion de credenciales FTP
- Configuracion de GitHub Secrets
- Pasos para despliegue manual
- Solucion de problemas

## Estructura del Proyecto

```
src/
├── api/                # Datos de tasas de cambio (integracion API BCV)
├── app/                # Componente raiz y layout de la aplicacion
├── components/         # Componentes de interfaz reutilizables
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
├── pages/              # Componentes de pagina (rutas)
│   ├── Home/
│   ├── Conocenos/
│   ├── Servicios/
│   ├── Aliados/
│   ├── Contacto/
│   ├── Legal/
│   └── KnowledgeBase/
├── styles/             # Estilos globales y tokens de diseno
│   ├── globals.css
│   ├── variables.css
│   └── typography.css
├── types/              # Definiciones de tipos TypeScript
├── utils/              # Funciones utilitarias (animaciones, helpers)
├── main.tsx            # Punto de entrada de la aplicacion
└── router.tsx          # Configuracion de React Router
```

## Stack Tecnologico

| Tecnologia | Proposito |
|---|---|
| [React 19](https://react.dev/) | Framework de interfaz |
| [TypeScript](https://www.typescriptlang.org/) | Tipado estatico |
| [Vite 5](https://vite.dev/) | Herramienta de compilacion y servidor de desarrollo |
| [React Router 7](https://reactrouter.com/) | Enrutamiento del lado del cliente |
| [GSAP](https://gsap.com/) | Animaciones activadas por scroll |
| [Swiper](https://swiperjs.com/) | Carruseles de galeria de imagenes |
| [Lucide React](https://lucide.dev/) | Libreria de iconos |
| [React Helmet Async](https://github.com/staylor/react-helmet-async) | Meta tags para SEO |

## Acceso para Desarrolladores

Para contribuir a este proyecto:

1. **Solicitar acceso** — Pida al propietario del repositorio que lo agregue como colaborador en GitHub (Settings > Collaborators > Add).
2. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd insular-cambios
   npm install
   ```
3. **Crear una rama de trabajo:**
   ```bash
   git checkout -b feature/nombre-de-su-funcionalidad
   ```
4. **Subir sus cambios:**
   ```bash
   git push origin feature/nombre-de-su-funcionalidad
   ```
5. **Desplegar** — Fusione en la rama `godaddy-deployment` para activar un despliegue automatico a produccion.

### GitHub Secrets (requeridos para el despliegue)

El propietario del repositorio debe configurar estos secretos en GitHub (Settings > Secrets and variables > Actions):

| Secreto | Descripcion |
|---|---|
| `FTP_SERVER` | Direccion del servidor FTP de GoDaddy |
| `FTP_USERNAME` | Nombre de usuario FTP de GoDaddy |
| `FTP_PASSWORD` | Contrasena FTP de GoDaddy |

## Licencia

Todos los derechos reservados. Insular Casa de Cambio, 2025.
