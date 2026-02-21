"use client"

import * as React from "react"
import { Mic, Upload, Loader2, Play, Square, FileText, CheckCircle } from "lucide-react"
import { transcribeCourtProceedings } from "@/ai/flows/transcribe-court-proceedings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function Stenographer() {
  const [loading, setLoading] = React.useState(false)
  const [transcription, setTranscription] = React.useState("")
  const [progress, setProgress] = React.useState(0)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setProgress(10)
    
    // Convert file to Base64 data URI
    const reader = new FileReader()
    reader.onload = async () => {
      setProgress(40)
      try {
        const audioDataUri = reader.result as string
        const result = await transcribeCourtProceedings({ audioDataUri })
        setProgress(100)
        setTranscription(result.transcription)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Mic className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AI Court Stenographer</h1>
        </div>
        <p className="text-muted-foreground">High-fidelity transcription of court proceedings with speaker identification.</p>
      </div>

      <Card className="glass-card border-none p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1">
          {loading && <Progress value={progress} className="h-full rounded-none bg-white/5" />}
        </div>
        
        <div className="w-24 h-24 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center mb-6">
          {loading ? (
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          ) : (
            <Mic className="w-12 h-12 text-primary" />
          )}
        </div>
        
        <h3 className="text-2xl font-bold mb-3">
          {loading ? "Transcribing Proceedings..." : "Start Official Transcription"}
        </h3>
        <p className="text-muted-foreground max-w-md mb-8">
          Upload audio recordings to begin transcription. AI will automatically separate speakers and format as a legal transcript.
        </p>

        <div className="flex gap-4">
          <input 
            type="file" 
            id="audio-upload" 
            className="hidden" 
            accept="audio/*" 
            onChange={handleFileUpload} 
          />
          <Button 
            variant="outline" 
            className="h-12 px-8 rounded-xl border-white/10" 
            disabled={loading}
            onClick={() => document.getElementById('audio-upload')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Audio File
          </Button>
        </div>
      </Card>

      {transcription && !loading && (
        <Card className="glass-card border-none animate-in fade-in duration-700">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Official Transcript</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-emerald-500 border-emerald-500/20">
                <CheckCircle className="w-3 h-3 mr-1" /> Verified by CourtIQ AI
              </Badge>
              <Button size="sm" variant="ghost" className="text-xs h-8">Copy All</Button>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="prose prose-invert max-w-none prose-p:leading-relaxed text-foreground/90 font-mono text-sm space-y-4">
              {transcription.split('\n').map((line, i) => (
                <p key={i} className="m-0">{line}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
