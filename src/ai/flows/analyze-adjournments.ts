
'use server';
/**
 * @fileOverview Genkit flow for AI Adjournment Analysis.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAdjournmentsInputSchema = z.object({
  caseId: z.string().describe('The identifier for the case.'),
  adjournmentHistory: z.array(z.object({
    date: z.string(),
    reason: z.string(),
    requestedBy: z.string(),
  })).describe('List of past adjournments for this case.'),
});
export type AnalyzeAdjournmentsInput = z.infer<typeof AnalyzeAdjournmentsInputSchema>;

const AnalyzeAdjournmentsOutputSchema = z.object({
  delayProbability: z.number().min(0).max(100),
  patternAlerts: z.array(z.string()),
  impactAnalysis: z.string(),
  recommendations: z.array(z.string()),
});
export type AnalyzeAdjournmentsOutput = z.infer<typeof AnalyzeAdjournmentsOutputSchema>;

export async function analyzeAdjournments(input: AnalyzeAdjournmentsInput): Promise<AnalyzeAdjournmentsOutput> {
  return analyzeAdjournmentsFlow(input);
}

const adjournmentPrompt = ai.definePrompt({
  name: 'analyzeAdjournmentsPrompt',
  input: {schema: AnalyzeAdjournmentsInputSchema},
  output: {schema: AnalyzeAdjournmentsOutputSchema},
  prompt: `You are CourtIQ Delay Prevention Expert. Analyze the adjournment pattern for Case {{{caseId}}}:

Adjournment History:
{{#each adjournmentHistory}}
- Date: {{{this.date}}}, Reason: {{{this.reason}}}, Requested By: {{{this.requestedBy}}}
{{/each}}

1. Calculate the probability of future delays (0-100).
2. Identify specific delay patterns (e.g., specific party requesting frequent postponements).
3. Analyze the cumulative impact on the judicial timeline.
4. Provide actionable recommendations to prevent further unnecessary adjournments.`,
});

const analyzeAdjournmentsFlow = ai.defineFlow(
  {
    name: 'analyzeAdjournmentsFlow',
    inputSchema: AnalyzeAdjournmentsInputSchema,
    outputSchema: AnalyzeAdjournmentsOutputSchema,
  },
  async input => {
    const {output} = await adjournmentPrompt(input);
    return output!;
  }
);
