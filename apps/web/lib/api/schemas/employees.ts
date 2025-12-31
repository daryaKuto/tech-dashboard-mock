import { z } from 'zod';

/**
 * Employee Status Schema
 */
export const employeeStatusSchema = z.enum(['online', 'away', 'busy', 'offline']);

export type EmployeeStatus = z.infer<typeof employeeStatusSchema>;

/**
 * Employee Performance Schema
 */
export const employeePerformanceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  avatar: z.string().optional(),
  initials: z.string(),
  isAi: z.boolean(),
  status: employeeStatusSchema.default('offline'),
  callsMinutes: z.number(),
  messages: z.number(),
  tasksInProgress: z.number(),
  tasksFinished: z.number(),
});

export type EmployeePerformance = z.infer<typeof employeePerformanceSchema>;

/**
 * Employees Response Schema
 */
export const employeesResponseSchema = z.object({
  employees: z.array(employeePerformanceSchema),
  viewType: z.enum(['performance', 'overtime']),
});

export type EmployeesResponse = z.infer<typeof employeesResponseSchema>;

