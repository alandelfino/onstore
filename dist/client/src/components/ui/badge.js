import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
const variantClasses = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-muted text-muted-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "border border-border text-foreground bg-transparent",
};
export function Badge({ className, variant = "default", ...props }) {
    return (_jsx("span", { className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", "transition-colors duration-150", variantClasses[variant], className), ...props }));
}
