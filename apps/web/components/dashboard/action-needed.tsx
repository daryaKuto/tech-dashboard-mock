import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CircularProgress } from '@/components/ui/circular-progress';
import { cn } from '@/lib/utils';
import { mockTasksData } from '@/lib/data/mock';
import type { ActionNeededResponse } from '@/lib/api/schemas/tasks';
import type { ApiResponse } from '@/lib/api/types';

export async function ActionNeeded() {
  let tasks = mockTasksData.tasks;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/tasks`, {
      cache: 'no-store',
    });

    if (response.ok) {
      const result: ApiResponse<ActionNeededResponse> = await response.json();
      if (result.ok) {
        tasks = result.data.tasks;
      }
    }
  } catch {
    // Use mock data on error
  }

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-3 sm:p-4">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-[#111827] sm:text-lg">Action needed</h3>
        <p className="mt-1 text-xs text-[#6B7280] sm:text-sm">{tasks.length} tasks total</p>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => {
          const progressPercentage = task.progress.total > 0 
            ? task.progress.current / task.progress.total 
            : 0;
          
          return (
            <div
              key={task.id}
              className={cn(
                'flex items-start gap-3 rounded-lg p-2',
                task.status === 'completed' && 'opacity-50'
              )}
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 text-[#FB923C] shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs text-[#6B7280]">{task.taskId}</span>
                  <Badge
                    variant="secondary"
                    className="h-4 px-1.5 text-xs bg-[#F3F4F6] text-[#111827]"
                  >
                    {task.progress.current}/{task.progress.total}
                  </Badge>
                </div>
                <p className="text-sm text-[#111827] line-clamp-2">{task.description}</p>
              </div>
              <div className="shrink-0">
                <CircularProgress
                  value={progressPercentage}
                  size={28}
                  strokeWidth={2.5}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
