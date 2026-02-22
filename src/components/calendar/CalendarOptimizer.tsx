
"use client"

import * as React from "react"
import { Calendar as CalendarIcon, Loader2, Sparkles, Clock, LayoutGrid, Timer } from "lucide-react"
import { optimizeCalendar, type OptimizeCalendarOutput } from "@/ai/flows/optimize-calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export function CalendarOptimizer() {
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<OptimizeCalendarOutput | null>(null)
  const { toast } = useToast()

  const pendingHearings = [
    { caseTitle: "Smith v. Matrix Corp", complexity: "High" as const },
    { caseTitle: "State v. Johnson", complexity: "Medium" as const },
    { caseTitle: "Property Dispute - Sector 4", complexity: "Low" as const },
    { caseTitle: "Contract Breach - Blue Star", complexity: "Medium" as const },
  ]

  const handleOptimize = async () => {
    setLoading(true)
    try {
      const output = await optimizeCalendar({
        pendingHearings,
        availableSlots: 4
      })
      setResult(output)
    } catch (error: any) {
      const isQuotaError = error.message?.toLowerCase().includes('quota') || error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED');
      toast({
        title: isQuotaError ? "AI Rate Limit Exceeded" : "Optimization Failed",
        description: isQuotaError 
          ? "The AI scheduler is currently handling too many requests. Please wait a few seconds and try again." 
          : "An error occurred while generating the schedule.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Court Calendar</h1>
        </div>
        <p className="text-muted-foreground">Predictive scheduling to minimize idle time and overflows.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-4 glass-card border-none h-fit">
          <CardHeader>
            <CardTitle>Pending Hearings</CardTitle>
            <CardDescription>Daily queue awaiting optimization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingHearings.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-sm font-medium">{h.caseTitle}</div>
                <Badge variant="outline" className={h.complexity === 'High' ? 'text-rose-500 border-rose-500/20' : 'text-primary border-primary/20'}>
                  {h.complexity}
                </Badge>
              </div>
            ))}
            <Button onClick={handleOptimize} className="w-full blue-gradient rounded-xl h-11" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Optimize Daily Schedule
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-8">
          {!result && !loading && (
            <Card className="h-full border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center p-12 text-center">
              <LayoutGrid className="w-16 h-16 text-muted-foreground/30 mb-6" />
              <p className="text-muted-foreground">Run optimization to generate an intelligent time-blocked schedule.</p>
            </Card>
          )}

          {result && !loading && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-2 gap-4">
                <Card className="glass-card border-none bg-emerald-500/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase text-emerald-500">Efficiency Gain</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xl font-bold">{result.efficiencyGainForecast}</CardContent>
                </Card>
                <Card className="glass-card border-none bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase text-primary">Idle Time Saved</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xl font-bold">{result.idleTimeReduction}</CardContent>
                </Card>
              </div>

              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="text-lg">Optimized Time Blocks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.optimizedSchedule.map((slot, i) => (
                    <div key={i} className="flex items-center gap-6 p-4 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                      <div className="flex flex-col items-center justify-center w-24 h-16 rounded-lg bg-primary/10 text-primary shrink-0">
                        <Clock className="w-4 h-4 mb-1" />
                        <span className="text-xs font-bold">{slot.recommendedSlotTime}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold truncate">{slot.caseTitle}</div>
                        <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-2">
                          <Timer className="w-3 h-3" />
                          Allotted: {slot.allottedMinutes} mins
                        </div>
                      </div>
                      <div className="text-xs text-primary/60 italic max-w-[200px] text-right">
                        {slot.priorityReason}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
