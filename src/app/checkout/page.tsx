'use client';

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation"; // ✅ Next.js router
import { BASE_URL } from "@/app/utils/config";

import {
  MapPin,
  Car,
  Calendar,
  Clock,
  CreditCard,
  PackageCheck,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/app/components/ui/sheet";

const Checkout = () => {
  const router = useRouter();
  const hasCalledRef = useRef(false);

  /* ---------------- CHECKOUT DATA ---------------- */
  const [checkoutData, setCheckoutData] = useState({
    cart: [],
    subtotal: 0,
    discount: 0,
    delivery: 0,
    walletDiscount: 0,
    promocode: "",
    total: 0,
  });

  // Load checkout data from localStorage
  useEffect(() => {
     const userId = localStorage.getItem("userId");

  // If user is not logged in, redirect to login page
  if (!userId) {
    router.push("/login");
    return;
  }
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("checkoutData");
      if (data) setCheckoutData(JSON.parse(data));
    }
  }, []);

  const { cart, subtotal, discount, delivery, walletDiscount, promocode, total } =
    checkoutData;

  /* ---------------- STATE ---------------- */
  const [addresses, setAddresses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState <any>(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedStartDateISO, setSelectedStartDateISO] = useState("");
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const orderId = `ORDER-${Date.now()}`;

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    fetchAddresses();
    fetchVehicles();
  }, []);

  const fetchAddresses = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      const res = await axios.get(`${BASE_URL}api/address/getByIdAddress/${userId}`);
      setAddresses(res.data?.Addresslist || []);
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    }
  };

  const fetchVehicles = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      const res = await axios.get(`${BASE_URL}api/vehicles/getvehicle/${userId}`);
      setVehicles(res.data?.vehicles || []);
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
    }
  };

  /* ---------------- PAYMENT ---------------- */
  const startPayment = async () => {
    if (!selectedSlot) return alert("Select booking slot");
    if (!selectedStartDateISO) return alert("Select start date");
    if (!selectedAddress) return alert("Select address");
    if (!selectedVehicle) return alert("Select vehicle");
    if (!acceptedTerms) return alert("Accept terms");

    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");

      const res = await axios.post(`${BASE_URL}api/order/hdfc/create-order`, {
        order_id: orderId,
        amount: total,
        userId,
      });

      const paymentLink = res.data?.paymentUrl?.payment_links?.web;
      if (paymentLink) {
        window.location.href = paymentLink;
      } else {
        alert("Payment link not found");
      }
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- HELPERS ---------------- */
  const timeSlots = ["6:00 AM – 9:00 AM", "9:00 AM – 12:00 PM", "12:00 PM – 3:00 PM", "3:00 PM – 6:00 PM"];
  const startDates = Array.from({ length: 15 }, (_, i) => {
    const date = moment().add(i + 1, "days");
    return { label: date.format("ddd, MMM D"), value: date.toISOString() };
  }).filter((d) => moment(d.value).day() !== 2);

  const isReady =
    selectedSlot && selectedAddress && selectedVehicle && selectedStartDateISO && acceptedTerms;

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4">
          {/* SUMMARY */}
          <div className="border rounded-xl p-4">
            <h3 className="flex items-center gap-2 font-semibold mb-3">
              <PackageCheck size={18} /> Order Summary
            </h3>
            {cart.map((item: any, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.name}</span>
                <span>₹{item.price}</span>
              </div>
            ))}
          </div>

          {/* SLOT */}
          <div className="border rounded-xl p-4">
            <h3 className="flex items-center gap-2 font-semibold mb-3">
              <Clock size={18} /> Booking Slot
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot: any) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`border rounded-lg py-2 text-sm ${
                    selectedSlot === slot ? "bg-red-600 text-white" : ""
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* DATE */}
          <div className="border rounded-xl p-4">
            <h3 className="flex items-center gap-2 font-semibold mb-3">
              <Calendar size={18} /> Start Date
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {startDates.map((d) => (
                <button
                  key={d.value}
                  onClick={() => {
                    setSelectedStartDate(d.label);
                    setSelectedStartDateISO(d.value);
                  }}
                  className={`border rounded-lg py-1 text-xs ${
                    selectedStartDate === d.label ? "bg-blue-100 border-blue-500" : ""
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="border rounded-xl p-5 space-y-4 h-fit sticky top-6">
          {/* ADDRESS SHEET */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="w-full border rounded-lg p-3 flex gap-3 text-left">
                <MapPin className="text-red-600" />
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="font-medium text-sm">
                    {selectedAddress ? (
                      <>
                        <span className="block">
                          {selectedAddress.fullName}, {selectedAddress.city}
                        </span>
                        <span className="block">{selectedAddress.phone}</span>
                        <span className="block text-gray-600">
                          {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pinCode}
                        </span>
                      </>
                    ) : (
                      "Select Address"
                    )}
                  </p>
                </div>
              </button>
            </SheetTrigger>

            <SheetContent side="bottom" className="h-[60vh] max-h-[60vh] overflow-hidden md:h-full md:w-[420px]">
              <div className="pb-3 border-b font-semibold">Select Address</div>
              <div className="mt-3 h-[calc(60vh-70px)] overflow-y-auto space-y-3 pr-1">
                {addresses.map((a: any) => (
                  <SheetClose asChild key={a._id}>
                    <div
                      onClick={() => setSelectedAddress(a)}
                      className={`border rounded-xl p-3 cursor-pointer ${
                        selectedAddress?._id === a._id ? "border-red-600 bg-red-50" : ""
                      }`}
                    >
                      <p className="font-medium">{a.fullName}</p>
                      <p className="text-sm text-gray-500">
                        {a.phone} <br />
                        {a.street} {a.city}, {a.state}, {a.pinCode}
                      </p>
                    </div>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* VEHICLE SHEET */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="w-full border rounded-lg p-3 flex gap-3 text-left">
                <Car className="text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Vehicle</p>
                  <p className="font-medium">
                    {selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : "Select Vehicle"}
                  </p>
                </div>
              </button>
            </SheetTrigger>

            <SheetContent side="bottom" className="h-[60vh] max-h-[60vh] overflow-hidden md:h-full md:w-[420px]">
              <div className="pb-3 border-b font-semibold">Select Vehicle</div>
              <div className="mt-3 h-[calc(60vh-70px)] overflow-y-auto space-y-3 pr-1">
                {vehicles.map((v: any) => (
                  <SheetClose asChild key={v._id}>
                    <div
                      onClick={() => setSelectedVehicle(v)}
                      className={`border rounded-xl p-3 cursor-pointer ${
                        selectedVehicle?._id === v._id ? "border-blue-600 bg-blue-50" : ""
                      }`}
                    >
                      <p className="font-medium">
                        {v.brand} {v.model}
                      </p>
                      <p className="text-sm text-gray-500">{v.vehicleNumber}</p>
                    </div>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* PRICE */}
          <div className="border-t pt-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            {walletDiscount > 0 && (
              <div className="flex justify-between">
                <span>Wallet</span>
                <span>-₹{walletDiscount}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          {/* TERMS */}
          <label className="flex items-start gap-2 text-xs mb-30">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            I agree to the terms & conditions
          </label>

          {/* DESKTOP PAY */}
          <button
            onClick={startPayment}
            disabled={!isReady || loading}
            className="hidden lg:flex w-full bg-red-600 text-white py-3 rounded-xl items-center justify-center gap-2 disabled:opacity-50"
          >
            <CreditCard size={18} />
            {loading ? "Processing..." : `Pay ₹${total}`}
          </button>
        </div>
      </div>

      {/* MOBILE PAY */}
      <div className="fixed bottom-15 left-0 right-0 bg-white border-t p-3 lg:hidden">
        <button
          onClick={startPayment}
          disabled={!isReady || loading}
          className="w-full bg-red-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <CreditCard size={18} />
          Pay ₹{total}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
