
'use server';
/**
 * @fileOverview Genkit flow for AI Case Triage and Justice Acceleration Index (JAI).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TriageCaseInputSchema = z.object({
  caseSummary: z.string().describe('Summary of the case facts and current status.'),
  ageInDays: z.number().describe('How long the case has been pending.'),
  partyTypes: z.array(z.string()).describe('Types of parties involved (e.g., Senior Citizen, Minor).'),
});
export type TriageCaseInput = z.infer<typeof TriageCaseInputSchema>;

const TriageCaseOutputSchema = z.object({
  triageCategory: z.enum(['CRITICAL', 'FAST_TRACK', 'MEDIATION', 'STANDARD']),
  jaiScore: z.number().min(0).max(100).describe('Justice Acceleration Index Score.'),
  humanImpactIndicators: z.array(z.string()),
  bailRiskAssessment: z.string().optional(),
  recommendedRouting: z.string(),
});
export type TriageCaseOutput = z.infer<typeof TriageCaseOutputSchema>;

export async function triageCase(input: TriageCaseInput): Promise<TriageCaseOutput> {
  return triageCaseFlow(input);
}

const triagePrompt = ai.definePrompt({
  name: 'triageCasePrompt',
  input: {schema: TriageCaseInputSchema},
  output: {schema: TriageCaseOutputSchema},
  prompt: `You are CourtIQ AI, a senior judicial administrator. Analyze the following case for triage:

Case Summary: {{{caseSummary}}}
Pending Days: {{{ageInDays}}}
Parties: {{#each partyTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Calculate the Justice Acceleration Index (JAI) - a priority score from 0-100 based on age, urgency, and social impact. 
Identify Human Impact Indicators (e.g., livelihood risk, child custody).
Assess Bail Risk if applicable.
Categorize into CRITICAL, FAST_TRACK, MEDIATION, or STANDARD.
Provide a clear Routing Recommendation.`,
});

const triageCaseFlow = ai.defineFlow(
  {
    name: 'triageCaseFlow',
    inputSchema: TriageCaseInputSchema,
    outputSchema: TriageCaseOutputSchema,
  },
  async input => {
    const {output} = await triagePrompt(input);
    return output!;
  }
);
