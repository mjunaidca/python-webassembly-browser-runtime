"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { SourcesPanel } from "./components/sources-panel"
import { ChatPanel } from "./components/chat-panel"
import { StudioPanel } from "./components/studio-panel"
import { JupyterLiteNotebook } from "./components/jupyterlite-notebook"
import { ThemeToggle } from "./components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Settings, Share, MoreHorizontal, Zap } from "lucide-react"

export default function LearningInterface() {
  const [theme, setTheme] = useState<"dark" | "light">("light")
  const [view, setView] = useState<"notebook" | "chat">("notebook")

  useEffect(() => {
    const handleSwitchToNotebook = () => {
      setView("notebook")
    }

    window.addEventListener("switchToNotebook", handleSwitchToNotebook)

    return () => {
      window.removeEventListener("switchToNotebook", handleSwitchToNotebook)
    }
  }, [])

  return (
    <div className={`h-screen flex flex-col ${theme === "dark" ? "dark" : ""} bg-background`}>
      {/* Header - NotebookLM Style */}
      <header className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">Python Notebook</span>
          </div>
          <span className="text-sm text-muted-foreground">Ready to code immediately</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Zap className="h-4 w-4 mr-2" />
            New! Share publicly
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <ThemeToggle theme={theme} onThemeChange={setTheme} />
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content - Three Panel Layout */}
      <div className="flex-1 overflow-hidden">
        <ThreePanelLayout>
          <SourcesPanel />
          {view === "chat" ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold">Chat</h2>
                <Button variant="outline" size="sm" onClick={() => setView("notebook")}>
                  Switch to Notebook
                </Button>
              </div>
              <div className="flex-1">
                <ChatPanel />
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold">Notebook</h2>
                <Button variant="outline" size="sm" onClick={() => setView("chat")}>
                  Switch to Chat
                </Button>
              </div>
              <div className="flex-1">
                <JupyterLiteNotebook theme={theme} />
              </div>
            </div>
          )}
          <StudioPanel />
        </ThreePanelLayout>
      </div>
    </div>
  )
}

// Three Panel Layout Component
function ThreePanelLayout({ children }: { children: [React.ReactNode, React.ReactNode, React.ReactNode] }) {
  return (
    <div className="h-full flex">
      <div className="w-80 border-r">{children[0]}</div>
      <div className="flex-1 border-r">{children[1]}</div>
      <div className="w-80">{children[2]}</div>
    </div>
  )
}
