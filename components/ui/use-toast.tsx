'use client';

import * as React from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

export type ToasterToast = ToastProps & {
  id: string
  title?: string
  description?: string
  action?: ToastActionElement
}

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToastState = {
  toasts: ToasterToast[]
}

const toastState = {
  toasts: [] as ToasterToast[],
  listeners: new Set<(state: ToasterToastState) => void>(),

  subscribe(listener: (state: ToasterToastState) => void) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  },

  notify(state: ToasterToastState) {
    this.listeners.forEach((listener) => listener(state))
  },

  addToast(toast: ToasterToast) {
    this.toasts = [toast, ...this.toasts].slice(0, TOAST_LIMIT)
    this.notify({ toasts: this.toasts })
  },

  dismissToast(toastId: string) {
    this.toasts = this.toasts.filter((t) => t.id !== toastId)
    this.notify({ toasts: this.toasts })
  },
}

export function useToast() {
  const [state, setState] = React.useState<ToasterToastState>({ toasts: [] })

  React.useEffect(() => {
    return toastState.subscribe(setState)
  }, [])

  return {
    toasts: state.toasts,
    toast: (props: Omit<ToasterToast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9)
      toastState.addToast({ id, ...props })
    },
    dismiss: (toastId: string) => toastState.dismissToast(toastId),
  }
} 