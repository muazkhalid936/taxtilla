"use client";

import type React from "react";

import { cn } from "@/lib/utils";

import AuthPageHeader from "./auth-page-header";

interface AuthContentWrapperProps {
  backgroundImage?: string;
  title?: string;
  description?: string;
  hasPortions?: boolean;
  colorInverted?: boolean;
  children: React.ReactNode;
  sideComponent?: React.ReactNode;
  sideContainerClassName?: string;
  titleSubtitleContainerClassName?: string;
  contentContainerClassName?: string;
  childrenContainerClassName?: string;
}

export function AuthContentWrapper({
  backgroundImage,
  title,
  description,
  hasPortions = false,
  colorInverted = false,
  children,
  sideComponent,
  sideContainerClassName,
  titleSubtitleContainerClassName,
  contentContainerClassName,
  childrenContainerClassName,
}: AuthContentWrapperProps) {
  return (
    <div
      className="min-h-screen bg-cover bg-center p-8 relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />
      )}

      {/* Content */}
      <div className="relative z-20">
        <AuthPageHeader colorInverted={colorInverted} />

        <div
          className={cn(
            "flex flex-col items-center justify-evenly pt-8 md:pt-12",
            hasPortions ? "md:flex-row md:items-start" : "",
            contentContainerClassName
          )}
        >
          <div
            className={cn(
              "flex flex-col items-center justify-center md:items-start w-full basis-1/3",
              sideContainerClassName
            )}
          >
            {title && description && (
              <div
                className={cn(
                  "pr-0 md:pr-4 mb-8 md:mb-0 text-center md:text-left",
                  colorInverted && "text-white",
                  titleSubtitleContainerClassName
                )}
              >
                <h1 className="text-2xl md:text-4xl font-bold mb-2">{title}</h1>
                <p className={cn(colorInverted && "text-gray-200")}>
                  {description}
                </p>
              </div>
            )}

            {sideComponent}
          </div>
          <div
            className={cn(
              "bg-white rounded-lg shadow-md p-6 md:p-8 w-[90%] md:w-[400px]",
              childrenContainerClassName
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
