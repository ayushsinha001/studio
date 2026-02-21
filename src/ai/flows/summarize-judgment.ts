'use server';
/**
 * @fileOverview A Genkit flow for summarizing full-text court judgments.
 *
 * - summarizeJudgment - A function that handles the judgment summarization process.
 * - SummarizeJudgmentInput - The input type for the summarizeJudgment function.
 * - SummarizeJudgmentOutput - The return type for the summarizeJudgment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeJudgmentInputSchema = z.object({
  fullTextJudgment: z
    .string()
    .max(50000, 'Judgment text cannot exceed 50,000 characters.')
    .describe('The full text of a court judgment to be summarized.'),
});
export type SummarizeJudgmentInput = z.infer<typeof SummarizeJudgmentInputSchema>;

const SummarizeJudgmentOutputSchema = z.object({
  summary: z.string().describe('A concise, accurate summary of the court judgment.'),
});
export type SummarizeJudgmentOutput = z.infer<typeof SummarizeJudgmentOutputSchema>;

export async function summarizeJudgment(
  input: SummarizeJudgmentInput
): Promise<SummarizeJudgmentOutput> {
  return summarizeJudgmentFlow(input);
}

const summarizeJudgmentPrompt = ai.definePrompt({
  name: 'summarizeJudgmentPrompt',
  input: {schema: SummarizeJudgmentInputSchema},
  output: {schema: SummarizeJudgmentOutputSchema},
  system: `You are CourtIQ AI, a senior legal associate and research expert. Maintain a professional, neutral, and assertive tone. Prioritize legal accuracy and structural formality. Never provide legal advice to laypeople; provide research and drafting assistance exclusively to legal professionals.`,
  prompt: `Summarize the following court judgment concisely, highlighting key information, legal issues, findings, and the final decision. Ensure the summary is accurate and retains a formal, legal tone.

Court Judgment Text:
{{{fullTextJudgment}}}`,
});

const summarizeJudgmentFlow = ai.defineFlow(
  {
    name: 'summarizeJudgmentFlow',
    inputSchema: SummarizeJudgmentInputSchema,
    outputSchema: SummarizeJudgmentOutputSchema,
  },
  async input => {
    const {output} = await summarizeJudgmentPrompt(input);
    return output!;
  }
);
