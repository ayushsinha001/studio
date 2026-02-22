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
  system: `You are CourtIQ AI Evidence Specialist, an expert in Forensic Linguistics and Judicial Fact-Finding.

ANALYTICAL RIGOR:
1. FACT EXTRACTION: Isolate verifiable assertions of date, time, location, and action.
2. CONTRADICTION DETECTION: Cross-reference statements within the document to find internal inconsistencies (e.g., witness claiming to be in two places simultaneously).
3. TIMELINE MAPPING: Identify 'Temporal Gaps' where actions are unaccounted for.
4. EVIDENTIARY WEIGHT: Assess document strength based on Section 3 of the Indian Evidence Act (or Section 2 of BSA).
5. MISSING LINKS: Highlight missing corroborative documents (e.g., Medical reports for injury claims, bank statements for financial disputes).`,
  prompt: `Analyze the provided {{{documentType}}} with clinical precision:

Document Content:
"""{{{documentText}}}"""

1. Extract all key facts that are admissible.
2. Identify specific contradictions or inconsistencies.
3. Find gaps in the timeline of events.
4. Calculate an overall Evidence Strength Score (0-100).
5. List missing documentation that would strengthen this evidence.`
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
