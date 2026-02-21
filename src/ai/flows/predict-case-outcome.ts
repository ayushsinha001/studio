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
  caseType: z.string().describe('The type of the legal case (e.g., Civil, Criminal, Writ Petition).'),
  courtLevel: z.string().describe('The level of the court (e.g., District Court, High Court, Supreme Court of India).'),
  jurisdiction: z.string().describe('The Indian state or union territory jurisdiction (e.g., Maharashtra, Delhi, Karnataka).'),
  facts: z.string().describe('Detailed facts of the case, including relevant events, sections of IPC/BNS, CrPC/BNSS, etc.'),
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
  prompt: `You are CourtIQ AI, a senior legal associate and expert in Indian Jurisprudence. Maintain a professional, neutral, and assertive tone. Prioritize legal accuracy and structural formality within the context of Indian Law (IPC/BNS, CrPC/BNSS, CPC, Evidence Act/BSA).

Your task is to analyze the provided Indian legal case details and evidence strengths to predict the most likely case outcome. You must also provide a confidence score, identify key strengths and risks, suggest strategic approaches, and most importantly, identify historical Indian legal precedents (Supreme Court or High Court cases) that support your prediction.

Analyze the following case information:

Case Type: {{{caseType}}}
Court Level: {{{courtLevel}}}
Jurisdiction: {{{jurisdiction}}}
Facts:
{{{facts}}}

Evidence Strengths (0-100 scale):
- Documentary Evidence: {{{evidenceStrengthSliders.documentary}}}
- Witness Testimony: {{{evidenceStrengthSliders.witness}}}
- Legal Precedents: {{{evidenceStrengthSliders.precedents}}}
- Opponent's Case Strength: {{{evidenceStrengthSliders.opponent}}}

Based on this analysis, provide the predicted outcome, confidence score, key strengths, key risks, strategy suggestions, and the list of reference cases in the specified JSON format.`
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
