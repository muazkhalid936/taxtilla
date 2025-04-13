"use client";

import { ChangeEvent, memo, RefObject, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TextInputProps {
  /** The label that appears above the input field. */
  label: string;
  /** The input type, e.g., "text" or "number". */
  type: string;
  /**
   * A ref object whose current value is updated as the user types.
   * E.g. useRef<string | number>("")
   */
  value: RefObject<string | number>;
  /** Placeholder text shown in the input when empty. */
  placeholder?: string;
  disabled?: boolean;
}

/**
 * A reusable text (or number) input component, converted from MUI to shadcn/ui.
 * If `label === "Base Count"` and the user enters a number outside 6–120,
 * an error message is displayed.
 */
function TextInput({
  label,
  type,
  value,
  placeholder,
  disabled = false,
}: TextInputProps) {
  const [text, setText] = useState<string | number>(value.current ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only validate if label is "Base Count"
    if (label === "Base Count") {
      const numericValue = Number(text);

      if (text !== "" && (numericValue < 6 || numericValue > 120)) {
        setError("Enter a number between 6 and 120");
      } else {
        setError(null);
      }
    }
  }, [label, text]);

  /**
   * Sync typed value to local state and to the passed ref
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;

    // Clear error if user is typing again
    setError(null);

    if (type === "number") {
      // If the field is empty, store ""
      // otherwise convert to a number
      const numericVal = inputVal ? Number(inputVal) : "";
      setText(numericVal);
      value.current = numericVal || 0; // or null, depending on your preference
    } else {
      setText(inputVal);
      value.current = inputVal;
    }
  };

  /**
   * For display, if type=number and text=0, show empty string.
   * Otherwise show `text`.
   */
  const inputValue = type === "number" ? (text === 0 ? "" : text) : text;

  return (
    <div className="flex flex-col space-y-1">
      {/* Label */}
      {label && (
        <Label className="text-sm font-medium text-foreground">{label}</Label>
      )}

      {/* Input Field */}
      <Input
        type={type}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        disabled={disabled}
      />

      {/* Error Message */}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default memo(TextInput);
