'use server';
/**
 * @fileOverview A Genkit flow for generating structured legal document drafts and providing an AI legal review, specialized for Indian Law.
 *
 * - automateLegalDrafting - A function that handles the legal document drafting process.
 * - AutomateLegalDraftingInput - The input type for the automateLegalDrafting function.
 * - AutomateLegalDraftingOutput - The return type for the automateLegalDrafting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomateLegalDraftingInputSchema = z.object({
  documentType: z
    .string()
    .describe(
      'The type of Indian legal document to draft (e.g., "Legal Notice", "Sale Deed", "Rent Agreement", "Writ Petition").'
    ),
  partyDetails: z
    .string()
    .describe('Detailed information about all parties involved, including age, parentage, and address as per Indian conventions.'),
  facts: z
    .string()
    .describe('All relevant facts and background information pertinent to the document.'),
  financialInfo: z
    .string()
    .optional()
    .describe('Any financial information or terms, typically in INR (₹).'),
});
export type AutomateLegalDraftingInput = z.infer<
  typeof AutomateLegalDraftingInputSchema
>;

const AutomateLegalDraftingOutputSchema = z.object({
  draft: z
    .string()
    .describe('The generated full text of the legal document draft following Indian legal formatting.'),
  aiReview: z.object({
    risks: z
      .array(z.string())
      .describe(
        'A list of identified potential legal risks or liabilities in the draft under Indian law.'
      ),
    missingInformation: z
      .array(z.string())
      .describe(
        'A list of critical information or details that are missing from the input or draft.'
      ),
    suggestedClauses: z
      .array(z.string())
      .describe('A list of clauses or provisions that could be added to improve the draft (e.g., Arbitration clause under Indian Arbitration Act).'),
  }),
});
export type AutomateLegalDraftingOutput = z.infer<
  typeof AutomateLegalDraftingOutputSchema
>;

export async function automateLegalDrafting(
  input: AutomateLegalDraftingInput
): Promise<AutomateLegalDraftingOutput> {
  return automateLegalDraftingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automateLegalDraftingPrompt',
  input: {schema: AutomateLegalDraftingInputSchema},
  output: {schema: AutomateLegalDraftingOutputSchema},
  prompt: `You are CourtIQ AI, a senior legal associate and expert in Indian Legal Research and Drafting. Maintain a professional, neutral, and assertive tone. Prioritize legal accuracy and structural formality as per Indian Court standards.

Your task is to generate a structured legal document draft and provide an AI legal review for it, ensuring adherence to Indian statutes and terminology.

Document Type: {{{documentType}}}

Party Details:
{{{partyDetails}}}

Facts:
{{{facts}}}

{{#if financialInfo}}
Financial Information:
{{{financialInfo}}}
{{/if}}

Based on the above information, draft the legal document of type '{{{documentType}}}'. Use Indian formatting conventions (e.g., "BEFORE THE HON'BLE HIGH COURT OF...", "AFFIDAVIT", "LEGAL NOTICE"). Then, provide a comprehensive AI legal review, identifying any potential risks under Indian law (e.g., Stamp Duty issues, Registration requirements), critical missing information, and suggesting additional clauses (e.g., Jurisdiction, Force Majeure). The output MUST be a valid JSON object matching the output schema described.`,
});

const automateLegalDraftingFlow = ai.defineFlow(
  {
    name: 'automateLegalDraftingFlow',
    inputSchema: AutomateLegalDraftingInputSchema,
    outputSchema: AutomateLegalDraftingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
