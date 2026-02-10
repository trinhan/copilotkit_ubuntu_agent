## Structuring this folder for a cloud run deployment

Structure the folder as follows:

```text
adk-agent/
├── main_bigquery_agent/    # Agent source code (can be any name)
    |-- agent.py            # Main agent
    |-- prompt.py           # Prompt file
    |-- __init__.py         # Init file
├── .dockerignore          # Files to exclude from build
├── .env                   # Environment variables (local dev)
├── Dockerfile             # Container configuration
├── main.py                # Entry point (FastAPI server)
└── requirements.txt        # Python dependencies
```

2. Test locally

```
cd adk-agent
docker build -t <APP_NAME>.
```

Then check it's working on the specified port:

```
docker run --rm -p 8080:8080 \
  -e PORT=8080 \
  --env-file .env \
  -e GOOGLE_APPLICATION_CREDENTIALS=/app/key.json \
  -v $(pwd)/path/to/key.json:/app/key.json \
  <APP_NAME>:latest
```

The output on port 8080 should look like: "{"detail":"Method Not Allowed"}"

3. Deploy the backend to cloud run

```
cd adk-agent

gcloud run deploy <APP_NAME>\
  --source . \
  --region <REGION> \
  --project <PROJECT_ID> \
  --service-account <SERVICE_ACCOUNT> \ ## if applicable
  --allow-unauthenticated # first-pass, do unauthenticated to check integration
```

4. Set up an access key: