
interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* استخدم صورة الشعار إن توفرت في المسار الجذري أو public */}
      <img
        src={"/auralinklogo.png"}
        alt="Auralink"
        className="w-8 h-8 rounded-md object-contain"
        onError={(e) => {
          // في حال عدم توفّر الصورة، اعرض الأيقونة القديمة
          const parent = (e.currentTarget.parentElement as HTMLElement)!
          e.currentTarget.style.display = 'none';
          const fallback = document.createElement('div');
          fallback.className = 'flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg';
          const icon = document.createElement('span');
          icon.className = 'inline-block';
          parent.prepend(fallback);
        }}
      />
      {showText && (
        <span className="text-xl font-bold text-dark-900">Auralink</span>
      )}
    </div>
  );
}