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
  Trash2,
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
    { path: "/", label: "Home", icon: <House size={20} /> },
    { path: "/services", label: "Services", icon: <ShoppingBag size={20} /> },
    { path: "/help", label: "Help", icon: <HelpCircle size={20} /> },
  ];

  const userNavItems: NavItem[] = [
    //  { route: "/", label: "Home", icon: <House size={20} /> },
    // { route: "/services", label: "Services", icon: <ShoppingBag size={20} /> },
    // { route: "/help", label: "Help", icon: <HelpCircle size={20} /> },
    { label: "My Profile", icon: <User size={20} color="red"/>, route: "/profile" },
    { label: "My Orders", icon: <Package size={20} color="red"/>, route: "/orders" },

    { label: "Vehicles", icon: <Car size={20} color="red"/>, route: "/vehicles" },
    { label: "Addresses", icon: <MapPin size={20} color="red"/>, route: "/addresses" },
    { label: "Transaction History", icon: <Wallet size={20} color="red"/>, route: "/wallet" },
    {
      label: "T & C",
      icon: <FileText size={20} color="red"/>,
      url: "https://washmonkey.in/terms-and-conditions.html",
    },
    { label: "Share App", icon: <Share2 size={20} color="red"/>, action: "share" },
    { label: "Rate Our App", icon: <Star size={20} color="red"/>, action: "rate" },
    { label: "Help & Support", icon: <HelpCircle size={20} color="red"/>, route: "/help" },
    { label: "Logout", icon: <LogOut size={20} color="red"/>, action: "logout" },
    // {
    //   label: "Delete Account",
    //   icon: <Trash2 size={20} className="text-red-600" />,
    //   action: "delete",
    // },
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
        console.error("Failed to load user", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, token]);

  /* ---------------- ACTION HANDLER ---------------- */
  const handleAction = (action?: string) => {
    switch (action) {
      case "logout":
        localStorage.clear();
        router.push("/login");
        break;
      case "share":
        if (navigator.share) {
          navigator.share({
            title: "WashMonkey",
            text: "Check out this app!",
            url: window.location.href,
          });
        } else {
          alert("Share is not supported on this device");
        }
        break;
      case "rate":
        window.open("https://play.google.com/store/apps/details?id=com.washmonkey.app", "_blank");
        break;
      case "delete":
        if (confirm("Are you sure you want to delete your account?")) {
          // Add delete API call here
          alert("Account deleted!");
        }
        break;
    }
  };

  return (
    <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image src={Logo} alt="Logo" width={120} height={60} priority />
        </Link>


        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8">
          {desktopNavItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`font-medium transition ${pathname === item.path
                  ? "text-red-600"
                  : "text-gray-600 hover:text-red-600"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-6">

          {/* WALLET */}
          {!loading && user && (
            <Link
              href="/wallet"
              className="flex items-center gap-1 font-medium text-gray-600 hover:text-red-600"
            >
              ₹{user.loyalty_point ?? 0} <Wallet className="w-4 h-4" />
             
            </Link>
          )}

          {/* PHONE */}
          <a
            href="tel:+919876543210"
            className="flex items-center gap-2 text-gray-600 hover:text-red-600"
          >
            <Phone className="w-4 h-4" />
            +91 98765 43210
          </a>

          {/* PROFILE MENU */}
          {!loading && user && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2">
                  <Image
                    src={
                      user?.profile_img?.trim()
                        ? user.profile_img
                        : "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
                    }
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full border object-cover"
                  />
                  <span className="text-sm font-medium text-gray-700">{user.firstname}</span>
                </button>
              </PopoverTrigger>

              <PopoverContent align="end" className="w-60 p-3">

                {/* USER INFO */}
                <div className="mb-3">
                  <p className="font-semibold">{user.firstname} {user.lastname}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>

                {user.mainAddress && (
                  <div className="flex items-start gap-2 text-xs text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mt-0.5" color="red"/>
                    <span>{user.mainAddress.city}, {user.mainAddress.state}</span>
                  </div>
                )}

                {/* DYNAMIC USER NAV ITEMS */}
                {userNavItems.map((item) =>
                  item.route ? (
                    <Link
                      key={item.label}
                      href={item.route}
                      className="flex gap-2 px-3 py-2 hover:bg-gray-100 rounded"
                    >
                      {item.icon} {item.label}
                    </Link>
                  ) : item.url ? (
                    <a
                      key={item.label}
                      href={item.url}
                      target="_blank"
                      className="flex gap-2 px-3 py-2 hover:bg-gray-100 rounded"
                    >
                      {item.icon} {item.label}
                    </a>
                  ) : (
                    <button
                      key={item.label}
                      onClick={() => handleAction(item.action)}
                      className={`flex gap-2 px-3 py-2 rounded w-full ${item.action === "delete" ? "text-red-600 hover:bg-red-50" : "hover:bg-gray-100"
                        }`}
                    >
                      {item.icon} {item.label}
                    </button>
                  )
                )}

              </PopoverContent>
            </Popover>
          )}

          <Link href="/services">
            <Button>Book Now</Button>
          </Link>
        </div>

        {/* MOBILE MENU */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>

          </SheetTrigger>

          <SheetContent>
            <div className="flex flex-col gap-6 mt-8 p-10">
           {!loading && user && (
                <div className="mb-4">
                  <p className="font-semibold">{user.firstname} {user.lastname}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  {user.mainAddress && (
                    <div className="flex items-start gap-2 text-xs text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mt-0.5" color="red"/>
                      <span>{user.mainAddress.city}, {user.mainAddress.state}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2 font-medium">
                    <Wallet className="w-5 h-5" color="red"/>
                    <span>₹{user.loyalty_point ?? 0}</span>
                  </div>
                </div>
              )}


             


              {/* WALLET & PHONE */}

              {/* USER NAV ITEMS */}
              {user && userNavItems.map((item) =>
                item.route ? (
                  <SheetClose asChild key={item.label}>
                    <Link href={item.route} className="flex gap-2 items-center text-black-600 font-medium">
                      {item.icon} {item.label}
                    </Link>
                  </SheetClose>
                ) : item.url ? (
                  <SheetClose asChild key={item.label}>
                    <a href={item.url} target="_blank" className="flex gap-2 items-center text-black-600 font-medium">
                      {item.icon} {item.label}
                    </a>
                  </SheetClose>
                ) : (
                  <SheetClose asChild key={item.label}>
                    <button
                      onClick={() => handleAction(item.action)}
                      className={`flex gap-2 items-center w-full ${item.action === "delete" ? "text-red-600" : ""
                        }`}
                    >
                      {item.icon} {item.label}
                    </button>
                  </SheetClose>
                )
              )}
              {!loading && user && (
                <>
                  
                  <a href="tel:+919876543210" className="flex items-center gap-2  text-black-600 font-medium mt-5">
                    <Phone className="w-5 h-5" color="red"/> +91 98765 43210
                  </a>
                </>
              )}

            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
