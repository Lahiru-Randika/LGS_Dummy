import {
  type ReactNode,
  useEffect,
  useRef,
} from 'react'

type ParallaxSectionProps = {
  src: string
  children: ReactNode
  className?: string
  imageClassName?: string
  overlayClassName?: string
  speed?: number
  maxOffset?: number
}

export function ParallaxSection({
  src,
  children,
  className = '',
  imageClassName = '',
  overlayClassName = '',
  speed = 0.08,
  maxOffset = 70,
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const image = imageRef.current

    if (!section || !image) return

    const prefersReducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

    if (prefersReducedMotion) {
      image.style.transform =
        'translate3d(0, 0, 0) scale(1.08)'
      return
    }

    const updateParallax = () => {
      frameRef.current = null

      const rect =
        section.getBoundingClientRect()

      const viewportHeight =
        window.innerHeight

      if (
        rect.bottom < 0 ||
        rect.top > viewportHeight
      ) {
        return
      }

      const sectionCenter =
        rect.top + rect.height / 2

      const viewportCenter =
        viewportHeight / 2

      const distance =
        sectionCenter - viewportCenter

      let offset =
        distance * speed

      offset = Math.max(
        -maxOffset,
        Math.min(maxOffset, offset),
      )

      image.style.transform = `translate3d(0, ${offset}px, 0) scale(1.08)`
    }

    const requestUpdate = () => {
      if (frameRef.current !== null) return

      frameRef.current =
        window.requestAnimationFrame(
          updateParallax,
        )
    }

    updateParallax()

    window.addEventListener(
      'scroll',
      requestUpdate,
      {
        passive: true,
      },
    )

    window.addEventListener(
      'resize',
      requestUpdate,
    )

    return () => {
      window.removeEventListener(
        'scroll',
        requestUpdate,
      )

      window.removeEventListener(
        'resize',
        requestUpdate,
      )

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(
          frameRef.current,
        )
      }
    }
  }, [speed, maxOffset])

  return (
    <section
      ref={sectionRef}
      className={`relative isolate overflow-hidden ${className}`}
    >
      {/* Parallax image */}
      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <img
          ref={imageRef}
          src={src}
          alt=""
          draggable={false}
          className={`
            absolute
            left-0
            top-[-12%]
            h-[124%]
            w-full
            object-cover
            will-change-transform
            ${imageClassName}
          `}
        />
      </div>

      {/* Overlay */}
      <div
        className={`
          pointer-events-none
          absolute
          inset-0
          -z-10
          ${overlayClassName}
        `}
      />

      {/* Foreground content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  )
}