"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, BookOpen, Code, FileText, Zap } from "lucide-react"

const quickActions = [
  {
    name: "Your Agentic AI Notebook",
    icon: Github,
    description: "Open your hello_agent.ipynb in Colab",
    action: () =>
      window.open(
        "https://colab.research.google.com/github/panaversity/learn-agentic-ai/blob/main/01_ai_agents_first/04_hello_agent/hello_agent.ipynb",
        "_blank",
      ),
    isPrimary: true,
  },
  {
    name: "New JupyterLite Notebook",
    icon: FileText,
    description: "Create a new Python notebook",
    action: () => window.open("https://jupyterlite.github.io/demo/lab/index.html", "_blank"),
    isPrimary: true,
  },
  {
    name: "Full Repository",
    icon: BookOpen,
    description: "Browse all Agentic AI lessons",
    action: () => window.open("https://github.com/panaversity/learn-agentic-ai", "_blank"),
    isPrimary: false,
  },
  {
    name: "JupyterLite Examples",
    icon: Code,
    description: "Pre-built example notebooks",
    action: () => window.open("https://jupyterlite.github.io/demo/lab/index.html?path=intro.ipynb", "_blank"),
    isPrimary: false,
  },
]

const notebookTemplates = [
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
            "That's interesting! Can you tell me more?",
            "I understand. Let me think about that.",
            "Based on what I know, I would suggest...",
            "That reminds me of something I learned.",
            "Let me process this information."
        ]
    
    def remember(self, information):
        self.memory.append(information)
        print(f"🧠 {self.name} remembered: {information}")
    
    def respond(self, user_input):
        response = random.choice(self.responses)
        print(f"🤖 {self.name}: {response}")
        return response
    
    def show_memory(self):
        print(f"\\n📚 {self.name}'s Memory:")
        for i, item in enumerate(self.memory, 1):
            print(f"  {i}. {item}")

# Create and test the agent
agent = SimpleAgent("AI Assistant")

# Teach the agent some facts
agent.remember("Python is great for AI development")
agent.remember("Machine learning uses data to make predictions")
agent.remember("Agents can have memory and reasoning capabilities")

# Test the agent
print("\\n🗣️ Conversation:")
agent.respond("What do you think about AI?")
agent.respond("How can I learn programming?")

# Show what the agent learned
agent.show_memory()`,
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
    'parameters': [175, 110, 11, 125, 1000],  # in billions
    'accuracy': [85.2, 88.4, 87.1, 89.3, 92.1],
    'year': [2020, 2018, 2019, 2019, 2023]
}

df = pd.DataFrame(data)
print("🤖 AI Models Dataset:")
print(df)

# Basic statistics
print(f"\\n📊 Statistics:")
print(f"Average parameters: {df['parameters'].mean():.1f}B")
print(f"Average accuracy: {df['accuracy'].mean():.1f}%")
print(f"Best model: {df.loc[df['accuracy'].idxmax(), 'model']}")

# Create a simple plot
plt.figure(figsize=(10, 6))
plt.scatter(df['parameters'], df['accuracy'], s=100, alpha=0.7)
for i, model in enumerate(df['model']):
    plt.annotate(model, (df['parameters'][i], df['accuracy'][i]), 
                xytext=(5, 5), textcoords='offset points')

plt.xlabel('Parameters (Billions)')
plt.ylabel('Accuracy (%)')
plt.title('AI Model Performance vs Size')
plt.grid(True, alpha=0.3)
plt.show()

print("\\n✅ Analysis complete!")`,
  },
  {
    title: "Python Basics for AI",
    description: "Essential Python concepts for AI development",
    code: `# Python Basics for AI Development
print("🐍 Python Basics for AI")
print("=" * 30)

# 1. Lists and Data Structures
ai_topics = ['machine learning', 'neural networks', 'nlp', 'computer vision']
print(f"AI Topics: {ai_topics}")

# 2. Dictionary for storing model info
model_info = {
    'name': 'GPT-3',
    'type': 'Language Model',
    'parameters': 175_000_000_000,
    'capabilities': ['text generation', 'question answering', 'translation']
}

print(f"\\nModel Info: {model_info['name']}")
print(f"Parameters: {model_info['parameters']:,}")

# 3. Functions for AI tasks
def calculate_accuracy(correct, total):
    """Calculate model accuracy percentage"""
    return (correct / total) * 100

def preprocess_text(text):
    """Simple text preprocessing"""
    return text.lower().strip().replace('!', '').replace('?', '')

# Test the functions
accuracy = calculate_accuracy(85, 100)
print(f"\\nModel Accuracy: {accuracy}%")

sample_text = "Hello! How are you doing today?"
processed = preprocess_text(sample_text)
print(f"Original: {sample_text}")
print(f"Processed: {processed}")

# 4. List comprehensions (very useful in AI)
numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]
print(f"\\nNumbers: {numbers}")
print(f"Squared: {squared}")

# 5. Working with data
import random
random.seed(42)  # For reproducible results

# Generate sample training data
training_data = [(random.randint(1, 100), random.choice(['positive', 'negative'])) 
                 for _ in range(10)]

print(f"\\nSample Training Data:")
for i, (value, label) in enumerate(training_data[:5], 1):
    print(f"  {i}. Value: {value}, Label: {label}")

print("\\n✅ Python basics covered!")`,
  },
]

export function LearningSidebar() {
  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      console.log("Code copied to clipboard!")
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  return (
    <div className="h-full flex flex-col space-y-4 p-4 bg-muted/30 overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Zap className="h-5 w-5 mr-2 text-primary" />
            Quick Start
          </CardTitle>
          <p className="text-xs text-muted-foreground">Get started with Python notebooks</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {quickActions.map((action) => (
            <Button
              key={action.name}
              variant={action.isPrimary ? "default" : "outline"}
              className="w-full justify-start h-auto p-3"
              onClick={action.action}
            >
              <action.icon className="h-4 w-4 mr-3 flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium text-sm">{action.name}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-lg">Notebook Templates</CardTitle>
          <p className="text-xs text-muted-foreground">Copy these into JupyterLite to get started</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {notebookTemplates.map((template, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-sm">{template.title}</span>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(template.code)}
                  className="h-6 px-2 text-xs"
                >
                  Copy
                </Button>
              </div>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto max-h-20 overflow-y-auto">
                <code>{template.code.slice(0, 200)}...</code>
              </pre>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
