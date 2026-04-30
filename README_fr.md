# Ai-chat-app-react-fastapi

## Chat Application avec OpenAI

Application web de chat utilisant les modèles OpenAI (GPT-4, GPT-3.5, etc.) avec une interface React moderne et un backend FastAPI.

---

## 📋 Prérequis
- Docker Desktop installé et en cours d'exécution
- Clé API OpenAI (obtenir sur https://platform.openai.com)

## 🚀 Installation et Démarrage

### 1. Configuration
Créez ou modifiez le fichier `.env` à la racine du projet :

```
OPENAI_API_KEY=sk-votre-clé-api-openai
SESSION_SECRET=votre-clé
PUBLIC_PORT=8080
```

> **Important :** Remplacez `sk-votre-clé-api-openai` par votre vraie clé API OpenAI.

### 2. Lancement de l'application

```bash
# Construction et démarrage des conteneurs
docker-compose up --build

# Ou simplement (si déjà construit)
docker-compose up
```

### 3. Accès à l'application
Ouvrez votre navigateur et accédez à : http://localhost:8080

### 4. Arrêt de l'application

```bash
# Arrêt propre
docker-compose down

# Ou Ctrl+C dans le terminal
```

---

## 📁 Structure du Projet

```
.
├── backend/              # Backend FastAPI (Python)
│   ├── app.py           # Application principale
│   ├── models.py        # Modèles de données Pydantic
│   ├── neuro_helper.py  # Prompt système et client OpenAI
│   └── requirements.txt # Dépendances Python
├── frontend/            # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/  # Composants React
│   │   ├── App.tsx      # Application principale
│   │   └── api.ts       # Client API
│   ├── package.json
│   └── vite.config.ts
├── compose.yaml         # Configuration Docker Compose
├── Dockerfile           # Image Docker multi-stage
├── .env                 # Variables d'environnement (à créer)
└── README.md
```

---

## 🛠️ Technologies Utilisées

### Backend
- FastAPI — Framework web moderne et rapide
- Uvicorn — Serveur ASGI
- OpenAI Python SDK — Client officiel OpenAI
- Pydantic — Validation de données

### Frontend
- React 18 — Bibliothèque UI
- TypeScript — Typage statique
- Vite — Build tool moderne
- Tailwind CSS 4 — Framework CSS utilitaire

### Infrastructure
- Docker — Conteneurisation
- Docker Compose — Orchestration multi-conteneurs

---

## ✨ Fonctionnalités
- ✅ Chat en temps réel avec streaming SSE (Server-Sent Events)
- ✅ Support de plusieurs modèles OpenAI (GPT-4, GPT-3.5, etc.)
- ✅ Gestion de conversations multiples
- ✅ Personnalisation du prompt système
- ✅ Sessions utilisateur persistantes
- ✅ Interface moderne et responsive
- ✅ Déploiement en un seul conteneur

---

## 🔧 Configuration Avancée

### Changer le port
Modifiez la variable `PUBLIC_PORT` dans le fichier `.env` :

```
PUBLIC_PORT=3000
```

### Ajouter des dépendances Python
Ajoutez-les dans `backend/requirements.txt` et reconstruisez :

```bash
docker-compose up --build
```

### Ajouter des dépendances npm

```bash
cd frontend
npm install nom-du-package
```
Puis reconstruisez l'image Docker.

---

## 🐛 Dépannage

- **Docker ne démarre pas** : Vérifiez que Docker Desktop est bien démarré (icône dans la barre des tâches).
- **Erreur de clé API** : Assurez-vous que votre `OPENAI_API_KEY` est correcte dans le fichier `.env`.
- **Port déjà utilisé** : Si le port 8080 est utilisé, changez `PUBLIC_PORT` dans `.env`.
- **Logs de l'application** :

```bash
docker-compose logs -f
```

---

## 📝 License
Ce projet est fourni à titre éducatif.

## 🤝 Contribution
Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

Développé avec ❤️ en utilisant OpenAI, React et FastAPI
