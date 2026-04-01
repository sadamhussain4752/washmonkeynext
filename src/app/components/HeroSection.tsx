"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Leaf, Calendar,User } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.pexels.com/photos/3752194/pexels-photo-3752194.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Car Wash Service"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          {/* Heading */}
          <h1 className="mb-6 text-4xl md:text-6xl font-bold leading-tight">
            Professional Car Cleaning at{" "}
            <span className="text-primary">Your Doorstep</span>
          </h1>

          {/* Description */}
          <p className="mb-8 text-lg md:text-2xl text-gray-200">
            Enjoy premium shine, spotless glass, and eco-friendly service — all
            from the comfort of your home.
          </p>

          {/* Features */}
          <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-primary" />
              <span>100% Satisfaction Guarantee</span>
            </div>
            <div className="flex items-center gap-3">
              <Leaf className="text-primary" />
              <span>Eco-Friendly Products</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/services">
              <Button
                size="lg"
                className="bg-primary hover:bg-primaryDark w-full sm:w-auto"
              >
                Explore Services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-black hover:bg-white hover:text-primary"
              >
                <User className="mr-2 w-5 h-5" />
               Contact 
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
