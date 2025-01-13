'use client'

import { motion } from 'framer-motion'

export default function GeminiLoader() {
  return (
    <div className="flex flex-col gap-4 p-8 bg-transparent min-h-[250px]">
      {/* Star icon with rotation */}
      <motion.div
        className="w-6 h-6"
        animate={{ 
          opacity: [0.4, 0.7, 1, 0.7, 0.5],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
          times: [0.4, 0.7, 1] // Sync opacity with rotation
        }}
      >
      <img src='/gemini_logo.svg' alt=''/>
      </motion.div>

      {/* Loading bars */}
      <div className="space-y-4">
        {[1, 0.85, 0.7].map((width, i) => (
          <div
            key={i}
            className="relative h-4 rounded-full overflow-hidden bg-[#212121]"
            style={{ width: `${width * 100}%` }}
          >
            <div className="absolute inset-0 -translate-x-[100px] w-full rounded-full animate-[shimmer_0.8s_infinite] bg-gradient-to-tr from-transparent via-[rgba(255,255,255,0.02)] to-transparent" />
          </div>
        ))}
      </div>
    </div>
  )
}

