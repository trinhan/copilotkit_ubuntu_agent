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

Request the information required for the `.env` file. The following is required:

```
MODEL_NAME=gemini-2.5-flash
GOOGLE_GENAI_USE_VERTEXAI=1
GOOGLE_CLOUD_PROJECT=
GOOGLE_CLOUD_LOCATION=
BIGQUERY_DATASET=
BIGQUERY_TABLE=
```

### 3. Setup Backend
1. Create a `.env` file in the root directory (see `.env.example`).
2. Install dependencies and run:

```bash
# Using uv (recommended)
uv sync
uv run main.py
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

*The frontend will start on `http://localhost:3000`.*

## 🛠 Features

- **BigQuery Search**: Queries StackOverflow data to find relevant Ubuntu solutions.
- **Web Search**: Falls back to Google Search for the latest information.
- **Interactive Dashboard**: Displays results in dedicated "StackOverflow" and "Google" tabs.
- **CopilotKit Integration**: Real-time AI chat powered by Google ADK.

## 🛠 Test Example

Type the following:

`how to uninstall python from ubuntu?`

The output would be similar to:

### StackOverflow Tab

1. **How to completely uninstall python 2.7.13 on Ubuntu 16.04** (Views: 466608)
   * The user installed Python 2.7.13, which became the default and broke `pip`; they seek to remove it and revert to 2.7.12.
2. **Two Python Version conflict in Ubuntu Oneiric 11.10 issue: ImportError: No module** (Views: 760)
   * The user has two Python versions, experiencing `ImportError` after installing Python 2.7.5, and needs help running `virtualenv` with the correct version.
3. **Unable to uninstall python3.7 in Ubuntu20.04** (Views: 463)
   * The user is facing `apt` dependency errors when trying to uninstall or upgrade Python 3.7 after an Ubuntu update.

### Google Tab

* Uninstalling Python from Ubuntu requires caution, primarily to avoid breaking system functionalities, and involves identifying installed versions, using `apt remove` or `apt purge` for user-installed versions, or manually deleting files for source installations, followed by updating environment paths. *