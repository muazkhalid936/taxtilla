import Link from "next/link";
import { Facebook, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Separator } from "../ui/separator";

interface AuthFormFooterProps {
  linkText: string;
  linkPath: string;
  linkPrompt: string;
}

export function AuthFormFooter({
  linkText,
  linkPath,
  linkPrompt,
}: AuthFormFooterProps) {
  return (
    <>
      <div className="flex items-center mt-4 gap-3">
        <Separator className="flex-1" />
        <p className="text-center text-sm text-gray-500">or login with</p>
        <Separator className="flex-1" />
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="outline" className="w-[48%] cursor-pointer">
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>
        <Button variant="outline" className="w-[48%] cursor-pointer">
          <Mail className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        {linkPrompt}{" "}
        <Link href={linkPath} className="text-black hover:underline">
          {linkText}
        </Link>
      </p>
    </>
  );
}
