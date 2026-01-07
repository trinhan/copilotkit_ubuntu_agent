"use client";
import { CopilotKit, useCoAgent, useCopilotChat, useFrontendTool } from "@copilotkit/react-core";
import { CopilotChat, CopilotSidebar } from "@copilotkit/react-ui";
import React from "react";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import Image from "next/image";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-gray-900">
            Ubuntu Helpdesk
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            a software literacy assistant to help you do stuff
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Udemy Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-all duration-300 border-t-4 border-purple-600">
            <div className="relative w-32 h-32 mb-6">
              <Image
                src="/udemy.png"
                alt="Udemy"
                width={128}
                height={128}
                className="object-contain"
                priority
                unoptimized
              />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Udemy</h2>
            <p className="text-center text-gray-600 leading-relaxed">
              Access comprehensive video courses and tutorials to upskill your software knowledge.
            </p>
          </div>

          {/* StackOverflow Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-all duration-300 border-t-4 border-orange-500">
            <div className="relative w-32 h-32 mb-6">
              <Image
                src="/stackoverflow.png"
                alt="StackOverflow"
                width={128}
                height={128}
                className="object-contain"
                priority
                unoptimized
              />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">StackOverflow</h2>
            <p className="text-center text-gray-600 leading-relaxed">
              Find solutions to specific coding problems and join the largest developer community.
            </p>
          </div>

          {/* Confluence Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500">
            <div className="relative w-32 h-32 mb-6">
              <Image
                src="/confluence.png"
                alt="Confluence"
                width={128}
                height={128}
                className="object-contain"
                priority
                unoptimized
              />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Confluence</h2>
            <p className="text-center text-gray-600 leading-relaxed">
              Explore internal documentation, project specs, and team knowledge bases.
            </p>
          </div>
        </div>

        <CopilotSidebar
          instructions="You are a helpful assistant. Answer the user's questions."
          labels={{
            title: "Helpdesk Assistant",
            initial: "How can I help you today? I can help you find answers about Ubuntu",
          }}
        />
      </div>
    </main>
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
    handler({ name }) {
      // Handler returns the result of the tool call
      return { currentURLPath: window.location.href, userName: name };
    },
    render: ({ args }) => {
      // Renders UI based on the data of the tool call
      return (
        <div>
          <h1>Hello, {args.name}!</h1>
          <h1>You're currently on {window.location.href}</h1>
        </div>
      );
    },
  });

}