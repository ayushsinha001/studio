
'use server';
/**
 * @fileOverview Genkit flow for Policy Simulation and Reform Modeling.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateReformInputSchema = z.object({
  proposedChanges: z.string().describe('Description of policy reforms (e.g., 20% more judges).'),
  currentBacklog: z.number(),
  jurisdictionType: z.string(),
});
export type SimulateReformInput = z.infer<typeof SimulateReformInputSchema>;

const SimulateReformOutputSchema = z.object({
  backlogReductionForecast: z.string(),
  timeToZeroPendency: z.string(),
  costImpact: z.string(),
  efficiencyGains: z.array(z.string()),
});
export type SimulateReformOutput = z.infer<typeof SimulateReformOutputSchema>;

export async function simulateReform(input: SimulateReformInput): Promise<SimulateReformOutput> {
  return simulateReformFlow(input);
}

const simulationPrompt = ai.definePrompt({
  name: 'simulateReformPrompt',
  input: {schema: SimulateReformInputSchema},
  output: {schema: SimulateReformOutputSchema},
  prompt: `You are CourtIQ Policy Analyst. Simulate the impact of the following reforms on the judicial system:

Proposed Changes: {{{proposedChanges}}}
Current Backlog: {{{currentBacklog}}} cases
Jurisdiction: {{{jurisdictionType}}}

Forecast:
1. Backlog reduction over 5 years.
2. Estimated time to reach zero pendency.
3. Economic/Cost impact.
4. Specific efficiency gains in percentage terms.`,
});

const simulateReformFlow = ai.defineFlow(
  {
    name: 'simulateReformFlow',
    inputSchema: SimulateReformInputSchema,
    outputSchema: SimulateReformOutputSchema,
  },
  async input => {
    const {output} = await simulationPrompt(input);
    return output!;
  }
);
