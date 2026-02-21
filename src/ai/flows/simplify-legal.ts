
'use server';
/**
 * @fileOverview Genkit flow for Legal Language Simplifier (Citizen Mode).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimplifyLegalInputSchema = z.object({
  legalText: z.string().describe('Complex legal order or judgment.'),
});
export type SimplifyLegalInput = z.infer<typeof SimplifyLegalInputSchema>;

const SimplifyLegalOutputSchema = z.object({
  plainSummary: z.string(),
  implications: z.array(z.string()),
  nextSteps: z.array(z.string()),
});
export type SimplifyLegalOutput = z.infer<typeof SimplifyLegalOutputSchema>;

export async function simplifyLegal(input: SimplifyLegalInput): Promise<SimplifyLegalOutput> {
  return simplifyLegalFlow(input);
}

const simplifyPrompt = ai.definePrompt({
  name: 'simplifyLegalPrompt',
  input: {schema: SimplifyLegalInputSchema},
  output: {schema: SimplifyLegalOutputSchema},
  prompt: `You are CourtIQ AI Citizen Assistant. Convert the following complex legal text into plain, simple language for a non-lawyer:

Legal Text:
{{{legalText}}}

Provide:
1. A very simple summary.
2. The implications for the citizen (what this means for them).
3. Clear, step-by-step next procedural actions.`,
});

const simplifyLegalFlow = ai.defineFlow(
  {
    name: 'simplifyLegalFlow',
    inputSchema: SimplifyLegalInputSchema,
    outputSchema: SimplifyLegalOutputSchema,
  },
  async input => {
    const {output} = await simplifyPrompt(input);
    return output!;
  }
);
