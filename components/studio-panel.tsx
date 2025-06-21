"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Mic,
  FileText,
  BookOpen,
  HelpCircle,
  TimerIcon as Timeline,
  Plus,
  Play,
  MoreHorizontal,
  Info,
} from "lucide-react"

export function StudioPanel() {
  const [notes, setNotes] = useState("")

  const handleGenerateNotebook = () => {
    console.log("Generate notebook")
  }

  const handleCreateAudioOverview = () => {
    console.log("Create audio overview")
  }

  return (
    <div className="h-full flex flex-col bg-muted/20">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Studio</h2>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Audio Overview */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Audio Overview</CardTitle>
              <Button variant="ghost" size="sm">
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Mic className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Create an Audio Overview in more languages!</span>
              </div>
              <Button variant="link" className="p-0 h-auto text-primary text-sm">
                Learn more
              </Button>
            </div>

            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Deep Dive conversation</p>
                    <p className="text-xs text-muted-foreground">Two hosts</p>
                  </div>
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    Customize
                  </Button>
                  <Button size="sm" className="flex-1" onClick={handleCreateAudioOverview}>
                    <Play className="h-3 w-3 mr-1" />
                    Generate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Notes</CardTitle>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add note
            </Button>

            <Textarea
              placeholder="Add your learning notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[120px] resize-none"
            />

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Study guide
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Briefing doc
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <HelpCircle className="h-4 w-4 mr-2" />
                FAQ
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Timeline className="h-4 w-4 mr-2" />
                Timeline
              </Button>
            </div>

            <Button className="w-full" onClick={handleGenerateNotebook}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Custom Notebook
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
