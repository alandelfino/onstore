import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]",
    secondary: "bg-muted text-foreground hover:bg-muted/80 active:scale-[0.98]",
    outline: "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
    ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98]",
};
const sizeClasses = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 py-1 text-xs",
    lg: "h-12 px-6 py-3 text-base",
    icon: "h-10 w-10",
};
export const Button = forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
    return (_jsx("button", { ref: ref, className: cn("inline-flex items-center justify-center gap-2 rounded-md font-medium", "transition-all duration-150", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none", variantClasses[variant], sizeClasses[size], className), ...props }));
});
Button.displayName = "Button";
