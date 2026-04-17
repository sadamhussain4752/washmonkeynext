"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/app/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/app/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";

import Logo from "@/public/logo.png";
import { BASE_URL } from "@/app/utils/config";

import {
  Menu,
  Phone,
  Wallet,
  User,
  LogOut,
  ShoppingBag,
  MapPin,
  Car,
  Package,
  FileText,
  Share2,
  Star,
  HelpCircle,
  House
} from "lucide-react";

interface NavItem {
  label: string;
  icon: any;
  route?: string;
  url?: string;
  action?: "logout" | "share" | "rate" | "delete";
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const desktopNavItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/services", label: "Services" },
    { path: "/help", label: "Help & Support" },
    { path: "/contact", label: "Contact Us" },
  ];

  const userNavItems: NavItem[] = [
    { label: "My Profile", icon: <User size={18} />, route: "/profile" },
    { label: "My Orders", icon: <Package size={18} />, route: "/orders" },
    { label: "Vehicles", icon: <Car size={18} />, route: "/vehicles" },
    { label: "Addresses", icon: <MapPin size={18} />, route: "/addresses" },
    { label: "Transaction History", icon: <Wallet size={18} />, route: "/wallet" },
    {
      label: "T & C",
      icon: <FileText size={18} />,
      url: "https://washmonkey.in/terms-and-conditions.html",
    },
    { label: "Share App", icon: <Share2 size={18} />, action: "share" },
    { label: "Rate Our App", icon: <Star size={18} />, action: "rate" },
    { label: "Help & Support", icon: <HelpCircle size={18} />, route: "/help" },
    { label: "Logout", icon: <LogOut size={18} />, action: "logout" },
  ];

  const userNavItemsLog: NavItem[] = [
    {
      label: "T & C",
      icon: <FileText size={18} />,
      url: "https://washmonkey.in/terms-and-conditions.html",
    },
    { label: "Share App", icon: <Share2 size={18} />, action: "share" },
    { label: "Rate Our App", icon: <Star size={18} />, action: "rate" },
    { label: "Help & Support", icon: <HelpCircle size={18} />, route: "/help" },
    { label: "Login", icon: <User size={18} />, route: "/login" },
  ];

  /* ---------------- CLIENT STORAGE ---------------- */
  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    setToken(localStorage.getItem("token"));
  }, []);

  /* ---------------- FETCH USER ---------------- */
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}api/user/userGetById/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data?.User || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, token]);

  /* ---------------- ACTION HANDLER ---------------- */
  const handleAction = (action?: string) => {
    if (action === "logout") {
      localStorage.clear();
      router.push("/login"); // ✅ removed reload
    }

    if (action === "share") {
      navigator.share?.({
        title: "WashMonkey",
        text: "Check out this app!",
        url: window.location.href,
      });
    }

    if (action === "rate") {
      window.open("https://play.google.com/store/apps/details?id=com.washmonkey.app", "_blank");
    }
  };

  return (
    <>
      {/* 🔴 TOP BAR */}
      <div className="bg-red-500 text-white text-xs overflow-hidden">
        <div className="whitespace-nowrap animate-marquee px-4 py-1">
          ⏰ Wed - Mon | 9:00 AM - 6:00 PM (Tuesday Holiday)
        </div>
      </div>

      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <Image src={Logo} alt="Logo" width={110} height={50} />
          </Link>

          {/* NAV */}
          <nav className="hidden md:flex items-center gap-6">
            {desktopNavItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium ${
                  pathname === item.path
                    ? "text-red-600"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-4">

            {/* WALLET */}
            {!loading && user && (
              <Link href="/wallet" className="flex items-center gap-1 text-xs text-gray-700">
                ₹{user.loyalty_point ?? 0}
                <Wallet size={14} />
              </Link>
            )}

            {/* PHONE */}
            <a href="tel:+918148274827" className="flex items-center gap-1 text-xs text-gray-700">
              <Phone size={14} />
              +91 81482 74827
            </a>

            {/* PROFILE */}
            {!loading && user && (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2">
                    <Image
                      src={
                        user?.profile_img?.trim()
                          ? user.profile_img
                          : "https://ui-avatars.com/api/?name=User"
                      }
                      alt="Profile"
                      width={28}
                      height={28}
                      className="rounded-full border"
                    />
                    <span className="text-xs">{user.firstname}</span>
                  </button>
                </PopoverTrigger>

                <PopoverContent align="end" className="w-56 p-2 text-sm">
                  {userNavItems.map((item) =>
                    item.route ? (
                      <Link key={item.label} href={item.route} className="flex gap-2 px-2 py-1 hover:bg-gray-100 rounded">
                        {item.icon} {item.label}
                      </Link>
                    ) : item.url ? (
                      <a key={item.label} href={item.url} target="_blank" className="flex gap-2 px-2 py-1 hover:bg-gray-100 rounded">
                        {item.icon} {item.label}
                      </a>
                    ) : (
                      <button key={item.label} onClick={() => handleAction(item.action)} className="flex gap-2 px-2 py-1 w-full hover:bg-gray-100 rounded">
                        {item.icon} {item.label}
                      </button>
                    )
                  )}
                </PopoverContent>
              </Popover>
            )}

            {/* LOGIN / LOGOUT */}
            <Button
              className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={() =>
                !user ? router.push("/login") : handleAction("logout")
              }
            >
              {!user ? "Login" : "Logout"}
            </Button>
          </div>

          {/* MOBILE */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost">
                <Menu />
              </Button>
            </SheetTrigger>

            <SheetContent>
              <div className="flex flex-col gap-4 mt-6 text-sm">

                {(user ? userNavItems : userNavItemsLog).map((item) =>
                  item.route ? (
                    <SheetClose asChild key={item.label}>
                      <Link href={item.route} className="flex gap-2 items-center">
                        {item.icon} {item.label}
                      </Link>
                    </SheetClose>
                  ) : item.url ? (
                    <SheetClose asChild key={item.label}>
                      <a href={item.url} target="_blank" className="flex gap-2 items-center">
                        {item.icon} {item.label}
                      </a>
                    </SheetClose>
                  ) : (
                    <SheetClose asChild key={item.label}>
                      <button onClick={() => handleAction(item.action)} className="flex gap-2 items-center w-full">
                        {item.icon} {item.label}
                      </button>
                    </SheetClose>
                  )
                )}

              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}