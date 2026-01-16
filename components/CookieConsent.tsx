"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieConsent() {

const [consent, setConsent] = useState<"accepted" | "declined" | null>(() => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("cookieConsent") as
    | "accepted"
    | "declined"
    | null;
});

const [closed, setClosed] = useState(false);


  const handleClose = () => {
    setClosed(true);
    // Optional: re-show after 5 minutes
    setTimeout(() => setClosed(false), 5 * 60 * 1000);
  };

  const handleConsent = (value: "accepted" | "declined") => {
    localStorage.setItem("cookieConsent", value);
    setConsent(value);
  };

  return (
    <AnimatePresence>
      {consent === null && !closed && (
        <>
          {/* 1. THE BLUR OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/40 backdrop-blur-md"
          />

          {/* 2. THE CENTERED CARD */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-[400px] bg-card border border-border rounded-[2rem] shadow-2xl p-8 overflow-hidden"
            >
              {/* Decorative Background Glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-5 right-5 cursor-pointer text-muted-foreground hover:text-foreground transition-colors p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>

              {/* Cookie Illustration */}
              <div className="flex justify-center mb-6">
                <motion.img
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  src="https://i.postimg.cc/Y2LCMyC9/cookie.png"
                  alt="Cookie"
                  className="w-40 h-40 object-contain drop-shadow-2xl"
                />
              </div>

              {/* Content */}
              <div className="text-center relative z-10">
                <h3 className="text-2xl font-bold text-foreground mb-3 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
                  Cookie Time!
                </h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  We use cookies to make your experience on our site as sweet as
                  possible. Is that cool with you?
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleConsent("accepted")}
                    className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg
                               hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg cursor-pointer"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={() => handleConsent("declined")}
                    className="w-full py-3 rounded-2xl bg-secondary/50 text-secondary-foreground font-medium
                               hover:bg-secondary transition-colors cursor-pointer"
                  >
                    No thanks
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
