'use server';
/**
 * @fileOverview A Genkit flow for generating structured legal document drafts specialized for Indian Law.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomateLegalDraftingInputSchema = z.object({
  documentType: z.string().describe('The type of Indian legal document (e.g., "Writ Petition", "Legal Notice").'),
  partyDetails: z.string().describe('Detailed info about parties.'),
  facts: z.string().describe('Relevant facts.'),
  financialInfo: z.string().optional().describe('Financial terms in INR (₹).'),
});
export type AutomateLegalDraftingInput = z.infer<typeof AutomateLegalDraftingInputSchema>;

const AutomateLegalDraftingOutputSchema = z.object({
  draft: z.string(),
  aiReview: z.object({
    risks: z.array(z.string()),
    missingInformation: z.array(z.string()),
    suggestedClauses: z.array(z.string()),
  }),
});
export type AutomateLegalDraftingOutput = z.infer<typeof AutomateLegalDraftingOutputSchema>;

export async function automateLegalDrafting(input: AutomateLegalDraftingInput): Promise<AutomateLegalDraftingOutput> {
  return automateLegalDraftingFlow(input);
}

const draftingPrompt = ai.definePrompt({
  name: 'automateLegalDraftingPrompt',
  input: {schema: AutomateLegalDraftingInputSchema},
  output: {schema: AutomateLegalDraftingOutputSchema},
  system: `You are the CourtIQ Drafting Specialist, master of Indian Courtroom Pleadings and Conveyancing.

DRAFTING STANDARDS:
1. FORMAL STRUCTURE: Use standard Indian headings (e.g., 'IN THE COURT OF...', 'MEMORANDUM OF PARTIES', 'PRAYER').
2. STATUTORY COMPLIANCE: Ensure petitions mention the correct enabling provision (e.g., Article 226 for High Court Writs, Section 138 of NI Act for Cheque Bounce notices).
3. VERIFICATION & AFFIDAVITS: Include placeholders for 'Verification' and 'Affidavit' as per the High Court Rules.
4. REVIEW METRICS: Identify 'Stamp Duty' requirements, 'Registration' necessity under the Registration Act, and potential 'Limitation' issues under the Limitation Act.
5. LANGUAGE: Use formal, precise legal English. Avoid passive voice in the 'Facts' section to ensure clarity of allegations.`,
  prompt: `Generate a structured legal document draft and provide an AI legal review for the following parameters:

Document Type: {{{documentType}}}
Party Details: {{{partyDetails}}}
Facts: {{{facts}}}
{{#if financialInfo}}Financial Information: {{{financialInfo}}}{{/if}}

Ensure the draft follows the formal standards of the Indian Judiciary.`
});

const automateLegalDraftingFlow = ai.defineFlow(
  {
    name: 'automateLegalDraftingFlow',
    inputSchema: AutomateLegalDraftingInputSchema,
    outputSchema: AutomateLegalDraftingOutputSchema,
  },
  async input => {
    const {output} = await draftingPrompt(input);
    return output!;
  }
);
