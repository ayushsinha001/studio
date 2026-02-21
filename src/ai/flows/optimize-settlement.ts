
'use server';
/**
 * @fileOverview Genkit flow for Settlement & Mediation Optimizer.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeSettlementInputSchema = z.object({
  disputeDetails: z.string(),
  financialExposure: z.string(),
  historicalSettlementData: z.string().optional(),
});
export type OptimizeSettlementInput = z.infer<typeof OptimizeSettlementInputSchema>;

const OptimizeSettlementOutputSchema = z.object({
  settlementProbability: z.number().min(0).max(100),
  suggestedNegotiationRange: z.string(),
  mediationSuccessRateForecast: z.number(),
  adrPathwayRecommendation: z.string(),
});
export type OptimizeSettlementOutput = z.infer<typeof OptimizeSettlementOutputSchema>;

export async function optimizeSettlement(input: OptimizeSettlementInput): Promise<OptimizeSettlementOutput> {
  return optimizeSettlementFlow(input);
}

const settlementPrompt = ai.definePrompt({
  name: 'optimizeSettlementPrompt',
  input: {schema: OptimizeSettlementInputSchema},
  output: {schema: OptimizeSettlementOutputSchema},
  prompt: `You are CourtIQ Mediation Expert. Analyze this dispute for settlement potential:

Dispute: {{{disputeDetails}}}
Financial Exposure: {{{financialExposure}}}

1. Estimate settlement probability (0-100).
2. Suggest a fair negotiation range.
3. Forecast mediation success rate.
4. Recommend the best Alternative Dispute Resolution (ADR) pathway.`,
});

const optimizeSettlementFlow = ai.defineFlow(
  {
    name: 'optimizeSettlementFlow',
    inputSchema: OptimizeSettlementInputSchema,
    outputSchema: OptimizeSettlementOutputSchema,
  },
  async input => {
    const {output} = await settlementPrompt(input);
    return output!;
  }
);
