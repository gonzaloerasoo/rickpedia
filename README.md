# 🧠 RickPedia — Explorador del Multiverso

RickPedia es una aplicación web desarrollada en **Angular** que permite explorar, filtrar y gestionar personajes, episodios, localizaciones y tu equipo personalizado del universo de *Rick and Morty*.  
El proyecto combina un **frontend SPA** con Angular y un **backend en Node/Express** para la gestión del equipo.

---

## 🚀 Tecnologías utilizadas

### Frontend
- **Angular**: framework principal para construir la SPA.
- **TypeScript**: tipado estricto para mayor control y escalabilidad.
- **SCSS**: estilos modulares y reutilizables con animaciones y coherencia visual.
- **Angular Material**: componentes UI (inputs, botones, spinner).
- **RxJS**: programación reactiva para manejar datos y asincronía.
- **Angular Router**: navegación entre vistas.

### Backend
- **Node.js + Express**: servidor ligero para exponer la API del equipo.
- **REST API**: operaciones CRUD sobre `/api/team`.
- **Localhost**: ejecutado en `http://localhost:3000/api/team`.

### Datos
- **API pública Rick and Morty**: fuente dinámica para personajes, episodios y localizaciones.

---

## ⚙️ Funcionalidades principales

- **Listado de personajes**: búsqueda por nombre, filtros por especie y estado, paginación.
- **Vista de detalle**: información completa y acciones con botones circulares (añadir/quitar equipo, volver).
- **Equipo personalizado (Team)**:
  - Añadir, editar y eliminar miembros.
  - Filtros por alias, especie y estado.
  - Paginación y mensajes de “no hay resultados”.
- **Filtros con panel lateral**:
  - Apertura/cierre animado (`slideIn`).
  - Inputs con overlays estáticos.
  - Control de foco y blur.
- **Mensajes de estado**:
  - Spinner de carga.
  - Confirmaciones (`.confirmation`).
  - Mensajes `.no-results` con animación `fadeIn`.
- **Paginación uniforme**:
  - Botones con estado activo/disabled.
  - Transiciones suaves y coherentes.
- **Diálogos de edición/creación**:
  - Apertura desde tarjetas del equipo.
- **Navegación clara**:
  - Rutas entre listados y detalle.
  - Botón “volver” consistente.

---

## 🎨 Diseño y experiencia

- **Fondo estelar** con textura y degradado radial.
- **Botones circulares** con sombra, hover y colores (accent, warn, back).
- **Tarjetas de personaje** con imagen grande, nombre, meta, origen/fecha y acciones.
- **Panel de filtros** con animación lateral.
- **Mensajes animados** (`fadeIn`) para feedback visual.
- **Paginación** con botones contorneados en cian y estado activo resaltado.

---

## 📦 Estructura del proyecto

- `characters-list` → listado con filtros y paginación.
- `characters-detail` → detalle con acciones y estilos propios.
- `team-list` → gestión del equipo con panel de filtros, tarjetas y paginación.
- `locations-list` / `episodes-list` → exploración por dimensión o capítulo.
- `shared` → componentes comunes (spinner, tarjetas, paginación, estilos reutilizables).
- `backend` → servidor Node/Express con rutas para `/api/team`.

---

## 🧪 Cómo ejecutar el proyecto

### Frontend (Angular)

```bash
npm install
ng serve
```

La app se ejecuta en:

```
http://localhost:4200
```

### Backend (Node/Express)

```bash
npm install
npm run start
```

El backend expone la API en:

```
http://localhost:3000/api/team
```

Aquí se gestionan las operaciones del equipo (añadir, eliminar, editar personajes).

---

## 📖 Mini glosario

- **SPA (Single Page Application):** aplicación web que carga una sola página y actualiza dinámicamente el contenido.
- **SCSS:** extensión de CSS que permite variables, anidamiento y reutilización de estilos.
- **RxJS:** librería para programación reactiva, usada en Angular para manejar datos asíncronos.
- **Angular Material:** conjunto de componentes UI listos para usar con Angular.
- **API REST:** interfaz que permite comunicación entre frontend y backend mediante peticiones HTTP.
- **CRUD:** operaciones básicas de datos: Create, Read, Update, Delete.
- **Overlay estático:** texto fijo que aparece sobre un input cuando está enfocado o vacío.
- **FadeIn/SlideIn:** animaciones CSS usadas para mostrar elementos suavemente.
- **Backend local:** servidor Node/Express que corre en `localhost:3000` para gestionar tu equipo.

---

## 🗂️ Arquitectura del proyecto

```
Frontend (Angular) ----> API Rick and Morty (datos públicos)
        |
        |----> Backend (Node/Express en localhost:3000/api/team)
```

- El **frontend** consume tanto la API pública como el backend propio.
- El **backend** gestiona el equipo personalizado y expone endpoints REST.
- Todo se ejecuta en local, con comunicación vía HTTP.

---

## ✨ Autor

Proyecto desarrollado por **Gonzalo Eraso Lorenzo** — optimizado para coherencia visual, control manual y rendimiento, con estilos replicables y comportamiento consistente entre componentes.
