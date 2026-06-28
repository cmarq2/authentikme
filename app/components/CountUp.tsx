"use client"
import { useEffect, useRef, useState } from "react"

interface Props {
  to: number
  prefix?: string
  suffix?: string
  duration?: number
  decimals?: number
}

export default function CountUp({ to, prefix = "", suffix = "", duration = 1800, decimals = 0 }: Props) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1)
            const ease = 1 - Math.pow(1 - p, 3)
            setValue(parseFloat((ease * to).toFixed(decimals)))
            if (p < 1) requestAnimationFrame(tick)
            else setValue(to)
          }
          requestAnimationFrame(tick)
          observer.unobserve(el)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [to, duration, decimals])

  return (
    <span ref={ref}>
      {prefix}{decimals ? value.toFixed(decimals) : Math.round(value)}{suffix}
    </span>
  )
}
