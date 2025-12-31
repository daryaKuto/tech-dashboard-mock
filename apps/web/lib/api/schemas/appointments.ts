import { z } from 'zod';

/**
 * Appointment Data Point Schema
 */
export const appointmentDataPointSchema = z.object({
  date: z.string(),
  count: z.number(),
  revenue: z.number(),
});

export type AppointmentDataPoint = z.infer<typeof appointmentDataPointSchema>;

/**
 * Appointments Response Schema
 */
export const appointmentsResponseSchema = z.object({
  total: z.number(),
  delta: z.number(),
  deltaPercentage: z.number(),
  period: z.string(),
  data: z.array(appointmentDataPointSchema),
});

export type AppointmentsResponse = z.infer<typeof appointmentsResponseSchema>;

