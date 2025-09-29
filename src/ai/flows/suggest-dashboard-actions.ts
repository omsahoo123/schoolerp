'use server';

/**
 * @fileOverview An AI agent that suggests appropriate actions based on dashboard KPIs.
 *
 * - suggestDashboardActions - A function that suggests actions based on dashboard KPIs.
 * - SuggestDashboardActionsInput - The input type for the suggestDashboardActions function.
 * - SuggestDashboardActionsOutput - The return type for the suggestDashboardActions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDashboardActionsInputSchema = z.object({
  dashboardData: z
    .string()
    .describe('A summary of the data displayed on the dashboard.'),
});
export type SuggestDashboardActionsInput = z.infer<
  typeof SuggestDashboardActionsInputSchema
>;

const SuggestDashboardActionsOutputSchema = z.object({
  suggestedActions: z
    .array(z.string())
    .describe('A list of suggested actions based on the dashboard data.'),
});
export type SuggestDashboardActionsOutput = z.infer<
  typeof SuggestDashboardActionsOutputSchema
>;

export async function suggestDashboardActions(
  input: SuggestDashboardActionsInput
): Promise<SuggestDashboardActionsOutput> {
  return suggestDashboardActionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDashboardActionsPrompt',
  input: {schema: SuggestDashboardActionsInputSchema},
  output: {schema: SuggestDashboardActionsOutputSchema},
  prompt: `You are an AI assistant that suggests actions based on data from an
ERP dashboard.

Given the following dashboard data, suggest a list of appropriate actions that
an administrator could take:

Dashboard Data:
{{dashboardData}}

Respond with only suggested actions. Each action should be concise and
actionable.

Example:
[
  "Investigate low student enrollment in specific courses",
  "Optimize resource allocation based on hostel occupancy rates",
  "Improve marketing strategies to attract more student applications",
]
`,
});

const suggestDashboardActionsFlow = ai.defineFlow(
  {
    name: 'suggestDashboardActionsFlow',
    inputSchema: SuggestDashboardActionsInputSchema,
    outputSchema: SuggestDashboardActionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
