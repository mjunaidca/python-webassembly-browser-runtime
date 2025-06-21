"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Play, Square, Trash2, Download } from "lucide-react"

declare global {
  interface Window {
    loadPyodide: any
    pyodide: any
  }
}

export function PythonRunner() {
  const [pyodide, setPyodide] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [code, setCode] = useState(`# Welcome to Python in the browser!
print("Hello from Pyodide!")

# Try some basic Python
import math
print(f"π = {math.pi}")

# Data analysis with pandas (pre-installed)
import pandas as pd
data = {'name': ['Alice', 'Bob'], 'age': [25, 30]}
df = pd.DataFrame(data)
print("\\nDataFrame:")
print(df)`)
  const [output, setOutput] = useState("")
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadPyodide()

    // Listen for code loading events
    const handleLoadCode = (event: any) => {
      setCode(event.detail)
    }

    window.addEventListener("loadPythonCode", handleLoadCode)
    return () => window.removeEventListener("loadPythonCode", handleLoadCode)
  }, [])

  const loadPyodide = async () => {
    try {
      setIsLoading(true)

      // Load Pyodide script if not already loaded
      if (!window.loadPyodide) {
        const script = document.createElement("script")
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"
        script.onload = async () => {
          await initializePyodide()
        }
        document.head.appendChild(script)
      } else {
        await initializePyodide()
      }
    } catch (error) {
      console.error("Failed to load Pyodide:", error)
      setOutput("Failed to load Python environment. Please refresh and try again.")
      setIsLoading(false)
    }
  }

  const initializePyodide = async () => {
    try {
      const pyodideInstance = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
      })

      // Install common packages
      await pyodideInstance.loadPackage(["numpy", "pandas", "matplotlib"])

      // Set up stdout capture
      pyodideInstance.runPython(`
import sys
from io import StringIO
import contextlib

@contextlib.contextmanager
def capture_output():
    old_stdout = sys.stdout
    old_stderr = sys.stderr
    stdout = StringIO()
    stderr = StringIO()
    try:
        sys.stdout = stdout
        sys.stderr = stderr
        yield stdout, stderr
    finally:
        sys.stdout = old_stdout
        sys.stderr = old_stderr
`)

      setPyodide(pyodideInstance)
      setOutput(
        "🐍 Python environment loaded successfully!\n✅ NumPy, Pandas, and Matplotlib are ready to use.\n\nClick 'Run' to execute your code!",
      )
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to initialize Pyodide:", error)
      setOutput("Failed to initialize Python environment.")
      setIsLoading(false)
    }
  }

  const runCode = async () => {
    if (!pyodide || isRunning) return

    setIsRunning(true)
    try {
      const result = pyodide.runPython(`
with capture_output() as (stdout, stderr):
    try:
${code
  .split("\n")
  .map((line) => `        ${line}`)
  .join("\n")}
    except Exception as e:
        print(f"Error: {e}")

stdout_content = stdout.getvalue()
stderr_content = stderr.getvalue()
output = stdout_content + stderr_content if stderr_content else stdout_content
output
`)

      setOutput(result || "✅ Code executed successfully (no output)")
    } catch (error: any) {
      setOutput(`❌ Error: ${error.message}`)
    }
    setIsRunning(false)

    // Scroll to bottom of output
    setTimeout(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight
      }
    }, 100)
  }

  const clearOutput = () => {
    setOutput("")
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "python_code.py"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col">
          <CardTitle className="text-lg font-semibold">Python Runner</CardTitle>
          <p className="text-xs text-muted-foreground">Powered by Pyodide + WebAssembly</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="default" size="sm" onClick={runCode} disabled={isLoading || isRunning}>
            {isRunning ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isRunning ? "Running..." : "Run"}
          </Button>
          <Button variant="outline" size="sm" onClick={clearOutput}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={downloadCode}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4 p-4">
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Loading Python environment...</p>
              <p className="text-xs text-muted-foreground mt-1">Downloading Pyodide (~10MB) - This may take a moment</p>
            </div>
          </div>
        )}

        {!isLoading && (
          <>
            <div className="flex-1 flex flex-col space-y-2">
              <label className="text-sm font-medium">Python Code:</label>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 font-mono text-sm min-h-[200px]"
                placeholder="Enter your Python code here..."
              />
            </div>

            <div className="flex-1 flex flex-col space-y-2">
              <label className="text-sm font-medium">Output:</label>
              <div
                ref={outputRef}
                className="flex-1 bg-muted p-3 rounded border font-mono text-sm overflow-y-auto min-h-[150px] whitespace-pre-wrap"
              >
                {output || "Run your code to see output here..."}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
