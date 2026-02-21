
"use client"

import * as React from "react"
import { Clock, Loader2, AlertTriangle, Activity, History, ListRestart } from "lucide-react"
import { analyzeAdjournments, type AnalyzeAdjournmentsOutput } from "@/ai/flows/analyze-adjournments"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function AdjournmentAnalyzer() {
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<AnalyzeAdjournmentsOutput | null>(null)
  const [history, setHistory] = React.useState([
    { date: "2023-10-12", reason: "Counsel Not Ready", requestedBy: "Plaintiff" },
    { date: "2023-11-05", reason: "Witness Absent", requestedBy: "Defendant" },
  ])

  const handleAnalyze = async () => {
    setLoading(true)
    try {
      const output = await analyzeAdjournments({
        caseId: "CASE-2024-9812",
        adjournmentHistory: history
      })
      setResult(output)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
            <Clock className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AI Adjournment Analyzer</h1>
        </div>
        <p className="text-muted-foreground">Tracking delay patterns and calculating postponement probabilities.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-6">
          <Card className="glass-card border-none">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="w-4 h-4" />
                  History
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setHistory([...history, { date: "", reason: "", requestedBy: "" }])}>
                  Add Log
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {history.map((h, i) => (
                <div key={i} className="grid grid-cols-12 gap-2">
                  <Input 
                    placeholder="Date" 
                    className="col-span-4 bg-background/50 h-8 text-xs" 
                    value={h.date} 
                    onChange={e => {
                      const newH = [...history]; newH[i].date = e.target.value; setHistory(newH);
                    }}
                  />
                  <Input 
                    placeholder="Reason" 
                    className="col-span-4 bg-background/50 h-8 text-xs" 
                    value={h.reason}
                    onChange={e => {
                      const newH = [...history]; newH[i].reason = e.target.value; setHistory(newH);
                    }}
                  />
                  <Input 
                    placeholder="Party" 
                    className="col-span-4 bg-background/50 h-8 text-xs" 
                    value={h.requestedBy}
                    onChange={e => {
                      const newH = [...history]; newH[i].requestedBy = e.target.value; setHistory(newH);
                    }}
                  />
                </div>
              ))}
              <Button onClick={handleAnalyze} className="w-full bg-rose-600 hover:bg-rose-500 text-white rounded-xl h-11" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ListRestart className="w-4 h-4 mr-2" />}
                Analyze Delay Risk
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7">
          {!result && !loading && (
            <Card className="h-full border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center p-12 text-center">
              <Activity className="w-16 h-16 text-muted-foreground/30 mb-6" />
              <p className="text-muted-foreground">Analyze the adjournment history to see risk levels and patterns.</p>
            </Card>
          )}

          {result && !loading && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <Card className="glass-card border-none bg-rose-500/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-rose-500">Delay Probability</CardTitle>
                    <Badge variant="outline" className="text-rose-500 border-rose-500/20">{result.delayProbability}%</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={result.delayProbability} className="h-2 bg-rose-500/10" />
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass-card border-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                      <AlertTriangle className="w-4 h-4" />
                      Pattern Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {result.patternAlerts.map((alert, i) => (
                      <div key={i} className="text-xs p-2 rounded-lg bg-white/5 border border-white/5">• {alert}</div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="glass-card border-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-500">
                      <Activity className="w-4 h-4" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <div key={i} className="text-xs p-2 rounded-lg bg-white/5 border border-white/5">• {rec}</div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="text-sm">Impact Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 leading-relaxed italic">
                    "{result.impactAnalysis}"
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
