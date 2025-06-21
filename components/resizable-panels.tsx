"use client"

import type * as React from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"

interface ResizablePanelsProps {
  children: [React.ReactNode, React.ReactNode]
  defaultSizes?: [number, number]
  minSizes?: [number, number]
}

export function ResizablePanels({ children, defaultSizes = [50, 50], minSizes = [30, 30] }: ResizablePanelsProps) {
  return (
    <PanelGroup direction="horizontal" className="h-full">
      <Panel defaultSize={defaultSizes[0]} minSize={minSizes[0]}>
        {children[0]}
      </Panel>
      <PanelResizeHandle className="w-2 bg-border hover:bg-accent transition-colors cursor-col-resize" />
      <Panel defaultSize={defaultSizes[1]} minSize={minSizes[1]}>
        {children[1]}
      </Panel>
    </PanelGroup>
  )
}
