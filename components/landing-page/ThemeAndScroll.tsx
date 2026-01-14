"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

const ThemeToggle = dynamic(() => import("../ThemeToggle"), { ssr: false })

export default function Nav() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop

      setShowScrollTop(scrollTop > 200)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll() // run once on mount

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav className="flex justify-end">
      <div>
        <ThemeToggle />
      </div>

      {showScrollTop && (
        <button
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          className="
            fixed bottom-25 sm:right-6 right-2 z-[100]
            bg-primary text-primary-foreground
            w-12 h-12 rounded-lg
            flex items-center justify-center
            shadow-2xl
            hover:scale-110 active:scale-95
            transition-all duration-300 cursor-pointer
          "
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </nav>
  )
}