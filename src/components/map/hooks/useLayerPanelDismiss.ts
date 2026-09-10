import { useEffect } from 'react'

import type {
  CivicMapRefs,
} from './useMapRefs'

export function useLayerPanelDismiss({
  open,
  refs,
  onClose,
}: {
  open: boolean
  refs: CivicMapRefs
  onClose: () => void
}) {
  useEffect(() => {
    const handlePointerDown =
      (event: PointerEvent) => {
        const target =
          event.target as Node | null

        if (!target || !open) {
          return
        }

        if (
          !refs.layerPanelRef.current?.contains(
            target,
          ) &&
          !refs.layerButtonRef.current?.contains(
            target,
          )
        ) {
          onClose()
        }
      }

    document.addEventListener(
      'pointerdown',
      handlePointerDown,
    )

    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDown,
      )
    }
  }, [open, onClose])
}
