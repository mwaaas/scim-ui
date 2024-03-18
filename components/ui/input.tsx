import * as React from "react";

import { cn } from "@/utils/functions/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "text-md flex h-10 w-60 rounded-md border border-slate-400 bg-transparent px-3 py-2 text-black placeholder:text-center placeholder:text-sm placeholder:font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border dark:border-yellow-600 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
