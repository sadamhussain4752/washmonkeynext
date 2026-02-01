'use client'

import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle, Home, Package } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-red-600" />
          </motion.div>

          <h1 className="mb-4 text-red-600">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Your car cleaning service has been successfully booked. We'll send you a confirmation shortly.
          </p>

          <div className="space-y-3">
            <Link href="/" className="block">
              <Button className="w-full" size="lg">
                <Home className="w-5 h-5 mr-2" />
                Go to Home
              </Button>
            </Link>
            <Link href="/orders" className="block">
              <Button variant="outline" className="w-full" size="lg">
                <Package className="w-5 h-5 mr-2" />
                View My Orders
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
