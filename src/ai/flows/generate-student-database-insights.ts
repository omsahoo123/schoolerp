'use server';
/**
 * @fileOverview Student database insights generator.
 *
 * - generateStudentDatabaseInsights - A function that generates insights from the student database.
 * - GenerateStudentDatabaseInsightsInput - The input type for the generateStudentDatabaseInsights function.
 * - GenerateStudentDatabaseInsightsOutput - The return type for the generateStudentDatabaseInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudentDatabaseInsightsInputSchema = z.object({
  databaseSummary: z
    .string()
    .describe('A summary of the student database, including tables and fields.'),
});
export type GenerateStudentDatabaseInsightsInput = z.infer<
  typeof GenerateStudentDatabaseInsightsInputSchema
>;

const GenerateStudentDatabaseInsightsOutputSchema = z.object({
  insights: z.string().describe('Insights on student demographics, academic performance trends, and potential areas for improvement.'),
  suggestions: z.string().describe('Suggested actions based on the insights.'),
});
export type GenerateStudentDatabaseInsightsOutput = z.infer<
  typeof GenerateStudentDatabaseInsightsOutputSchema
>;

export async function generateStudentDatabaseInsights(
  input: GenerateStudentDatabaseInsightsInput
): Promise<GenerateStudentDatabaseInsightsOutput> {
  return generateStudentDatabaseInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudentDatabaseInsightsPrompt',
  input: {schema: GenerateStudentDatabaseInsightsInputSchema},
  output: {schema: GenerateStudentDatabaseInsightsOutputSchema},
  prompt: `You are an AI assistant helping school administrators understand their student data.

  Analyze the following student database summary and provide insights on student demographics,
  academic performance trends, and potential areas for improvement. Also, suggest actions that the
  administrator could take based on these insights.

  Database Summary:
  {{databaseSummary}}

  Respond with insights and suggestions in a single, coherent response.
  `,
});

const generateStudentDatabaseInsightsFlow = ai.defineFlow(
  {
    name: 'generateStudentDatabaseInsightsFlow',
    inputSchema: GenerateStudentDatabaseInsightsInputSchema,
    outputSchema: GenerateStudentDatabaseInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
