import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-gradient-to-r from-slate-900 to-slate-700 text-slate-50 hover:from-slate-800 hover:to-slate-600 shadow-lg hover:shadow-xl transform hover:scale-105",
                destructive: "bg-gradient-to-r from-red-500 to-red-600 text-slate-50 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:scale-105",
                outline: "border-2 border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 shadow-md hover:shadow-lg transform hover:scale-105",
                secondary: "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-900 hover:from-slate-200 hover:to-slate-300 shadow-md hover:shadow-lg transform hover:scale-105",
                ghost: "hover:bg-slate-100 hover:text-slate-900 transition-colors",
                link: "text-slate-900 underline-offset-4 hover:underline",
                premium: "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-white hover:from-amber-500 hover:via-amber-600 hover:to-amber-700 shadow-lg hover:shadow-xl transform hover:scale-105",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-xl px-3",
                lg: "h-11 rounded-2xl px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
        <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
        />
    );
});
Button.displayName = "Button";

export { Button, buttonVariants };
