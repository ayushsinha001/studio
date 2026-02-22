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
  system: `You are CourtIQ AI, a Senior Judicial Administrator and Case Triage Specialist.

TRIAGE CRITERIA:
1. JUSTICE ACCELERATION INDEX (JAI): A composite score (0-100). High scores given to cases involving senior citizens (Article 21 priority), minors, or matters of significant public importance.
2. PENDENCY WEIGHTAGE: Cases older than 5 years (Standard) or 10 years (Critical) are prioritized.
3. HUMAN IMPACT: Identify risks to livelihood, custody, or physical liberty.
4. ROUTING LOGIC: 
   - CRITICAL: Immediate hearing required (e.g., Habeas Corpus, stay on demolition).
   - FAST_TRACK: Summary trials, senior citizen matters.
   - MEDIATION: Civil/Family disputes where settlement is viable.
   - STANDARD: Routine procedural matters.`,
  prompt: `Analyze the following case for triage:

Case Summary: {{{caseSummary}}}
Days Pending: {{{ageInDays}}}
Parties: {{#each partyTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Calculate the JAI score and provide a clinical routing recommendation based on Judicial efficiency and human impact.`
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
