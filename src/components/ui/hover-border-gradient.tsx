"use client";
import React from "react";
import { cn } from "@/lib/utils";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
  } & React.HTMLAttributes<HTMLElement>
>) {
  return (
    <Tag
      className={cn(
        "relative flex rounded-[24px] content-center items-center flex-col flex-nowrap h-min justify-center overflow-hidden w-fit",
        // Liquid glass effect - transparent with blur
        "bg-white/5 backdrop-blur-xl",
        "border border-white/10",
        "hover:bg-white/10 hover:border-white/20",
        "transition-all duration-300",
        containerClassName
      )}
      {...props}
    >
      <div className={cn("relative z-10 px-6 py-3", className)}>
        {children}
      </div>
    </Tag>
  );
}
