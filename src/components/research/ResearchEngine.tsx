
"use client"

import * as React from "react"
import { Search, Loader2, BookOpen, Scale, FileText, HelpCircle } from "lucide-react"
import { researchCaseLaw, type ResearchCaseLawOutput } from "@/ai/flows/research-case-law"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export function ResearchEngine() {
  const [loading, setLoading] = React.useState(false)
  const [summary, setSummary] = React.useState("")
  const [data, setData] = React.useState<ResearchCaseLawOutput | null>(null)
  const { toast } = useToast()

  const handleResearch = async () => {
    if (!summary.trim()) return
    setLoading(true)
    try {
      const result = await researchCaseLaw({ caseSummary: summary })
      setData(result)
    } catch (error: any) {
      const isQuotaError = error.message?.toLowerCase().includes('quota') || error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED');
      toast({
        title: isQuotaError ? "Rate Limit Exceeded" : "Research Failed",
        description: isQuotaError 
          ? "The legal database is experiencing high traffic. Please try again in a few seconds." 
          : "An error occurred while analyzing the case summary.",
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
            <Search className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AI Case Law Research</h1>
        </div>
        <p className="text-muted-foreground">Extract insights, building arguments, and identify precedents from any case summary.</p>
      </div>

      <div className="space-y-4">
        <Card className="glass-card border-none overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Research Focus</CardTitle>
            <CardDescription>Paste the case summary or judgment snippet you wish to analyze.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="Case summary goes here..." 
              className="min-h-[150px] bg-background/50 border-white/10 rounded-xl"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
            <Button onClick={handleResearch} disabled={loading || !summary} className="w-full blue-gradient h-11 rounded-xl">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <BookOpen className="w-4 h-4 mr-2" />}
              Deep Research Analysis
            </Button>
          </CardContent>
        </Card>

        {loading && (
          <div className="grid gap-6">
            <Card className="glass-card h-64 animate-pulse flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-sm font-medium text-muted-foreground">Consulting legal database...</p>
              </div>
            </Card>
          </div>
        )}

        {data && !loading && (
          <Tabs defaultValue="issues" className="w-full animate-in fade-in duration-700">
            <TabsList className="bg-card/50 border border-white/5 p-1 rounded-2xl grid grid-cols-5 h-auto">
              <TabsTrigger value="issues" className="rounded-xl py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Legal Issues</TabsTrigger>
              <TabsTrigger value="precedents" className="rounded-xl py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Precedents</TabsTrigger>
              <TabsTrigger value="arguments" className="rounded-xl py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Arguments</TabsTrigger>
              <TabsTrigger value="citations" className="rounded-xl py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Citations</TabsTrigger>
              <TabsTrigger value="gaps" className="rounded-xl py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Gaps</TabsTrigger>
            </TabsList>

            <TabsContent value="issues" className="mt-6">
              <div className="grid gap-4">
                {data.legalIssues.map((issue, i) => (
                  <Card key={i} className="glass-card border-none hover:bg-white/5 transition-colors">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Scale className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-foreground/90 font-medium leading-relaxed">{issue}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="precedents" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                {data.similarPrecedents.map((prec, i) => (
                  <Card key={i} className="glass-card border-none flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg text-primary">{prec.name}</CardTitle>
                        <Badge variant="outline" className="font-mono text-[10px]">{prec.citation}</Badge>
                      </div>
                      <CardDescription className="text-foreground/80 leading-relaxed">{prec.summary}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="arguments" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass-card border-l-4 border-l-emerald-500/50">
                  <CardHeader>
                    <CardTitle className="text-emerald-500 flex items-center gap-2">
                      <Scale className="w-5 h-5" />
                      Plaintiff's Arguments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {data.argumentBuilder.plaintiff.map((arg, i) => (
                      <div key={i} className="flex gap-3 text-sm text-foreground/80 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        {arg}
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="glass-card border-l-4 border-l-rose-500/50">
                  <CardHeader>
                    <CardTitle className="text-rose-500 flex items-center gap-2">
                      <Scale className="w-5 h-5" />
                      Defendant's Arguments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {data.argumentBuilder.defendant.map((arg, i) => (
                      <div key={i} className="flex gap-3 text-sm text-foreground/80 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        {arg}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="citations" className="mt-6">
              <Card className="glass-card border-none">
                <CardContent className="p-8 space-y-6">
                  {data.citationNotes.map((note, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                      <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm leading-relaxed">{note}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gaps" className="mt-6">
              <div className="grid gap-4">
                {data.researchGaps.map((gap, i) => (
                  <Card key={i} className="glass-card border-none border-l-2 border-l-primary">
                    <CardContent className="p-6 flex items-start gap-4">
                      <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                      <p className="text-foreground/90 font-medium">{gap}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
