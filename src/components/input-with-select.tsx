// components/LabeledInputWithSelect.js
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InputWithSelectProps {
  label?: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  selectValue?: string;
  onSelectChange?: (value: string) => void;
  placeholder?: string;
  units?: string[];
  disabled?: boolean;
}

export default function InputWithSelect({
  label = "Label*",
  type = "text",
  value,
  onChange,
  selectValue,
  onSelectChange,
  placeholder = "Enter value",
  units = ["kg", "lbs", "bags"],
  disabled = false,
}: InputWithSelectProps) {
  const [localValue, setLocalValue] = useState(value || "");
  const [localSelectValue, setLocalSelectValue] = useState(selectValue || "");

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  const handleSelectChange = (newValue: string) => {
    setLocalSelectValue(newValue);
    if (onSelectChange) onSelectChange(newValue);
  };

  return (
    <div className="relative flex flex-col">
      <Label htmlFor="inputWithSelect" className="mb-1 text-sm font-medium">
        {label}
      </Label>
      <div className="flex gap-2">
        <Input
          id="inputWithSelect"
          type={type}
          placeholder={placeholder}
          className="pr-[5.5rem]"
          value={localValue}
          onChange={handleValueChange}
          disabled={disabled}
        />
        {units.length > 0 && (
          <Select
            onValueChange={handleSelectChange}
            value={localSelectValue}
            disabled={disabled}
          >
            <SelectTrigger
              className="absolute right-0 top-[1.4rem] h-[2.5rem] w-[5.5rem] rounded-l-none border-none focus-visible:ring-0"
              aria-label="selectField"
            >
              <SelectValue placeholder="select" />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit, index) => (
                <SelectItem key={index} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
