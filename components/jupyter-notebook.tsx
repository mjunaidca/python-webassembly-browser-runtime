"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, ExternalLink, Maximize2, Minimize2, AlertCircle, Github } from "lucide-react"

interface JupyterNotebookProps {
  theme?: "light" | "dark"
}

const NOTEBOOK_OPTIONS = [
  {
    name: "Agentic AI Notebook",
    url: "https://nbviewer.org/github/panaversity/learn-agentic-ai/blob/main/01_ai_agents_first/04_hello_agent/hello_agent.ipynb",
    description: "Hello Agent - Agentic AI Tutorial",
    isDefault: true,
    githubUrl:
      "https://github.com/panaversity/learn-agentic-ai/blob/main/01_ai_agents_first/04_hello_agent/hello_agent.ipynb",
    colabUrl:
      "https://colab.research.google.com/github/panaversity/learn-agentic-ai/blob/main/01_ai_agents_first/04_hello_agent/hello_agent.ipynb",
  },
  {
    name: "JupyterLite Lab",
    url: "https://jupyterlite.github.io/demo/lab/index.html",
    description: "Full JupyterLab interface",
    isDefault: false,
  },
  {
    name: "Pyodide Console",
    url: "https://pyodide.org/en/stable/console.html",
    description: "Python console in browser",
    isDefault: false,
  },
]

export function JupyterNotebook({ theme = "light" }: JupyterNotebookProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [currentOption, setCurrentOption] = useState(0) // Default to GitHub notebook
  const [jupyterUrl, setJupyterUrl] = useState<string | null>(null)

  useEffect(() => {
    // Set GitHub notebook as default
    setJupyterUrl(NOTEBOOK_OPTIONS[0].url)
    setIsLoading(true)
    setHasError(false)
  }, [])

  useEffect(() => {
    setJupyterUrl(NOTEBOOK_OPTIONS[currentOption].url)
    setIsLoading(true)
    setHasError(false)
  }, [currentOption])

  const handleRefresh = () => {
    if (!jupyterUrl) return
    setIsLoading(true)
    setHasError(false)
    const iframe = document.getElementById("jupyter-iframe") as HTMLIFrameElement | null
    if (iframe) {
      iframe.src = jupyterUrl
    }
  }

  const openInNewTab = () => {
    if (jupyterUrl) window.open(jupyterUrl, "_blank")
  }

  const openInGitHub = () => {
    const currentNotebook = NOTEBOOK_OPTIONS[currentOption]
    if (currentNotebook.githubUrl) {
      window.open(currentNotebook.githubUrl, "_blank")
    }
  }

  const openInColab = () => {
    const currentNotebook = NOTEBOOK_OPTIONS[currentOption]
    if (currentNotebook.colabUrl) {
      window.open(currentNotebook.colabUrl, "_blank")
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const tryNextOption = () => {
    const nextOption = (currentOption + 1) % NOTEBOOK_OPTIONS.length
    setCurrentOption(nextOption)
  }

  const switchToOption = (index: number) => {
    setCurrentOption(index)
  }

  const currentNotebook = NOTEBOOK_OPTIONS[currentOption]

  return (
    <Card className={`h-full flex flex-col ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col">
          <CardTitle className="text-lg font-semibold">{currentNotebook.name}</CardTitle>
          <p className="text-xs text-muted-foreground">{currentNotebook.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          {currentNotebook.githubUrl && (
            <Button variant="outline" size="sm" onClick={openInGitHub}>
              <Github className="h-4 w-4" />
            </Button>
          )}
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
                  <p className="font-medium">Loading {currentNotebook.name}...</p>
                  <p className="text-sm text-muted-foreground">Rendering notebook from GitHub</p>
                </div>
              </div>
            </div>
          )}

          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center space-y-4 text-center max-w-md">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <div>
                  <p className="font-medium">Cannot load {currentNotebook.name}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    The notebook service may be temporarily unavailable
                  </p>
                </div>
                <div className="flex flex-col space-y-2 w-full">
                  <Button onClick={openInNewTab} variant="default" size="sm">
                    Open in New Tab
                  </Button>
                  {currentNotebook.colabUrl && (
                    <Button onClick={openInColab} variant="outline" size="sm">
                      Open in Google Colab
                    </Button>
                  )}
                  {currentNotebook.githubUrl && (
                    <Button onClick={openInGitHub} variant="outline" size="sm">
                      View on GitHub
                    </Button>
                  )}
                  <Button onClick={handleRefresh} variant="outline" size="sm">
                    Try Again
                  </Button>
                  {NOTEBOOK_OPTIONS.length > 1 && (
                    <div className="flex flex-wrap gap-1 justify-center mt-2">
                      {NOTEBOOK_OPTIONS.map((option, index) => (
                        <Button
                          key={index}
                          onClick={() => switchToOption(index)}
                          variant={index === currentOption ? "default" : "outline"}
                          size="sm"
                          className="text-xs"
                        >
                          {option.name.split(" ")[0]}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {jupyterUrl && (
            <iframe
              id="jupyter-iframe"
              src={jupyterUrl}
              className="w-full h-full border-0 rounded-b-lg"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title={currentNotebook.name}
              sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-modals allow-popups"
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
