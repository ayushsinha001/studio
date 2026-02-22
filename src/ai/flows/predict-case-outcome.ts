
'use server';
/**
 * @fileOverview A Genkit flow for predicting the outcome of a legal case based on various inputs, localized for the Indian context.
 *
 * - predictCaseOutcome - A function that handles the case outcome prediction process.
 * - PredictCaseOutcomeInput - The input type for the predictCaseOutcome function.
 * - PredictCaseOutcomeOutput - The return type for the predictCaseOutcome function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictCaseOutcomeInputSchema = z.object({
  caseType: z.string().min(2).describe('The type of the legal case (e.g., Civil, Criminal, Writ Petition).'),
  courtLevel: z.string().min(2).describe('The level of the court (e.g., District Court, High Court, Supreme Court of India).'),
  jurisdiction: z.string().min(2).describe('The Indian state or union territory jurisdiction (e.g., Maharashtra, Delhi, Karnataka).'),
  facts: z.string().min(10).describe('Detailed facts of the case, including relevant events, sections of IPC/BNS, CrPC/BNSS, etc.'),
  evidenceStrengthSliders: z.object({
    documentary: z.number().min(0).max(100).describe('Strength of documentary evidence (0-100).'),
    witness: z.number().min(0).max(100).describe('Strength of witness testimony (0-100).'),
    precedents: z.number().min(0).max(100).describe('Strength of relevant Indian legal precedents (0-100).'),
    opponent: z.number().min(0).max(100).describe('Perceived strength of the opponent\'s case (0-100).')
  }).describe('Slider values indicating the perceived strength of various evidence categories.')
});
export type PredictCaseOutcomeInput = z.infer<typeof PredictCaseOutcomeInputSchema>;

const PredictCaseOutcomeOutputSchema = z.object({
  predictedOutcome: z.string().describe('The most likely predicted outcome (e.g., "Allowed", "Dismissed", "Partial Relief", "Settlement Recommended").'),
  confidenceScore: z.number().min(0).max(100).describe('A numerical score (0-100) representing the confidence in the predicted outcome.'),
  keyStrengths: z.array(z.string()).describe('A list of key factors that strengthen the case.'),
  keyRisks: z.array(z.string()).describe('A list of key factors that pose risks or weaknesses.'),
  strategySuggestions: z.array(z.string()).describe('Actionable suggestions for strategic approaches based on Indian law and procedure.'),
  references: z.array(z.object({
    caseName: z.string().describe('Name of the historical reference case.'),
    citation: z.string().describe('Legal citation for the reference case.'),
    relevance: z.string().describe('Brief explanation of why this case is relevant to the current prediction.')
  })).describe('Historical cases or legal precedents used to derive this prediction.')
});
export type PredictCaseOutcomeOutput = z.infer<typeof PredictCaseOutcomeOutputSchema>;

export async function predictCaseOutcome(input: PredictCaseOutcomeInput): Promise<PredictCaseOutcomeOutput> {
  return predictCaseOutcomeFlow(input);
}

const predictCaseOutcomePrompt = ai.definePrompt({
  name: 'predictCaseOutcomePrompt',
  input: {schema: PredictCaseOutcomeInputSchema},
  output: {schema: PredictCaseOutcomeOutputSchema},
  system: `You are CourtIQ AI, a senior legal associate and expert in Indian Jurisprudence. 

MISSION: Provide high-fidelity predictive analysis of case outcomes within the Indian Judicial System.

PROMPT GUIDELINES:
1. STATUTORY RIGOR: References must distinguish between the Indian Penal Code (IPC) and Bharatiya Nyaya Sanhita (BNS) contextually.
2. PRECEDENTIAL ANALYSIS: You must identify specific Supreme Court of India or High Court judgments that establish the "Ratio Decidendi" for your prediction.
3. EVIDENTIARY HIERARCHY: Prioritize documentary evidence over witness testimony in civil matters, and vice versa in specific criminal categories.
4. CONFIDENCE SCORING: Be intellectually honest. If facts are ambiguous, lower the confidence score and highlight the specific missing 'fact-in-issue'.`,
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

Provide a detailed prediction including outcome, confidence, key factors, strategy, and historical citations (Supreme Court/High Court) that support this specific reasoning.`
});

const predictCaseOutcomeFlow = ai.defineFlow(
  {
    name: 'predictCaseOutcomeFlow',
    inputSchema: PredictCaseOutcomeInputSchema,
    outputSchema: PredictCaseOutcomeOutputSchema
  },
  async input => {
    const {output} = await predictCaseOutcomePrompt(input);
    if (!output) {
      throw new Error('Failed to get output from predictCaseOutcomePrompt');
    }
    return output;
  }
);
