from google.adk.agents import Agent
from google.adk.tools import google_search
from google.adk.tools.agent_tool import AgentTool
from google.adk.tools.bigquery import BigQueryCredentialsConfig, BigQueryToolset
import google.auth
import dotenv
from . import prompt
import os

dotenv.load_dotenv()

credentials, _ = google.auth.default()
credentials_config = BigQueryCredentialsConfig(credentials=credentials)
bigquery_toolset = BigQueryToolset(
  credentials_config=credentials_config
)

MODEL_NAME = os.getenv("MODEL_NAME", "gemini-2.5-flash")

bq_search_agent = Agent(
    name="bq_search_agent",
    model=MODEL_NAME,
    instruction="Use your search tool to look up facts in big query",
    tools=[bigquery_toolset]
)

web_search_agent = Agent(
    name="web_search_agent",
    model=MODEL_NAME,
    instruction="Use the google search tool to find relevant information on the web.",
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
