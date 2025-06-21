"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, ExternalLink, Maximize2, Minimize2, AlertCircle, Play } from "lucide-react"

interface JupyterLiteNotebookProps {
  theme?: "light" | "dark"
}

export function JupyterLiteNotebook({ theme = "light" }: JupyterLiteNotebookProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [jupyterUrl, setJupyterUrl] = useState<string | null>(null)
  const [currentService, setCurrentService] = useState(0)

  const jupyterServices = [
    {
      name: "JupyterLite Lab",
      url: "https://jupyterlite.github.io/demo/lab/index.html",
      description: "Full JupyterLab interface with Python execution",
    },
    {
      name: "JupyterLite RetroLab",
      url: "https://jupyterlite.github.io/demo/retro/notebooks/index.html",
      description: "Classic notebook interface",
    },
    {
      name: "Pyodide Console",
      url: "https://pyodide.org/en/stable/console.html",
      description: "Python console in browser",
    },
  ]

  useEffect(() => {
    loadJupyterService(currentService)
  }, [currentService])

  const loadJupyterService = (serviceIndex: number) => {
    const service = jupyterServices[serviceIndex]
    setJupyterUrl(service.url)
    setIsLoading(true)
    setHasError(false)
  }

  const handleRefresh = () => {
    if (!jupyterUrl) return
    setIsLoading(true)
    setHasError(false)
    const iframe = document.getElementById("jupyterlite-iframe") as HTMLIFrameElement | null
    if (iframe) {
      iframe.src = jupyterUrl
    }
  }

  const openInNewTab = () => {
    if (jupyterUrl) window.open(jupyterUrl, "_blank")
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const tryNextService = () => {
    const nextService = (currentService + 1) % jupyterServices.length
    setCurrentService(nextService)
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const openColab = () => {
    window.open(
      "https://colab.research.google.com/github/panaversity/learn-agentic-ai/blob/main/01_ai_agents_first/04_hello_agent/hello_agent.ipynb",
      "_blank",
    )
  }

  return (
    <Card className={`h-full flex flex-col ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col">
          <CardTitle className="text-lg font-semibold">{jupyterServices[currentService].name}</CardTitle>
          <p className="text-xs text-muted-foreground">{jupyterServices[currentService].description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={openColab}>
            <Play className="h-4 w-4 mr-1" />
            Your Notebook
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="outline" size="sm" onClick={openInNewTab}>
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="relative h-full">
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center space-y-4">
                <RefreshCw className="h-8 w-8 animate-spin" />
                <div className="text-center">
                  <p className="font-medium">Loading Python Environment...</p>
                  <p className="text-xs text-muted-foreground">Setting up {jupyterServices[currentService].name}</p>
                  <p className="text-xs text-muted-foreground mt-1">This may take 30-60 seconds</p>
                </div>
              </div>
            </div>
          )}

          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center space-y-4 text-center max-w-md">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <div>
                  <p className="font-medium">Cannot load {jupyterServices[currentService].name}</p>
                  <p className="text-sm text-muted-foreground mb-4">Service may be temporarily unavailable</p>
                </div>
                <div className="flex flex-col space-y-2 w-full">
                  <Button onClick={tryNextService} variant="default" size="sm">
                    Try Different Service
                  </Button>
                  <Button onClick={openColab} variant="outline" size="sm">
                    Open Google Colab Instead
                  </Button>
                  <Button onClick={handleRefresh} variant="outline" size="sm">
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          )}

          {jupyterUrl && (
            <iframe
              id="jupyterlite-iframe"
              src={jupyterUrl}
              className="w-full h-full border-0 rounded-b-lg"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title="Python Notebook Environment"
              sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-modals allow-popups allow-top-navigation-by-user-activation"
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
