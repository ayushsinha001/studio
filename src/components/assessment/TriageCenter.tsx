
"use client"

import * as React from "react"
import { Scale, Loader2, Zap, UserCheck, AlertTriangle, Route } from "lucide-react"
import { triageCase, type TriageCaseOutput } from "@/ai/flows/triage-case"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function TriageCenter() {
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<TriageCaseOutput | null>(null)
  
  const [form, setForm] = React.useState({
    caseSummary: "",
    ageInDays: 0,
    partyTypes: ""
  })

  const handleTriage = async () => {
    setLoading(true)
    try {
      const output = await triageCase({
        caseSummary: form.caseSummary,
        ageInDays: Number(form.ageInDays),
        partyTypes: form.partyTypes.split(',').map(s => s.trim())
      })
      setResult(output)
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
            <Zap className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AI Case Triage & JAI</h1>
        </div>
        <p className="text-muted-foreground">Automated routing and Justice Acceleration Index scoring.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-5 glass-card border-none h-fit">
          <CardHeader>
            <CardTitle>Intake Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Case Summary</label>
              <Textarea 
                placeholder="Brief facts of the case..." 
                className="bg-background/50"
                value={form.caseSummary}
                onChange={e => setForm({...form, caseSummary: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Age (Days)</label>
                <Input 
                  type="number" 
                  className="bg-background/50"
                  value={form.ageInDays}
                  onChange={e => setForm({...form, ageInDays: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Parties (CSV)</label>
                <Input 
                  placeholder="e.g. Senior Citizen, Minor" 
                  className="bg-background/50"
                  value={form.partyTypes}
                  onChange={e => setForm({...form, partyTypes: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={handleTriage} className="w-full blue-gradient rounded-xl h-11" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
              Run Triage Analysis
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-7 space-y-6">
          {!result && !loading && (
            <Card className="h-64 border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center">
              <Scale className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Input case details to generate triage data.</p>
            </Card>
          )}

          {result && !loading && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-2 gap-4">
                <Card className="glass-card border-none bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary">JAI Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-primary">{result.jaiScore}</div>
                    <Progress value={result.jaiScore} className="h-1.5 mt-2 bg-primary/10" />
                  </CardContent>
                </Card>
                <Card className="glass-card border-none bg-emerald-500/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-emerald-500">Triage Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className="text-lg py-1 px-4 rounded-lg bg-emerald-500/20 text-emerald-500 border-emerald-500/20">
                      {result.triageCategory}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-card border-none">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Route className="w-4 h-4 text-primary" />
                    <CardTitle className="text-lg">Routing Strategy</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-sm leading-relaxed italic">
                    "{result.recommendedRouting}"
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Human Impact Indicators</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.humanImpactIndicators.map((hi, i) => (
                        <Badge key={i} variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                          {hi}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {result.bailRiskAssessment && (
                    <div className="pt-4 border-t border-white/5 space-y-2">
                       <h4 className="text-xs font-bold uppercase tracking-widest text-rose-500 flex items-center gap-2">
                         <AlertTriangle className="w-3 h-3" />
                         Undertrial & Bail Insights
                       </h4>
                       <p className="text-sm text-foreground/80">{result.bailRiskAssessment}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
