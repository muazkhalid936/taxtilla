"use client";

import { RefObject, useState } from "react";

import { Input } from "@/components/ui/input";

// We assume 'value' is a MutableRefObject or similar that holds an array.
// Adjust the types as needed based on your usage.

interface TableInputProps {
  index: number;
  /** The ref object containing an array you want to modify. */
  value: RefObject<{ [key: string]: number | string | null }[]>;
  /** The key to update in `value.current[index][objectKey]`. */
  objectKey: string;
  /** Optional placeholder text. Defaults to "Enter price". */
  placeholder?: string;
}

export default function TableInput({
  index,
  value,
  objectKey,
  placeholder = "Enter price",
}: TableInputProps) {
  // Retrieve the initial value
  const initial = value.current[index][objectKey];
  const [text, setText] = useState<number | "">(
    typeof initial === "number" ? initial : ""
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value ? Number(e.target.value) : "";
    setText(newValue);

    // Update the ref’s array
    value.current[index][objectKey] = newValue || null; // or 0, depending on your logic
  };

  return (
    <div className="w-full">
      <Input
        type="number"
        value={text === 0 || text === null ? "" : text}
        onChange={handleChange}
        placeholder={placeholder}
        className="h-10 px-2 focus-visible:ring-0 rounded-none border-none"
      />
    </div>
  );
}
