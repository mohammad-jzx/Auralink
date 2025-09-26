import type { LucideIcon } from "lucide-react"

interface SectionHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  className?: string
}

export function SectionHeader({ title, description, icon: Icon, className = "" }: SectionHeaderProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        {Icon && <Icon className="h-8 w-8 text-primary" />}
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      </div>
      {description && <p className="text-muted-foreground text-lg">{description}</p>}
    </div>
  )
}
