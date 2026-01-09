# Ubuntu Helpdesk Agent (ADK + CopilotKit)

A software literacy assistant that helps users with Ubuntu-related queries by searching BigQuery (StackOverflow data) and the Web.

## 🤖 AI Agent

The root agent (defined in `ubuntu_agent/agent.py`) uses two specialized tools:
*   **bq_search_agent**: Queries a BigQuery dataset to find StackOverflow posts matching the user's query.
*   **web_search_agent**: Uses Google Search to find external resources and solutions.

This agent is served via FastAPI in `main.py`.

## 🚀 Quick Start (Local)

### 1. Prerequisites
- **Python 3.12+** (Recommend using `uv`)
- **Node.js 20+**
- **Google Cloud SDK (gcloud)** authenticated with a project that has BigQuery and Vertex AI enabled.

### 2. Authentication
Authorize your local environment to use your Google Cloud credentials:
```bash
gcloud auth application-default login
```

### 3. Setup Backend
1. Create a `.env` file in the root directory (see `.env.example`).
2. Install dependencies and run:

```bash
# Using uv (recommended)
uv sync
uv run main.py

# OR using pip
pip install .
python main.py
```
*The backend will start on `http://localhost:8000`.*

### 4. Setup Frontend
1. Open a new terminal.
2. Navigate to the frontend directory:

```bash
cd my-copilot-app
npm install
npm run dev
```

*The frontend will start on `http://localhost:3000` (or 3001).*

---

## 🛠 Features

- **BigQuery Search**: Queries StackOverflow data to find relevant Ubuntu solutions.
- **Web Search**: Falls back to Google Search for the latest information.
- **Interactive Dashboard**: Displays results in dedicated "StackOverflow" and "Google" tabs.
- **CopilotKit Integration**: Real-time AI chat powered by Google ADK.


