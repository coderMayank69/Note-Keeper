<p align="center">
  <img src="client/src/assets/noteLogo.png" alt="Note-Keeper Logo" width="120" height="120" style="border-radius: 20px;" />
</p>

<h1 align="center">📝 Note-Keeper</h1>

<p align="center">
  <strong>A full-stack MERN notes web-app with Firebase authentication and complete CRUD functionality.</strong>
</p>

<p align="center">
  <a href="https://note-keeper-2-yvyt.onrender.com/">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-Render-orange?style=for-the-badge" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge" alt="PRs Welcome" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
</p>

---

## 🖼️ Preview

<p align="center">
  <img src="screenshots/homepage.png" alt="Note-Keeper Homepage" width="800" style="border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.3);" />
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Google Authentication** | Secure sign-in powered by Firebase Auth — no passwords to remember |
| 📝 **Full CRUD Operations** | Create, read, update, and delete notes with ease |
| 👤 **Per-User Data Isolation** | Each user only sees their own notes — enforced server-side |
| 🎨 **Modern UI** | Clean, responsive interface built with React + Tailwind CSS |
| ⚡ **Blazing Fast Dev** | Vite-powered development with HMR for instant feedback |
| 🐳 **Docker Ready** | One-command deployment with Docker Compose |
| 🚀 **Production Deployed** | Live on Render with Vercel-compatible frontend config |

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Home    │  │  Notes   │  │  Note    │  │  Navbar/     │  │
│  │  Page    │  │  Page    │  │  Page    │  │  Footer      │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────────────┘  │
│       │              │              │                           │
│       └──────────────┴──────────────┘                           │
│                      │                                          │
│           Firebase Auth (Google Sign-In)                        │
│                      │  ID Token                                │
└──────────────────────┼──────────────────────────────────────────┘
                       │  API Requests + Bearer Token
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                       SERVER (Express.js)                        │
│  ┌────────────────┐  ┌─────────────────┐  ┌──────────────────┐  │
│  │ verifyFirebase │  │  Auth Routes    │  │  Note Routes     │  │
│  │ Token (MW)     │──│  POST /google   │  │  GET/POST/PUT/   │  │
│  └────────────────┘  └─────────────────┘  │  DELETE /notes   │  │
│                                            └──────────────────┘  │
│                              │                                    │
│                    Firebase Admin SDK                              │
│                              │                                    │
└──────────────────────────────┼────────────────────────────────────┘
                               │  Mongoose ODM
                               ▼
                    ┌──────────────────────┐
                    │   MongoDB Atlas      │
                    │  ┌──────┐ ┌───────┐  │
                    │  │Users │ │ Notes │  │
                    │  └──────┘ └───────┘  │
                    └──────────────────────┘
```

---

## 📁 Project Structure

```
Note-Keeper/
├── client/                          # React Frontend (Vite)
│   ├── src/
│   │   ├── assets/
│   │   │   ├── noteLogo.png         # App logo / favicon
│   │   │   └── background.jpg       # Hero background image
│   │   ├── component/
│   │   │   ├── Navbar.jsx           # Navigation bar with auth
│   │   │   └── Footer.jsx           # App footer
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page with Google sign-in
│   │   │   ├── Notes.jsx            # Notes dashboard (list + create)
│   │   │   └── Note.jsx             # Single note view/edit
│   │   ├── firebase.js              # Firebase client config
│   │   ├── App.jsx                  # React Router setup
│   │   ├── main.jsx                 # App entry point
│   │   ├── App.css                  # App styles
│   │   └── index.css                # Global styles (Tailwind)
│   ├── index.html                   # HTML entry with favicon
│   ├── package.json                 # Client dependencies
│   ├── tailwind.config.js           # Tailwind configuration
│   ├── vite.config.js               # Vite build config
│   └── eslint.config.js             # ESLint rules
│
├── server/                          # Express.js Backend
│   ├── models/
│   │   ├── note.js                  # Note schema (title, content, timestamps)
│   │   └── user.js                  # User schema (username, email, firebaseId)
│   ├── routes/
│   │   ├── authRoutes.js            # Google auth endpoint
│   │   └── noteRoutes.js            # CRUD endpoints for notes
│   ├── client-build/                # Production React build (served statically)
│   ├── firebaseAdmin.js             # Firebase Admin SDK init
│   ├── verifyFirebaseToken.js       # Auth middleware
│   ├── server.js                    # Express app entry point
│   └── package.json                 # Server dependencies
│
├── Dockerfile                       # Multi-stage Docker build
├── docker-compose.yml               # Docker Compose orchestration
├── vercel.json                      # Vercel deployment config
├── .env.example                     # Environment variable template
├── .gitignore                       # Git ignore rules
└── LICENSE                          # MIT License
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2 | UI library |
| **React Router** | 7.13 | Client-side routing |
| **Tailwind CSS** | 4.1 | Utility-first styling |
| **Vite** | 7.2 | Build tool & dev server |
| **Firebase (Client)** | 12.9 | Google OAuth authentication |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20 (Alpine) | Runtime environment |
| **Express.js** | 5.2 | HTTP server framework |
| **Mongoose** | 9.2 | MongoDB ODM |
| **Firebase Admin** | 13.6 | Server-side token verification |
| **CORS** | 2.8 | Cross-origin resource sharing |
| **UUID** | 13.0 | Unique note identifiers |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| **MongoDB Atlas** | Cloud-hosted database |
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Render** | Production hosting |
| **Vercel** | Frontend deployment (alternative) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.x
- **npm** ≥ 10.x
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Firebase Project** with Google Auth enabled

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/coderMayank69/Note-Keeper.git
cd Note-Keeper
```

### 2️⃣ Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your actual credentials:

```env
# Client-side Firebase config
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Server-side config
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/notekeeper
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

