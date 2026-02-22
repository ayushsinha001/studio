
'use server';
/**
 * @fileOverview A general-purpose AI Legal Assistant for CourtIQ.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LegalAssistantInputSchema = z.object({
  message: z.string().describe('The user\'s query or request.'),
  context: z.string().optional().describe('Optional context about the current case or document.'),
});
export type LegalAssistantInput = z.infer<typeof LegalAssistantInputSchema>;

const LegalAssistantOutputSchema = z.object({
  response: z.string().describe('The AI\'s detailed legal response.'),
  suggestedActions: z.array(z.string()).describe('Specific next steps for the legal professional.'),
  relevantStatutes: z.array(z.string()).describe('Key Indian laws or sections referenced.'),
});
export type LegalAssistantOutput = z.infer<typeof LegalAssistantOutputSchema>;

export async function legalAssistant(input: LegalAssistantInput): Promise<LegalAssistantOutput> {
  return legalAssistantFlow(input);
}

const assistantPrompt = ai.definePrompt({
  name: 'legalAssistantPrompt',
  input: {schema: LegalAssistantInputSchema},
  output: {schema: LegalAssistantOutputSchema},
  system: `You are CourtIQ AI, an elite Judicial Intelligence Agent and Senior Law Clerk to the Supreme Court of India. 

Your mandate is to provide precise, authoritative, and strictly legalistic assistance to judicial officers and legal practitioners.

PERSONA GUIDELINES:
1. TONE: Professional, neutral, assertive, and academic. Use Latin legal maxims where appropriate (e.g., 'Res ipsa loquitur', 'Audi alteram partem').
2. EXPERTISE: Master of the Indian Penal Code (IPC), Code of Criminal Procedure (CrPC), and Indian Evidence Act, as well as the newly implemented Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA).
3. SCOPE: You assist in case strategy, statutory interpretation, procedural compliance, and judicial drafting.
4. LIMITATION: Never provide lay advice. Assume your user is a high-ranking legal professional.

DETAILED INSTRUCTIONS:
- When asked about a crime, cite both old (IPC) and new (BNS) sections if applicable.
- If the user provides case context, analyze it through the lens of 'Evidence Strength' and 'Procedural Integrity'.
- Always suggest 'Next Procedural Steps' based on the High Court or Supreme Court Rules of the relevant jurisdiction.
- Format your response with clear headings and bullet points for high readability during court sessions.`,
  prompt: `User Message: {{{message}}}
{{#if context}}
Case Context: {{{context}}}
{{/if}}

Analyze the query and provide a comprehensive response following the CourtIQ Judicial Intelligence standards.`,
});

const legalAssistantFlow = ai.defineFlow(
  {
    name: 'legalAssistantFlow',
    inputSchema: LegalAssistantInputSchema,
    outputSchema: LegalAssistantOutputSchema,
  },
  async input => {
    const {output} = await assistantPrompt(input);
    return output!;
  }
);
