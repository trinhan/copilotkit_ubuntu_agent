import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { HttpAgent } from "@ag-ui/client";
import { NextRequest } from "next/server";
import { GoogleAuth } from "google-auth-library";

const serviceAdapter = new ExperimentalEmptyAdapter();

// Fetch the agent url from the .env file
export const POST = async (req: NextRequest) => {
  const remoteUrl = process.env.REMOTE_AGENT_URL;

  if (!remoteUrl) {
    console.error("REMOTE_AGENT_URL is not set in environment variables.");
    return new Response("Configuration Error", { status: 500 });
  }

  try {
    // Fetch an ID token using Application Default Credentials
    // The audience is the same as the remote agent URL
    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient(remoteUrl);
    const idToken = await client.idTokenProvider.fetchIdToken(remoteUrl);

    const runtime = new CopilotRuntime({
      agents: {
        main_bigquery_agent: new HttpAgent({
          url: remoteUrl,
          headers: {
            Authorization: `Bearer ${idToken}`,
          }
        }),
      }
    });

    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime,
      serviceAdapter,
      endpoint: "/api/copilotkit",
    });

    return handleRequest(req);
  } catch (error) {
    console.error("Error in CopilotKit runtime:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};