### 3️⃣ Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install --legacy-peer-deps
```

### 4️⃣ Run in Development Mode

**Start the backend:**
```bash
cd server
node server.js
# Server runs on http://localhost:5000
```

**Start the frontend (new terminal):**
```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

---

## 🐳 Docker Deployment

Run the entire stack with a single command:

```bash
# Build and start all services
docker-compose up --build

# App available at http://localhost:5000
```

This spins up:
- 🟢 **App container** — Node.js server serving the React build
- 🟢 **MongoDB container** — Mongo 7 with persistent volume

---

## 🔌 API Reference

All API routes are prefixed with `/api` and require a Firebase Bearer token.

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/google` | Register / login user via Google |

**Headers:** `Authorization: Bearer <firebase_id_token>`

### Notes CRUD

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notes` | Fetch all notes for authenticated user |
| `POST` | `/api/notes` | Create a new note |
| `GET` | `/api/notes/:id` | Fetch a specific note by ID |
| `PUT` | `/api/notes/:id` | Update a note |
| `DELETE` | `/api/notes/:id` | Delete a note |

**Request Body (POST/PUT):**
```json
{
  "title": "My Note Title",
  "content": "The content of my note..."
}
```

**Response (Note Object):**
```json
{
  "_id": "664f...",
  "title": "My Note Title",
  "content": "The content of my note...",
  "user": "664e...",
  "id": "uuid-v4-string",
  "createdAt": "2026-05-06T10:30:00.000Z",
  "updatedAt": "2026-05-06T10:30:00.000Z"
}
```

---

## 🗄️ Database Schema

### User Model
```javascript
{
  username:   { type: String, required: true, unique: true },
  email:      { type: String, required: true, unique: true },
  firebaseId: { type: String, sparse: true, unique: true }
}
```

### Note Model
```javascript
{
  title:     { type: String, required: true },
  content:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  user:      { type: ObjectId, ref: 'User', required: true },
  id:        { type: String, default: uuidv4, unique: true }
}
```

---

## 🔒 Security

- **Firebase Auth** — All API routes are protected by Firebase ID token verification middleware
- **Per-user isolation** — Notes are scoped to the authenticated user's MongoDB `_id`
- **CORS configured** — Origin restricted in production; permissive only in development
- **Environment variables** — Sensitive credentials stored in `.env` (never committed)

---

## 📦 Deployment

### Render (Current)
The app is deployed as a single service on [Render](https://render.com), serving both the Express API and the React static build from the same container.

🔗 **Live:** [https://note-keeper-2-yvyt.onrender.com/](https://note-keeper-2-yvyt.onrender.com/)

### Vercel (Frontend Alternative)
A `vercel.json` is included for deploying the React frontend separately on Vercel, with API rewrites proxying to your backend URL.

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Mayank Singh**

- GitHub: [@coderMayank69](https://github.com/coderMayank69)

---

<p align="center">
  <img src="client/src/assets/noteLogo.png" alt="Note-Keeper" width="40" />
  <br />
  <em>Built with ❤️ using the MERN Stack</em>
</p>
