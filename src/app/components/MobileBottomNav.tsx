"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, HelpCircle, User } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/orders", icon: Package, label: "Orders" },
    { path: "/help", icon: HelpCircle, label: "Help" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? "text-red-600" : "text-gray-600 hover:text-red-600"
              }`}
            >
              <Icon
                className={`w-6 h-6 mb-1 transition-colors ${
                  isActive ? "stroke-red-600" : "stroke-gray-600"
                }`}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
