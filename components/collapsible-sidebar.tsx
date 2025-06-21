"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChevronLeft, ChevronRight, Settings, Palette } from "lucide-react"
import { cn } from "@/lib/utils"

interface CollapsibleSidebarProps {
  children: React.ReactNode
  side: "left" | "right"
  defaultOpen?: boolean
  className?: string
  onToggle?: (isOpen: boolean) => void
}

export function CollapsibleSidebar({
  children,
  side,
  defaultOpen = true,
  className,
  onToggle,
}: CollapsibleSidebarProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleToggle = () => {
    const newState = !isOpen
    setIsOpen(newState)
    onToggle?.(newState)
  }

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="fixed top-20 z-50 bg-background/95 backdrop-blur-sm border shadow-md"
            style={{ [side]: "1rem" }}
          >
            {side === "left" ? <Settings className="h-4 w-4" /> : <Palette className="h-4 w-4" />}
          </Button>
        </SheetTrigger>
        <SheetContent side={side} className="w-80 p-0">
          {children}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <>
      {/* Enhanced Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggle}
        className={cn(
          "fixed top-1/2 -translate-y-1/2 z-50 h-12 w-8 p-0 rounded-md border shadow-md",
          "bg-background/95 backdrop-blur-sm hover:bg-accent transition-all duration-200",
          side === "left" ? `${isOpen ? "left-80" : "left-2"}` : `${isOpen ? "right-80" : "right-2"}`,
          !isOpen && "hover:scale-110",
        )}
        title={`${isOpen ? "Close" : "Open"} ${side} panel`}
      >
        <div className="flex flex-col items-center space-y-1">
          {side === "left" ? (
            isOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <>
                <Settings className="h-3 w-3" />
                <ChevronRight className="h-3 w-3" />
              </>
            )
          ) : isOpen ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <Palette className="h-3 w-3" />
              <ChevronLeft className="h-3 w-3" />
            </>
          )}
        </div>
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 h-full bg-background border-r transition-transform duration-300 ease-in-out z-40",
          side === "left" ? "left-0" : "right-0",
          isOpen ? "translate-x-0" : side === "left" ? "-translate-x-full" : "translate-x-full",
          className,
        )}
        style={{ width: "320px" }}
      >
        {children}
      </div>
    </>
  )
}
