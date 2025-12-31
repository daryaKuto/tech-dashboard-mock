import { cn } from '@/lib/utils';
import { mockTasksData } from '@/lib/data/mock';
import type { ActionNeededResponse } from '@/lib/api/schemas/tasks';
import type { ApiResponse } from '@/lib/api/types';

/**
 * Hexagon Icon Component
 * Small hexagon with color fill based on task severity
 * - Fully red = urgent/high priority
 * - Orange halfway filled = in progress
 * - Outline only = other states
 */
function HexagonIcon({ 
  className, 
  status,
  priority
}: { 
  className?: string; 
  status: 'pending' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
}) {
  const isUrgent = priority === 'high';
  const isInProgress = status === 'in_progress' && priority !== 'high';
  const isDisabled = status === 'completed';
  
  // Determine fill color and percentage
  let fillColor = 'none';
  let fillPercentage = 0;
  let strokeColor = '#9CA3AF';
  let opacity = 0.4;
  
  if (isUrgent) {
    fillColor = '#EF4444'; // Red
    fillPercentage = 100;
    strokeColor = '#EF4444';
    opacity = 1;
  } else if (isInProgress) {
    fillColor = '#FB923C'; // Orange
    fillPercentage = 50; // Halfway filled
    strokeColor = '#FB923C';
    opacity = 1;
  } else if (!isDisabled) {
    strokeColor = '#FB923C';
    opacity = 1;
  }
  
  const hexagonPath = 'M8 1L13.1962 4V12L8 15L2.80385 12V4L8 1Z';
  const uniqueId = `hex-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* ClipPath for halfway fill (bottom half) */}
        {fillPercentage === 50 && (
          <clipPath id={`clip-${uniqueId}`}>
            <rect x="0" y="8" width="16" height="8" />
          </clipPath>
        )}
      </defs>
      
      {/* Background hexagon (for fill) */}
      {fillPercentage === 100 && (
        <path
          d={hexagonPath}
          fill={fillColor}
          opacity={opacity}
        />
      )}
      {fillPercentage === 50 && (
        <g clipPath={`url(#clip-${uniqueId})`}>
          <path
            d={hexagonPath}
            fill={fillColor}
            opacity={opacity}
          />
        </g>
      )}
      
      {/* Outline hexagon */}
      <path
        d={hexagonPath}
        stroke={strokeColor}
        strokeWidth="2"
        fill="none"
        opacity={opacity}
      />
    </svg>
  );
}

/**
 * Small Circular Progress Ring Icon
 * 12px size for progress badge
 * Shows progress based on current/total fraction
 */
function SmallProgressRing({ 
  className,
  current,
  total
}: { 
  className?: string;
  current: number;
  total: number;
}) {
  const size = 12;
  const strokeWidth = 1;
  const radius = 4.5;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate progress percentage (0-1)
  const progress = total > 0 ? current / total : 0;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  
  // Calculate stroke dash offset for the progress arc
  const offset = circumference - (clampedProgress * circumference);
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: 'rotate(-90deg)' }}
    >
      {/* Background circle (unfilled portion - light gray) */}
      <circle
        cx="6"
        cy="6"
        r={radius}
        stroke="#E5E7EB"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress circle (gray, shows completed portion) */}
      {clampedProgress > 0 && (
        <circle
          cx="6"
          cy="6"
          r={radius}
          stroke="#9CA3AF"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

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

  const isTaskActive = (status: string) => {
    return status === 'in_progress' || status === 'pending';
  };

  const isTaskDisabled = (status: string) => {
    return status === 'completed';
  };

  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-4">
      {/* Card Header */}
      <div>
        <h3 className="text-[16px] font-semibold text-[#111827]">Action needed</h3>
        <p className="mt-1 text-[13px] font-normal text-[#9CA3AF]">{tasks.length} tasks total</p>
      </div>

      {/* Task List Container */}
      <div className="mt-3">
        {tasks.map((task, index) => {
          const active = isTaskActive(task.status);
          const disabled = isTaskDisabled(task.status);
          const hasProgress = task.progress.total > 1;

          return (
            <div key={task.id}>
              {/* Task Row */}
              <div
                className={cn(
                  'flex items-center gap-3',
                  'hover:bg-[#F9FAFB] transition-colors',
                  disabled && 'opacity-40'
                )}
                style={{ height: '44px' }}
              >
                {/* 1. Task ID */}
                <div className="w-[64px] flex-shrink-0">
                  <span className="text-[13px] font-medium text-[#6B7280]">
                    {task.taskId}
                  </span>
                </div>

                {/* 2. Status Icon */}
                <div className="flex-shrink-0">
                  <HexagonIcon status={task.status} priority={task.priority} />
                </div>

                {/* 3. Task Description */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-[14px] font-medium truncate',
                      active ? 'text-[#111827]' : 'text-[#9CA3AF]'
                    )}
                    style={{
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                  >
                    {task.description}
                  </p>
                </div>

                {/* 4. Spacer */}
                <div className="flex-1" />

                {/* 5. Progress Badge (Optional) */}
                {hasProgress && (
                  <div className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[#E5E7EB] px-2 py-1 min-w-[44px]">
                    <SmallProgressRing 
                      current={task.progress.current} 
                      total={task.progress.total} 
                    />
                    <span className="text-[12px] font-medium text-[#6B7280]">
                      {task.progress.current}/{task.progress.total}
                    </span>
                  </div>
                )}
              </div>

              {/* Row Separator */}
              {index < tasks.length - 1 && (
                <div className="h-px bg-[#E5E7EB]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
