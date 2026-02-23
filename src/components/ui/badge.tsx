import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "destructive" | "outline";
}

const variantClasses: Record<string, string> = {
    default: "bg-primary text-white",
    secondary: "bg-slate-100 text-slate-900",
    destructive: "bg-red-100 text-red-700",
    outline: "border border-slate-200 text-slate-700",
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
                variantClasses[variant],
                className
            )}
            {...props}
        />
    );
}

export { Badge };
export type { BadgeProps };
