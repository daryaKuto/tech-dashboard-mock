import { z } from 'zod';

/**
 * Standard API Error Codes
 */
export const API_ERROR_CODES = {
  VALIDATION_ERROR: 'validation_error',
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  NOT_FOUND: 'not_found',
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  INTERNAL_ERROR: 'internal_error',
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];

/**
 * Standard API Response Envelope
 */
export const apiOkSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    ok: z.literal(true),
    data: dataSchema,
  });

export const apiErrSchema = z.object({
  ok: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});

export type ApiOk<T> = {
  ok: true;
  data: T;
};

export type ApiErr = {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiResponse<T> = ApiOk<T> | ApiErr;

/**
 * Helper to create API responses
 */
export function createApiResponse<T>(data: T): ApiOk<T> {
  return {
    ok: true,
    data,
  };
}

export function createApiError(
  code: string,
  message: string,
  details?: unknown
): ApiErr {
  return {
    ok: false,
    error: {
      code,
      message,
      details,
    },
  };
}

/**
 * Format Zod errors for API responses
 */
export function formatZodError(error: z.ZodError): ApiErr {
  // Safety check: ensure error is a valid ZodError with errors array
  if (!error || typeof error !== 'object' || !('errors' in error)) {
    return createApiError(
      'validation_error',
      'Validation failed: Invalid error object',
      {
        issues: [],
      }
    );
  }
  
  // Safety check: ensure errors array exists and has items
  const errors = Array.isArray(error.errors) ? error.errors : [];
  if (errors.length === 0) {
    return createApiError(
      'validation_error',
      'Validation failed: No error details available',
      {
        issues: [],
      }
    );
  }
  
  const firstError = errors[0];
  return createApiError(
    'validation_error',
    firstError?.message ?? 'Validation failed',
    {
      issues: errors,
    }
  );
}

