/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { memo, RefObject } from "react";
import { Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Replaces MUI's SlubInput with shadcn/ui.
 * We show two numeric inputs: Min and Max.
 */
interface SlubInputProps {
  formData: RefObject<any>;
  control: any;
  errors: any;
  title: string; // e.g. "Slub Length (cm)"
  name: string; // e.g. "length", "pause", "thickness"
}

function SlubInput({ formData, control, errors, title, name }: SlubInputProps) {
  const minError = errors[name]?.min;
  const maxError = errors[name]?.max;

  return (
    <div className="mb-2 flex w-full items-center justify-between">
      <p className="text-sm font-medium">{title}</p>

      <div className="flex items-center gap-4">
        {/* Min */}
        <div className="flex w-[80px] flex-col">
          <Label className="mb-1 text-xs">Min</Label>
          <Controller
            name={`${name}.min`}
            control={control}
            defaultValue={formData.current?.[name]?.min || ""}
            rules={{ min: { value: 0, message: "Invalid entry" } }}
            render={({ field }) => (
              <>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
                {minError && (
                  <p className="text-xs text-red-500">{minError.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* Max */}
        <div className="flex w-[80px] flex-col">
          <Label className="mb-1 text-xs">Max</Label>
          <Controller
            name={`${name}.max`}
            control={control}
            defaultValue={formData.current?.[name]?.max || ""}
            rules={{ min: { value: 0, message: "Invalid entry" } }}
            render={({ field }) => (
              <>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
                {maxError && (
                  <p className="text-xs text-red-500">{maxError.message}</p>
                )}
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(SlubInput);
