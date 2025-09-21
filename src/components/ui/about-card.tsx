import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface AboutCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function AboutCard({ 
  title, 
  icon, 
  children, 
  className,
  ...props 
}: AboutCardProps) {
  return (
    <Card 
      className={cn(
        "bg-card/50 hover:bg-card transition-colors duration-200 border border-border rounded-xl shadow-sm overflow-hidden h-full flex flex-col",
        className
      )}
      {...props}
    >
      <CardContent className="p-6 flex-1 flex flex-col">
        {title && (
          <div className="flex items-center gap-3 mb-4">
            {icon && <div className="text-stare-teal">{icon}</div>}
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>
        )}
        <div className="text-muted-foreground flex-1">
          {children}
        </div>
      </CardContent>
    </Card>
  )
}
