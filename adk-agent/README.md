## Testing the agent

1. During development of the core agent use the ADK Web UI (if from the root directory)

```
uv run adk web adk-agent

```

2. Consider whether there are specific tools needed by the front-end UI and add them to the agent. 

See [tools documentation](https://github.com/ag-ui-protocol/ag-ui/blob/main/integrations/adk-middleware/python/TOOLS.md) for examples

Note this is added at the ADK level. See [example here](https://github.com/ag-ui-protocol/ag-ui/blob/main/integrations/adk-middleware/python/USAGE.md#memory-tools-integration)

```
root_agent = Agent(
 model=MODEL_NAME,
 name="main_bigquery_agent",
 description="Agent that returns stackoverflow posts with issues similar to the questions the user has presented",
 instruction=prompt.AGENT_INSTRUCTION,
 tools=[AgentTool(bq_search_agent, skip_summarization=False), 
        AgentTool(web_search_agent, skip_summarization=False),
        AGUIToolset()]
)

```

3. Create middleware by using fastAPI server in `main.py`

For more information, visit this [quickstart on adk-middleware](https://github.com/ag-ui-protocol/ag-ui/tree/main/integrations/adk-middleware/python) and [adk-middleware configuration guide](https://github.com/ag-ui-protocol/ag-ui/blob/main/integrations/adk-middleware/python/CONFIGURATION.md)

We can either wrap the root agent:

```
adk_agent = ADKAgent(root_agent, ...)
```

OR if developing an app for Human in the loop:

```
adk_app = ADKAgent.from_app(app, ...)
```

To test whether this works locally, run:

```
uv run main.py
```

By defauly, this will run on localhost port 8000 [http://localhost:8000](http://localhost:8000)

## Structuring this folder for a cloud run deployment

Structure the folder as follows:

```
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

Examples of entries required in the `.env` file:

```
MODEL_NAME=gemini-2.5-flash
GOOGLE_CLOUD_PROJECT=lab-atrinh-vv5e3f7cc6
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_GENAI_USE_VERTEXAI=1
GOOGLE_APPLICATION_CREDENTIALS=/app/key.json
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
  --allow-unauthenticated # optional
```


