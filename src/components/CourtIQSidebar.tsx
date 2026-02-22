
"use client"

import * as React from "react"
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Search, 
  FileSignature, 
  Mic, 
  Gavel,
  Settings,
  LogOut,
  FileSearch,
  Handshake,
  CalendarDays
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

const mainNav = [
  { id: 'dashboard', label: 'Judicial Dashboard', icon: LayoutDashboard },
  { id: 'predictor', label: 'Outcome Predictor', icon: BrainCircuit },
  { id: 'evidence', label: 'Evidence Analyzer', icon: FileSearch },
  { id: 'calendar', label: 'Smart Calendar', icon: CalendarDays },
  { id: 'settlement', label: 'Settlement Optimizer', icon: Handshake },
  { id: 'research', label: 'Research Engine', icon: Search },
  { id: 'drafting', label: 'Drafting Studio', icon: FileSignature },
  { id: 'stenographer', label: 'AI Stenographer', icon: Mic },
]

interface CourtIQSidebarProps {
  activeTab: string
  setActiveTab: (id: string) => void
}

export function CourtIQSidebar({ activeTab, setActiveTab }: CourtIQSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="border-r border-white/5 bg-sidebar">
      <SidebarHeader className="h-20 flex items-center justify-center border-b border-white/5">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <Gavel className="w-6 h-6" />
          </div>
          <span className="text-xl font-headline font-bold tracking-tighter group-data-[collapsible=icon]:hidden">
            Court<span className="text-primary">IQ</span>
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold mb-2 group-data-[collapsible=icon]:hidden">
            Judicial Suite
          </SidebarGroupLabel>
          <SidebarMenu>
            {mainNav.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)}
                  tooltip={item.label}
                  className={`h-11 px-4 rounded-xl transition-all duration-300 hover:bg-white/5 group ${
                    activeTab === item.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <item.icon className={`w-5 h-5 transition-colors ${activeTab === item.id ? 'text-primary' : 'group-hover:text-primary'}`} />
                  <span className="font-medium group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings" className="rounded-xl h-10 hover:bg-white/5">
              <Settings className="w-5 h-5" />
              <span className="group-data-[collapsible=icon]:hidden">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sign Out" className="rounded-xl h-10 hover:bg-white/5 text-destructive hover:text-destructive">
              <LogOut className="w-5 h-5" />
              <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
