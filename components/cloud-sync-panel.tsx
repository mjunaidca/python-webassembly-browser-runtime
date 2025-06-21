"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CloudOff,
  Download,
  Trash2,
  RefreshCw,
  Save,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Database,
} from "lucide-react"
import { upstashStorage, type NotebookFile } from "../lib/upstash-storage"

interface CloudSyncPanelProps {
  onLoadNotebook?: (notebook: NotebookFile) => void
}

export function CloudSyncPanel({ onLoadNotebook }: CloudSyncPanelProps) {
  const [notebooks, setNotebooks] = useState<NotebookFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [newNotebookName, setNewNotebookName] = useState("")
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle")

  useEffect(() => {
    checkConnection()
    loadNotebooks()
  }, [])

  const checkConnection = async () => {
    const available = await upstashStorage.isAvailable()
    setIsConnected(available)
  }

  const loadNotebooks = async () => {
    setIsLoading(true)
    try {
      const notebookList = await upstashStorage.listNotebooks()
      setNotebooks(notebookList)
      setIsConnected(true)
    } catch (error) {
      console.error("Failed to load notebooks:", error)
      setIsConnected(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveCurrentNotebook = async () => {
    if (!newNotebookName.trim()) return

    setSyncStatus("syncing")
    try {
      // Create a basic notebook structure
      const notebookContent = JSON.stringify(
        {
          cells: [
            {
              cell_type: "code",
              execution_count: null,
              metadata: {},
              outputs: [],
              source: [
                "# Welcome to your Python notebook!\n",
                "print('Hello from Python Lab!')\n",
                "\n",
                "# Start coding here...\n",
              ],
            },
          ],
          metadata: {
            kernelspec: {
              display_name: "Python 3",
              language: "python",
              name: "python3",
            },
            language_info: {
              name: "python",
              version: "3.8.0",
            },
          },
          nbformat: 4,
          nbformat_minor: 4,
        },
        null,
        2,
      )

      const notebook: NotebookFile = {
        id: newNotebookName.toLowerCase().replace(/\s+/g, "-"),
        name: `${newNotebookName}.ipynb`,
        content: notebookContent,
        lastModified: new Date(),
        size: notebookContent.length,
      }

      await upstashStorage.saveNotebook(notebook)
      await loadNotebooks()
      setNewNotebookName("")
      setSyncStatus("success")

      setTimeout(() => setSyncStatus("idle"), 2000)
    } catch (error) {
      console.error("Failed to save notebook:", error)
      setSyncStatus("error")
      setTimeout(() => setSyncStatus("idle"), 2000)
    }
  }

  const handleLoadNotebook = async (notebook: NotebookFile) => {
    try {
      const loadedNotebook = await upstashStorage.loadNotebook(notebook.id)
      if (loadedNotebook && onLoadNotebook) {
        onLoadNotebook(loadedNotebook)
      }
    } catch (error) {
      console.error("Failed to load notebook:", error)
    }
  }

  const handleDeleteNotebook = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notebook?")) return

    try {
      await upstashStorage.deleteNotebook(id)
      await loadNotebooks()
    } catch (error) {
      console.error("Failed to delete notebook:", error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            {isConnected ? (
              <Database className="h-5 w-5 mr-2 text-green-500" />
            ) : (
              <CloudOff className="h-5 w-5 mr-2 text-red-500" />
            )}
            Upstash Storage
          </div>
          <div className="flex items-center space-x-1">
            {syncStatus === "syncing" && <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />}
            {syncStatus === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
            {syncStatus === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
            <Button variant="ghost" size="sm" onClick={loadNotebooks} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {isConnected
            ? `Sync notebooks to Redis • User: ${upstashStorage.getCurrentUserId().slice(-8)}`
            : "Connection failed"}
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Save Current Notebook */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Save Current Notebook</h3>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter notebook name..."
              value={newNotebookName}
              onChange={(e) => setNewNotebookName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSaveCurrentNotebook()}
            />
            <Button
              size="sm"
              onClick={handleSaveCurrentNotebook}
              disabled={!newNotebookName.trim() || syncStatus === "syncing" || !isConnected}
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Saved Notebooks */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Saved Notebooks</h3>
            <Badge variant="secondary">{notebooks.length}</Badge>
          </div>

          {!isConnected ? (
            <div className="text-center py-8 text-muted-foreground">
              <CloudOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Upstash Redis not connected</p>
              <p className="text-xs">Check environment variables</p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : notebooks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No saved notebooks</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {notebooks.map((notebook) => (
                <Card key={notebook.id} className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{notebook.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(notebook.lastModified)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatFileSize(notebook.size)}</span>
                      </div>
                    </div>
                    <div className="flex space-x-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLoadNotebook(notebook)}
                        className="h-6 w-6 p-0"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNotebook(notebook.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Storage Info */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Storage Info</h3>
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Total notebooks:</span>
              <span>{notebooks.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total size:</span>
              <span>{formatFileSize(notebooks.reduce((acc, nb) => acc + nb.size, 0))}</span>
            </div>
            <div className="flex justify-between">
              <span>Provider:</span>
              <span>Upstash Redis</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={isConnected ? "text-green-500" : "text-red-500"}>
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
