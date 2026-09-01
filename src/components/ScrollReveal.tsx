import { type ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '../lib/cn'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'fade' | 'scale'
  once?: boolean
}

const hidden: Record<NonNullable<RevealProps['direction']>, string> = {
  up: 'translate-y-8 opacity-0',
  left: '-translate-x-8 opacity-0',
  right: 'translate-x-8 opacity-0',
  fade: 'opacity-0',
  scale: 'scale-[.96] opacity-0',
}

export function ScrollReveal({ children, className = '', delay = 0, direction = 'up', once = true }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        if (once) observer.unobserve(node)
      } else if (!once) setVisible(false)
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [once])

  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={cn('transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none', visible ? 'translate-x-0 translate-y-0 scale-100 opacity-100' : hidden[direction], className)}>
      {children}
    </div>
  )
}
