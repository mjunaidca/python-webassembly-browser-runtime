"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { User, Brain, Target, BookOpen, Zap, Save, Upload } from "lucide-react"

interface UserContext {
  name: string
  level: string
  interests: string[]
  currentGoal: string
  notes: string
}

export function PersonalizedContent() {
  const [userContext, setUserContext] = useState<UserContext>({
    name: "AI Learner",
    level: "Beginner",
    interests: ["Machine Learning", "Python", "Data Science"],
    currentGoal: "Build my first AI agent",
    notes: "Learning about agentic AI systems and how to implement them using Python.",
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleSaveContext = () => {
    // In a real app, this would save to a database/bucket
    console.log("Saving user context:", userContext)
    setIsEditing(false)
    // Could save to localStorage, cloud storage, etc.
    localStorage.setItem("userContext", JSON.stringify(userContext))
  }

  const handleLoadContext = () => {
    // Load from storage
    const saved = localStorage.getItem("userContext")
    if (saved) {
      setUserContext(JSON.parse(saved))
    }
  }

  const generatePersonalizedNotebook = () => {
    // This would generate a custom notebook based on user context
    const notebookContent = `# Personalized AI Learning Session for ${userContext.name}

## Your Learning Goal: ${userContext.currentGoal}

### Based on your interests: ${userContext.interests.join(", ")}

# Let's start with a simple AI agent example tailored for ${userContext.level} level

print("Hello ${userContext.name}! Let's build your AI agent.")

# Your personalized code will go here...
import openai
# ... customized based on your context
`

    // Copy to clipboard or send to notebook
    navigator.clipboard.writeText(notebookContent)
    console.log("Generated personalized notebook content")
  }

  return (
    <div className="h-full flex flex-col space-y-4 p-4 bg-muted/10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Learning Context</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleLoadContext}>
              <Upload className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit"}
            </Button>
            {isEditing && (
              <Button size="sm" onClick={handleSaveContext}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            {isEditing ? (
              <Input
                value={userContext.name}
                onChange={(e) => setUserContext({ ...userContext, name: e.target.value })}
              />
            ) : (
              <p className="text-sm">{userContext.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Level</label>
            {isEditing ? (
              <select
                className="w-full p-2 border rounded"
                value={userContext.level}
                onChange={(e) => setUserContext({ ...userContext, level: e.target.value })}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            ) : (
              <Badge variant="secondary">{userContext.level}</Badge>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Interests</label>
            <div className="flex flex-wrap gap-1">
              {userContext.interests.map((interest, index) => (
                <Badge key={index} variant="outline">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Current Goal</label>
            {isEditing ? (
              <Input
                value={userContext.currentGoal}
                onChange={(e) => setUserContext({ ...userContext, currentGoal: e.target.value })}
              />
            ) : (
              <p className="text-sm flex items-center">
                <Target className="h-4 w-4 mr-2 text-primary" />
                {userContext.currentGoal}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            Learning Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          {isEditing ? (
            <Textarea
              value={userContext.notes}
              onChange={(e) => setUserContext({ ...userContext, notes: e.target.value })}
              className="h-full min-h-[200px] resize-none"
              placeholder="Add your learning notes, questions, and progress here..."
            />
          ) : (
            <div className="h-full">
              <p className="text-sm whitespace-pre-wrap">{userContext.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Zap className="h-5 w-5 mr-2 text-primary" />
            Personalized Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button className="w-full" onClick={generatePersonalizedNotebook}>
            <BookOpen className="h-4 w-4 mr-2" />
            Generate Custom Notebook
          </Button>
          <Button variant="outline" className="w-full">
            <Brain className="h-4 w-4 mr-2" />
            AI Learning Recommendations
          </Button>
          <Button variant="outline" className="w-full">
            <Target className="h-4 w-4 mr-2" />
            Track Progress
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
