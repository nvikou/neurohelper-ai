# NeuroHelper

AI assistant that generates day plans, checklists, templates, and ideas using OpenAI models. Built with a React/TypeScript frontend and a FastAPI backend, ready to run with Docker.

**Repository:** [nvikou/neurohelper-ai](https://github.com/nvikou/neurohelper-ai)

---

## Features

- Structured **day plans** with priorities and timing
- Actionable **task checklists**
- Ready-to-use **text templates**
- **Idea generation** for study and work
- Real-time **streaming** responses from OpenAI
- Model selection and chat history in the UI
- Single-container deployment via Docker Compose

---

## Tech Stack

| Layer          | Technologies                          |
|----------------|---------------------------------------|
| Frontend       | React 18, TypeScript, Vite, Tailwind CSS |
| Backend        | FastAPI, Uvicorn, Pydantic, OpenAI SDK |
| Infrastructure | Docker, Docker Compose                |

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- An [OpenAI API key](https://platform.openai.com)

---

## Quick Start

### 1. Configure environment

Copy the example file and edit your secrets:

```bash
cp .env.example .env
```

```env
OPENAI_API_KEY=sk-your-openai-api-key
SESSION_SECRET=your-session-secret
PUBLIC_PORT=8080
```

Replace `OPENAI_API_KEY` with your real key and set a strong random `SESSION_SECRET`.

### 2. Build and run

```bash
docker compose up -d --build
```

### 3. Open the app

Go to [http://localhost:8080](http://localhost:8080)

### 4. Stop the app

```bash
docker compose down
```

---

## Configuration

| Variable         | Description                        | Default |
|------------------|------------------------------------|---------|
| `OPENAI_API_KEY` | OpenAI API key (required)          | —       |
| `SESSION_SECRET` | Secret for session cookies         | —       |
| `PUBLIC_PORT`    | Host port mapped to the container  | `8080`  |

To change the port, update `PUBLIC_PORT` in `.env`, then restart:

```bash
docker compose up -d
```

---

## Project Structure

```
.
├── backend/                 # FastAPI application
│   ├── app.py               # API routes and app entry
│   ├── models.py            # Pydantic models
│   ├── neuro_helper.py      # System prompt and OpenAI client
│   ├── openai_client.py     # OpenAI client helpers
│   └── requirements.txt     # Python dependencies
├── frontend/                # React + TypeScript UI
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── App.tsx          # Main application
│   │   └── api.ts           # API client
│   ├── package.json
│   └── vite.config.ts
├── compose.yaml             # Docker Compose config
├── Dockerfile               # Multi-stage production image
├── .env.example             # Environment template
└── README.md
```

---

## Development Notes

**Python dependencies** — add packages to `backend/requirements.txt`, then rebuild:

```bash
docker compose up -d --build
```

**Frontend dependencies** — install locally, then rebuild the image:

```bash
cd frontend
npm install <package-name>
```

**Logs:**

```bash
docker compose logs -f
```

---

## Troubleshooting

| Issue                    | Solution                                              |
|--------------------------|-------------------------------------------------------|
| Docker will not start    | Ensure Docker Desktop is running                      |
| API key / auth errors    | Check `OPENAI_API_KEY` in `.env`                      |
| Port already in use      | Change `PUBLIC_PORT` in `.env` and restart            |
| Container crashes        | Inspect logs with `docker compose logs -f`            |

---

## License

This project is provided for educational and demonstration purposes.

## Contributing

Issues and pull requests are welcome.
