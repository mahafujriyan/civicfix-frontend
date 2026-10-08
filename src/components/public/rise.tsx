"use client"

import { cn } from "@/lib/utils"
import { motion, useReducedMotion } from "motion/react"
import type { ReactNode } from "react"

type RiseProps = {
  children: ReactNode
  className?: string
  delay?: number
}

export function Rise({ children, className, delay = 0 }: RiseProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={cn(className)}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
