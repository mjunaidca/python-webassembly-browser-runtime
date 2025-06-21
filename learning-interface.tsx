"use client"

import { useState } from "react"
import { ResizablePanels } from "./components/resizable-panels"
import { JupyterLiteNotebook } from "./components/jupyterlite-notebook"
import { PersonalizedContent } from "./components/personalized-content"
import { ThemeToggle } from "./components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Settings, HelpCircle, Code } from "lucide-react"

export default function LearningInterface() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  return (
    <div className={`h-screen flex flex-col ${theme === "dark" ? "dark" : ""}`}>
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Code className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">AI Learning Lab</h1>
          </div>
          <span className="text-sm text-muted-foreground">Personalized Python Notebook Experience</span>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle theme={theme} onThemeChange={setTheme} />
          <Button variant="outline" size="sm">
            <HelpCircle className="h-4 w-4 mr-2" />
            Help
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content - Split Panel Layout */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanels defaultSizes={[50, 50]} minSizes={[30, 30]}>
          <JupyterLiteNotebook theme={theme} />
          <PersonalizedContent />
        </ResizablePanels>
      </div>
    </div>
  )
}
