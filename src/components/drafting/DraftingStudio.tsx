
"use client"

import * as React from "react"
import { FileSignature, Loader2, Save, Download, AlertCircle, Plus, Search } from "lucide-react"
import { automateLegalDrafting, type AutomateLegalDraftingOutput } from "@/ai/flows/automate-legal-drafting"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function DraftingStudio() {
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState<AutomateLegalDraftingOutput | null>(null)
  const { toast } = useToast()
  
  const [form, setForm] = React.useState({
    documentType: "Non-Disclosure Agreement",
    partyDetails: "",
    facts: "",
    financialInfo: "",
  })

  const handleDraft = async () => {
    setLoading(true)
    try {
      const result = await automateLegalDrafting(form)
      setData(result)
    } catch (error: any) {
      const isQuotaError = error.message?.toLowerCase().includes('quota') || error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED');
      toast({
        title: isQuotaError ? "Drafting Limit Reached" : "Drafting Failed",
        description: isQuotaError 
          ? "The AI drafting studio is busy. Please wait a few seconds before generating another draft." 
          : "An error occurred while generating the legal document.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <FileSignature className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Legal Drafting Studio</h1>
          </div>
          <p className="text-muted-foreground">Professional document generation with integrated AI legal review.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-white/10">
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
          <Button className="rounded-xl blue-gradient">
            <Plus className="w-4 h-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-4 glass-card h-fit border-none sticky top-8">
          <CardHeader>
            <CardTitle className="text-lg">Document Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Input 
                value={form.documentType} 
                onChange={e => setForm({...form, documentType: e.target.value})}
                placeholder="e.g. Service Agreement" 
                className="bg-background/50 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Party Details</Label>
              <Textarea 
                value={form.partyDetails} 
                onChange={e => setForm({...form, partyDetails: e.target.value})}
                placeholder="Name, address, and legal status of all parties..." 
                className="bg-background/50 border-white/10 min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Core Provisions & Facts</Label>
              <Textarea 
                value={form.facts} 
                onChange={e => setForm({...form, facts: e.target.value})}
                placeholder="Specific terms, obligations, and dates..." 
                className="bg-background/50 border-white/10 min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Financial Information (Optional)</Label>
              <Input 
                value={form.financialInfo} 
                onChange={e => setForm({...form, financialInfo: e.target.value})}
                placeholder="Payment terms, penalties, or valuations..." 
                className="bg-background/50 border-white/10"
              />
            </div>
            <Button onClick={handleDraft} className="w-full h-11 blue-gradient rounded-xl" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileSignature className="w-4 h-4 mr-2" />}
              Generate Draft
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-8 space-y-6">
          {!data && !loading && (
            <Card className="h-[600px] border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center text-center p-12">
              <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                <FileSignature className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-xl font-bold mb-2">Initialize Your Draft</h3>
              <p className="text-muted-foreground max-w-sm">Define the document type and party details in the panel to your left to start the automated generation process.</p>
            </Card>
          )}

          {loading && (
            <div className="space-y-6 animate-pulse">
              <div className="h-[500px] bg-white/5 rounded-2xl" />
              <div className="h-48 bg-white/5 rounded-2xl" />
            </div>
          )}

          {data && !loading && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-700">
              <Card className="glass-card border-none min-h-[500px]">
                <CardHeader className="flex flex-row items-center justify-between border-b border-white/5">
                  <div>
                    <CardTitle className="text-xl">{form.documentType}</CardTitle>
                    <CardDescription>Generated Draft Document</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-lg hover:bg-white/5">
                    <Download className="w-5 h-5 text-primary" />
                  </Button>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="prose prose-invert max-w-none prose-p:leading-loose text-foreground/80 font-mono text-sm whitespace-pre-wrap">
                    {data.draft}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-3">
                <Card className="glass-card border-none bg-rose-500/5">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 text-rose-500">
                      <AlertCircle className="w-4 h-4" />
                      <CardTitle className="text-sm font-bold uppercase tracking-wider">Identified Risks</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.aiReview.risks.map((r, i) => (
                      <div key={i} className="text-xs leading-relaxed text-foreground/70">• {r}</div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="glass-card border-none bg-amber-500/5">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 text-amber-500">
                      <Search className="w-4 h-4" />
                      <CardTitle className="text-sm font-bold uppercase tracking-wider">Missing Info</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.aiReview.missingInformation.map((m, i) => (
                      <div key={i} className="text-xs leading-relaxed text-foreground/70">• {m}</div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="glass-card border-none bg-primary/5">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 text-primary">
                      <Plus className="w-4 h-4" />
                      <CardTitle className="text-sm font-bold uppercase tracking-wider">Suggested Clauses</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.aiReview.suggestedClauses.map((s, i) => (
                      <div key={i} className="text-xs leading-relaxed text-foreground/70">• {s}</div>
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
