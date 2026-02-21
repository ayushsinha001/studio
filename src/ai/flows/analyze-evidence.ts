
'use server';
/**
 * @fileOverview Genkit flow for deep AI Evidence Analysis.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeEvidenceInputSchema = z.object({
  documentText: z.string().describe('Text of the uploaded FIR, contract, or affidavit.'),
  documentType: z.string(),
});
export type AnalyzeEvidenceInput = z.infer<typeof AnalyzeEvidenceInputSchema>;

const AnalyzeEvidenceOutputSchema = z.object({
  extractedFacts: z.array(z.string()),
  contradictions: z.array(z.string()),
  timelineGaps: z.array(z.string()),
  evidenceStrength: z.number().min(0).max(100),
  missingDocumentation: z.array(z.string()),
});
export type AnalyzeEvidenceOutput = z.infer<typeof AnalyzeEvidenceOutputSchema>;

export async function analyzeEvidence(input: AnalyzeEvidenceInput): Promise<AnalyzeEvidenceOutput> {
  return analyzeEvidenceFlow(input);
}

const evidencePrompt = ai.definePrompt({
  name: 'analyzeEvidencePrompt',
  input: {schema: AnalyzeEvidenceInputSchema},
  output: {schema: AnalyzeEvidenceOutputSchema},
  prompt: `You are CourtIQ AI Evidence Specialist. Analyze this {{{documentType}}}:

Document Text:
{{{documentText}}}

1. Extract key facts.
2. Identify internal contradictions or inconsistencies.
3. Find timeline gaps or missing sequences of events.
4. Assess overall Evidence Strength (0-100).
5. List any missing documentation required to validate claims.`,
});

const analyzeEvidenceFlow = ai.defineFlow(
  {
    name: 'analyzeEvidenceFlow',
    inputSchema: AnalyzeEvidenceInputSchema,
    outputSchema: AnalyzeEvidenceOutputSchema,
  },
  async input => {
    const {output} = await evidencePrompt(input);
    return output!;
  }
);
