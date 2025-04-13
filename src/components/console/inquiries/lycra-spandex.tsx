"use client";

import { Dispatch, memo, RefObject, SetStateAction, useCallback } from "react";
import { Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LycraSpandexProps {
  filament: string;
  formData: RefObject<any>;
  control: any;
  errors: any;
  Lycra: number[];
  setLycra: Dispatch<SetStateAction<number[]>>;
  Spandex: number[];
  setSpandex: Dispatch<SetStateAction<number[]>>;
  LycraCount: RefObject<number>;
  SpandexCount: RefObject<number>;
}

export function LycraSpandex({
  filament,
  formData,
  control,
  errors,
  Lycra,
  setLycra,
  Spandex,
  setSpandex,
  LycraCount,
  SpandexCount,
}: LycraSpandexProps) {
  // For the heading & "Add more" button
  const handleAddMore = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent form submission
      e.stopPropagation(); // Stop event bubbling
      if (filament === "Lycra") {
        LycraCount.current += 1;
        setLycra((prev) => [...prev, LycraCount.current]);
      } else {
        SpandexCount.current += 1;
        setSpandex((prev) => [...prev, SpandexCount.current]);
      }
    },
    [filament, LycraCount, SpandexCount, setLycra, setSpandex]
  );

  // Common function to remove an item from the array
  const handleRemove = useCallback(
    (item: number) => {
      if (filament === "Lycra") {
        setLycra((prev) => prev.filter((e) => e !== item));
        // Clean up form data
        if (formData.current?.[filament]) {
          const newSpecs = { ...formData.current[filament] };
          delete newSpecs[item];
          if (Object.keys(newSpecs).length === 0) {
            delete formData.current[filament];
          } else {
            formData.current[filament] = newSpecs;
          }
          // Force a re-render by updating the form data reference
          formData.current = { ...formData.current };
        }
      } else {
        setSpandex((prev) => prev.filter((e) => e !== item));
        // Clean up form data
        if (formData.current?.[filament]) {
          const newSpecs = { ...formData.current[filament] };
          delete newSpecs[item];
          if (Object.keys(newSpecs).length === 0) {
            delete formData.current[filament];
          } else {
            formData.current[filament] = newSpecs;
          }
          // Force a re-render by updating the form data reference
          formData.current = { ...formData.current };
        }
      }
    },
    [filament, setLycra, setSpandex, formData]
  );

  // Update form data when denier or draft changes
  const handleInputChange = useCallback(
    (item: number, field: string, value: string | number) => {
      if (formData.current) {
        if (!formData.current[filament]) {
          formData.current[filament] = {};
        }
        if (!formData.current[filament][item]) {
          formData.current[filament][item] = {};
        }
        formData.current[filament][item][field] =
          value === "" ? undefined : Number(value);
        // Force a re-render by updating the form data reference
        formData.current = { ...formData.current };
      }
    },
    [filament, formData]
  );

  const itemArray = filament === "Lycra" ? Lycra : Spandex;

  return (
    <div className="mb-4 w-full">
      <div className="mb-2 flex w-full items-center justify-between">
        <h2 className="text-lg font-semibold">{filament}</h2>
        <Button variant="default" onClick={handleAddMore}>
          Add more
        </Button>
      </div>

      {/* Each item row */}
      {itemArray.map((item) => {
        // We'll build a unique base name for react-hook-form fields
        const baseName = `${filament}.${item}`;

        return (
          <div
            key={item}
            className="mb-3 flex w-full flex-wrap items-center justify-between"
          >
            <div className="flex w-[80%] flex-wrap items-center justify-between gap-2">
              {/* DRAFT */}
              <div className="w-[48%]">
                <Controller
                  name={`${baseName}.draft`}
                  control={control}
                  defaultValue={
                    formData.current?.[filament]?.[item]?.draft || ""
                  }
                  rules={{ min: { value: 0, message: "Invalid entry" } }}
                  render={({ field }) => {
                    const fieldError = errors?.[filament]?.[item]?.draft;
                    return (
                      <div className="flex flex-col space-y-1">
                        <Label>Draft</Label>
                        <Input
                          {...field}
                          type="number"
                          onChange={(e) => {
                            field.onChange(
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value)
                            );
                            handleInputChange(item, "draft", e.target.value);
                          }}
                        />
                        {fieldError && (
                          <p className="text-sm text-red-500">
                            {fieldError.message}
                          </p>
                        )}
                      </div>
                    );
                  }}
                />
              </div>

              {/* DENIER */}
              <div className="w-[48%]">
                <Controller
                  name={`${baseName}.denier`}
                  control={control}
                  defaultValue={
                    formData.current?.[filament]?.[item]?.denier || ""
                  }
                  rules={{ min: { value: 0, message: "Invalid entry" } }}
                  render={({ field }) => {
                    const fieldError = errors?.[filament]?.[item]?.denier;
                    return (
                      <div className="flex flex-col space-y-1">
                        <Label>Denier</Label>
                        <Input
                          {...field}
                          type="number"
                          onChange={(e) => {
                            field.onChange(
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value)
                            );
                            handleInputChange(item, "denier", e.target.value);
                          }}
                        />
                        {fieldError && (
                          <p className="text-sm text-red-500">
                            {fieldError.message}
                          </p>
                        )}
                      </div>
                    );
                  }}
                />
              </div>
            </div>

            {/* Remove Button */}
            <p>
              To remove this from specification,just clear any field of that
              entry
            </p>
            {/* <Button
              variant="ghost"
              className="p-0 h-fit"
              onClick={() => handleRemove(item)}
            >
              <X size={20} />
            </Button> */}
          </div>
        );
      })}
    </div>
  );
}
export default memo(LycraSpandex);
