/* eslint-disable @typescript-eslint/member-delimiter-style */
"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center gap-2 rounded-md ",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger> & {
    variant?: "button" | "underline";
  },
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    variant?: "button" | "underline";
  }
>(({ className, variant = "button", ...props }, ref) => {
  // Define base styles
  const baseStyles =
    "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-xs text-secondary-foreground transition-all";

  // Define variant-specific styles
  const variantStyles =
    variant === "button"
      ? "border border-border bg-background ring-offset-background hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:shadow-sm"
      : "border-b-0 hover:border-b-2 data-[state=active]:border-b-2 data-[state=active]:border-secondary-foreground rounded-none text-foreground-light data-[state=active]:text-foreground text-sm";

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(baseStyles, variantStyles, className)}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
