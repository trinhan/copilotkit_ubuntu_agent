# Front end files

## Local development

This assumes the back-end has been configured, and/or deployed to cloud run. See [adk-agent/README.md](adk-agent/README.md) for more information.

1. Set up the .env:

If the agent is being developed locally, you can use 'http://localhost:8000' as the `REMOTE_AGENT_URL`.

```
REMOTE_AGENT_URL=https://<your-cloud-run-url>
GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
```

2. Verify the token

```
node verify_token.js
```

If you don't have the `GOOGLE_APPLICATION_CREDENTIALS` variable set, it will use credentials from `gcloud auth application-default login` if you have already authenticated
 
3. Navigate to the front-end and run

```
cd front-end
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Local Build

### A. Perform a local build in docker (Individual)

```bash
cd my-copilot-app
docker build -t frontend-test .
```

Run the container. Note you will need to inject your `.env` and GCP service account key
```bash
docker run --rm -p 3000:3000 \
  --env-file .env \
  -e GOOGLE_APPLICATION_CREDENTIALS=/app/key.json \
  -v $(pwd)/path/to/key.json:/app/key.json \
  frontend-test
```

## Deployment

If all is good, modify the `deploy.sh` file and deploy to cloud run.

Note this section will need to be modified. If the variable is present in the `.env` file, it will be auto-updated

```
# Configuration
PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-$(gcloud config get-value project)}
SERVICE_NAME="data-companion-agent"
REGION=${GOOGLE_CLOUD_LOCATION}
SERVICE_ACCOUNT=${SERVICE_ACCOUNT}
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"
```
If all is good, run:

```
bash deploy.sh
```