"use client"

import { useState } from "react"
import { CollapsibleSidebar } from "./components/collapsible-sidebar"
import { NotebookControls } from "./components/notebook-controls"
import { ChatPanel } from "./components/chat-panel"
import { StudioPanel } from "./components/studio-panel"
import { JupyterLiteNotebook } from "./components/jupyterlite-notebook"
import { ThemeToggle } from "./components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Settings, Share, Zap } from "lucide-react"

export default function LearningInterface() {
  const [theme, setTheme] = useState<"dark" | "light">("light")
  const [view, setView] = useState<"notebook" | "chat">("notebook")
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)

  // Calculate main content margins based on sidebar states
  const getMainContentStyle = () => {
    let marginLeft = 0
    let marginRight = 0

    if (leftSidebarOpen) marginLeft = 320
    if (rightSidebarOpen) marginRight = 320

    return {
      marginLeft: `${marginLeft}px`,
      marginRight: `${marginRight}px`,
      transition: "margin 300ms ease-in-out",
    }
  }

  return (
    <div className={`h-screen flex flex-col ${theme === "dark" ? "dark" : ""} bg-background`}>
      {/* Minimal Header - Apple Style */}
      <header className="flex items-center justify-between px-6 py-3 border-b bg-background/95 backdrop-blur-sm relative z-30">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold">Python Lab</span>
          <div className="hidden md:block text-sm text-muted-foreground">python.ipynb ready</div>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle theme={theme} onThemeChange={setTheme} />
          <Button variant="ghost" size="sm">
            <Share className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content with Collapsible Sidebars */}
      <div className="flex-1 relative overflow-hidden">
        {/* Left Sidebar - Collapsible */}
        <CollapsibleSidebar side="left" defaultOpen={false} className="w-80" onToggle={setLeftSidebarOpen}>
          <div className="h-full p-4">
            <NotebookControls onSwitchToChat={() => setView("chat")} currentView={view} />
          </div>
        </CollapsibleSidebar>

        {/* Right Sidebar - Collapsible */}
        <CollapsibleSidebar side="right" defaultOpen={false} className="w-80" onToggle={setRightSidebarOpen}>
          <div className="h-full">
            <StudioPanel />
          </div>
        </CollapsibleSidebar>

        {/* Main Content Area - Adjusts based on sidebar states */}
        <div className="h-full" style={getMainContentStyle()}>
          {view === "chat" ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b flex justify-between items-center bg-background/95 backdrop-blur-sm">
                <h2 className="font-semibold">AI Chat</h2>
                <Button variant="outline" size="sm" onClick={() => setView("notebook")}>
                  Switch to Notebook
                </Button>
              </div>
              <div className="flex-1">
                <ChatPanel />
              </div>
            </div>
          ) : (
            <JupyterLiteNotebook theme={theme} />
          )}
        </div>
      </div>
    </div>
  )
}
