
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  BrainCircuit, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb,
  BookOpen,
  ArrowRight
} from "lucide-react"

import { predictCaseOutcome, type PredictCaseOutcomeOutput } from "@/ai/flows/predict-case-outcome"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

const caseTypes = [
  "Civil Writ Petition",
  "Criminal Appeal",
  "PIL",
  "Matrimonial",
  "Property Dispute",
  "Service Matter",
  "Insolvency/NCLT",
  "Consumer Case",
  "Cheque Bounce",
  "Motor Accident",
  "Taxation",
  "Arbitration"
]

const formSchema = z.object({
  caseType: z.string().min(2, "Required"),
  courtLevel: z.string().min(2, "Required"),
  jurisdiction: z.string().min(2, "Required"),
  facts: z.string().min(20, "Please provide more details"),
  documentary: z.number().min(0).max(100),
  witness: z.number().min(0).max(100),
  precedents: z.number().min(0).max(100),
  opponent: z.number().min(0).max(100),
})

export function OutcomePredictor() {
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<PredictCaseOutcomeOutput | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caseType: "Civil Writ Petition",
      courtLevel: "High Court",
      jurisdiction: "Delhi",
      facts: "",
      documentary: 50,
      witness: 50,
      precedents: 50,
      opponent: 50,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      const output = await predictCaseOutcome({
        caseType: values.caseType,
        courtLevel: values.courtLevel,
        jurisdiction: values.jurisdiction,
        facts: values.facts,
        evidenceStrengthSliders: {
          documentary: values.documentary,
          witness: values.witness,
          precedents: values.precedents,
          opponent: values.opponent,
        },
      })
      setResult(output)
    } catch (error: any) {
      console.error(error)
      const isQuotaError = error.message?.includes('quota') || error.message?.includes('429');
      toast({
        title: isQuotaError ? "Rate Limit Exceeded" : "Prediction Failed",
        description: isQuotaError 
          ? "The Indian Law model is experiencing high traffic. Please try again in a moment." 
          : "An error occurred while processing your case prediction.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Case Outcome Predictor</h1>
        </div>
        <p className="text-muted-foreground">Predictive modeling based on Indian case facts and evidentiary strength.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-7 glass-card border-none">
          <CardHeader>
            <CardTitle>Case Parameters</CardTitle>
            <CardDescription>Input case details and perceived evidentiary strength (Indian Context)</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <FormField
                  control={form.control}
                  name="caseType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-semibold text-foreground/80">Select Case Category</FormLabel>
                      <FormControl>
                        <ScrollArea className="w-full whitespace-nowrap rounded-xl border border-white/5 bg-white/5 p-2 shadow-inner">
                          <div className="flex w-max space-x-2 p-1">
                            {caseTypes.map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => field.onChange(type)}
                                className={cn(
                                  "inline-flex h-10 items-center justify-center rounded-lg px-6 text-xs font-bold uppercase tracking-wider transition-all duration-300",
                                  field.value === type
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105 border border-primary/20"
                                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-transparent"
                                )}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                          <ScrollBar orientation="horizontal" className="h-2" />
                        </ScrollArea>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="courtLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Court Level</FormLabel>
                        <FormControl><Input placeholder="e.g. High Court" {...field} className="bg-white/5 border-white/10" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jurisdiction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jurisdiction (State/UT)</FormLabel>
                        <FormControl><Input placeholder="e.g. Maharashtra" {...field} className="bg-white/5 border-white/10" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="facts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Core Case Facts</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide summary of facts, relevant sections (e.g. Sec 138 NI Act), and dates..."
                          className="min-h-[120px] resize-none bg-white/5 border-white/10 focus:border-primary/50 transition-colors"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-6 pt-4">
                  <FormLabel className="text-primary font-bold uppercase tracking-wider text-[10px]">Evidence Strength Assessment</FormLabel>
                  {[
                    { name: 'documentary', label: 'Documentary Evidence (Registry, Wills, etc.)' },
                    { name: 'witness', label: 'Witness Testimony' },
                    { name: 'precedents', label: 'Legal Precedents (SC/HC Judgments)' },
                    { name: 'opponent', label: 'Opponent\'s Case Strength' },
                  ].map((slider) => (
                    <FormField
                      key={slider.name}
                      control={form.control}
                      name={slider.name as any}
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <div className="flex justify-between items-center">
                            <FormLabel className="text-xs text-muted-foreground">{slider.label}</FormLabel>
                            <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{field.value}%</span>
                          </div>
                          <FormControl>
                            <Slider
                              min={0}
                              max={100}
                              step={1}
                              value={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                              className="py-2"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold uppercase tracking-widest blue-gradient shadow-xl shadow-primary/20" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Computing Prediction...
                    </>
                  ) : (
                    <>Run Prediction Engine</>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="lg:col-span-5 space-y-6">
          {!result && !loading && (
            <Card className="h-full border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <BrainCircuit className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Awaiting Intelligence Input</h3>
              <p className="text-sm text-muted-foreground">Select a case category and adjust the evidentiary strength parameters to generate a predictive judicial model.</p>
            </Card>
          )}

          {loading && (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="glass-card border-none animate-pulse">
                  <div className="h-24 bg-white/5 rounded-xl" />
                </Card>
              ))}
            </div>
          )}

          {result && !loading && (
            <div className="space-y-6 animate-in fade-in zoom-in duration-500">
              <Card className="glass-card border-none overflow-hidden ring-1 ring-primary/20">
                <CardHeader className="bg-primary/5 pb-6">
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">India Model v2.5</Badge>
                    <div className="flex items-center gap-1 text-primary">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Analysis Ready</span>
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold tracking-tight mb-2 text-primary">{result.predictedOutcome}</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${result.confidenceScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono font-bold text-primary">{result.confidenceScore}% Confidence</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-emerald-500" />
                      Strategic Strengths
                    </h4>
                    <ul className="space-y-2">
                      {result.keyStrengths.map((s, i) => (
                        <li key={i} className="text-sm flex items-start gap-3 text-foreground/80 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result.references && result.references.length > 0 && (
                    <div className="pt-4 border-t border-white/5 space-y-3">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                        <BookOpen className="w-3 h-3" />
                        Legal Precedents & References
                      </h4>
                      <div className="space-y-3">
                        {result.references.map((ref, i) => (
                          <div key={i} className="p-4 rounded-xl bg-primary/5 border border-primary/10 group hover:bg-primary/10 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm font-bold text-primary">{ref.caseName}</span>
                              <Badge variant="outline" className="text-[10px] font-mono border-primary/20">{ref.citation}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed italic">
                              {ref.relevance}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/5 space-y-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                      <Lightbulb className="w-3 h-3" />
                      Judicial Strategy Recommendations
                    </h4>
                    <div className="space-y-3">
                      {result.strategySuggestions.map((s, i) => (
                        <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 text-sm text-foreground/90 leading-relaxed italic border-l-primary/30 border-l-2">
                          "{s}"
                        </div>
                      ))}
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
