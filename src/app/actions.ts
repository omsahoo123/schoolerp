'use server';

import { generateStudentDatabaseInsights } from '@/ai/flows/generate-student-database-insights';
import { suggestDashboardActions } from '@/ai/flows/suggest-dashboard-actions';

export async function getDashboardSuggestions(dashboardData: string) {
  try {
    const result = await suggestDashboardActions({ dashboardData });
    return { success: true, data: result.suggestedActions };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get suggestions.' };
  }
}

export async function getStudentDbInsights(databaseSummary: string) {
    try {
      const result = await generateStudentDatabaseInsights({ databaseSummary });
      return { success: true, data: result };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Failed to generate insights.' };
    }
  }
