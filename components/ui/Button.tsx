import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "gold" | "outline" | "purpleGhost" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  gold:
    "border-ekalo-gold bg-ekalo-gold text-black shadow-[0_0_34px_rgba(250,204,21,0.22)] hover:bg-ekalo-goldSoft hover:shadow-[0_0_46px_rgba(250,204,21,0.32)]",
  outline:
    "border-ekalo-line bg-black/25 text-white hover:border-ekalo-gold hover:bg-ekalo-gold/10 hover:text-ekalo-gold",
  purpleGhost:
    "border-ekalo-purple/70 bg-black/15 text-fuchsia-400 hover:bg-ekalo-purple/10 hover:text-fuchsia-300 hover:shadow-purple",
  ghost: "border-white/10 bg-white/5 text-white hover:border-white/25 hover:bg-white/10"
};

const sizeClasses: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-base",
  lg: "h-14 px-6 text-base sm:px-8 sm:text-lg"
};

type SharedProps = {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
};

export function Button({
  className,
  variant = "gold",
  size = "md",
  icon,
  iconPosition = "right",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & SharedProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ekalo-gold disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {icon && iconPosition === "left" ? icon : null}
      <span>{children}</span>
      {icon && iconPosition === "right" ? icon : null}
    </button>
  );
}

export function LinkButton({
  className,
  variant = "gold",
  size = "md",
  icon,
  iconPosition = "right",
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & SharedProps) {
  return (
    <a
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ekalo-gold",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {icon && iconPosition === "left" ? icon : null}
      <span>{children}</span>
      {icon && iconPosition === "right" ? icon : null}
    </a>
  );
}
