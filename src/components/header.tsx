import * as React from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useUserStore } from "@/stores/userStore";
import { ChevronDown, Menu, MessageSquare } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NotificationPopover from "@/components/notification-popover";

interface HeaderProps {
  drawerWidth?: number;
  handleDrawerToggle?: () => void;
}

export default function Header({ handleDrawerToggle }: HeaderProps) {
  const [searchValue, setSearchValue] = React.useState("");
  const [menuOpen, setMenuOpen] = React.useState(false);
  const router = useRouter();
  // Use Zustand to access user data
  const user = useUserStore((state) => state.user);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleLogout = () => {
    // Clear user data from the Zustand store
    useUserStore.getState().setUser(null);
    // Remove the token from localStorage
    localStorage.removeItem("token");
    // Redirect to login page
    router.push(ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-10 w-full bg-white py-4 text-[#293132]">
      <div className="flex items-center px-4">
        {/* Mobile Menu Icon */}
        <div className="flex md:hidden">
          {handleDrawerToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDrawerToggle}
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Middle Section: Search + Icons */}
        <div className="flex flex-1 items-center gap-4">
          {/* Search (hidden on xs, shown on sm+) */}
          <div className="relative hidden items-center sm:flex">
            <Input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="What service are you looking for today?"
              className="w-full min-w-[150px] max-w-[500px] pr-28 sm:min-w-[150px] md:min-w-[400px]"
            />
            <Button
              variant="default"
              className="absolute right-0 top-0 h-full rounded-l-none bg-[#293132] text-white hover:bg-[#1f1f1f]"
            >
              Yarn
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </div>

          {/* Notification Icon / Popover */}
          <NotificationPopover />

          {/* Messages Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="text-[#74767E] hover:text-[#5e5f63]"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>

          {/* Orders Button */}
          <Button
            variant="ghost"
            className="text-[#74767E] hover:text-[#5e5f63]"
          >
            Orders
          </Button>
        </div>

        {/* Right Section: Username + Avatar */}
        <div className="ml-1 flex flex-shrink-0 items-center">
          {/* Display username if available */}
          <span className="mr-2 hidden font-medium md:inline">
            {user?.name || "User"}
          </span>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="p-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/img/avatar.png" alt="User avatar" />
                        <AvatarFallback>
                          {user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="mt-2 w-36">
                    <DropdownMenuItem
                      onSelect={() => {
                        setMenuOpen(false);
                        // router.push("/profile"); // Uncomment if you have a profile page
                      }}
                    >
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>Open settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}
