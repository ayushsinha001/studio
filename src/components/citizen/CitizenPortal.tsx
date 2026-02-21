
"use client"

import * as React from "react"
import { User, MessageSquare, Loader2, ArrowRight, HelpCircle } from "lucide-react"
import { simplifyLegal, type SimplifyLegalOutput } from "@/ai/flows/simplify-legal"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function CitizenPortal() {
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<SimplifyLegalOutput | null>(null)
  const [input, setInput] = React.useState("")

  const handleSimplify = async () => {
    if (!input.trim()) return
    setLoading(true)
    try {
      const output = await simplifyLegal({ legalText: input })
      setResult(output)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Legal Language Simplifier</h1>
        </div>
        <p className="text-muted-foreground">Citizen Mode: Converting complex orders into plain-language actionable steps.</p>
      </div>

      <Card className="glass-card border-none overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Input Judicial Order</CardTitle>
          <CardDescription>Paste the complex text you want simplified for a citizen.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="Complex legal text goes here..." 
            className="min-h-[150px] bg-background/50 border-white/5"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <Button onClick={handleSimplify} className="w-full blue-gradient rounded-xl h-11" disabled={loading || !input}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <MessageSquare className="w-4 h-4 mr-2" />}
            Simplify for Citizen
          </Button>
        </CardContent>
      </Card>

      {result && !loading && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <Card className="glass-card border-none bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Plain Language Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed text-foreground/90 font-medium">
                {result.plainSummary}
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="glass-card border-none">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">What This Means For You</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.implications.map((imp, i) => (
                    <li key={i} className="text-sm flex items-start gap-3">
                      <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {imp}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-card border-none">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Next Procedural Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.nextSteps.map((step, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {i + 1}
                      </div>
                      <p className="text-sm text-foreground/80">{step}</p>
                      <ArrowRight className="w-4 h-4 text-primary/20 ml-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
