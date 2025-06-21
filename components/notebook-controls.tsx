"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Play, Square, RotateCcw, Download, Upload, Settings, MessageSquare, BookOpen, Zap } from "lucide-react"

interface NotebookControlsProps {
  onSwitchToChat: () => void
  currentView: "notebook" | "chat"
}

export function NotebookControls({ onSwitchToChat, currentView }: NotebookControlsProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          Notebook Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* View Toggle */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">View</h3>
          <Button
            variant={currentView === "chat" ? "default" : "outline"}
            className="w-full justify-start"
            onClick={onSwitchToChat}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Switch to Chat
          </Button>
        </div>

        <Separator />

        {/* Notebook Actions */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Notebook Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              <Play className="h-4 w-4 mr-1" />
              Run All
            </Button>
            <Button variant="outline" size="sm">
              <Square className="h-4 w-4 mr-1" />
              Stop
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-1" />
              Restart
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
          </div>
        </div>

        <Separator />

        {/* File Operations */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">File Operations</h3>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Download Notebook
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Upload className="h-4 w-4 mr-2" />
              Upload Notebook
            </Button>
          </div>
        </div>

        <Separator />

        {/* Quick Actions */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Quick Start</h3>
          <Button
            variant="default"
            size="sm"
            className="w-full justify-start"
            onClick={() =>
              window.open(
                "https://colab.research.google.com/github/panaversity/learn-agentic-ai/blob/main/01_ai_agents_first/04_hello_agent/hello_agent.ipynb",
                "_blank",
              )
            }
          >
            <Zap className="h-4 w-4 mr-2" />
            Your Agentic AI Notebook
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
