"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ThemeToggleProps {
  theme: "light" | "dark"
  onThemeChange: (theme: "light" | "dark") => void
}

export function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  return (
    <Button variant="outline" size="sm" onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}>
      {theme === "light" ? (
        <>
          <Moon className="h-4 w-4 mr-2" />
          Dark Mode
        </>
      ) : (
        <>
          <Sun className="h-4 w-4 mr-2" />
          Light Mode
        </>
      )}
    </Button>
  )
}
