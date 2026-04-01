#  ChatBot 

Un chatbot con IA real, arquitectura cliente-servidor y personalidad configurable. Construido como proyecto de portafolio para demostrar habilidades en desarrollo fullstack moderno.

🔗 **Demo en vivo:** [https://careerbot-cr.vercel.app](https://careerbot-cr.vercel.app)

---

## ✨ Funcionalidades

-  Chat en tiempo real con IA (LLaMA 3.3 vía Groq)
-  Selector de personalidad: Amigable, Profesional o Técnico
-  Nombre del bot editable desde la interfaz
-  Timestamps en cada mensaje
-  Animación de escritura mientras la IA responde
-  API key protegida en el backend (nunca expuesta al cliente)

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React + Vite |
| Estilos | CSS puro con variables |
| Backend | Node.js + Express |
| IA | Groq API (LLaMA 3.3 70B) |
| Deploy Frontend | Vercel |
| Deploy Backend | Railway |

---

## Arquitectura

```
Usuario
  ↓
React (Vercel)
  ↓  fetch POST /api/chat
Express (Railway)
  ↓  fetch con API key
Groq API → LLaMA 3.3
```

El frontend nunca tiene acceso directo a la API key. Toda comunicación con Groq pasa por el backend.

---

## Correr el proyecto localmente

### Requisitos
- Node.js 18+
- API key de [Groq](https://console.groq.com)

### Frontend

```bash
cd chatbot-portfolio
npm install
```

Crea un archivo `.env`:
```
VITE_GROQ_API_KEY=tu_api_key
```

```bash
npm run dev
```

### Backend

```bash
cd chatbot-portfolio/server
npm install
```

Crea un archivo `.env`:
```
GROQ_API_KEY=tu_api_key
```

```bash
node index.js
```

El frontend corre en `http://localhost:5173` y el backend en `http://localhost:3001`.

---

## Estructura del proyecto

```
chatbot-portfolio/
├── server/
│   ├── index.js        # Servidor Express
│   ├── package.json
│   └── .env            # No incluido en el repo
├── src/
│   ├── App.jsx         # Componente principal del chat
│   ├── App.css         # Estilos del chat
│   ├── main.jsx
│   └── index.css       # Estilos globales
├── .env                # No incluido en el repo
├── index.html
└── package.json
```

---

## Autor

**José Manuel** — Ingeniero en Sistemas, Universidad Fidélitas  
[GitHub](https://github.com/JManu02)