"use client";
import React, { useState } from 'react';
import { useFrontendTool, useCopilotAction } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

// --- Types ---

interface Reference {
  title: string;
  url: string;
  source: string;
}

interface AgentSection {
  title: string;
  summary: string;
  references: Reference[];
}

interface DashboardState {
  activeTab: 'google' | 'stackoverflow';
  sections: {
    google?: AgentSection;
    stackoverflow?: AgentSection;
  };
}

// --- Components ---

const Header = () => (
  <header className="h-14 border-b border-slate-800 bg-slate-900/50 flex items-center px-6 justify-between select-none">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
        <i className="fa-solid fa-layer-group"></i>
      </div>
      <span className="font-semibold text-lg tracking-tight text-white">Ubuntu<span className="text-blue-500">Agent</span></span>
    </div>
    <div className="text-xs text-slate-500 font-mono">
      Connected to Agent
    </div>
  </header>
);

const ReferenceCard = ({ refItem }: { refItem: Reference }) => (
  <a
    href={refItem.url}
    target="_blank"
    rel="noopener noreferrer"
    className="block p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-blue-500/50 transition-all group"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-slate-200 truncate group-hover:text-blue-400">
          {refItem.title || "Web Resource"}
        </h4>
        <p className="text-xs text-slate-500 mt-1 truncate">
          {refItem.url}
        </p>
      </div>
      <div className="ml-3 text-slate-600 group-hover:text-blue-500">
        <i className="fa-solid fa-external-link-alt text-xs"></i>
      </div>
    </div>
  </a>
);

const Dashboard = ({ state, onTabChange }: { state: DashboardState, onTabChange: (tab: 'google' | 'stackoverflow') => void }) => {
  const hasData = state.sections.google || state.sections.stackoverflow;

  if (!hasData) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center animate-in fade-in duration-700">
        <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-6">
          <i className="fa-regular fa-compass text-4xl text-slate-600"></i>
        </div>
        <h2 className="text-xl font-medium text-slate-300 mb-2">Workspace Ready</h2>
        <p className="max-w-md">
          Ask a question to activate the Google Search or StackOverflow agent.
          Results and summaries will appear here.
        </p>
      </div>
    );
  }

  const activeData = state.sections[state.activeTab];

  return (
    <div className="h-full flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      {/* Tabs Header */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center space-x-1 bg-slate-800/50 p-1 rounded-lg w-fit mb-6 border border-slate-700/50">
          {state.sections.google && (
            <button
              onClick={() => onTabChange('google')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${state.activeTab === 'google'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
            >
              <i className="fa-brands fa-google"></i>
              Google Search
            </button>
          )}
          {state.sections.stackoverflow && (
            <button
              onClick={() => onTabChange('stackoverflow')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${state.activeTab === 'stackoverflow'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
            >
              <i className="fa-brands fa-stack-overflow"></i>
              StackOverflow
            </button>
          )}
        </div>

        {activeData ? (
          <div>
            <h1 className="text-3xl font-bold text-white leading-tight">{activeData.title}</h1>
          </div>
        ) : (
          <div className="text-slate-500 italic">Select an active agent tab to view results.</div>
        )}
      </div>

      {/* Scrollable Content */}
      {activeData && (
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="prose prose-invert prose-slate max-w-none mb-10">
            <div className="glass-panel p-6 rounded-2xl">
              <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                {activeData.summary || <span className="text-slate-500 italic">Waiting for summary...</span>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-link"></i> Sources & References
            </h3>
            {activeData.references && activeData.references.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {activeData.references.map((ref, idx) => (
                  <ReferenceCard key={idx} refItem={ref} />
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-800/20 border border-slate-700/50 border-dashed text-center text-slate-500 text-sm">
                No references provided by the agent.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Page() {
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    activeTab: 'google',
    sections: {}
  });

  useCopilotAction({
    name: "update_dashboard",
    description: "Update the dashboard with the findings. Call this whenever you have an answer.",
    parameters: [
      {
        name: "active_tab",
        type: "string",
        required: true,
        description: "The tab to display: 'google' or 'stackoverflow'"
      },
      {
        name: "title",
        type: "string",
        required: true,
        description: "The title of the findings"
      },
      {
        name: "summary",
        type: "string",
        required: true,
        description: "The detailed summary text to display. This is the most important field."
      },
      {
        name: "references",
        type: "object[]",
        description: "List of reference objects {title, url, source}",
        required: false,
        attributes: [
          { name: "title", type: "string" },
          { name: "url", type: "string" },
          { name: "source", type: "string" }
        ]
      }
    ],
    handler: async ({ active_tab, title, summary, references }) => {
      console.log("Dashboard update called:", { active_tab, title, summary });
      const sectionData: AgentSection = {
        title,
        summary,
        references: references || []
      };

      setDashboardState(prev => ({
        activeTab: active_tab as 'google' | 'stackoverflow',
        sections: {
          ...prev.sections,
          [active_tab]: sectionData
        }
      }));
      return "Dashboard updated successfully.";
    }
  });

  const handleTabChange = (tab: 'google' | 'stackoverflow') => {
    setDashboardState(prev => ({ ...prev, activeTab: tab }));
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white overflow-hidden">
      <Header />

      <main className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL - DASHBOARD */}
        <section className="w-[60%] border-r border-slate-800 bg-slate-900/50 relative hidden md:block overflow-hidden">
          <Dashboard state={dashboardState} onTabChange={handleTabChange} />
        </section>

        {/* RIGHT PANEL - CHAT */}
        <section className="w-full md:w-[40%] flex flex-col bg-slate-950">
          <CopilotChat
            instructions="You are a helpful assistant. When you find information, you MUST use the 'update_dashboard' tool. IMPORTANT: You must put the detailed content of your findings into the 'summary' field of the tool so it appears on the dashboard. Do not just output the answer in the chat; ensure the 'summary' field is populated."
            labels={{
              title: "Helpdesk Assistant",
              initial: "How can I help you today? I can help you find answers about Ubuntu",
            }}
            className="h-full"
          />
        </section>
      </main>
    </div>
  );

  useFrontendTool({
    name: "sayHello",
    description: "Say hello to the user",
    parameters: [
      {
        name: "name",
        type: "string",
        description: "The name of the user to say hello to",
        required: true,
      },
    ],
    handler: async ({ name }) => {
      alert(`Hello, ${name}!`);
    },
  });

}