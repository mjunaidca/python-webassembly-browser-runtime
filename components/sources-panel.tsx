"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, FileText, Github, Copy, Check } from "lucide-react"

interface Source {
  id: string
  name: string
  type: "notebook" | "pdf" | "link" | "text"
  url?: string
  status: "ready" | "processing" | "error"
}

export function SourcesPanel() {
  const [sources, setSources] = useState<Source[]>([
    {
      id: "1",
      name: "hello_agent.ipynb",
      type: "notebook",
      url: "https://github.com/panaversity/learn-agentic-ai/blob/main/01_ai_agents_first/04_hello_agent/hello_agent.ipynb",
      status: "ready",
    },
  ])

  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const codeExamples = [
    {
      title: "AI Agent Basics",
      description: "Simple AI agent without API keys",
      code: `# Simple AI Agent Simulation
import random
import json

class SimpleAgent:
    def __init__(self, name):
        self.name = name
        self.memory = []
        self.responses = [
            "That's interesting! Tell me more.",
            "I understand your point.",
            "Let me think about that...",
            "That makes sense to me.",
            "Can you elaborate on that?"
        ]
    
    def respond(self, message):
        self.memory.append(message)
        response = random.choice(self.responses)
        print(f"{self.name}: {response}")
        return response
    
    def get_memory(self):
        return self.memory

# Create and test the agent
agent = SimpleAgent("AI Assistant")
agent.respond("Hello, how are you?")
agent.respond("What do you think about AI?")
print("Agent memory:", agent.get_memory())`,
    },
    {
      title: "Data Analysis Starter",
      description: "Basic data analysis with pandas",
      code: `# Data Analysis with Pandas
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Create sample AI training data
data = {
    'model': ['GPT-3', 'BERT', 'T5', 'RoBERTa', 'GPT-4'],
    'parameters': [175, 110, 220, 125, 1000],
    'accuracy': [0.85, 0.88, 0.87, 0.89, 0.92],
    'year': [2020, 2018, 2019, 2019, 2023]
}

df = pd.DataFrame(data)
print("AI Models Dataset:")
print(df)

# Basic analysis
print("\\nBasic Statistics:")
print(df.describe())

# Simple visualization
plt.figure(figsize=(10, 6))
plt.scatter(df['parameters'], df['accuracy'], s=100)
for i, model in enumerate(df['model']):
    plt.annotate(model, (df['parameters'][i], df['accuracy'][i]))
plt.xlabel('Parameters (Billions)')
plt.ylabel('Accuracy')
plt.title('AI Model Performance')
plt.show()`,
    },
    {
      title: "Python Basics for AI",
      description: "Essential Python concepts for AI development",
      code: `# Python Basics for AI Development
print("🐍 Python Basics for AI")
print("=" * 30)

# 1. Lists and Data Structures
models = ["GPT", "BERT", "T5", "Claude"]
print(f"AI Models: {models}")

# 2. Dictionaries for structured data
model_info = {
    "name": "GPT-4",
    "type": "Language Model",
    "parameters": "1T+",
    "capabilities": ["text", "code", "reasoning"]
}
print(f"Model Info: {model_info}")

# 3. Functions for reusable code
def calculate_accuracy(correct, total):
    return (correct / total) * 100

accuracy = calculate_accuracy(85, 100)
print(f"Model Accuracy: {accuracy}%")

# 4. Classes for AI agents
class AIModel:
    def __init__(self, name, type_):
        self.name = name
        self.type = type_
        self.trained = False
    
    def train(self):
        self.trained = True
        print(f"{self.name} is now trained!")
    
    def predict(self, input_data):
        if self.trained:
            return f"Prediction for: {input_data}"
        return "Model needs training first!"

# Create and use the model
my_model = AIModel("CustomGPT", "Language Model")
my_model.train()
result = my_model.predict("Hello world")
print(result)`,
    },
  ]

  const copyToClipboard = async (code: string, title: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(title)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  const handleSourceClick = (source: Source) => {
    if (source.url) {
      window.open(source.url, "_blank")
    }
  }

  return (
    <div className="h-full flex flex-col bg-muted/20">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Python Notebook Runner</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Run Python notebooks directly in your browser</p>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Quick Start</h3>
          <p className="text-xs text-muted-foreground">Get started with Python notebooks</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b">
        <div className="space-y-2">
          <Button
            variant="default"
            size="sm"
            className="w-full justify-start"
            onClick={() => handleSourceClick(sources[0])}
          >
            <FileText className="h-4 w-4 mr-2" />
            Your Agentic AI Notebook
          </Button>
          <p className="text-xs text-muted-foreground">Open your hello_agent.ipynb in Colab</p>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => window.open("https://jupyterlite.github.io/demo/lab/index.html", "_blank")}
          >
            <Plus className="h-4 w-4 mr-2" />
            New JupyterLite Notebook
          </Button>
          <p className="text-xs text-muted-foreground">Create a new Python notebook</p>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => window.open("https://github.com/panaversity/learn-agentic-ai", "_blank")}
          >
            <Github className="h-4 w-4 mr-2" />
            Full Repository
          </Button>
          <p className="text-xs text-muted-foreground">Browse all Agentic AI lessons</p>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => window.open("https://jupyterlite.readthedocs.io/en/stable/quickstart/index.html", "_blank")}
          >
            <Search className="h-4 w-4 mr-2" />
            JupyterLite Examples
          </Button>
          <p className="text-xs text-muted-foreground">Pre-built example notebooks</p>
        </div>
      </div>

      {/* Code Examples */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Notebook Templates</h3>
            <p className="text-xs text-muted-foreground mb-4">Copy these into JupyterLite to get started</p>
          </div>

          {codeExamples.map((example, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-sm font-medium">{example.title}</h4>
                  <p className="text-xs text-muted-foreground">{example.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(example.code, example.title)}
                  className="h-8 w-8 p-0"
                >
                  {copiedCode === example.title ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
              <div className="bg-muted/50 rounded p-2 text-xs font-mono overflow-x-auto">
                <pre className="whitespace-pre-wrap text-xs">
                  {example.code.split("\n").slice(0, 4).join("\n")}
                  {example.code.split("\n").length > 4 && "\n..."}
                </pre>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
