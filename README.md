# 🧠 NeuroHelper

Generate plans, checklists, templates, and ideas in seconds using OpenAI models (GPT-4, GPT-3.5, etc.), with a React frontend and FastAPI backend.

---

## 📋 Prerequisites

- Docker Desktop installed and running
- OpenAI API key (get one at https://platform.openai.com)

---

## 🚀 Installation & Quick Start

### 1. Configuration

Create or edit the `.env` file at the root of the project:

```
OPENAI_API_KEY=sk-your-openai-api-key
SESSION_SECRET=your-session-secret
PUBLIC_PORT=8080
```
> **Important:** Replace `sk-your-openai-api-key` with your real OpenAI API key.

### 2. Build & Run

```bash
docker compose up -d --build
```

### 3. Access the App

Open your browser and go to: [http://localhost:8080](http://localhost:8080)

### 4. Stop the App

```bash
docker compose down
```

---

## ✨ Features

- 📅 **Day plans** with time
- ✅ **Task checklists**
- 📝 **Text templates**
- 💡 **Ideas** for work/study
- Real-time response streaming

---

## 📁 Project Structure

```
.
├── backend/              # FastAPI backend (Python)
│   ├── app.py           # Main application
│   ├── models.py        # Pydantic data models
│   ├── neuro_helper.py  # System prompt and OpenAI client
│   ├── openai_client.py # OpenAI client initialization
│   └── requirements.txt # Python dependencies
├── frontend/            # React + TypeScript frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.tsx      # Main app
│   │   └── api.ts       # API client
│   ├── package.json
│   └── vite.config.ts
├── compose.yaml         # Docker Compose configuration
├── Dockerfile           # Multi-stage Docker image
├── .env                 # Environment variables (to create)
├── .env.example         # Example environment file
└── README.md
```

---

## 🛠️ Technologies Used

### Backend
- **FastAPI** — Modern, fast web framework
- **Uvicorn** — ASGI server
- **OpenAI Python SDK** — Official OpenAI client
- **Pydantic** — Data validation

### Frontend
- **React 18** — UI library
- **TypeScript** — Static typing
- **Vite** — Modern build tool
- **Tailwind CSS 4** — Utility-first CSS framework

### Infrastructure
- **Docker** — Containerization
- **Docker Compose** — Multi-container orchestration

---

## 🔧 Advanced Configuration

### Change the port

Edit the `PUBLIC_PORT` variable in your `.env` file:

```
PUBLIC_PORT=3000
```

### Add Python dependencies

Add them to `backend/requirements.txt` and rebuild:

```bash
docker compose up --build
```

### Add npm dependencies

```bash
cd frontend
npm install package-name
```
Then rebuild the Docker image.

---

## 🐛 Troubleshooting

- **Docker won't start:** Make sure Docker Desktop is running (whale icon in the system tray).
- **API key error:** Ensure your `OPENAI_API_KEY` is correct in the `.env` file.
- **Port already in use:** Change `PUBLIC_PORT` in `.env`.
- **View logs:**
	```bash
	docker compose logs -f
	```

---

## 📝 License

This project is provided for educational purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or pull request.

Developed with ❤️ using OpenAI, React, and FastAPI.
