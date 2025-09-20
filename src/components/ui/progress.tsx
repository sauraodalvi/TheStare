import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    {(() => {
      // Normalize value to 0..100 (accepts number, numeric string, percentage string, or 0..1 fraction)
      const raw = value as unknown as any;
      let n: number;
      if (typeof raw === 'number') {
        n = raw;
      } else if (typeof raw === 'string') {
        const cleaned = raw.trim().endsWith('%') ? raw.trim().slice(0, -1) : raw.trim();
        n = parseFloat(cleaned);
      } else {
        n = 0;
      }
      if (!Number.isFinite(n) || isNaN(n)) n = 0;
      // If it looks like a fraction (0..1), treat as 0..100
      if (n > 0 && n <= 1) n = n * 100;
      // Clamp
      n = Math.max(0, Math.min(100, n));
      const translate = 100 - n;
      return (
        <ProgressPrimitive.Indicator
          className="h-full w-full flex-1 bg-green-600 transition-all"
          style={{ transform: `translateX(-${translate}%)` }}
        />
      );
    })()}
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
