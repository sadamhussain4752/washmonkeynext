'use client'


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BASE_URL, ENDPOINTS } from "../utils/config";
import {
  Delete,
  Tag,
  Wallet,
  ShoppingCart,
  CreditCard,
} from "lucide-react";

const Order = () => {
  const router = useRouter();

  /* ---------------- CART STATE ---------------- */
  const [cartItems, setCartItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const delivery = 0;

  /* ---------------- DISCOUNT & WALLET ---------------- */
  const [promocode, setPromocode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [walletAmount, setWalletAmount] = useState("");
  const [walletDiscount, setWalletDiscount] = useState(0);
const [total, setTotal] = useState<any>(0);

  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);

  /* ---------------- LOAD CART ---------------- */
useEffect(() => {
  localStorage.removeItem("checkoutData");

  const storedCart: any = JSON.parse(localStorage.getItem("cart") || "[]");
  setCartItems(storedCart);

  const sum = storedCart.reduce(
    (total: number, item: any) => total + Number(item.price || 0),
    0
  );
  setSubTotal(sum);
}, []);

/* ---------------- TOTAL ---------------- */
useEffect(() => {
  // Ensure all values are numeric and default to 0 if invalid
  const safeSubTotal = Number(subTotal) || 0;
  const safeDelivery = Number(delivery) || 0;
  const safeDiscount = Number(discount) || 0;
  const safeWalletDiscount = Number(walletDiscount) || 0;

  const calculated = safeSubTotal + safeDelivery - safeDiscount - safeWalletDiscount;

  // Prevent negative total
  setTotal(Math.max(calculated, 0).toFixed(2));
}, [subTotal, delivery, discount, walletDiscount]);


  /* ---------------- FETCH WALLET ---------------- */
  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await axios.get(
          `${BASE_URL}${ENDPOINTS.get.usersgetid}/${userId}`
        );
        setWallet(res.data?.User?.loyalty_point || 0);
      } catch {
          router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  /* ---------------- REMOVE ITEM ---------------- */
  const handleRemoveItem = (id: any) => {
    const updatedCart = cartItems.filter(
      (item: any) => item.id !== id && item._id !== id
    );

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    const newSubtotal = updatedCart.reduce(
      (sum: any, item: any) => sum + Number(item.price || 0),
      0
    );

    setSubTotal(newSubtotal);
    setDiscount(0);
    setWalletDiscount(0);
    setPromocode("");
    setWalletAmount("");
  };

  /* ---------------- PROMO ---------------- */
  const applyPromoCode = async () => {
    if (!promocode) return;
    setLoading(true);

    try {
      const userId = localStorage.getItem("userId");
      const res = await axios.post(
        BASE_URL + ENDPOINTS.get.discount,
        { couponCode: promocode, userId }
      );

      if (res.data?.success) {
        const promoValue =
          (subTotal * Number(res.data.bodysend?.discount || 0)) / 100;
        setDiscount(promoValue);
        alert("Coupon applied");
      } else {
        alert("Invalid coupon");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- WALLET ---------------- */
  const applyWalletDiscount = () => {
    setWalletLoading(true);
    const amount = Number(walletAmount);

    if (!amount || amount <= 0 || amount > wallet) {
      alert("Invalid wallet amount");
      setWalletLoading(false);
      return;
    }

    if (amount > subTotal - discount) {
      alert("Wallet exceeds payable");
      setWalletLoading(false);
      return;
    }

    setWalletDiscount(amount);
    setWalletLoading(false);
  };

  /* ---------------- CHECKOUT ---------------- */
const handleCheckout = () => {
  const userId = localStorage.getItem("userId");

  // If user is not logged in, redirect to login page
  if (!userId) {
    router.push("/login");
    return;
  }

  // If cart is empty, do nothing
  if (!cartItems.length) return;

  // Save checkout data to localStorage
  localStorage.setItem(
    "checkoutData",
    JSON.stringify({
      cart: cartItems,
      subtotal: subTotal,
      discount,
      delivery,
      walletDiscount,
      promocode,
      total,
    })
  );

  // Navigate to checkout page
  router.push("/checkout");
};

  /* ---------------- EMPTY CART ---------------- */
  if (!cartItems.length) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <ShoppingCart size={52} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <p className="text-gray-500">Add services to continue</p>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 min-h-screen">

      {/* HEADER */}
      <h2 className="flex items-center gap-2 text-xl font-semibold mb-6">
        <ShoppingCart size={22} />
        Your Cart
      </h2>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT – CART ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item: any) => (
            <div
              key={item.id || item._id}
              className="border rounded-xl p-4 flex items-center gap-4"
            >
              <img
                src={item.item.image}
                alt={item.name}
                className="h-20 w-20 rounded-lg object-cover"
              />

              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">{item.item.weight}</p>
                <p className="font-semibold mt-1">₹{item.price}</p>
              </div>

              <button
                onClick={() => handleRemoveItem(item.id || item._id)}
                className="p-2 rounded-full hover:bg-red-50 text-red-600"
              >
                <Delete size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* RIGHT – SUMMARY */}
        <div className="border rounded-xl p-5 space-y-4 h-fit sticky top-6">

          {/* PROMO */}
          {!discount && (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={promocode}
                  onChange={(e) => setPromocode(e.target.value)}
                  placeholder="Promo code"
                  className="w-full border rounded-lg pl-9 py-2 text-sm"
                />
              </div>
              <button
                onClick={applyPromoCode}
                className="bg-red-600 text-white px-4 rounded-lg text-sm"
              >
                {loading ? "..." : "Apply"}
              </button>
            </div>
          )}

          {/* WALLET */}
          {wallet > 0 && !walletDiscount && (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Wallet size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(e.target.value)}
                  placeholder={`Wallet ₹${wallet}`}
                  className="w-full border rounded-lg pl-9 py-2 text-sm"
                />
              </div>
              <button
                onClick={applyWalletDiscount}
                className="border px-4 rounded-lg text-sm"
              >
                {walletLoading ? "..." : "Use"}
              </button>
            </div>
          )}

          {/* PRICE */}
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subTotal}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}

            {walletDiscount > 0 && (
              <div className="flex justify-between">
                <span>Wallet</span>
                <span>-₹{walletDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          {/* DESKTOP CHECKOUT */}
          <button
            onClick={handleCheckout}
            className="hidden lg:flex w-full bg-red-600 text-white py-3 rounded-xl items-center justify-center gap-2"
          >
            <CreditCard size={18} />
            Proceed to Pay
          </button>
        </div>
      </div>

      {/* MOBILE STICKY CHECKOUT */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t p-3 lg:hidden">
        <button
          onClick={handleCheckout}
          className="w-full bg-red-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <CreditCard size={18} />
          Pay ₹{total}
        </button>
      </div>
    </div>
  );
};

export default Order;
