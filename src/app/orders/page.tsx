'use client'

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // ✅ Next.js router

import { BASE_URL } from "@/app/utils/config";

const TABS = ["Subscription", "On-Demand"];

const OrdersPage = () => {
  const router = useRouter()

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("Subscription");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  /* ---------------- FETCH USER ID ---------------- */
  useEffect(() => {
    const id : any = localStorage.getItem("userId");
    console.log(id);
    
    if (id) setUserId(id);
  }, []);

  /* ---------------- FETCH ORDERS ---------------- */
  const fetchOrders = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}api/order/OrderlistById/${userId}`);
      setOrders(res.data?.orders || []);
    } catch (err) {
      console.error("Order fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders().finally(() => setRefreshing(false));
  }, [userId]);

  /* ---------------- FILTER ORDERS ---------------- */
  const filteredOrders = orders.filter((order: any) =>
    activeTab === "Subscription"
      ? order.tasks?.length > 1
      : order.tasks?.length === 1
  );

  /* ---------------- DATE HELPERS ---------------- */
  const formatDate = (date: any) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (date: any) =>
    new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="pb-10 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="px-6 py-4 border-b bg-white">
        <h2 className="text-lg font-semibold">Order History</h2>
      </div>

      {/* TABS */}
      <div className="flex justify-center gap-8 mt-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm transition-all ${
              activeTab === tab
                ? "border-b-2 border-cyan-500 font-semibold text-cyan-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* REFRESH */}
      {/* <div className="text-center mt-4">
        <button
          onClick={onRefresh}
          className="px-4 py-2 text-sm rounded-md border bg-white hover:bg-gray-100"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div> */}

      {/* CONTENT */}
      <div className="mt-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : !filteredOrders.length ? (
          <div className="text-center mt-16">
            <h3 className="text-lg font-semibold">No Order History</h3>
            <p className="text-gray-500 mt-2">
              Place an order to see history
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order: any) => (
              <div
                key={order._id}
                onClick={() =>
                   router.push(`/order-details/${order._id}`)
                }
                className="bg-white mx-4 p-5 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
              >
                {/* TOP */}
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <p>
                    {formatDate(order.createdAt)} •{" "}
                    {formatTime(order.createdAt)}
                  </p>
                  <p className="font-semibold text-gray-800">
                    ₹{order.totalAmount}
                  </p>
                </div>

                {/* SERVICE */}
                <p className="text-sm text-cyan-600">
                  {order.products?.[0]?.category?.[0]} –{" "}
                  {order.products?.[0]?.name}
                </p>

                {/* BOTTOM */}
                <div className="flex justify-between items-center mt-3 text-xs">
                  <span className="text-gray-500">
                    Order ID: #{order._id.slice(-6)}
                  </span>

                  <span
                    className={`px-2 py-1 rounded-md text-white text-[11px] ${
                      order.paymentStatus === "Confirmed"
                        ? "bg-orange-400"
                        : order.paymentStatus === "Cancelled"
                        ? "bg-red-500"
                        : "bg-cyan-500"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
