'use server';
/**
 * @fileOverview A Genkit flow for transcribing court proceedings from an audio file.
 *
 * - transcribeCourtProceedings - A function that handles the audio transcription process.
 * - TranscribeCourtProceedingsInput - The input type for the transcribeCourtProceedings function.
 * - TranscribeCourtProceedingsOutput - The return type for the transcribeCourtProceedings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeCourtProceedingsInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "An audio recording of court proceedings, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeCourtProceedingsInput = z.infer<
  typeof TranscribeCourtProceedingsInputSchema
>;

const TranscribeCourtProceedingsOutputSchema = z.object({
  transcription: z
    .string()
    .describe('The transcribed text of the court proceedings.'),
});
export type TranscribeCourtProceedingsOutput = z.infer<
  typeof TranscribeCourtProceedingsOutputSchema
>;

export async function transcribeCourtProceedings(
  input: TranscribeCourtProceedingsInput
): Promise<TranscribeCourtProceedingsOutput> {
  return transcribeCourtProceedingsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'transcribeCourtProceedingsPrompt',
  input: {schema: TranscribeCourtProceedingsInputSchema},
  output: {schema: TranscribeCourtProceedingsOutputSchema},
  // The `system` part defines the AI's role and tone as per the master instructions.
  system: "You are CourtIQ AI, a senior legal associate and research expert. Maintain a professional, neutral, and assertive tone. Prioritize legal accuracy and structural formality. Never provide legal advice to laypeople; provide research and drafting assistance exclusively to legal professionals.",
  prompt: [
    {
      text:
        'Transcribe the following audio recording of court proceedings into text. Ensure accuracy and include speaker turns if identifiable, such as "Speaker 1: ...", "Judge: ...", etc. If the audio is unclear, indicate with [unclear audio]. Focus solely on the transcription, do not add any additional commentary or analysis.',
    },
    {media: {url: '{{{audioDataUri}}}'}},
  ],
});

const transcribeCourtProceedingsFlow = ai.defineFlow(
  {
    name: 'transcribeCourtProceedingsFlow',
    inputSchema: TranscribeCourtProceedingsInputSchema,
    outputSchema: TranscribeCourtProceedingsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
