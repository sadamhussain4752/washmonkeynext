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
  items: [],
  subtotal: 0,
  discount: 0,
  walletUsed: 0,
  promocode: "",
  total: 0,
  netTotal: 0,
  gst: 0,
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

const {
  cart = [],
  items = [],
  subtotal = 0,
  discount = 0,
  walletUsed = 0,
  promocode = "",
  total = 0,
  netTotal = 0,
  gst = 0,
} = checkoutData;
  /* ---------------- STATE ---------------- */
  const [addresses, setAddresses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
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

  const generateOrderId = () => {
    const timestamp = Date.now(); // milliseconds since 1970
    const randomNum = Math.floor(Math.random() * 100000);
    return `ORDER-${timestamp}-${randomNum}`;
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

    /* ---------------- TASK CREATION ---------------- */
    const tasks = cart.flatMap((item: any) => {
      const taskDays =
        Number(item.item.days || 0) +
        Number(item.item.exterior || 0) +
        Number(item.item.interior || 0);

      const tasksForItem = [];
      let currentDate = moment(selectedStartDateISO);
      let createdDays = 0;

      while (createdDays < taskDays) {
        // ❌ Skip Tuesday
        if (currentDate.day() !== 2) {
          tasksForItem.push({
            task_id: `${Date.now()}-${Math.random()}`,
            productId: item._id,
            assign_date: currentDate.startOf("day").toISOString(),
            is_done: false,
          });
          createdDays++;
        }
        currentDate = currentDate.clone().add(1, "day");
      }

      return tasksForItem;
    });
const productIds = cart.map((item: any) => item.item._id);

    /* ---------------- QUANTITIES ---------------- */
    const quantities = cart.map((item: any) => ({
      productId: item.item._id,
      quantity: 1,
    }));

    /* ---------------- WASH COUNTS ---------------- */
    const washCounts = cart.reduce(
      (acc, item: any) => {
        acc.interior += Number(item.item.interior || 0);
        acc.exterior += Number(item.item.exterior || 0);
        return acc;
      },
      { interior: 0, exterior: 0 }
    );
const customOrderId = generateOrderId();

    /* ---------------- CREATE ORDER ---------------- */
   const orderRes = await axios.post(`${BASE_URL}api/order/createOrderweb`, {
  userId,
  addressId: selectedAddress._id,
  vehicleId: selectedVehicle._id,

  productIds,
  quantity: quantities,
  orderDisplayId: customOrderId, // ✅ SAVE THIS

  totalAmount: total,
  bookingTime: selectedSlot,
  walletamount: walletUsed,
  applycoupon: promocode,

  delivery: Number(total) === 0 ? "Wallet" : "Online",
  paymentStatus: Number(total) === 0 ? "Confirmed" : "Pending",

  tasks,

  interior: washCounts.interior,
  exterior: washCounts.exterior,

  formwashcount: cart.reduce(
    (sum, item: any) => sum + Number(item.item.formwash || 0),
    0
  ),
});

    const orderId = orderRes.data?.order?._id;

    if (!orderId) {
      alert("Order creation failed");
      return;
    }

    localStorage.setItem("currentOrderId", orderId);

    /* ---------------- ZERO PAYMENT ---------------- */
    if (Number(total) === 0) {
      router.push(`/payment-success?orderId=${orderId}`);
      return;
    }

    /* ---------------- PAYMENT ---------------- */
   const res = await axios.post(`${BASE_URL}api/order/hdfc/create-order-web`, {
  order_id: customOrderId, // ✅ SAME ID
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
  <h6 className="font-semibold mb-3">My Order</h6>

  {/* ITEMS */}
  {(items.length ? items : cart).map((item: any, i: number) => {
    const price = Number(item.price || 0);

    return (
      <div key={i} className="flex justify-between text-sm mb-2">
        <span>
          {item?.category || item?.item?.category?.[0]} ({item.name})
        </span>
        <span>₹{price.toFixed(2)}</span>
      </div>
    );
  })}

  

  {/* DISCOUNT */}
  {discount > 0 && (
    <div className="flex justify-between text-green-600 text-sm">
      <span>Discount ({promocode})</span>
      <span>-₹{discount.toFixed(2)}</span>
    </div>
  )}

  {/* WALLET */}
  {walletUsed > 0 && (
    <div className="flex justify-between text-green-600 text-sm">
      <span>Wallet Used</span>
      <span>-₹{walletUsed.toFixed(2)}</span>
    </div>
  )}

  {/* NET TOTAL */}
  <div className="flex justify-between text-sm">
    <span>Net Total</span>
    <span>
      ₹{(netTotal || subtotal - discount - walletUsed).toFixed(2)}
    </span>
  </div>

  {/* GST */}
  <div className="flex justify-between text-sm">
    <span>GST (18%)</span>
    <span>
      ₹{(gst || (total * 0.18)).toFixed(2)}
    </span>
  </div>

  {/* FINAL */}
  <div className="flex justify-between font-semibold text-base pt-1">
    <span>Total Payable</span>
    <span>₹{total.toFixed(2)}</span>
  </div>
</div>

          {/* SLOT */}
          <div className="border rounded-xl p-4">
            <h6 className="flex items-center gap-2 font-semibold mb-3">
               Booking Slot
            </h6>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot: any) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`border rounded-lg py-2 text-xs ${selectedSlot === slot ? "bg-primary text-white" : ""
                    }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* DATE */}
          <div className="border rounded-xl p-4">
            <h6 className="flex items-center gap-2 font-semibold mb-3">
               Start Date
            </h6>
            <div className="grid grid-cols-3 gap-2">
              {startDates.map((d) => (
                <button
                  key={d.value}
                  onClick={() => {
                    setSelectedStartDate(d.label);
                    setSelectedStartDateISO(d.value);
                  }}
                  className={`border rounded-lg py-1 text-xs ${selectedStartDate === d.label ? "bg-blue-100 border-blue-500" : ""
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
    <button className="w-full border rounded-xl p-4 flex gap-3 text-left shadow-sm hover:shadow-md transition">
      <MapPin className="text-primary mt-1" />
      <div className="flex-1">
        <p className="text-xs text-gray-500">Address</p>

        {selectedAddress ? (
          <div className="mt-1 space-y-1">
            <p className="font-semibold text-sm">
              {selectedAddress.fullName}, {selectedAddress.city}
            </p>
            <p className="text-xs text-gray-500">
              {selectedAddress.phone}
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              {selectedAddress.street}, {selectedAddress.city},{" "}
              {selectedAddress.state} - {selectedAddress.pinCode}
            </p>
          </div>
        ) : (
          <p className="font-medium text-sm mt-1 text-gray-700">
            Select Address
          </p>
        )}
      </div>
    </button>
  </SheetTrigger>

  <SheetContent
    side="bottom"
    className="h-[65vh] md:h-full md:w-[420px] flex flex-col p-0"
  >
    {/* Header */}
    <div className="p-4 border-b font-semibold text-lg">
      Select Address
    </div>

    {/* Address List */}
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
      {addresses.map((a: any) => (
        <SheetClose asChild key={a._id}>
          <div
            onClick={() => setSelectedAddress(a)}
            className={`border rounded-xl p-3 cursor-pointer transition ${
              selectedAddress?._id === a._id
                ? "border-primary bg-primary/10 shadow-sm"
                : "hover:border-gray-400"
            }`}
          >
            <p className="font-medium text-sm">{a.fullName}</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {a.phone} <br />
              {a.street}, {a.city}, {a.state}, {a.pinCode}
            </p>
          </div>
        </SheetClose>
      ))}
    </div>

    {/* Sticky Bottom Button */}
    <div className="p-3 border-t bg-white sticky bottom-0">
      <button
        onClick={() => {
           router.push("/addresses?from=checkout");
        }}
        className="w-full bg-primary text-white py-3 rounded-xl font-medium shadow-md hover:bg-primary/90 transition"
      >
        + Add New Address
      </button>
    </div>
  </SheetContent>
</Sheet>

{/* VEHICLE SHEET */}
<Sheet>
  <SheetTrigger asChild>
    <button className="w-full border rounded-xl p-4 flex gap-3 text-left shadow-sm hover:shadow-md transition">
      <Car className="text-primary mt-1" />

      <div className="flex-1">
        <p className="text-xs text-gray-500">Vehicle</p>

        {selectedVehicle ? (
          <div className="mt-1">
            <p className="font-semibold text-sm">
              {selectedVehicle.brand} {selectedVehicle.model}
            </p>
            <p className="text-xs text-gray-500">
              {selectedVehicle.vehicleNumber}
            </p>
          </div>
        ) : (
          <p className="font-medium text-sm mt-1 text-gray-700">
            Select Vehicle
          </p>
        )}
      </div>
    </button>
  </SheetTrigger>

  <SheetContent
    side="bottom"
    className="h-[65vh] md:h-full md:w-[420px] flex flex-col p-0"
  >
    {/* Header */}
    <div className="p-4 border-b font-semibold text-lg">
      Select Vehicle
    </div>

    {/* Vehicle List */}
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
      {vehicles.map((v: any) => (
        <SheetClose asChild key={v._id}>
          <div
            onClick={() => setSelectedVehicle(v)}
            className={`border rounded-xl p-3 cursor-pointer transition ${
              selectedVehicle?._id === v._id
                ? "border-primary bg-primary/10 shadow-sm"
                : "hover:border-gray-400"
            }`}
          >
            <p className="font-medium text-sm">
              {v.brand} {v.model}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {v.fuelType}
            </p>
             <p className="text-xs text-gray-500 mt-1">
              {v.registrationNumber}
            </p>
          </div>
        </SheetClose>
      ))}
    </div>

    {/* Sticky Bottom Button */}
    <div className="p-3 border-t bg-white sticky bottom-0">
      <button
        onClick={() => {
          router.push("/vehicles?from=checkout");
        }}
        className="w-full bg-primary text-white py-3 rounded-xl font-medium shadow-md hover:bg-primary/90 transition"
      >
        + Add Vehicle
      </button>
    </div>
  </SheetContent>
</Sheet>

          {/* PRICE */}
          {/* <div className="border-t pt-3 text-sm space-y-1">
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
            {walletUsed > 0 && (
              <div className="flex justify-between">
                <span>Wallet</span>
                <span>-₹{walletUsed}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div> */}

          {/* TERMS */}
          <label className="flex items-start gap-2 text-xs mb-30">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
           <span>
    I Read and Agree to{" "}
    <a
      href="https://www.washmonkey.in/terms-and-conditions/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline hover:text-primary/80"
    >
      Terms & Conditions
    </a>
  </span>
          </label>

          {/* DESKTOP PAY */}
          <button
            onClick={startPayment}
            disabled={!isReady || loading}
            className="hidden lg:flex w-full bg-primary text-white py-3 rounded-xl items-center justify-center gap-2 disabled:opacity-50"
          >
            <CreditCard size={18} />
            {loading ? "Processing..." : `Pay ₹${total}`}
          </button>
        </div>
      </div>

      {/* MOBILE PAY */}
      <div className="fixed bottom-17 left-0 right-0 bg-white border-t p-3 lg:hidden">
        <button
          onClick={startPayment}
          disabled={!isReady || loading}
          className="w-full bg-primary text-white py-2 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <CreditCard size={18} />
          Pay ₹{total}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
