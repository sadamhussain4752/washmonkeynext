"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BASE_URL, ENDPOINTS } from "@/app/utils/config";
import { toast } from "sonner";
export default function OrderPage() {
  const router = useRouter();

  const [cart, setCart] = useState<any[]>([]);
  const [promocode, setPromocode] = useState("");
  const [discount, setDiscount] = useState(0);

  const [wallet, setWallet] = useState(0);
  const [walletInput, setWalletInput] = useState("");
  const [walletUsed, setWalletUsed] = useState(0);

  const [loading, setLoading] = useState(false);

  /* ================= LOAD CART ================= */
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  /* ================= FETCH WALLET ================= */
  useEffect(() => {
    const fetchWallet = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await axios.get(
          `${BASE_URL}${ENDPOINTS.get.usersgetid}/${userId}`
        );
        setWallet(res.data?.User?.loyalty_point || 0);
      } catch (err) {
        console.log(err);
      }
    };

    fetchWallet();
  }, []);

  /* ================= CALCULATIONS ================= */
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );

  const netTotal = subtotal - discount - walletUsed;
  const gst = netTotal > 0 ? netTotal * 0.18 : 0;
  const total = netTotal > 0 ? netTotal + gst : 0;

  /* ================= APPLY COUPON ================= */
  const applyCoupon = async () => {
    if (!promocode) return;

    setLoading(true);

    try {
      const userId = localStorage.getItem("userId");

      const res = await axios.post(BASE_URL + ENDPOINTS.get.discount, {
        couponCode: promocode,
        userId,
      });

      if (res.data?.success) {
        const type = res.data.bodysend?.coupon_type;
        let value = 0;

        if (type === "PERCENTAGE") {
          value = (subtotal * Number(res.data.bodysend.discount)) / 100;
        } else {
          value = Number(res.data.bodysend.discount);
        }

        setDiscount(value);
        alert("Coupon Applied 🎉");
      } else {
        alert("Invalid coupon");
      }
    } catch {
      alert("Error applying coupon");
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setPromocode("");
  };

  /* ================= WALLET ================= */
  const applyWallet = () => {
    const amount = Number(walletInput);

    if (!amount || amount <= 0) return alert("Enter valid amount");
    if (amount > wallet) return alert("Exceeds wallet balance");
    if (amount > subtotal - discount)
      return alert("Wallet exceeds payable");

    setWalletUsed(amount);
  };

  const removeWallet = () => {
    setWalletUsed(0);
    setWalletInput("");
  };

  /* ================= CHECKOUT ================= */


const checkout = () => {
  if (!cart.length) return;

  const userId = localStorage.getItem("userId");

  // ❌ Not logged in
  if (!userId) {
    toast.error("Please login to continue");

    setTimeout(() => {
      router.push("/login");
    }, 2000);

    return;
  }

  // ✅ Keep old + add new fields
  localStorage.setItem(
    "checkoutData",
    JSON.stringify({
      // 🔹 OLD DATA (unchanged)
      cart,
      subtotal,
      discount,
      walletUsed,
      gst,
      total: Number(total.toFixed(2)),

      // 🔥 NEW DATA ADDED
      userId,
      promocode,
      netTotal: Number((subtotal - discount - walletUsed).toFixed(2)),

     
      createdAt: new Date().toISOString(),
    })
  );

  router.push("/checkout");
};

  const item = cart[0];

  return (
    <div className="min-h-screen bg-[#F6F7F9] pb-28">

      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white shadow-sm md:px-10">
        <button onClick={() => router.back()} className="text-lg">←</button>
        <h2 className="text-base font-semibold text-gray-800">Summary</h2>
      </div>

      {/* ================= MAIN ================= */}
      <div className="md:max-w-6xl md:mx-auto md:grid md:grid-cols-2 md:gap-8 md:mt-8">

        {/* ================= LEFT ================= */}
        <div>

          {/* PRODUCT */}
          {item && (
            <div className="flex flex-col items-center px-4 py-5 bg-white md:rounded-xl md:shadow-sm">
              <img
                src={item?.item?.image}
                className="h-36 object-contain"
              />

              <h3 className="mt-3 text-sm font-semibold text-primary">
                {item?.name}
              </h3>

              <p className="text-xs text-gray-500">
                {item?.item?.category?.[0]}
              </p>

              <div className="mt-2 border border-red-500 px-4 py-1 rounded-full text-primary font-semibold text-sm">
                ₹{item?.price} / Month
              </div>
            </div>
          )}

          {/* INPUTS */}
          <div className="px-4 mt-4 space-y-4 md:px-0">

            {/* COUPON */}
            <div className="bg-white md:rounded-xl md:shadow-sm p-4">
              <p className="text-sm font-medium mb-2 text-gray-700">
                Coupon / Promocode
              </p>

              <div className="flex border rounded-xl overflow-hidden">
                <input
                  value={promocode}
                 onChange={(e) =>
  setPromocode(e.target.value.toUpperCase().replace(/\s/g, ""))
}
                  disabled={discount > 0}
                  placeholder="Enter your promocode"
                  className="flex-1 px-3 py-2 text-sm outline-none"
                />

                <button
                  onClick={discount ? removeCoupon : applyCoupon}
                  className={`px-4 text-sm font-medium ${
                    discount
                      ? "text-primary"
                      : "bg-primary text-white"
                  }`}
                >
                  {loading ? "..." : discount ? "Remove" : "Apply"}
                </button>
              </div>
            </div>

            {/* WALLET */}
            <div className="bg-white md:rounded-xl md:shadow-sm p-4">
              <div className="flex justify-between text-sm mb-2">
                <p className="text-gray-700">Wallet Amount</p>
                <p className="text-gray-400 text-xs">
                  Available: ₹{wallet.toFixed(2)}
                </p>
              </div>

              <div className="flex border rounded-xl overflow-hidden">
                <input
                  type="number"
                  value={walletUsed ? walletUsed : walletInput}
                  onChange={(e) => setWalletInput(e.target.value)}
                  disabled={walletUsed > 0}
                  placeholder="Enter wallet amount"
                  className="flex-1 px-3 py-2 text-sm outline-none"
                />

                <button
                  onClick={walletUsed ? removeWallet : applyWallet}
                  className={`px-4 text-sm font-medium ${
                    walletUsed
                      ? "text-primary"
                      : "bg-primary text-white"
                  }`}
                >
                  {walletUsed ? "Remove" : "Use"}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ================= RIGHT (DESKTOP) ================= */}
        <div className="px-4 mt-5 md:mt-0 md:px-0 mb-20">

          <div className="bg-white rounded-xl p-5 shadow-sm md:sticky md:top-24">

            <p className="text-sm font-semibold text-gray-700 mb-1">
              Bill Summary
            </p>

            <div className="space-y-1 text-sm ">

              <div className="flex justify-between">
                <span> {item?.item?.category?.[0]} ({item?.name})</span>
                <span>₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}

              {walletUsed > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Wallet</span>
                  <span>-₹{walletUsed.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between border-t pt-2">
                <span>Net Total</span>
                <span>₹{netTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-semibold text-base pt-1">
                <span>Total Payable</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

            </div>

            {/* DESKTOP BUTTON */}
            <button
              onClick={checkout}
              className="hidden md:block w-full mt-5 bg-primary hover:bg-primary text-white py-3 rounded-xl text-sm font-semibold"
            >
              Checkout
            </button>
          </div>
        </div>

      </div>

      {/* MOBILE BUTTON */}
      <div className="fixed bottom-17 left-0 right-0 bg-white border-t p-4 md:hidden">
        <button
          onClick={checkout}
          className="w-full bg-primary text-white py-3 rounded-xl text-sm font-semibold"
        >
          Checkout
        </button>
      </div>

    </div>
  );
}