"use client";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="h-[62px] bg-white rounded-xl shadow-[0_4px_18px_0_rgba(47,43,61,0.1)] flex items-center 
                       justify-end px-6 shrink-0 z-10 relative">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-900">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 
                           bg-red-500 rounded-full border-2 border-white" />
        </Button>
        <Avatar className="w-9 h-9 border-2 border-white shadow-sm cursor-pointer">
          <AvatarFallback className="bg-[#8c57ff] text-white text-xs font-bold">
            AD
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
