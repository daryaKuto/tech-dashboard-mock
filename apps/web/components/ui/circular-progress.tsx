"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CircularProgressProps {
  value: number // 0-100 or 0-1
  size?: number
  strokeWidth?: number
  className?: string
  showLabel?: boolean
  labelClassName?: string
}

/**
 * Circular Progress Component
 * Displays a circular progress indicator with optional label
 */
export function CircularProgress({
  value,
  size = 40,
  strokeWidth = 4,
  className,
  showLabel = false,
  labelClassName,
}: CircularProgressProps) {
  // Normalize value to 0-100
  const normalizedValue = value > 1 ? value : value * 100
  const clampedValue = Math.min(Math.max(normalizedValue, 0), 100)
  
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clampedValue / 100) * circumference
  
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-[#6B7280] transition-all duration-300"
        />
      </svg>
      {showLabel && (
        <span
          className={cn(
            "absolute text-xs font-medium text-[#111827]",
            labelClassName
          )}
        >
          {Math.round(clampedValue)}%
        </span>
      )}
    </div>
  )
}

