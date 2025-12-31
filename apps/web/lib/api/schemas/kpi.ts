import { z } from 'zod';

/**
 * KPI Metric Schema
 */
export const kpiMetricSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  value: z.number(),
  previousValue: z.number().optional(),
  delta: z.number().optional(),
  deltaPercentage: z.number().optional(),
  isPositive: z.boolean().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type KpiMetric = z.infer<typeof kpiMetricSchema>;

/**
 * KPI Response Schema
 */
export const kpiResponseSchema = z.object({
  drillbitBalance: z.object({
    value: z.number(),
    delta: z.number(),
    deltaPercentage: z.number(),
    isPositive: z.boolean(),
  }),
  roi: z.object({
    value: z.number(),
    delta: z.number(),
    deltaPercentage: z.number(),
    isPositive: z.boolean(),
  }),
  revenue: z.object({
    value: z.number(),
    delta: z.number(),
    deltaPercentage: z.number(),
    isPositive: z.boolean(),
  }),
  costs: z.object({
    value: z.number(),
    delta: z.number(),
    deltaPercentage: z.number(),
    isPositive: z.boolean(),
  }),
});

export type KpiResponse = z.infer<typeof kpiResponseSchema>;

