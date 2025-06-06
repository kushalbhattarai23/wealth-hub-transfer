
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Wallet,
  ArrowLeftRight,
  BarChart3,
  Calendar,
  Settings,
  CreditCard,
  TrendingUp,
  PieChart
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigation = [
  { title: "Projects", url: "/project-selection", icon: Home },
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Wallets", url: "/wallets", icon: Wallet },
  { title: "Transactions", url: "/transactions", icon: ArrowLeftRight },
  { title: "Transfers", url: "/transfers", icon: CreditCard },
  { title: "Loans", url: "/loans", icon: TrendingUp },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Category Reports", url: "/category-reports", icon: PieChart },
  { title: "Categories", url: "/categories", icon: Calendar },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            {!collapsed && (
              <span className="text-xl font-bold text-gray-900">FinTrackr</span>
            )}
          </div>
        </div>

        <SidebarGroup className="flex-1 p-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive: navIsActive }) =>
                        `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          navIsActive || isActive(item.url)
                            ? "bg-emerald-50 text-emerald-600 border-l-4 border-emerald-500"
                            : "text-gray-600 hover:bg-gray-50"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-emerald-50 rounded-lg p-4">
              <h3 className="font-semibold text-emerald-900 mb-1">Premium Plan</h3>
              <p className="text-sm text-emerald-700 mb-3">
                Upgrade to access advanced features!
              </p>
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                Upgrade Now
              </Button>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
