"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, ExternalLink, Maximize2, Minimize2, AlertCircle } from "lucide-react"

interface JupyterLiteRunnerProps {
  theme?: "light" | "dark"
}

const JUPYTERLITE_OPTIONS = [
  {
    name: "JupyterLite Lab",
    url: "https://jupyterlite.github.io/demo/lab/index.html",
    description: "Full JupyterLab interface with Python kernel",
    isDefault: true,
  },
  {
    name: "JupyterLite RetroLab",
    url: "https://jupyterlite.github.io/demo/retro/notebooks/index.html",
    description: "Classic Notebook interface",
    isDefault: false,
  },
  {
    name: "JupyterLite REPL",
    url: "https://jupyterlite.github.io/demo/repl/index.html",
    description: "Python REPL console",
    isDefault: false,
  },
]

export function JupyterLiteRunner({ theme = "light" }: JupyterLiteRunnerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [currentOption, setCurrentOption] = useState(0)
  const [jupyterUrl, setJupyterUrl] = useState<string | null>(null)

  useEffect(() => {
    // Set JupyterLite Lab as default
    setJupyterUrl(JUPYTERLITE_OPTIONS[0].url)
    setIsLoading(true)
    setHasError(false)
  }, [])

  useEffect(() => {
    setJupyterUrl(JUPYTERLITE_OPTIONS[currentOption].url)
    setIsLoading(true)
    setHasError(false)
  }, [currentOption])

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

  const handleIframeLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const switchToOption = (index: number) => {
    setCurrentOption(index)
  }

  const currentNotebook = JUPYTERLITE_OPTIONS[currentOption]

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
                  <p className="text-xs text-muted-foreground">Initializing Python kernel via WebAssembly</p>
                  <p className="text-xs text-muted-foreground mt-1">This may take 30-60 seconds on first load</p>
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
                    JupyterLite may be temporarily unavailable or blocked by your network
                  </p>
                </div>
                <div className="flex flex-col space-y-2 w-full">
                  <Button onClick={openInNewTab} variant="default" size="sm">
                    Open in New Tab
                  </Button>
                  <Button onClick={handleRefresh} variant="outline" size="sm">
                    Try Again
                  </Button>
                  <div className="flex flex-wrap gap-1 justify-center mt-2">
                    {JUPYTERLITE_OPTIONS.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => switchToOption(index)}
                        variant={index === currentOption ? "default" : "outline"}
                        size="sm"
                        className="text-xs"
                      >
                        {option.name.split(" ")[1] || option.name}
                      </Button>
                    ))}
                  </div>
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
              title={currentNotebook.name}
              sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-modals allow-popups allow-top-navigation-by-user-activation"
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
