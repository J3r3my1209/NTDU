## DESCRIPCION
Este proyecto consiste en una aplicación web desarrollada en React con JavaScript para la materia de Aplicaciones Web, cuyo objetivo es ayudar a los usuarios a organizar sus finanzas personales mediante el registro de ingresos y gastos, su categorización y la visualización de balances para comprender en qué se utiliza el dinero y mejorar la toma de decisiones; incluye funcionalidades como registro de usuario, inicio de sesión, gestión de ingresos y gastos, reportes básicos y una estructura organizada en componentes, páginas, servicios y estilos, además de permitir su ejecución localcon proyección a futuras mejoras como gráficos interactivos, exportación de reportes y notificaciones, y está desarrollado por Alejandro Favara, Jeremy Vivas y Alex Perugachi como un proyecto académico de uso educativo.



## Tecnologías
- **Frontend:** React
- **Backend:** Node.js
- **Base de Datos:** Supabase (PostgreSQL)
- **Autenticación:** Firebase

## Estructura del Proyecto
- `/frontend`: Interfaz de usuario.
- `/backend`: Lógica del servidor y API.

# No Tan De Una (NTDU) - Gestión de Finanzas Personales

**Notan de Una** es una aplicación web moderna diseñada para ayudarte a tomar el control total de tu dinero. Registra ingresos, gastos y visualiza tu balance en tiempo real con una interfaz limpia y eficiente.

---

## ✨ Características Principales
*   **Autenticación Segura:** Acceso mediante correo electrónico o vinculación directa con **Google (Gmail)** a través de Firebase.
*   **Gestión de Movimientos:** Registro detallado de ingresos y gastos.
*   **Interfaz Adaptable:** Diseño responsive y moderno construido con Tailwind CSS.
*   **Perfil Personalizado:** Visualización del nombre y foto del usuario logueado.

## 🛠️ Tecnologías Utilizadas

| Capa | Tecnología |
| :--- | :--- |
| **Frontend** | React.js & Tailwind CSS |
| **Autenticación** | Firebase Auth (Email & Google Sync) |
| **Base de Datos** | Supabase (PostgreSQL) |
| **Enrutado** | React Router Dom |

---

## 📂 Estructura del Proyecto

```text
├── frontend/             # Interfaz de usuario (React)
│   ├── src/
│   │   ├── components/   # Componentes reutilizables (Navbar, etc.)
│   │   ├── config/       # Configuración de Firebase y Supabase
│   │   └── pages/        # Vistas principales (Login, Register, Home)
├── backend/              # Lógica del servidor y API
└── Mockups/              # Diseños y prototipos del proyecto
