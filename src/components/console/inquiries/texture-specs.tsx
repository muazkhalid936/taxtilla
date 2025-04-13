/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dispatch, RefObject, SetStateAction } from "react";
import { Controller } from "react-hook-form";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import SlubInput from "./slub-input";

interface TextureSpecsProps {
  formData: RefObject<any>;
  control: any;
  errors: any;
  Texture: string;
  setTexture: Dispatch<SetStateAction<string>>;
}

export default function TextureSpecs({
  formData,
  control,
  errors,
  Texture,
  setTexture,
}: TextureSpecsProps) {
  return (
    <div className="flex w-full flex-wrap justify-between">
      {/* Single Select for "Texture" */}
      <div className="mb-4 w-full sm:mb-0 sm:w-[48%]">
        <Label>Texture</Label>
        <Controller
          name="texture"
          control={control}
          defaultValue={formData.current?.texture || ""}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(val) => {
                field.onChange(val);
                setTexture(val);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select texture" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Plain">Plain</SelectItem>
                <SelectItem value="Slub">Slub</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* If user selected "Slub", show 3 inputs for length, pause, thickness */}
      <div className="flex w-full flex-col sm:w-[48%]">
        {Texture === "Slub" && (
          <>
            <SlubInput
              title="Slub Length (cm)"
              name="length"
              formData={formData}
              control={control}
              errors={errors}
            />
            <SlubInput
              title="Slub Pause (cm)"
              name="pause"
              formData={formData}
              control={control}
              errors={errors}
            />
            <SlubInput
              title="Slub Thickness (times)"
              name="thickness"
              formData={formData}
              control={control}
              errors={errors}
            />
          </>
        )}
      </div>
    </div>
  );
}
