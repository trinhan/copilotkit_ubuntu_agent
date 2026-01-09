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
1. Create a `.env` file in the root directory. The following is required:
```
MODEL_NAME=gemini-2.5-flash
GOOGLE_GENAI_USE_VERTEXAI=1
GOOGLE_CLOUD_PROJECT=
GOOGLE_CLOUD_LOCATION=
BIGQUERY_DATASET=
BIGQUERY_TABLE=
```
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

### 5. Running with Docker (Monolithic)

To build the entire application (Backend + Frontend) in a single container:

```bash
docker build -t ubuntu-agent .
```

When running inside Docker locally, the container doesn't have access to your host's `gcloud` credentials. Use one of these methods to authenticate:

1. [Download a Service Account JSON key](https://console.cloud.google.com/iam-admin/serviceaccounts) from GCP. Note this key requires the permissions: bigquery data viewer, bigquery job user, vertex AI service agent, vertex ai reasoning engine service agent (mayble)
2. Place it in the root folder (e.g., `key.json`).
3. Run with the correctly mapped path:

```bash
docker run -p 8080:8080 \
  -e PORT=8080 \
  --env-file .env \
  -e GOOGLE_APPLICATION_CREDENTIALS=/app/key.json \
  -v $(pwd)/key.json:/app/key.json \
  ubuntu-agent
```
*The application will be accessible at `http://localhost:8080`.*

### 6. Deploy to Google Cloud Run

We provide a `deploy.sh` script to automate the build and deployment process using Google Cloud Build (which builds the image in the cloud).

1. **Prerequisites**:
   - Ensure you are logged in: `gcloud auth login`
   - Set your project: `gcloud config set project YOUR_PROJECT_ID`

2. **Run the deployment**:
   ```bash
   ./deploy.sh
   ```

3. **Configure Environment**:
   After deployment, go to the Cloud Run console and add your environment variables (like `BIGQUERY_DATASET`, `MODEL_NAME`, etc.) to the service configuration.

### 7. Alternative: Local Docker Build & Push

If you prefer to build the image on your local machine and push it to GCR manually:

1. **Run the local deployment script**:
   ```bash
   ./deploy_local.sh
   ```
   *This script handles `docker build`, `docker push`, and `gcloud run deploy` in one go.*

---

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