
"use client"

import * as React from "react"
import { FileSearch, Loader2, CheckCircle2, AlertCircle, AlertTriangle, HelpCircle, Activity } from "lucide-react"
import { analyzeEvidence, type AnalyzeEvidenceOutput } from "@/ai/flows/analyze-evidence"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export function EvidenceHub() {
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState<AnalyzeEvidenceOutput | null>(null)
  const [input, setInput] = React.useState("")
  const { toast } = useToast()

  const handleAnalyze = async () => {
    if (!input.trim()) return
    setLoading(true)
    try {
      const result = await analyzeEvidence({ 
        documentText: input,
        documentType: "First Information Report (FIR)"
      })
      setData(result)
    } catch (error: any) {
      console.error(error)
      const isQuotaError = error.message?.includes('quota') || error.message?.includes('429');
      toast({
        title: isQuotaError ? "Rate Limit Exceeded" : "Analysis Failed",
        description: isQuotaError 
          ? "AI limits reached. Please try again in a few seconds." 
          : "Could not analyze the provided evidence document.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <FileSearch className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AI Evidence Analyzer</h1>
        </div>
        <p className="text-muted-foreground">Extract facts, detect contradictions, and assess evidentiary strength.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-5 glass-card border-none">
          <CardHeader>
            <CardTitle>Evidence Intake</CardTitle>
            <CardDescription>Paste text from FIRs, affidavits, or charge sheets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              className="min-h-[300px] bg-background/50 border-white/5 font-mono text-sm"
              placeholder="Paste document text here..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <Button onClick={handleAnalyze} className="w-full blue-gradient rounded-xl h-11" disabled={loading || !input}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileSearch className="w-4 h-4 mr-2" />}
              Deep Evidence Analysis
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-7 space-y-6">
          {!data && !loading && (
            <Card className="h-full border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center p-12 text-center">
              <Activity className="w-16 h-16 text-muted-foreground/30 mb-6" />
              <h3 className="text-xl font-bold mb-2">Awaiting Evidence</h3>
              <p className="text-muted-foreground">Upload a document to begin fact extraction and contradiction detection.</p>
            </Card>
          )}

          {data && !loading && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <Card className="glass-card border-none">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Analysis Summary</CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Strength Score</div>
                      <div className="text-xl font-bold text-primary">{data.evidenceStrength}%</div>
                    </div>
                    <Progress value={data.evidenceStrength} className="w-24 h-2" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3" />
                        Extracted Facts
                      </h4>
                      <ul className="space-y-2">
                        {data.extractedFacts.map((f, i) => (
                          <li key={i} className="text-xs text-foreground/80 leading-relaxed">• {f}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-rose-500 flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3" />
                        Contradictions
                      </h4>
                      <ul className="space-y-2">
                        {data.contradictions.map((c, i) => (
                          <li key={i} className="text-xs text-foreground/80 leading-relaxed">• {c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2">
                        <Activity className="w-3 h-3" />
                        Timeline Gaps
                      </h4>
                      <ul className="space-y-2">
                        {data.timelineGaps.map((g, i) => (
                          <li key={i} className="text-xs text-foreground/80 leading-relaxed">• {g}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                        <HelpCircle className="w-3 h-3" />
                        Missing Docs
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {data.missingDocumentation.map((m, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] border-primary/20 text-primary">
                            {m}
                          </Badge>
                        ))}
                      </div>
                    </div>
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
