
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-gray-900">Personal Finance Tracker</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full"></span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-sm text-gray-700">kushal.bhattarai23@gmail.com</span>
          </div>
        </div>
      </div>
    </header>
  );
}
