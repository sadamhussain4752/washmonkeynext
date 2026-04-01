"use client"; // only if using state/hooks


import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import Logo from "@/image/logo.png";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 hidden lg:block">
      <div className="container mx-auto px-4 py-16">

        {/* Top Section */}
        <div className="grid gap-10 md:grid-cols-4">

          {/* Brand */}
          <div>
             <Link href="/" className="flex items-center gap-2">
                        <Image
  src={Logo}
  width={200}
  height={100}
  alt="Wash Monkey Logo"
  className="object-contain"
/>
                      
                     </Link>
            <p className="text-sm text-gray-400">
              Professional car cleaning at your doorstep.  
              Premium care, eco-friendly products, and trusted professionals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/services" className="hover:text-white">Services</Link></li>
              <li><Link href="/wallet" className="hover:text-white">Wallet</Link></li>
              <li><Link href="/help" className="hover:text-white">Help & Support</Link></li>
              <li><Link href="/profile" className="hover:text-white">Profile</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm">
              <li>Exterior Wash</li>
              <li>Interior Cleaning</li>
              <li>Car Detailing</li>
              <li>Wax & Polish</li>
              <li>Eco-Friendly Wash</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500" />
                +91 81482 74827
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500" />
                support@washmonkey.in
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                Chennai, India
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Copyright */}
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Wash Monkey. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white">
              <Twitter className="w-5 h-5" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}
