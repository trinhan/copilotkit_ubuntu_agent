from google.adk.agents import Agent
from google.adk.tools import google_search
from google.adk.tools.agent_tool import AgentTool
from google.adk.tools.bigquery import BigQueryCredentialsConfig, BigQueryToolset
import google.auth
import dotenv
import prompt
import os

dotenv.load_dotenv(override=True)

# Set model name and fallback
MODEL_NAME = os.getenv("MODEL_NAME", "gemini-2.5-flash")

# Load credentials
credentials, _ = google.auth.default()
credentials_config = BigQueryCredentialsConfig(credentials=credentials)
bigquery_toolset = BigQueryToolset(
    credentials_config=credentials_config
  )

bq_search_agent = Agent(
    name="bq_search_agent",
    model=MODEL_NAME,
    instruction=prompt.BQ_INSTRUCTION,
    tools=[bigquery_toolset]
)

web_search_agent = Agent(
    name="web_search_agent",
    model=MODEL_NAME,
    instruction=prompt.WEBSEARCH_INSTRUCTION,
    tools=[google_search] 
)

root_agent = Agent(
 model=MODEL_NAME,
 name="main_bigquery_agent",
 description="Agent that returns stackoverflow posts with issues similar to the questions the user has presented",
 instruction=prompt.AGENT_INSTRUCTION,
 tools=[AgentTool(bq_search_agent, skip_summarization=False), 
        AgentTool(web_search_agent, skip_summarization=False)]
)

def get_bigquery_agent():
 return root_agent
