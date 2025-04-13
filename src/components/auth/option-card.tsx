"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type OptionCardProps = {
  title: string;
  selected: boolean;
  onChange: () => void;
  contentClassName?: string;
  titleClassName?: string;
};

const OptionCard = ({
  title,
  selected,
  onChange,
  contentClassName,
  titleClassName,
}: OptionCardProps) => {
  return (
    <Card
      className={cn(
        "border border-gray-900 rounded-2xl min-h-[180px] h-full relative cursor-pointer",
        selected && "ring-2 ring-black"
      )}
      onClick={onChange}
    >
      <div
        className={cn(
          "flex flex-col justify-end items-center h-full relative p-4",
          contentClassName
        )}
      >
        <RadioGroup value={title} onChange={onChange} defaultValue={title}>
          <RadioGroupItem
            value={title}
            checked={selected}
            className="absolute top-2 right-2 text-gray-900"
          />
        </RadioGroup>
        <h4
          className={cn(
            "scroll-m-20 tracking-tight font-bold text-lg md:text-4xl",
            titleClassName
          )}
        >
          {title}
        </h4>
      </div>
    </Card>
  );
};

export default OptionCard;
