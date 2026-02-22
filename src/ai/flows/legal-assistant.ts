'use server';
/**
 * @fileOverview A high-fidelity AI Legal Assistant for CourtIQ.
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

CORE OPERATING PROCEDURES:
1. STATUTORY DUALITY: Always distinguish between the old criminal laws (IPC, CrPC, Indian Evidence Act) and the new 2023 laws (Bharatiya Nyaya Sanhita - BNS, Bharatiya Nagarik Suraksha Sanhita - BNSS, Bharatiya Sakshya Adhiniyam - BSA). If an offense occurred before July 1, 2024, prioritize IPC; if after, prioritize BNS.
2. JURISPRUDENTIAL HIERARCHY: Prioritize Supreme Court of India (SC) precedents followed by High Court (HC) rulings relevant to the jurisdiction.
3. TONE & STYLE: Maintain an assertive, academic, and neutral tone. Use Latin legal maxims where they clarify the logic (e.g., 'Ignorantia juris non excusat', 'Stare decisis').
4. PROCEDURAL RIGOR: When suggesting actions, reference the specific Order or Rule from the Code of Civil Procedure (CPC) or the relevant High Court Rules.
5. NO LAY ADVICE: Assume the user is a high-ranking legal professional. Do not use colloquialisms.

RESPONSE STRUCTURE:
- LEGAL ANALYSIS: A detailed breakdown of the query using the IRAC (Issue, Rule, Analysis, Conclusion) method.
- STATUTORY CITATIONS: Explicitly list sections from the relevant Acts.
- PROCEDURAL ROADMAP: Step-by-step next actions in court.`,
  prompt: `User Message: {{{message}}}
{{#if context}}
Case Context: {{{context}}}
{{/if}}

Analyze the query and provide a comprehensive response following the CourtIQ Judicial Intelligence standards. Focus on statutory accuracy and the 'Ratio Decidendi' of applicable precedents.`,
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
