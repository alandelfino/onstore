import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
const sizeClasses = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
};
export function Avatar({ className, src, alt, fallback, size = "md", ...props }) {
    return (_jsxs("div", { className: cn("relative inline-flex items-center justify-center rounded-full overflow-hidden", "bg-primary/10 text-primary font-semibold select-none", sizeClasses[size], className), ...props, children: [src ? (_jsx("img", { src: src, alt: alt, className: "w-full h-full object-cover", onError: (e) => {
                    e.currentTarget.style.display = "none";
                } })) : null, _jsx("span", { className: "absolute", children: fallback })] }));
}
