import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Infinity symbol icon */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <path
          d="M16 12C14.5 9.5 12 8 9 8C5.134 8 2 11.134 2 15C2 18.866 5.134 22 9 22C12 22 14.5 20.5 16 18M16 18C17.5 20.5 20 22 23 22C26.866 22 30 18.866 30 15C30 11.134 26.866 8 23 8C20 8 17.5 9.5 16 12M16 12V18"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showText && (
        <span className="text-lg font-semibold tracking-tight">
          Infinity<span className="text-primary">.</span>
        </span>
      )}
    </div>
  );
}
