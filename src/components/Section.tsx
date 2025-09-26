import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
}

export function Section({ 
  children, 
  className = "",
  containerClassName = "",
  id 
}: SectionProps) {
  return (
    <section id={id} className={cn("py-16 md:py-20", className)}>
      <div className={cn(
        "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", 
        containerClassName
      )}>
        {children}
      </div>
    </section>
  );
}