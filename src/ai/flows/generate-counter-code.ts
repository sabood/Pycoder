'use server';

/**
 * @fileOverview Generates Python code for a counter based on user description.
 *
 * - generateCounterCode - A function that generates Python counter code.
 * - GenerateCounterCodeInput - The input type for the generateCounterCode function.
 * - GenerateCounterCodeOutput - The return type for the generateCounterCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCounterCodeInputSchema = z.object({
  description: z.string().describe('Description of the counter functionality required.'),
});

export type GenerateCounterCodeInput = z.infer<typeof GenerateCounterCodeInputSchema>;

const GenerateCounterCodeOutputSchema = z.object({
  code: z.string().describe('Python code snippet for the counter.'),
});

export type GenerateCounterCodeOutput = z.infer<typeof GenerateCounterCodeOutputSchema>;

export async function generateCounterCode(input: GenerateCounterCodeInput): Promise<GenerateCounterCodeOutput> {
  return generateCounterCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCounterCodePrompt',
  input: {schema: GenerateCounterCodeInputSchema},
  output: {schema: GenerateCounterCodeOutputSchema},
  prompt: `You are a Python coding expert. Generate Python code for a counter with the following description, including exception handling for invalid operations:\n\nDescription: {{{description}}}\n\nYour code should include comments to explain each step, and should be robust and handle edge cases gracefully.\nEnsure the code is properly formatted and easy to read, using appropriate indentation and naming conventions.\nDo not include any introductory or concluding remarks, just provide the raw code.\n\n`,
});

const generateCounterCodeFlow = ai.defineFlow(
  {
    name: 'generateCounterCodeFlow',
    inputSchema: GenerateCounterCodeInputSchema,
    outputSchema: GenerateCounterCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
