
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
        <CourtIQSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <SidebarInset className="bg-background">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between px-8 border-b border-white/5 bg-background/80 backdrop-blur-md">
            <div className="flex items-center gap-6">
              <SidebarTrigger className="h-10 w-10 text-muted-foreground hover:text-primary transition-colors" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Active Session</span>
                <span className="text-sm font-semibold">Judicial Intelligence Grid v2.5</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
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
              <span className="opacity-50">Enterprise Judicial Grade</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Secure Connection: Encrypted</span>
            </div>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
