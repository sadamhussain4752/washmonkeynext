"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, HelpCircle, User, Car } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/orders", icon: Package, label: "Orders" },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/vehicles", icon: Car, label: "Vehicles" },
    { path: "/help", icon: HelpCircle, label: "Help" },
  ];

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 md:hidden">
      <div
        className="flex items-center justify-between h-16 px-2 rounded-2xl 
        shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
        style={{
          background: "var(--primary)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? pathname === "/"
              : pathname.startsWith(item.path);

          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full 
              transition-all duration-300 active:scale-90"
            >
              {/* Active Background */}
              <div
                className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl 
                transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                ${
                  isActive
                    ? "bg-white shadow-lg scale-110 -translate-y-1"
                    : "bg-transparent"
                }`}
              >
                {/* Icon */}
                <Icon
                  className="w-5 h-5 mb-0.5 transition-all duration-300"
                  style={{
                    color: isActive ? "var(--primary)" : "rgba(255,255,255,0.8)",
                    transform: isActive
                      ? "scale(1.2) translateY(-2px)"
                      : "scale(1)",
                  }}
                />

                {/* Label */}
                <span
                  className="text-[10px] font-medium transition-all duration-300"
                  style={{
                    color: isActive ? "var(--primary)" : "rgba(255,255,255,0.8)",
                  }}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}