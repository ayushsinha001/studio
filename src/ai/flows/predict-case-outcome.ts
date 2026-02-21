'use server';
/**
 * @fileOverview A Genkit flow for predicting the outcome of a legal case based on various inputs.
 *
 * - predictCaseOutcome - A function that handles the case outcome prediction process.
 * - PredictCaseOutcomeInput - The input type for the predictCaseOutcome function.
 * - PredictCaseOutcomeOutput - The return type for the predictCaseOutcome function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictCaseOutcomeInputSchema = z.object({
  caseType: z.string().describe('The type of the legal case (e.g., Civil, Criminal, Family Law).'),
  courtLevel: z.string().describe('The level of the court (e.g., District Court, High Court, Supreme Court).'),
  jurisdiction: z.string().describe('The legal jurisdiction the case falls under (e.g., California, Federal, specific country).'),
  facts: z.string().describe('Detailed facts of the case, including relevant events, dates, and parties involved.'),
  evidenceStrengthSliders: z.object({
    documentary: z.number().min(0).max(100).describe('Strength of documentary evidence (0-100).'),
    witness: z.number().min(0).max(100).describe('Strength of witness testimony (0-100).'),
    precedents: z.number().min(0).max(100).describe('Strength of relevant legal precedents (0-100).'),
    opponent: z.number().min(0).max(100).describe('Perceived strength of the opponent\u0027s case (0-100, where higher means stronger opponent).')
  }).describe('Slider values indicating the perceived strength of various evidence categories.')
});
export type PredictCaseOutcomeInput = z.infer<typeof PredictCaseOutcomeInputSchema>;

const PredictCaseOutcomeOutputSchema = z.object({
  predictedOutcome: z.string().describe('The most likely predicted outcome of the case (e.g., "Plaintiff Favored", "Defendant Favored", "Likely Settlement", "Uncertain").'),
  confidenceScore: z.number().min(0).max(100).describe('A numerical score (0-100) representing the confidence in the predicted outcome.'),
  keyStrengths: z.array(z.string()).describe('A list of key factors that strengthen the case.'),
  keyRisks: z.array(z.string()).describe('A list of key factors that pose risks or weaknesses to the case.'),
  strategySuggestions: z.array(z.string()).describe('Actionable suggestions for strategic approaches based on the analysis.')
});
export type PredictCaseOutcomeOutput = z.infer<typeof PredictCaseOutcomeOutputSchema>;

export async function predictCaseOutcome(input: PredictCaseOutcomeInput): Promise<PredictCaseOutcomeOutput> {
  return predictCaseOutcomeFlow(input);
}

const predictCaseOutcomePrompt = ai.definePrompt({
  name: 'predictCaseOutcomePrompt',
  input: {schema: PredictCaseOutcomeInputSchema},
  output: {schema: PredictCaseOutcomeOutputSchema},
  prompt: `You are CourtIQ AI, a senior legal associate and research expert. Maintain a professional, neutral, and assertive tone. Prioritize legal accuracy and structural formality. Never provide legal advice to laypeople; provide research and drafting assistance exclusively to legal professionals.\n\nYour task is to analyze the provided legal case details and evidence strengths to predict the most likely case outcome. You must also provide a confidence score, identify key strengths and risks, and suggest strategic approaches.\n\nAnalyze the following case information:\n\nCase Type: {{{caseType}}}\nCourt Level: {{{courtLevel}}}\nJurisdiction: {{{jurisdiction}}}\nFacts:\n{{{facts}}}\n\nEvidence Strengths (0-100 scale):\n- Documentary Evidence: {{{evidenceStrengthSliders.documentary}}}\n- Witness Testimony: {{{evidenceStrengthSliders.witness}}}\n- Legal Precedents: {{{evidenceStrengthSliders.precedents}}}\n- Opponent's Case Strength: {{{evidenceStrengthSliders.opponent}}}\n\nBased on this analysis, provide the predicted outcome, confidence score, key strengths, key risks, and strategy suggestions in the specified JSON format.\n`
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
