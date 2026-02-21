"use client"

import * as React from "react"
import { Handshake, Loader2, TrendingUp, Target, ShieldCheck, ArrowRight } from "lucide-react"
import { optimizeSettlement, type OptimizeSettlementOutput } from "@/ai/flows/optimize-settlement"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function SettlementOptimizer() {
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<OptimizeSettlementOutput | null>(null)
  const [form, setForm] = React.useState({
    disputeDetails: "",
    financialExposure: "",
  })

  const handleOptimize = async () => {
    if (!form.disputeDetails || !form.financialExposure) return
    setLoading(true)
    try {
      const output = await optimizeSettlement({
        disputeDetails: form.disputeDetails,
        financialExposure: form.financialExposure,
      })
      setResult(output)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Handshake className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Settlement & Mediation Optimizer</h1>
        </div>
        <p className="text-muted-foreground">Pre-trial analysis for Indian disputes to estimate settlement probability and Lok Adalat/ADR pathways.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-5 glass-card border-none h-fit">
          <CardHeader>
            <CardTitle>Dispute Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Dispute Details</label>
              <Textarea 
                placeholder="Describe the core conflict, e.g. partition suit, matrimonial dispute, etc." 
                className="bg-background/50 border-white/10"
                value={form.disputeDetails}
                onChange={e => setForm({...form, disputeDetails: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Financial Exposure / Claim Value (₹)</label>
              <Input 
                placeholder="e.g. ₹10,00,000 in damages" 
                className="bg-background/50 border-white/10"
                value={form.financialExposure}
                onChange={e => setForm({...form, financialExposure: e.target.value})}
              />
            </div>
            <Button onClick={handleOptimize} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-11" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <TrendingUp className="w-4 h-4 mr-2" />}
              Forecast Settlement
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-7">
          {!result && !loading && (
            <Card className="h-full border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center p-12 text-center">
              <ShieldCheck className="w-16 h-16 text-muted-foreground/30 mb-6" />
              <p className="text-muted-foreground">Submit dispute details to calculate Indian legal settlement potential.</p>
            </Card>
          )}

          {result && !loading && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-2 gap-4">
                <Card className="glass-card border-none bg-emerald-500/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Settlement Probability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-emerald-500">{result.settlementProbability}%</div>
                    <Progress value={result.settlementProbability} className="h-1.5 mt-2 bg-emerald-500/10" />
                  </CardContent>
                </Card>
                <Card className="glass-card border-none bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-primary">Mediation Success</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-primary">{result.mediationSuccessRateForecast}%</div>
                    <Progress value={result.mediationSuccessRateForecast} className="h-1.5 mt-2 bg-primary/10" />
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-card border-none">
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                      <Target className="w-4 h-4 text-emerald-500" />
                      Suggested Negotiation Range
                    </h4>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 font-mono text-emerald-500">
                      {result.suggestedNegotiationRange}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      ADR Recommendation
                    </h4>
                    <p className="text-sm text-foreground/80 leading-relaxed italic">
                      "{result.adrPathwayRecommendation}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
