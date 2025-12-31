import { createClient } from '@/lib/supabase/server';
import { mockEmployeesData } from '@/lib/data/mock';
import type { EmployeesResponse, EmployeePerformance, EmployeeStatus } from '@/lib/api/schemas/employees';

/**
 * Employees Repository - Data access layer for employee performance
 */
export async function getEmployeesData(viewType: 'performance' | 'overtime' = 'performance'): Promise<EmployeesResponse> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    if (isDevelopment) {
      return { ...mockEmployeesData, viewType };
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

  const { data: employees, error: employeesError } = await supabase
    .from('employees')
    .select('id, name, avatar_url, is_ai, status')
    .eq('organization_id', orgId);

  if (employeesError) {
    throw new Error(`Failed to fetch employees: ${employeesError.message}`);
  }

  const { data: calls } = await supabase
    .from('calls')
    .select('employee_id, duration_minutes')
    .eq('organization_id', orgId);

  const { data: messages } = await supabase
    .from('messages')
    .select('from_user_id')
    .eq('organization_id', orgId);

  const { data: tasks } = await supabase
    .from('tasks')
    .select('employee_id, status, progress_current, progress_total')
    .eq('organization_id', orgId);

  const performanceData: EmployeePerformance[] = (employees || []).map((emp) => {
    const employeeCalls = calls?.filter((c) => c.employee_id === emp.id) || [];
    const callsMinutes = employeeCalls.reduce((sum, c) => sum + (c.duration_minutes || 0), 0);

    const employeeMessages = messages?.filter((m) => m.from_user_id === emp.id) || [];
    const messagesCount = employeeMessages.length;

    const employeeTasks = tasks?.filter((t) => t.employee_id === emp.id) || [];
    const tasksInProgress = employeeTasks.filter((t) => t.status === 'in_progress').length;
    const tasksFinished = employeeTasks.filter((t) => t.status === 'completed').length;

    const initials = emp.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const status: EmployeeStatus = (emp.status as EmployeeStatus) || 'offline';

    return {
      id: emp.id,
      name: emp.name,
      avatar: emp.avatar_url || undefined,
      initials,
      isAi: emp.is_ai || false,
      status,
      callsMinutes,
      messages: messagesCount,
      tasksInProgress,
      tasksFinished,
    };
  });

  if (performanceData.length === 0) {
    return { ...mockEmployeesData, viewType };
  }

  return {
    employees: performanceData,
    viewType,
  };
}

