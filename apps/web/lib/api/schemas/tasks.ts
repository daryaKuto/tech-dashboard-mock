import { z } from 'zod';

/**
 * Task Schema
 */
export const taskSchema = z.object({
  id: z.string().uuid(),
  taskId: z.string(),
  description: z.string(),
  progress: z.object({
    current: z.number(),
    total: z.number(),
  }),
  status: z.enum(['pending', 'in_progress', 'completed']),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Task = z.infer<typeof taskSchema>;

/**
 * Action Needed Response Schema
 */
export const actionNeededResponseSchema = z.object({
  tasks: z.array(taskSchema),
  total: z.number(),
});

export type ActionNeededResponse = z.infer<typeof actionNeededResponseSchema>;

