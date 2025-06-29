import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        info: "border-transparent bg-blue-500 text-white",
        success: "border-transparent bg-green-500 text-white",
        warning: "border-transparent bg-yellow-500 text-black",
      },
    },
    size: {
      sm: "px-1.5 py-0.5 text-[10px]",
      default: "px-2 py-0.5 text-xs",
      lg: "px-2.5 py-0.75 text-sm",
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
