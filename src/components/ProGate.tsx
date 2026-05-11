import { type ReactNode } from 'react'
import { useAppStore } from '@/stores/appStore'
import { cn } from '@/lib/utils'
import { Lock } from 'lucide-react'

interface ProGateProps {
  moduleId: string
  children: ReactNode
  fallback?: ReactNode
}

export function ProGate({ moduleId, children, fallback }: ProGateProps) {
  const { isPro, productConfig } = useAppStore()

  const isProModule = productConfig?.proModules?.includes(moduleId) ?? false

  if (isProModule && !isPro) {
    return fallback ?? (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <Lock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Pro Feature</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            This feature requires a Pro license. Upgrade to unlock AI-powered capabilities.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
