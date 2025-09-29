import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    ...(process.env.NODE_ENV === 'production' || process.env.GENKIT_ENV === 'prod' ? [googleAI()] : []),
  ],
  model: process.env.NODE_ENV === 'production' || process.env.GENKIT_ENV === 'prod' ? 'googleai/gemini-2.5-flash' : 'dev-model',
});
