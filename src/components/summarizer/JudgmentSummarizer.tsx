"use client"

import * as React from "react"
import { FileText, Loader2, Minimize2, Copy, CheckCircle2, AlertCircle } from "lucide-react"
import { summarizeJudgment } from "@/ai/flows/summarize-judgment"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function JudgmentSummarizer() {
  const [loading, setLoading] = React.useState(false)
  const [fullText, setFullText] = React.useState("")
  const [summary, setSummary] = React.useState("")
  const { toast } = useToast()

  const handleSummarize = async () => {
    if (!fullText.trim()) return
    if (fullText.length > 50000) {
      toast({
        title: "Input too long",
        description: "Maximum character limit is 50,000.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const result = await summarizeJudgment({ fullTextJudgment: fullText })
      setSummary(result.summary)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Judgment Summarizer</h1>
        </div>
        <p className="text-muted-foreground">Condense massive court judgments into precise, authoritative executive summaries.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 h-[600px]">
        <Card className="glass-card border-none flex flex-col">
          <CardHeader className="pb-3 border-b border-white/5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Source Judgment</CardTitle>
              <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                {fullText.length} / 50,000 Chars
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex flex-col">
            <Textarea 
              placeholder="Paste the full court judgment here..."
              className="flex-1 border-none bg-transparent resize-none p-6 text-sm leading-relaxed focus-visible:ring-0"
              value={fullText}
              onChange={(e) => setFullText(e.target.value)}
            />
            <div className="p-4 border-t border-white/5 bg-white/2">
              <Button 
                onClick={handleSummarize} 
                className="w-full blue-gradient h-11 rounded-xl" 
                disabled={loading || !fullText.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Processing Judgment...
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-4 h-4 mr-2" />
                    Summarize Now
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none flex flex-col">
          <CardHeader className="pb-3 border-b border-white/5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">AI Summary</CardTitle>
              {summary && (
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/5 text-primary">
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-6 overflow-y-auto">
            {!summary && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-8">
                <FileText className="w-16 h-16 mb-4" />
                <p className="text-sm">Summary output will appear here after processing the source text.</p>
              </div>
            )}
            
            {loading && (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-full" />
                <div className="h-4 bg-white/10 rounded w-5/6" />
                <div className="h-4 bg-white/10 rounded w-4/6" />
                <div className="h-20 bg-white/10 rounded w-full" />
                <div className="h-4 bg-white/10 rounded w-3/4" />
              </div>
            )}

            {summary && !loading && (
              <div className="animate-in fade-in duration-500 space-y-6">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm leading-relaxed text-foreground/90">
                    <span className="font-bold text-primary block mb-1">CourtIQ Executive Summary</span>
                    {summary}
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed text-amber-500/80">
                    This summary is AI-generated for research purposes. Please verify specific clauses against the source text for absolute precision in court.
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}