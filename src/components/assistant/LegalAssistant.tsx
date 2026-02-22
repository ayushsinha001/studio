
"use client"

import * as React from "react"
import { Sparkles, Loader2, Send, MessageSquare, Book, Scale, ArrowRight } from "lucide-react"
import { legalAssistant, type LegalAssistantOutput } from "@/ai/flows/legal-assistant"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export function LegalAssistant() {
  const [loading, setLoading] = React.useState(false)
  const [input, setInput] = React.useState("")
  const [result, setResult] = React.useState<LegalAssistantOutput | null>(null)

  const handleConsult = async () => {
    if (!input.trim()) return
    setLoading(true)
    try {
      const output = await legalAssistant({ message: input })
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
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AI Legal Assistant</h1>
        </div>
        <p className="text-muted-foreground">General-purpose judicial intelligence for case strategy and statutory interpretation.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-6">
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="text-lg">Query the Intelligence Grid</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Ask about case law, statutory sections, or procedural strategy..."
                className="min-h-[200px] bg-background/50 border-white/10"
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <Button onClick={handleConsult} className="w-full blue-gradient rounded-xl h-11" disabled={loading || !input}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                Consult AI Assistant
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7">
          {!result && !loading && (
            <Card className="h-full border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center p-12 text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground/30 mb-6" />
              <p className="text-muted-foreground italic">"I am ready to assist with your judicial inquiries. Please provide a query to begin."</p>
            </Card>
          )}

          {loading && (
            <div className="space-y-6">
              <Card className="glass-card border-none animate-pulse h-48" />
              <Card className="glass-card border-none animate-pulse h-64" />
            </div>
          )}

          {result && !loading && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <Card className="glass-card border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    Judicial Response
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {result.response}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass-card border-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      Suggested Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {result.suggestedActions.map((action, i) => (
                      <div key={i} className="text-xs p-3 rounded-lg bg-white/5 border border-white/5 font-medium">• {action}</div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="glass-card border-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2">
                      <Book className="w-4 h-4" />
                      Statutory Citations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {result.relevantStatutes.map((stat, i) => (
                      <Badge key={i} variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 py-1.5 px-3">
                        {stat}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
