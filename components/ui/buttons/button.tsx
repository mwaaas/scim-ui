import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/utils/functions/cn";
const buttonVariants = cva(
  "active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:hover:bg-slate-800 dark:hover:text-slate-100 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800",
  {
    variants: {
      variant: {
        default:
          " uppercase place-items-center bg-slate-400 shadow-lg shadow-transparent text-black hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900",
        destructive:
          " uppercase place-items-center bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600 duration-300",
        outline:
          " uppercase place-items-center bg-transparent  text-slate-600 border hover:border-2 hover:border-yellow-400 border-slate-700 hover:bg-slate-500 hover:text-white dark:border-slate-700 dark:text-slate-600 duration-300",
        subtle:
          "uppercase place-items-center bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100 duration-300",
        ghost:
          "uppercase place-items-center bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-100 dark:hover:text-slate-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent",
        link: "bg-transparent place-items-center dark:bg-transparent underline-offset-4 hover:underline text-slate-900 dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
