"use client"

import { useTheme } from "next-themes"
import { Sun, Moon, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useMounted } from "@/hooks/useMounted"

export default function ThemeToggle() {
  const mounted = useMounted()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)

  // Small delay to prevent flash of incorrect theme
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted || isLoading) {
    return (
      <button
        className="fixed bottom-10 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-lg
        bg-neutral-200 dark:bg-neutral-800 shadow-lg animate-pulse"
        aria-label="Loading theme"
        disabled
      >
        <Loader2 className="w-5 h-5 animate-spin" />
      </button>
    )
  }

  const isDark = resolvedTheme === 'dark'
  const nextTheme = isDark ? 'light' : 'dark'
  const Icon = isDark ? Sun : Moon

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      className="fixed bottom-10 right-2 z-50 sm:bottom-10 sm:right-6 flex items-center justify-center w-12 h-12 rounded-lg
      bg-neutral-200 text-neutral-800 shadow-lg transition-all duration-300 hover:bg-neutral-300 
      dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 cursor-pointer
      focus:outline-none"
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
    >
      <Icon size={22} />
    </button>

  );
}
