"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Send } from "lucide-react"

export function ChatPanel() {
  const [message, setMessage] = useState("")
  const [hasStarted, setHasStarted] = useState(false)

  const handleSendMessage = () => {
    if (message.trim()) {
      setHasStarted(true)
      console.log("Send message:", message)
      setMessage("")
    }
  }

  const handleUploadSource = () => {
    console.log("Upload source")
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chat</h2>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {!hasStarted ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <Upload className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Add a source to get started</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Upload your learning materials and start an AI-powered conversation about your content.
            </p>
            <Button onClick={handleUploadSource}>Upload a source</Button>
          </div>
        ) : (
          <div className="flex-1 p-4">
            {/* Chat messages would go here */}
            <div className="space-y-4">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm">
                  AI: I can help you understand your learning materials. What would you like to explore?
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              placeholder={hasStarted ? "Ask about your sources..." : "Upload a source to get started"}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={!hasStarted}
            />
            <Button onClick={handleSendMessage} disabled={!message.trim() || !hasStarted}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">0 sources</span>
            <span className="text-xs text-muted-foreground">
              AI can be inaccurate; please double check its responses.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
