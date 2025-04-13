"use client";

import { MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Action = {
  label: string;
  onClick: () => void;
  Icon: React.ElementType;
};

type ActionPopoverProps = {
  actions: Action[];
};

export default function ActionPopover({ actions }: ActionPopoverProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-2">
          <MoreVertical size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {actions.map((action, index) => (
          <DropdownMenuItem key={index} onClick={action.onClick}>
            <action.Icon className="mr-2 h-4 w-4" />
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
