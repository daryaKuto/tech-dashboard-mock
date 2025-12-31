import { z } from 'zod';

/**
 * Lead Source Schema
 */
export const leadSourceSchema = z.object({
  source: z.string(),
  percentage: z.number().min(0).max(100),
  count: z.number().optional(),
});

export type LeadSource = z.infer<typeof leadSourceSchema>;

/**
 * Leads Response Schema
 */
export const leadsResponseSchema = z.object({
  sources: z.array(leadSourceSchema),
  total: z.number(),
  viewType: z.enum(['conversion', 'location']),
});

export type LeadsResponse = z.infer<typeof leadsResponseSchema>;

