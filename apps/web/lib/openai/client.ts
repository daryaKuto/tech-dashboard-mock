import OpenAI from 'openai';
import { env } from '../env';

/**
 * OpenAI client wrapper
 * SERVER-ONLY - Never import in client components
 * Includes error handling and rate limiting considerations
 */
export function createClient(): OpenAI {
  return new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });
}

/**
 * Helper to handle OpenAI API errors consistently
 */
export function handleOpenAIError(error: unknown): {
  code: string;
  message: string;
  details?: unknown;
} {
  if (error instanceof OpenAI.APIError) {
    return {
      code: error.code ?? 'openai_api_error',
      message: error.message,
      details: {
        status: error.status,
        type: error.type,
      },
    };
  }

  if (error instanceof Error) {
    return {
      code: 'openai_error',
      message: error.message,
    };
  }

  return {
    code: 'unknown_error',
    message: 'An unknown error occurred',
  };
}

