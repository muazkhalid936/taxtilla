"use client";

import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { Check } from "lucide-react";
import { Controller } from "react-hook-form";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

// Types for props
interface MaterialSpecsProps {
  formData: RefObject<any>;
  control: any;
  errors: any;
  options: string[];
  SelectedMaterials: string[];
  setSelectedMaterials: Dispatch<SetStateAction<string[]>>;
}

export default function MaterialSpecs({
  formData,
  control,
  errors,
  options,
  SelectedMaterials,
  setSelectedMaterials,
}: MaterialSpecsProps) {
  const [open, setOpen] = useState(false);

  // Toggle a material in or out of the selected array
  const toggleMaterial = (material: string) => {
    setSelectedMaterials((prev) => {
      if (prev.includes(material)) {
        return prev.filter((m) => m !== material);
      } else {
        return [...prev, material];
      }
    });
  };

  const isChecked = (material: string) => SelectedMaterials.includes(material);

  const renderSelected = SelectedMaterials.length
    ? SelectedMaterials.join(", ")
    : "Select material(s)...";

  return (
    <div className="flex w-full flex-wrap justify-between">
      {/* Multi-select popover on the left column */}
      <div className="mb-4 w-full sm:w-[48%]">
        <Label>Material</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {renderSelected}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <ScrollArea className="max-h-48 overflow-auto p-2">
              {options.map((name) => {
                const checked = isChecked(name);
                return (
                  <div
                    key={name}
                    onClick={() => toggleMaterial(name)}
                    className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-accent"
                  >
                    {/* Check / uncheck box */}
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded border ${
                        checked ? "bg-primary text-primary-foreground" : ""
                      }`}
                    >
                      {checked && <Check className="h-3 w-3" />}
                    </div>
                    <span className="text-sm">{name}</span>
                  </div>
                );
              })}
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>

      {/* For each selected material, we show a numeric % input */}
      <div className="flex w-full flex-wrap gap-2 sm:w-[48%]">
        {SelectedMaterials.map((material) => {
          const fieldName = material;

          // retrieve any error from react-hook-form
          const fieldError = errors[fieldName];

          return (
            <div key={material} className="w-[30%]">
              <Controller
                name={fieldName}
                control={control}
                defaultValue={formData.current?.[fieldName] || ""}
                rules={{
                  min: { value: 0, message: "Invalid entry" },
                  max: { value: 100, message: "Invalid entry" },
                }}
                render={({ field }) => (
                  <div className="flex flex-col space-y-1">
                    <Label>{material} %</Label>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                    {fieldError && (
                      <p className="text-sm text-red-500">
                        {fieldError.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
