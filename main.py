from fastapi import FastAPI
from ag_ui_adk import ADKAgent, add_adk_fastapi_endpoint
from google.adk.agents import LlmAgent
from agent import root_agent
import os
import dotenv

dotenv.load_dotenv(override=True)

MODEL_NAME = os.getenv("MODEL_NAME", "gemini-2.5-flash")
# agent = LlmAgent(
#     name="assistant",
#     model=MODEL_NAME,
#     instruction="Be helpful and fun!"
# )

adk_agent = ADKAgent(
    adk_agent=root_agent,
    app_name="ubuntu_bq_search",
    user_id="demo_user",
    session_timeout_seconds=3600,
    use_in_memory_services=True
)

app = FastAPI()
add_adk_fastapi_endpoint(app, adk_agent, path="/")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)