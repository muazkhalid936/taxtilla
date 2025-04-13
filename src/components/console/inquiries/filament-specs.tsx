"use client";

// Child component
import {
  Dispatch,
  memo,
  RefObject,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Check } from "lucide-react";
import { Control, Controller } from "react-hook-form";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area"; // optional for scrolling if many items

import LycraSpandex from "./lycra-spandex";

interface FilamentSpecsProps {
  formData: RefObject<Record<string, { denier?: number }>>;
  control: Control<Record<string, { denier?: number }>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  /** The array of possible filament names, e.g. ["Lycra", "Spandex", "something"] */
  options: string[];
  /** The currently selected filament names */
  SelectedFilaments: string[];
  /** setState for selected filaments */
  setSelectedFilaments: Dispatch<SetStateAction<string[]>>;
  // For Lycra/Spandex child
  Lycra: number[];
  setLycra: Dispatch<SetStateAction<number[]>>;
  Spandex: number[];
  setSpandex: Dispatch<SetStateAction<number[]>>;
  LycraCount: RefObject<number>;
  SpandexCount: RefObject<number>;
}

export function FilamentSpecs({
  formData,
  control,
  errors,
  options,
  SelectedFilaments,
  setSelectedFilaments,
  Lycra,
  setLycra,
  Spandex,
  setSpandex,
  LycraCount,
  SpandexCount,
}: FilamentSpecsProps) {
  // We create an "open" state for the popover
  const [open, setOpen] = useState(false);

  /**
   * Toggles a filament in or out of the selected array
   */
  const handleToggleFilament = useCallback(
    (filamentName: string) => {
      setSelectedFilaments((prev) => {
        // If already selected, remove it
        if (prev.includes(filamentName)) {
          // Clean up form data when removing a filament
          if (formData.current) {
            delete formData.current[filamentName];
            // Force a re-render by updating the form data reference
            formData.current = { ...formData.current };
          }
          return prev.filter((f) => f !== filamentName);
        } else {
          // Check if trying to add Lycra/Spandex when the other is already selected
          if (
            (filamentName === "Lycra" && prev.includes("Spandex")) ||
            (filamentName === "Spandex" && prev.includes("Lycra"))
          ) {
            return prev; // Don't add if the other is already selected
          }
          // Otherwise add it
          return [...prev, filamentName];
        }
      });
    },
    [setSelectedFilaments, formData]
  );

  // Renders the combined labels in the trigger
  const renderSelected = useMemo(() => {
    if (!SelectedFilaments.length) return "Choose Filaments...";
    return SelectedFilaments.join(", ");
  }, [SelectedFilaments]);

  return (
    <div className="flex w-full flex-wrap justify-between">
      {/* Left Column: the multi-select popover */}
      <div className="mb-4 w-full sm:mb-0 sm:w-[48%]">
        <Label className="mb-1">Filament</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {renderSelected}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start" side="bottom">
            <ScrollArea className="max-h-64 w-48 p-2">
              {options.map((name) => {
                const isChecked = SelectedFilaments.includes(name);
                return (
                  <div
                    key={name}
                    onClick={() => handleToggleFilament(name)}
                    className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-accent"
                  >
                    {/* Checkbox replacement */}
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded border ${
                        isChecked ? "bg-primary text-primary-foreground" : ""
                      }`}
                    >
                      {isChecked && <Check className="h-3 w-3" />}
                    </div>
                    <span className="text-sm">{name}</span>
                  </div>
                );
              })}
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>

      {/* Right Column: For each selected filament, show either <LycraSpandex> or single denier input */}
      <div className="w-full sm:w-[48%]">
        {SelectedFilaments.map((filament) => {
          if (filament === "Lycra" || filament === "Spandex") {
            // Render the special Lycra/Spandex child
            return (
              <LycraSpandex
                key={filament}
                filament={filament}
                formData={formData}
                control={control}
                errors={errors}
                Lycra={Lycra}
                setLycra={setLycra}
                LycraCount={LycraCount}
                Spandex={Spandex}
                setSpandex={setSpandex}
                SpandexCount={SpandexCount}
              />
            );
          } else {
            // Render a single "Denier" field
            return (
              <div
                key={filament}
                className="mb-4 flex w-full flex-wrap items-center justify-between"
              >
                <h2 className="text-lg font-semibold">{filament}</h2>
                <div className="h-[80px] w-[40%] overflow-auto">
                  <Controller
                    name={`${filament}.denier`}
                    control={control}
                    defaultValue={
                      typeof formData.current?.[filament]?.denier === "number"
                        ? formData.current?.[filament]?.denier
                        : undefined
                    }
                    rules={{ min: { value: 0, message: "Invalid entry" } }}
                    render={({ field }) => {
                      const fieldError = errors[filament]?.denier;
                      return (
                        <div className="flex flex-col space-y-1">
                          <Label>Denier</Label>
                          <Input
                            {...field}
                            type="number"
                            onChange={(e) => {
                              const value =
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value);
                              field.onChange(value);
                              // Update formData to match the expected structure
                              if (formData.current) {
                                formData.current[filament] = { denier: value };
                                // Force a re-render by updating the form data reference
                                formData.current = { ...formData.current };
                              }
                            }}
                            onBlur={(e) => {
                              field.onBlur();
                              // Ensure formData is updated on blur as well
                              const value =
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value);
                              if (formData.current) {
                                formData.current[filament] = { denier: value };
                                // Force a re-render by updating the form data reference
                                formData.current = { ...formData.current };
                              }
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
            );
          }
        })}
      </div>
    </div>
  );
}

export default memo(FilamentSpecs);
