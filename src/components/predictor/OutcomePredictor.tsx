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
  Scale
} from "lucide-react"

import { predictCaseOutcome, type PredictCaseOutcomeOutput } from "@/ai/flows/predict-case-outcome"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"

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
    } catch (error) {
      console.error(error)
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
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="caseType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Case Type</FormLabel>
                        <FormControl><Input placeholder="e.g. Property Dispute" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="courtLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Court Level</FormLabel>
                        <FormControl><Input placeholder="e.g. High Court" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="jurisdiction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jurisdiction (State/UT)</FormLabel>
                      <FormControl><Input placeholder="e.g. Maharashtra" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="facts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Core Case Facts</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide summary of facts, relevant sections (e.g. Sec 138 NI Act), and dates..."
                          className="min-h-[120px] resize-none"
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
                          <div className="flex justify-between">
                            <FormLabel className="text-xs">{slider.label}</FormLabel>
                            <span className="text-xs font-mono text-primary">{field.value}%</span>
                          </div>
                          <FormControl>
                            <Slider
                              min={0}
                              max={100}
                              step={1}
                              value={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <Button type="submit" className="w-full h-12 rounded-xl text-base blue-gradient" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Data...
                    </>
                  ) : (
                    <>Analyze Outcome</>
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
                <BrainCircuit className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Awaiting Analysis</h3>
              <p className="text-sm text-muted-foreground">Complete the form and evidentiary assessment to generate an Indian legal prediction.</p>
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
              <Card className="glass-card border-none overflow-hidden">
                <CardHeader className="bg-primary/5 pb-6">
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="outline" className="text-primary border-primary/20">India Model v2.4</Badge>
                    <div className="flex items-center gap-1 text-primary">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Analysis Ready</span>
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold tracking-tight mb-2">{result.predictedOutcome}</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-primary h-full rounded-full" 
                        style={{ width: `${result.confidenceScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono font-bold text-primary">{result.confidenceScore}% Confidence</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-emerald-500" />
                      Key Strengths
                    </h4>
                    <ul className="space-y-2">
                      {result.keyStrengths.map((s, i) => (
                        <li key={i} className="text-sm flex items-start gap-2 text-foreground/80">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 mt-2 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-rose-500" />
                      Critical Risks
                    </h4>
                    <ul className="space-y-2">
                      {result.keyRisks.map((r, i) => (
                        <li key={i} className="text-sm flex items-start gap-2 text-foreground/80">
                          <span className="w-1 h-1 rounded-full bg-rose-500 mt-2 shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                      <Lightbulb className="w-3 h-3" />
                      Strategic Suggestions
                    </h4>
                    <div className="space-y-3">
                      {result.strategySuggestions.map((s, i) => (
                        <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/5 text-sm text-foreground/90 leading-relaxed italic">
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
