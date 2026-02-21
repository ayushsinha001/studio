
"use client"

import * as React from "react"
import { Globe, TrendingUp, BarChart3, AlertCircle, Play, Settings2 } from "lucide-react"
import { simulateReform, type SimulateReformOutput } from "@/ai/flows/simulate-reform"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export function IntelligenceHub() {
  const [loading, setLoading] = React.useState(false)
  const [simulation, setSimulation] = React.useState<SimulateReformOutput | null>(null)
  const [reformInput, setReformInput] = React.useState("Increase High Court judge strength by 25% and implement mandatory e-filing.")

  const runSimulation = async () => {
    setLoading(true)
    try {
      const output = await simulateReform({
        proposedChanges: reformInput,
        currentBacklog: 5900000,
        jurisdictionType: "High Court"
      })
      setSimulation(output)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Globe className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Court Intelligence Grid</h1>
        </div>
        <p className="text-muted-foreground">National pendency heatmap and reform simulation engine.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-8 glass-card border-none">
          <CardHeader>
            <CardTitle>National Pendency Heatmap</CardTitle>
            <CardDescription>Live visualization of case clusters across India (Simulated Grid)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2 h-64">
              {Array.from({ length: 100 }).map((_, i) => {
                const intensity = Math.random()
                return (
                  <div 
                    key={i} 
                    className="rounded-sm transition-all duration-500 hover:scale-110 cursor-pointer"
                    style={{ 
                      backgroundColor: `hsl(var(--primary) / ${intensity})`,
                      opacity: 0.3 + intensity * 0.7
                    }}
                    title={`District ${i}: ${Math.floor(intensity * 10000)} pending cases`}
                  />
                )
              })}
            </div>
            <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground uppercase tracking-widest font-bold">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary opacity-20" />
                <span>Low Pendency</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>High Pendency</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 glass-card border-none h-fit">
          <CardHeader>
            <CardTitle>Policy Simulation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
               <label className="text-xs font-bold text-muted-foreground">Proposed Reform</label>
               <Input 
                 value={reformInput}
                 onChange={e => setReformInput(e.target.value)}
                 className="bg-background/50 h-10"
               />
            </div>
            <Button onClick={runSimulation} className="w-full blue-gradient rounded-xl" disabled={loading}>
              {loading ? <Settings2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              Run Reform Impact Model
            </Button>

            {simulation && (
              <div className="mt-6 pt-6 border-t border-white/5 space-y-4 animate-in fade-in zoom-in-95">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground font-bold">Reduction Forecast</div>
                  <div className="text-sm font-medium text-emerald-500">{simulation.backlogReductionForecast}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground font-bold">Time to Zero Pendency</div>
                  <div className="text-sm font-medium text-primary">{simulation.timeToZeroPendency}</div>
                </div>
                <div className="space-y-1">
                   <div className="text-xs text-muted-foreground font-bold">Key Efficiency Gains</div>
                   <div className="flex flex-wrap gap-2">
                     {simulation.efficiencyGains.map((eg, i) => (
                       <Badge key={i} variant="secondary" className="text-[10px]">{eg}</Badge>
                     ))}
                   </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-card border-none">
          <CardHeader className="pb-2">
             <div className="flex items-center gap-2 text-rose-500">
               <AlertCircle className="w-4 h-4" />
               <CardTitle className="text-sm">Adjournment Alert</CardTitle>
             </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Detected a 15% surge in "Counsel Not Available" adjournments in the North Zone. Delay probability increased by 3.2 days.
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-none">
          <CardHeader className="pb-2">
             <div className="flex items-center gap-2 text-emerald-500">
               <TrendingUp className="w-4 h-4" />
               <CardTitle className="text-sm">Disposal Index</CardTitle>
             </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.4%</div>
            <p className="text-[10px] text-muted-foreground">National average improvement since Virtual Court rollout.</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-none">
          <CardHeader className="pb-2">
             <div className="flex items-center gap-2 text-primary">
               <BarChart3 className="w-4 h-4" />
               <CardTitle className="text-sm">Productivity Metric</CardTitle>
             </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142m</div>
            <p className="text-[10px] text-muted-foreground">Avg. judgment writing time (AI-assisted drafting active).</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
