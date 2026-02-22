
"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { CourtIQSidebar } from "@/components/CourtIQSidebar"
import { JudicialDashboard } from "@/components/dashboard/JudicialDashboard"
import { OutcomePredictor } from "@/components/predictor/OutcomePredictor"
import { ResearchEngine } from "@/components/research/ResearchEngine"
import { DraftingStudio } from "@/components/drafting/DraftingStudio"
import { Stenographer } from "@/components/stenographer/Stenographer"
import { EvidenceHub } from "@/components/evidence/EvidenceHub"
import { SettlementOptimizer } from "@/components/settlement/SettlementOptimizer"
import { CalendarOptimizer } from "@/components/calendar/CalendarOptimizer"
import { Bell, Search } from "lucide-react"

export default function CourtIQApp() {
  const [activeTab, setActiveTab] = React.useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <JudicialDashboard />
      case "predictor": return <OutcomePredictor />
      case "evidence": return <EvidenceHub />
      case "calendar": return <CalendarOptimizer />
      case "settlement": return <SettlementOptimizer />
      case "research": return <ResearchEngine />
      case "drafting": return <DraftingStudio />
      case "stenographer": return <Stenographer />
      default: return <JudicialDashboard />
    }
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        < CourtIQSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <SidebarInset className="bg-background">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between px-8 border-b border-white/5 bg-background/80 backdrop-blur-md">
            <div className="flex items-center gap-6">
              <SidebarTrigger className="h-10 w-10 text-muted-foreground hover:text-primary transition-colors" />
              <div className="relative hidden md:block w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Global Search (Records, Cases, Laws)..."
                  className="w-full h-11 bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-muted-foreground hover:text-primary transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-white/5">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold tracking-tight">Hon. Michael S.</div>
                  <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Supreme Court Justice</div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/20">
                  MS
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8 lg:p-12">
            {renderContent()}
          </main>
          
          <footer className="px-8 py-6 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-6">
              <span>&copy; 2024 CourtIQ Legal Intelligence System</span>
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Compliance</a>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>System Status: Operational</span>
            </div>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
