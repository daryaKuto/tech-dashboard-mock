"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { CheckCircle2 } from "lucide-react"

import { cn } from "@/lib/utils"
import type { EmployeeStatus } from "@/lib/api/schemas/employees"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

/**
 * Avatar Status Indicator Component
 * Shows a status checkmark positioned at the bottom-right of the avatar
 */
function AvatarStatus({
  status,
  className,
}: {
  status: EmployeeStatus;
  className?: string;
}) {
  const statusConfig = {
    online: { color: "text-green-500" },
    away: { color: "text-yellow-500" },
    busy: { color: "text-red-500" },
    offline: { color: "text-gray-400" },
  };

  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "absolute bottom-0 right-0 flex items-center justify-center",
        className
      )}
      aria-label={`Status: ${status}`}
    >
      <CheckCircle2 
        className={cn("size-4", config.color)} 
        fill="currentColor"
        stroke="white"
        strokeWidth={1.5}
      />
    </div>
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarStatus }
