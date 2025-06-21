"use client"

import type * as React from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"

interface ResizablePanelsProps {
  children: [React.ReactNode, React.ReactNode, React.ReactNode]
  defaultSizes?: [number, number, number]
  minSizes?: [number, number, number]
}

export function ResizablePanels({
  children,
  defaultSizes = [25, 50, 25],
  minSizes = [20, 30, 20],
}: ResizablePanelsProps) {
  return (
    <PanelGroup direction="horizontal" className="h-full">
      <Panel defaultSize={defaultSizes[0]} minSize={minSizes[0]}>
        {children[0]}
      </Panel>
      <PanelResizeHandle className="w-px bg-border hover:bg-accent transition-colors cursor-col-resize" />
      <Panel defaultSize={defaultSizes[1]} minSize={minSizes[1]}>
        {children[1]}
      </Panel>
      <PanelResizeHandle className="w-px bg-border hover:bg-accent transition-colors cursor-col-resize" />
      <Panel defaultSize={defaultSizes[2]} minSize={minSizes[2]}>
        {children[2]}
      </Panel>
    </PanelGroup>
  )
}
