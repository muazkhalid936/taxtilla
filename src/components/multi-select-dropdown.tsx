"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils"; // optional helper to conditionally merge classes
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectDropdownProps {
  /** The array of { label, value } objects. */
  options: Option[];
  /** The user-friendly label for this dropdown. */
  label: string;
  /** The current state array of selected values. */
  state: string[];
  /** A setter that updates the state in the parent. */
  setState: (newValue: string[]) => void;
  /** Whether the dropdown is disabled */
  disabled?: boolean;
}

/**
 * A reusable multi-select dropdown that includes optional "BaseSpecsFilter" logic
 * for certain label sets like "Combed" vs "Carded", "Plain" vs "Slub", etc.
 */
export default function MultiSelectDropdown({
  options,
  label,
  state,
  setState,
  disabled = false,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>(state);

  // Keep a ref of previous selections for the "Base Specs" filter
  const previousSelections = React.useRef<string[]>([]);

  // Update local state if the parent state changes externally
  React.useEffect(() => {
    setSelectedOptions(state);
    previousSelections.current = state;
  }, [state]);

  /**
   * The "BaseSpecsFilter" replicates your original combed/carded and plain/slub logic.
   */
  function BaseSpecsFilter(newSelections: string[]): string[] {
    let newlyAdded = "";

    for (const elem of newSelections) {
      if (!previousSelections.current.includes(elem)) {
        newlyAdded = elem;
        break;
      }
    }

    switch (newlyAdded) {
      case "Combed":
        newSelections = newSelections.filter((item) => item !== "Carded");
        break;
      case "Carded":
        newSelections = newSelections.filter((item) => item !== "Combed");
        break;
      case "Plain":
        newSelections = newSelections.filter((item) => item !== "Slub");
        break;
      case "Slub":
        newSelections = newSelections.filter((item) => item !== "Plain");
        break;
      default:
        break;
    }

    return newSelections;
  }

  /**
   * Toggles an item in the local array of selected items,
   * then applies optional filtering if label is "Base Specs".
   */
  const toggleOption = (value: string) => {
    let newSelections: string[];
    if (selectedOptions.includes(value)) {
      // Remove it
      newSelections = selectedOptions.filter((v) => v !== value);
    } else {
      // Add it
      newSelections = [...selectedOptions, value];
    }

    if (label === "Base Specs") {
      newSelections = BaseSpecsFilter(newSelections);
    }

    setSelectedOptions(newSelections);
    setState(newSelections);
    previousSelections.current = newSelections;
  };

  /**
   * Helper to show a comma-separated list of labels in the trigger button.
   */
  const renderSelectedValue = () => {
    if (!selectedOptions.length) return "";
    // Map each selected value to its label for display
    const selectedLabels = selectedOptions
      .map((val) => {
        const opt = options.find((o) => o.value === val);
        return opt ? opt.label : val;
      })
      .join(", ");
    return selectedLabels;
  };

  if (!selectedOptions) return null;

  return (
    <div className="w-full">
      <label className="mb-1 block text-sm font-medium text-foreground">
        {label}
      </label>

      {/* Popover trigger: The Button that shows selected values */}
      <Popover
        open={open && !disabled}
        onOpenChange={(newOpen) => !disabled && setOpen(newOpen)}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            disabled={disabled}
          >
            <span className="truncate">
              {selectedOptions.length > 0 ? renderSelectedValue() : "Select..."}
            </span>
          </Button>
        </PopoverTrigger>

        {/* The popover content that shows the checkboxes */}
        <PopoverContent className="p-0" align="start" side="bottom">
          <div className="max-h-60 w-64 overflow-auto p-2">
            {/* We just list items with checkboxes */}
            {options.map((opt) => {
              const isChecked = selectedOptions.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  onClick={() => !disabled && toggleOption(opt.value)}
                  className={cn(
                    "flex cursor-pointer select-none items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent",
                    isChecked ? "font-medium" : "font-normal",
                    disabled && "cursor-not-allowed opacity-50"
                  )}
                >
                  {/* A simple checkbox replacement using lucide-react icon or your own styling */}
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border border-input",
                      isChecked ? "bg-primary text-primary-foreground" : ""
                    )}
                  >
                    {isChecked && <Check className="h-3 w-3" />}
                  </div>
                  <span>{opt.label}</span>
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
