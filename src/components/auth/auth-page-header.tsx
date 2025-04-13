import Image from "next/image";

import { cn } from "@/lib/utils";

type AuthPageHeaderProps = {
  colorInverted?: boolean;
};

export default function AuthPageHeader({
  colorInverted = false,
}: AuthPageHeaderProps) {
  const imagePath = colorInverted
    ? "/images/auth/auth-logo.svg"
    : "/images/auth/auth-logo-dark.svg";
  return (
    <div className="flex items-center gap-2 mb-4 md:mb-0 md:ml-4">
      <Image
        src={imagePath}
        alt="Logo"
        width={50}
        height={50}
        className="mr-2"
      />
      <h2
        className={cn("text-2xl font-semibold", colorInverted && "text-white")}
      >
        Logo
      </h2>
    </div>
  );
}
