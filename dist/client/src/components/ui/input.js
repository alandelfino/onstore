import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
export const Input = forwardRef(({ className, ...props }, ref) => {
    return (_jsx("input", { ref: ref, className: cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2", "text-sm text-foreground placeholder:text-muted-foreground", "transition-all duration-150", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1", "disabled:opacity-50 disabled:cursor-not-allowed", className), ...props }));
});
Input.displayName = "Input";
