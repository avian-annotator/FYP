import { Button } from '@/components/ui/button'
import { Pen, MousePointer, Box, ChevronsLeft, ChevronsRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useState } from 'react'

export type ToolId = 'draw' | 'select' | 'box'

const tools = [
  { id: '1', label: 'draw', icon: Pen },
  { id: '2', label: 'select', icon: MousePointer },
  { id: '3', label: 'bounding box', icon: Box },
]

interface ToolSelectorSidebarProps {
  active: ToolId
  onSelect: (id: ToolId) => void
}

export function ToolSelectorSidebar({ active, onSelect }: ToolSelectorSidebarProps) {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <aside
      className={cn(
        'flex flex-col bg-gray-200 border-r transition-all duration-300 rounded',
        collapsed ? 'w-16' : 'w-40',
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <h2 className="text-lg font-semibold">Tools</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setCollapsed(!collapsed)
          }}
          className="p-1"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex flex-col gap-2 p-2">
        {tools.map(tool => (
          <Button
            key={tool.id}
            variant={active === tool.id ? 'outline' : 'ghost'}
            className={cn('justify-start gap-2 w-full', collapsed && 'justify-center')}
            onClick={() => {
              onSelect(tool.id as ToolId)
            }}
          >
            <tool.icon className="h-4 w-4" />
            {!collapsed && <span>{tool.label}</span>}
          </Button>
        ))}
      </nav>
    </aside>
  )
}
