'use server';
/**
 * @fileOverview A Genkit flow for generating structured legal document drafts and providing an AI legal review.
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
      'The type of legal document to draft (e.g., "Notice", "Contract", "Agreement").'
    ),
  partyDetails: z
    .string()
    .describe('Detailed information about all parties involved in the document.'),
  facts: z
    .string()
    .describe('All relevant facts and background information pertinent to the document.'),
  financialInfo: z
    .string()
    .optional()
    .describe('Any financial information or terms relevant to the document.'),
});
export type AutomateLegalDraftingInput = z.infer<
  typeof AutomateLegalDraftingInputSchema
>;

const AutomateLegalDraftingOutputSchema = z.object({
  draft: z
    .string()
    .describe('The generated full text of the legal document draft.'),
  aiReview: z.object({
    risks: z
      .array(z.string())
      .describe(
        'A list of identified potential legal risks or liabilities in the draft.'
      ),
    missingInformation: z
      .array(z.string())
      .describe(
        'A list of critical information or details that are missing from the input or draft.'
      ),
    suggestedClauses: z
      .array(z.string())
      .describe('A list of clauses or provisions that could be added to improve the draft.'),
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
  prompt: `You are CourtIQ AI, a senior legal associate and research expert. Maintain a professional, neutral, and assertive tone. Prioritize legal accuracy and structural formality. Never provide legal advice to laypeople; provide research and drafting assistance exclusively to legal professionals.

Your task is to generate a structured legal document draft and provide an AI legal review for it. Ensure the output is in the specified JSON format.

Document Type: {{{documentType}}}

Party Details:
{{{partyDetails}}}

Facts:
{{{facts}}}

{{#if financialInfo}}
Financial Information:
{{{financialInfo}}}
{{/if}}

Based on the above information, first, draft the legal document of type '{{{documentType}}}'. Then, provide a comprehensive AI legal review, identifying any potential risks, critical missing information, and suggesting additional clauses that would strengthen the document. The output MUST be a valid JSON object matching the output schema described.`,
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
