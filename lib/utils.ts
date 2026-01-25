import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getGreeting(name: string): string {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return `Good morning, ${name}`;
  } else if (hour < 18) {
    return `Good afternoon, ${name}`;
  } else {
    return `Good evening, ${name}`;
  }
}

export function getDayGreeting(): string {
  const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday'
  ];
  const dayName = days[new Date().getDay()];
  return `How is your ${dayName} going?`;
}
