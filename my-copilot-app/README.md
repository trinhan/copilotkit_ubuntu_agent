# Front end files

## Folder structure

```text
my-copilot-app/
├── app/                    # Next.js App Router files
│   ├── api/copilotkit/
│   │   └── route.ts        # CopilotKit runtime endpoint
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main landing page - edit this
├── public/                 # Static assets (images, icons)
├── .env                    # Environment variables (local)
├── Dockerfile              # Docker configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── verify_token.js         # Token verification helper
```
## Local development

This assumes the back-end has been configured, and/or deployed to cloud run. See [adk-agent/README.md](adk-agent/README.md) for more information.

1. Set up the .env:

If the agent is being developed locally, you can use 'http://localhost:8000' as the `REMOTE_AGENT_URL`.

```
REMOTE_AGENT_URL=https://<your-cloud-run-url>
GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
```

The following fields are optional for deployment:

```
SERVICE_ACCOUNT
REGION
PROJECT_ID


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


```
gcloud run deploy front-end \
  --source . \
  --region <REGION> \
  --project <PROJECT_ID> \
  --service-account <SERVICE_ACCOUNT> \
  --port 3000 \
  --memory 1Gi \
  --cpu 1 \
  --description "Standalone Frontend for Copilot Kit"
  --set-env-vars REMOTE_AGENT_URL=<REMOTE_AGENT_URL>
```

