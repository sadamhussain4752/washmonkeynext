"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Package, HelpCircle, User, Car } from "lucide-react";
import { toast } from "sonner";

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { path: "/", icon: Home, label: "Home", protected: false },
    { path: "/orders", icon: Package, label: "Orders", protected: true },
    { path: "/profile", icon: User, label: "Profile", protected: true },
    { path: "/vehicles", icon: Car, label: "Vehicles", protected: true },
    { path: "/help", icon: HelpCircle, label: "Help", protected: false },
  ];

  const handleNavigation = (item: any, e: any) => {
    const userId = localStorage.getItem("userId");

    if (item.protected && !userId) {
      e.preventDefault();

      toast.error("Please login to continue");

      // save redirect
      localStorage.setItem("redirectAfterLogin", item.path);

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    }
  };

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 md:hidden">
      <div
        className="flex items-center justify-between h-16 px-2 rounded-2xl shadow-lg"
        style={{
          background: "var(--primary)",
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
              onClick={(e) => handleNavigation(item, e)}
              className="flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 active:scale-90"
            >
              <div
                className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all duration-300
                ${
                  isActive
                    ? "bg-white shadow-lg scale-110 -translate-y-1"
                    : "bg-transparent"
                }`}
              >
                <Icon
                  className="w-5 h-5 mb-0.5"
                  style={{
                    color: isActive
                      ? "var(--primary)"
                      : "rgba(255,255,255,0.8)",
                  }}
                />

                <span
                  className="text-[10px] font-medium"
                  style={{
                    color: isActive
                      ? "var(--primary)"
                      : "rgba(255,255,255,0.8)",
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