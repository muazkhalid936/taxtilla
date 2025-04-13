"use client";

import * as React from "react";
// shadcn/ui Popover
import { Bell, Clock, FileText, MessageSquare, UserPlus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// shadcn/ui Avatar
import { Button } from "@/components/ui/button"; // shadcn/ui Button
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Example notification data
const notifications = [
  {
    id: 1,
    user: "Lex Murphy",
    action: "requested access to UNIX directory tree hierarchy",
    time: "Today at 9:42 AM",
    type: "request",
  },
  {
    id: 2,
    user: "Ray Arnold",
    action: "left 6 comments on Isla Nublar SOC2 compliance report",
    time: "Last Wednesday at 9:42 AM",
    type: "comment",
  },
  {
    id: 3,
    user: "Denise Nedry",
    action: "replied to Anna Srzand",
    message:
      '"Oh, I finished de-bugging the phones, but the system\'s compiling for eighteen minutes, or twent..."',
    time: "Last Wednesday at 9:42 AM",
    type: "reply",
  },
  {
    id: 4,
    user: "John Hammond",
    action: "attached a file to Isla Nublar SOC2 compliance report",
    file: "EY_review.pdf",
    fileSize: "2mb",
    time: "Last Wednesday at 9:42 AM",
    type: "attachment",
  },
  {
    id: 5,
    action: "New Account created",
    time: "Last Wednesday at 9:42 AM",
    type: "newAccount",
  },
];

export default function NotificationPopover() {
  const [open, setOpen] = React.useState(false);

  // Decide which icon to show
  const getIcon = (type: string) => {
    switch (type) {
      case "request":
      case "reply":
        return <MessageSquare className="h-4 w-4" />;
      case "comment":
      case "attachment":
        return <FileText className="h-4 w-4" />;
      case "newAccount":
        return <UserPlus className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* IconButton as Popover Trigger */}
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="text-[#74767E] hover:text-[#5e5f63]"
        >
          <Bell className="h-5 w-5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[350px] max-h-[400px] overflow-auto p-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <h6 className="text-sm font-medium">Notifications</h6>
          <Button variant="link" className="text-xs p-0 h-auto">
            Mark all as read
          </Button>
        </div>

        {/* Notification List */}
        <ul className="max-w-[360px] divide-y divide-border">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="flex items-start gap-3 px-4 py-3"
            >
              {/* Avatar with Icon */}
              <Avatar className="h-8 w-8">
                {/* 
                  If you have actual user images, you can place them in AvatarImage,
                  otherwise, we show the icon as a fallback
                */}
                <AvatarImage src="" alt="avatar" />
                <AvatarFallback>{getIcon(notification.type)}</AvatarFallback>
              </Avatar>

              {/* Text Content */}
              <div className="space-y-1 text-sm leading-tight">
                {/* Primary action line */}
                <p className="text-sm text-foreground">
                  {notification.user && (
                    <span className="font-medium">{notification.user} </span>
                  )}
                  {notification.action}
                </p>
                {/* Optional message or file */}
                {notification.message && (
                  <p className="text-sm text-foreground">
                    {notification.message}
                  </p>
                )}
                {notification.file && (
                  <p className="text-sm text-foreground">
                    {notification.file} ({notification.fileSize})
                  </p>
                )}
                {/* Time */}
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3 inline-block" />
                  {notification.time}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
