import { createClient } from '@/lib/supabase/server';
import { mockTasksData } from '@/lib/data/mock';
import type { ActionNeededResponse, Task } from '@/lib/api/schemas/tasks';

/**
 * Tasks Repository - Data access layer for tasks
 */
export async function getActionNeededTasks(): Promise<ActionNeededResponse> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    if (isDevelopment) {
      return mockTasksData;
    }
    throw new Error('Unauthorized');
  }

  const { data: userData } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single();

  if (!userData?.organization_id) {
    throw new Error('User organization not found');
  }

  const orgId = userData.organization_id;

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('id, task_id, description, status, priority, progress_current, progress_total, created_at, updated_at')
    .eq('organization_id', orgId)
    .in('status', ['pending', 'in_progress'])
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }

  const taskList: Task[] = (tasks || []).map((task) => ({
    id: task.id,
    taskId: task.task_id,
    description: task.description,
    progress: {
      current: task.progress_current || 0,
      total: task.progress_total || 1,
    },
    status: task.status as 'pending' | 'in_progress' | 'completed',
    priority: (task.priority as 'low' | 'medium' | 'high') || 'medium',
    createdAt: task.created_at,
    updatedAt: task.updated_at,
  }));

  if (taskList.length === 0) {
    return mockTasksData;
  }

  return {
    tasks: taskList,
    total: taskList.length,
  };
}

