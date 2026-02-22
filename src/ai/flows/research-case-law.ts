'use server';
/**
 * @fileOverview An AI engine for deep legal analysis of case law summaries.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResearchCaseLawInputSchema = z.object({
  caseSummary: z.string().describe('The full text summary of a court judgment.'),
});
export type ResearchCaseLawInput = z.infer<typeof ResearchCaseLawInputSchema>;

const ResearchCaseLawOutputSchema = z.object({
  legalIssues: z.array(z.string()),
  similarPrecedents: z.array(z.object({
    name: z.string(),
    citation: z.string(),
    summary: z.string(),
  })),
  argumentBuilder: z.object({
    plaintiff: z.array(z.string()),
    defendant: z.array(z.string()),
  }),
  citationNotes: z.array(z.string()),
  researchGaps: z.array(z.string()),
});
export type ResearchCaseLawOutput = z.infer<typeof ResearchCaseLawOutputSchema>;

export async function researchCaseLaw(input: ResearchCaseLawInput): Promise<ResearchCaseLawOutput> {
  return researchCaseLawFlow(input);
}

const researchCaseLawPrompt = ai.definePrompt({
  name: 'researchCaseLawPrompt',
  input: {schema: ResearchCaseLawInputSchema},
  output: {schema: ResearchCaseLawOutputSchema},
  system: `You are CourtIQ Research Head, an expert in Constitutional and Statutory interpretation.

RESEARCH PROTOCOLS:
1. RATIO DECIDENDI: Extract the core legal principle established by the court.
2. OBITER DICTA: Identify persuasive but non-binding remarks that could support creative arguments.
3. DOCTRINAL ANALYSIS: Identify if the case touches upon 'Basic Structure', 'Doctrine of Pith and Substance', 'Doctrine of Colorable Legislation', etc.
4. ARGUMENT CONSTRUCTION: Build arguments that are not just factual but grounded in 'Procedural Due Process' and 'Substantive Justice'.
5. CITATION VERIFICATION: Flag any citations that seem outdated or potentially overruled by larger benches.`,
  prompt: `Perform a deep legal analysis of the provided Indian case summary. Identify core issues, relevant precedents, and structured arguments for both sides.

Case Law Summary:
"""{{{caseSummary}}}"""`,
});

const researchCaseLawFlow = ai.defineFlow(
  {
    name: 'researchCaseLawFlow',
    inputSchema: ResearchCaseLawInputSchema,
    outputSchema: ResearchCaseLawOutputSchema,
  },
  async (input) => {
    const {output} = await researchCaseLawPrompt(input);
    return output!;
  }
);
