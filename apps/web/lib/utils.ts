import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a consistent avatar background color based on employee ID or name
 * Returns a Tailwind color class for the background
 */
const avatarColors = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-orange-500',
  'bg-red-500',
  'bg-cyan-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-lime-500',
] as const;

const avatarTextColors = [
  'text-white',
  'text-white',
  'text-white',
  'text-white',
  'text-white',
  'text-white',
  'text-white',
  'text-white',
  'text-white',
  'text-white',
  'text-white',
  'text-white',
  'text-white',
  'text-white',
  'text-white',
] as const;

export function getAvatarColor(id: string): {
  bg: typeof avatarColors[number];
  text: typeof avatarTextColors[number];
} {
  // Generate a consistent hash from the ID
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % avatarColors.length;
  return {
    bg: avatarColors[index],
    text: avatarTextColors[index],
  };
}
