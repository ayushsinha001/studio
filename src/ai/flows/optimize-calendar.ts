
'use server';
/**
 * @fileOverview Genkit flow for Smart Court Calendar Optimizer.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeCalendarInputSchema = z.object({
  pendingHearings: z.array(z.object({
    caseTitle: z.string(),
    complexity: z.enum(['Low', 'Medium', 'High']),
    estimatedDuration: z.string().optional(),
  })),
  availableSlots: z.number().describe('Number of available hearing slots.'),
});
export type OptimizeCalendarInput = z.infer<typeof OptimizeCalendarInputSchema>;

const OptimizeCalendarOutputSchema = z.object({
  optimizedSchedule: z.array(z.object({
    caseTitle: z.string(),
    recommendedSlotTime: z.string(),
    allottedMinutes: z.number(),
    priorityReason: z.string(),
  })),
  efficiencyGainForecast: z.string(),
  idleTimeReduction: z.string(),
});
export type OptimizeCalendarOutput = z.infer<typeof OptimizeCalendarOutputSchema>;

export async function optimizeCalendar(input: OptimizeCalendarInput): Promise<OptimizeCalendarOutput> {
  return optimizeCalendarFlow(input);
}

const calendarPrompt = ai.definePrompt({
  name: 'optimizeCalendarPrompt',
  input: {schema: OptimizeCalendarInputSchema},
  output: {schema: OptimizeCalendarOutputSchema},
  prompt: `You are CourtIQ Scheduling Optimizer. Organize the following pending hearings into {{{availableSlots}}} slots to maximize court efficiency:

Hearings:
{{#each pendingHearings}}
- {{{this.caseTitle}}} (Complexity: {{{this.complexity}}})
{{/each}}

1. Create an optimized schedule with recommended times and durations.
2. Forecast the efficiency gain from this arrangement.
3. Estimate the reduction in idle court time.`,
});

const optimizeCalendarFlow = ai.defineFlow(
  {
    name: 'optimizeCalendarFlow',
    inputSchema: OptimizeCalendarInputSchema,
    outputSchema: OptimizeCalendarOutputSchema,
  },
  async input => {
    const {output} = await calendarPrompt(input);
    return output!;
  }
);
