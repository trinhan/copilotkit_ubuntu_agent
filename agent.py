from google.adk.agents import Agent
from google.adk.tools import google_search
from google.adk.tools.agent_tool import AgentTool
from google.adk.tools.bigquery import BigQueryCredentialsConfig, BigQueryToolset
import google.auth
import dotenv
import prompt


dotenv.load_dotenv()

credentials, _ = google.auth.default()
credentials_config = BigQueryCredentialsConfig(credentials=credentials)
bigquery_toolset = BigQueryToolset(
  credentials_config=credentials_config
)

bq_search_agent = Agent(
    name="bq_search_agent",
    model="gemini-2.5-flash",
    instruction="Use your search tool to look up facts in big query",
    tools=[bigquery_toolset]
)

web_search_agent = Agent(
    name="web_search_agent",
    model="gemini-2.5-flash",
    instruction="Use the google search tool to find relevant information on the web.",
    tools=[google_search] 
)

root_agent = Agent(
 model="gemini-2.5-flash",
 name="main_bigquery_agent",
 description="Agent that returns stackoverflow posts with issues similar to the questions the user has presented",
 instruction=prompt.AGENT_INSTRUCTION,
 tools=[AgentTool(bq_search_agent, skip_summarization=False), 
        AgentTool(web_search_agent, skip_summarization=False)]
)

def get_bigquery_agent():
 return root_agent

