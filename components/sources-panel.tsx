"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FileText, Github, Upload, Link, Type } from "lucide-react"

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

  const [showUploadModal, setShowUploadModal] = useState(false)

  const handleAddSource = () => {
    setShowUploadModal(true)
  }

  const handleUploadNotebook = () => {
    // Handle notebook upload
    console.log("Upload notebook")
    setShowUploadModal(false)
  }

  const handleAddLink = () => {
    // Handle adding link
    console.log("Add link")
    setShowUploadModal(false)
  }

  const handlePasteText = () => {
    // Handle paste text
    console.log("Paste text")
    setShowUploadModal(false)
  }

  return (
    <div className="h-full flex flex-col bg-muted/20">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Sources</h2>
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleAddSource} size="sm" className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Search className="h-4 w-4 mr-2" />
            Discover
          </Button>
        </div>
      </div>

      {/* Sources List */}
      <div className="flex-1 p-4">
        {sources.length > 0 ? (
          <div className="space-y-3">
            {sources.map((source) => (
              <Card key={source.id} className="p-3 hover:bg-muted/50 cursor-pointer">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {source.type === "notebook" && <FileText className="h-4 w-4 text-blue-500" />}
                    {source.type === "pdf" && <FileText className="h-4 w-4 text-red-500" />}
                    {source.type === "link" && <Link className="h-4 w-4 text-green-500" />}
                    {source.type === "text" && <Type className="h-4 w-4 text-purple-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{source.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={source.status === "ready" ? "default" : "secondary"} className="text-xs">
                        {source.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground capitalize">{source.type}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium mb-2">Saved sources will appear here</p>
            <p className="text-xs text-muted-foreground mb-4">
              Click Add source above to add notebooks, PDFs, websites, text, or audio files. Or import a file directly
              from your device.
            </p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>Add sources</CardTitle>
              <p className="text-sm text-muted-foreground">
                Sources let the AI base its responses on the information that matters most to you.
                <br />
                (Examples: notebooks, course reading, research notes, meeting transcripts, etc.)
              </p>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center mb-6">
                <Upload className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload sources</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag & drop or{" "}
                  <button className="text-primary hover:underline" onClick={handleUploadNotebook}>
                    choose file
                  </button>{" "}
                  to upload
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported file types: Notebooks (.ipynb), PDF, .txt, Markdown, Audio (e.g. mp3), .png, .jpg, .jpeg
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" className="h-16 flex-col" onClick={handleUploadNotebook}>
                  <Github className="h-5 w-5 mb-2" />
                  <span className="text-sm">GitHub Notebook</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col" onClick={handleAddLink}>
                  <Link className="h-5 w-5 mb-2" />
                  <span className="text-sm">Link</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col" onClick={handlePasteText}>
                  <Type className="h-5 w-5 mb-2" />
                  <span className="text-sm">Paste text</span>
                </Button>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowUploadModal(false)}>Done</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
