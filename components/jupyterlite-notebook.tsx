"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, ExternalLink, Maximize2, Minimize2, AlertCircle, Eye, EyeOff } from "lucide-react"

interface JupyterLiteNotebookProps {
  theme?: "light" | "dark"
}

export function JupyterLiteNotebook({ theme = "light" }: JupyterLiteNotebookProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [jupyterUrl, setJupyterUrl] = useState<string | null>(null)

  useEffect(() => {
    // Load JupyterLite with python.ipynb opened by default
    const notebookUrl = "https://jupyterlite.github.io/demo/lab/index.html?path=python.ipynb"
    setJupyterUrl(notebookUrl)
    setIsLoading(true)
    setHasError(false)
  }, [])

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
    // No need to auto-create since we're loading python.ipynb
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <div className={`h-full flex flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-background" : ""}`}>
      {/* Minimal Header - Apple Style */}
      {showControls && (
        <div className="flex items-center justify-between p-2 border-b bg-background/95 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Python Notebook</span>
            <div className="w-2 h-2 bg-green-500 rounded-full" title="Ready" />
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={openInNewTab}>
              <ExternalLink className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      )}

      {/* Toggle Controls Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowControls(!showControls)}
        className="absolute top-2 right-2 z-10 h-6 w-6 p-0 bg-background/80 backdrop-blur-sm hover:bg-accent"
      >
        {showControls ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
      </Button>

      {/* Main Notebook Area */}
      <div className="flex-1 relative">
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <div className="text-center">
                <p className="font-medium">Loading Python Environment...</p>
                <p className="text-xs text-muted-foreground">Setting up your notebook</p>
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
                <p className="font-medium">Cannot load notebook environment</p>
                <p className="text-sm text-muted-foreground mb-4">JupyterLite may be temporarily unavailable</p>
              </div>
              <div className="flex flex-col space-y-2 w-full">
                <Button onClick={openInNewTab} variant="default" size="sm">
                  Open in New Tab
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
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title="Python Notebook Environment"
            sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-modals allow-popups allow-top-navigation-by-user-activation"
          />
        )}
      </div>
    </div>
  )
}
