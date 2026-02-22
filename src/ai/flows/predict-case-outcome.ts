'use server';
/**
 * @fileOverview A Genkit flow for predicting the outcome of a legal case based on various inputs, localized for the Indian context.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictCaseOutcomeInputSchema = z.object({
  caseType: z.string().min(2).describe('The type of the legal case (e.g., Civil, Criminal).'),
  courtLevel: z.string().min(2).describe('The level of the court (e.g., High Court).'),
  jurisdiction: z.string().min(2).describe('The Indian state or union territory.'),
  facts: z.string().min(10).describe('Detailed facts of the case.'),
  evidenceStrengthSliders: z.object({
    documentary: z.number().min(0).max(100),
    witness: z.number().min(0).max(100),
    precedents: z.number().min(0).max(100),
    opponent: z.number().min(0).max(100)
  })
});
export type PredictCaseOutcomeInput = z.infer<typeof PredictCaseOutcomeInputSchema>;

const PredictCaseOutcomeOutputSchema = z.object({
  predictedOutcome: z.string(),
  confidenceScore: z.number().min(0).max(100),
  keyStrengths: z.array(z.string()),
  keyRisks: z.array(z.string()),
  strategySuggestions: z.array(z.string()),
  references: z.array(z.object({
    caseName: z.string(),
    citation: z.string(),
    relevance: z.string()
  }))
});
export type PredictCaseOutcomeOutput = z.infer<typeof PredictCaseOutcomeOutputSchema>;

export async function predictCaseOutcome(input: PredictCaseOutcomeInput): Promise<PredictCaseOutcomeOutput> {
  return predictCaseOutcomeFlow(input);
}

const predictCaseOutcomePrompt = ai.definePrompt({
  name: 'predictCaseOutcomePrompt',
  input: {schema: PredictCaseOutcomeInputSchema},
  output: {schema: PredictCaseOutcomeOutputSchema},
  system: `You are the CourtIQ Predictive Intelligence Engine, specialized in Indian Jurisprudence.

ANALYTICAL FRAMEWORK:
1. EVIDENTIARY WEIGHTAGE: In Civil cases, prioritize 'Preponderance of Probabilities'. In Criminal cases, use the 'Beyond Reasonable Doubt' standard.
2. SECTIONAL ANALYSIS: Correlate facts with specific provisions of the IPC/BNS or relevant Special Acts (NDPS, PMLA, etc.).
3. BURDEN OF PROOF: Identify which party carries the burden as per Section 101-106 of the Indian Evidence Act (or corresponding BSA sections).
4. PRECEDENTIAL MATCHING: Scan historical data for Supreme Court cases with similar 'Facts-in-issue'.

DETERMINATION GUIDELINES:
- If Documentary evidence is high (>80) but Witness is low (<30), civil success probability is high, but criminal conviction risk is higher.
- If Opponent strength is high (>70), highlight specific 'Rebuttal Strategies'.
- CITATIONS: You MUST provide real or highly probable historical citations (e.g., 'AIR 2023 SC 456') that anchor your logic.`,
  prompt: `Analyze the following Indian legal case parameters:

Case Type: {{{caseType}}}
Court Level: {{{courtLevel}}}
Jurisdiction: {{{jurisdiction}}}
Facts:
{{{facts}}}

Evidence Strengths (0-100 scale):
- Documentary: {{{evidenceStrengthSliders.documentary}}}
- Witness: {{{evidenceStrengthSliders.witness}}}
- Legal Precedents: {{{evidenceStrengthSliders.precedents}}}
- Opponent: {{{evidenceStrengthSliders.opponent}}}

Provide a detailed prediction including outcome, confidence, strategic analysis, and the historical citations that support this reasoning.`
});

const predictCaseOutcomeFlow = ai.defineFlow(
  {
    name: 'predictCaseOutcomeFlow',
    inputSchema: PredictCaseOutcomeInputSchema,
    outputSchema: PredictCaseOutcomeOutputSchema
  },
  async input => {
    const {output} = await predictCaseOutcomePrompt(input);
    return output!;
  }
);
