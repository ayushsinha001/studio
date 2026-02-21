'use server';
/**
 * @fileOverview An AI engine for deep legal analysis of case law summaries.
 *
 * - researchCaseLaw - A function that analyzes a case law summary to extract legal issues,
 *   find similar precedents, build arguments, and identify research gaps.
 * - ResearchCaseLawInput - The input type for the researchCaseLaw function.
 * - ResearchCaseLawOutput - The return type for the researchCaseLaw function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResearchCaseLawInputSchema = z.object({
  caseSummary: z
    .string()
    .describe('The full text summary of a court judgment or case law.'),
});
export type ResearchCaseLawInput = z.infer<typeof ResearchCaseLawInputSchema>;

const ResearchCaseLawOutputSchema = z.object({
  legalIssues: z
    .array(z.string().describe('A specific legal issue identified in the case summary.'))
    .describe('A list of all pertinent legal issues extracted from the case summary.'),
  similarPrecedents: z
    .array(
      z.object({
        name: z.string().describe('The name of the similar precedent case.'),
        citation: z
          .string()
          .describe('The legal citation for the similar precedent case.'),
        summary: z
          .string()
          .describe('A brief summary of the similar precedent case and its relevance.'),
      })
    )
    .describe('A list of similar legal precedents relevant to the case summary.'),
  argumentBuilder: z
    .object({
      plaintiff: z
        .array(z.string().describe('A key argument or point for the plaintiff.'))
        .describe('Key arguments and points that can be made on behalf of the plaintiff.'),
      defendant: z
        .array(z.string().describe('A key argument or point for the defendant.'))
        .describe('Key arguments and points that can be made on behalf of the defendant.'),
    })
    .describe('Structured arguments for both the plaintiff and the defendant.'),
  citationNotes: z
    .array(z.string().describe('An important note or observation regarding a citation.'))
    .describe(
      'Important notes, observations, or warnings related to citations or legal references.'
    ),
  researchGaps: z
    .array(
      z
        .string()
        .describe(
          'An area of the case requiring further investigation or information.'
        )
    )
    .describe('Identified areas where further legal research is required.'),
});
export type ResearchCaseLawOutput = z.infer<typeof ResearchCaseLawOutputSchema>;

export async function researchCaseLaw(
  input: ResearchCaseLawInput
): Promise<ResearchCaseLawOutput> {
  return researchCaseLawFlow(input);
}

const researchCaseLawPrompt = ai.definePrompt({
  name: 'researchCaseLawPrompt',
  input: {schema: ResearchCaseLawInputSchema},
  output: {schema: ResearchCaseLawOutputSchema},
  prompt: `You are CourtIQ AI, a senior legal associate and research expert. Maintain a professional, neutral, and assertive tone. Prioritize legal accuracy and structural formality. Never provide legal advice to laypeople; provide research and drafting assistance exclusively to legal professionals.

Your task is to perform a deep legal analysis of the provided case law summary. Extract the following information in a structured JSON format based on the provided schema:

1. Legal Issues: Identify all key legal issues present in the case summary.
2. Similar Precedents: Find and summarize similar legal precedents that could be relevant, including their names and citations.
3. Argument Builder: Develop key arguments for both the Plaintiff and the Defendant based on the facts and legal issues.
4. Citation Notes: Provide any critical notes or observations related to citations or legal references.
5. Research Gaps: Point out areas where further research would be beneficial to strengthen understanding or arguments.

Case Law Summary:
"""{{{caseSummary}}}"""
`,
});

const researchCaseLawFlow = ai.defineFlow(
  {
    name: 'researchCaseLawFlow',
    inputSchema: ResearchCaseLawInputSchema,
    outputSchema: ResearchCaseLawOutputSchema,
  },
  async (input) => {
    const {output} = await researchCaseLawPrompt(input);
    if (!output) {
      throw new Error('Failed to generate research analysis.');
    }
    return output;
  }
);
