import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* Primary: cloud-silver on obsidian */
        default: "bg-[#DCDCE0] text-[#050507] hover:bg-[#C9CDD0] active:scale-[0.98]",
        /* Champagne: warm gold accent */
        champagne: "bg-[#C4A574] text-[#050507] hover:bg-[#B39362] active:scale-[0.98]",
        /* Destructive: danger red */
        destructive: "bg-destructive text-white hover:bg-destructive/85 active:scale-[0.98]",
        /* Outline: glass border + hover reveal */
        outline:
          "bg-[rgba(201,205,208,0.05)] border border-[rgba(201,205,208,0.2)] text-[#BDBDC3] hover:bg-[rgba(201,205,208,0.1)] hover:text-[#DCDCE0] hover:border-[rgba(201,205,208,0.35)] active:scale-[0.98]",
        /* Secondary: graphite panel */
        secondary:
          "bg-[#24242A] text-[#DCDCE0] border border-[rgba(201,205,208,0.15)] hover:bg-[#2C2C34] active:scale-[0.98]",
        /* Ghost: transparent, minimal */
        ghost: "text-[#85858E] hover:bg-[rgba(201,205,208,0.06)] hover:text-[#DCDCE0]",
        /* Link: underline */
        link: "text-[#C4A574] underline-offset-4 hover:underline normal-case tracking-normal text-sm font-medium",
        /* Glass: smoked glass surface with subtle border */
        glass:
          "bg-[rgba(201,205,208,0.06)] border border-[rgba(201,205,208,0.18)] text-[#BDBDC3] hover:bg-[rgba(201,205,208,0.12)] hover:text-[#F4F4F5] hover:border-[rgba(201,205,208,0.3)] active:scale-[0.98]",
        /* Legacy aliases */
        brut: "bg-[#DCDCE0] text-[#050507] hover:bg-[#C9CDD0] active:scale-[0.98]",
        brutOutline:
          "bg-[rgba(201,205,208,0.05)] border border-[rgba(201,205,208,0.2)] text-[#BDBDC3] hover:bg-[rgba(201,205,208,0.1)] active:scale-[0.98]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-[11px]",
        lg: "h-11 rounded-xl px-7 text-xs",
        icon: "h-9 w-9 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
