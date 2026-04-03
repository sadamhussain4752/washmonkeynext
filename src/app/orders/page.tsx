"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/app/utils/config";

/* ---------------- CONSTANTS ---------------- */
const TABS = ["Subscription", "On-Demand"];
const FILTERS = ["Interior", "Exterior", "Form Wash"];

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("Subscription");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- USER ---------------- */
  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) setUserId(id);
  }, []);

  /* ---------------- FETCH ---------------- */
  const fetchOrders = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}api/order/OrderlistById/${userId}`
      );
      setOrders(res.data?.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* ---------------- HELPERS ---------------- */
  const getCategoryType = (task: any) => {
    if (task.interior) return "Interior";
    if (task.exterior) return "Exterior";
    if (task.formwash) return "Form Wash";
    return null;
  };

  /* ---------------- FILTERED ORDERS ---------------- */
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const tasks = order.tasks || [];

      const tabMatch =
        activeTab === "Subscription"
          ? tasks.length > 1
          : tasks.length === 1;

      let filterMatch = true;
      if (activeFilter) {
        filterMatch = tasks.some(
          (t: any) => getCategoryType(t) === activeFilter
        );
      }

      return tabMatch && filterMatch;
    });
  }, [orders, activeTab, activeFilter]);

  /* ---------------- STATS ---------------- */
  const total = orders.length;

  const completed = orders.filter(
    (o) => o.paymentStatus?.toLowerCase() === "Completed"
  ).length;

  const inProgress = total - completed;

  /* ---------------- SERVICE DAYS ---------------- */
  const serviceDays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return orders.reduce((sum, order) => {
      const futureTasks =
        order.tasks?.filter((t: any) => {
          const d = new Date(t.assign_date);
          d.setHours(0, 0, 0, 0);
          return d >= today;
        }) || [];

      return sum + futureTasks.length;
    }, 0);
  }, [orders]);

  /* ---------------- CATEGORY COUNT ---------------- */
  const getCategoryCount = (category: string) => {
    let count = 0;

    filteredOrders.forEach((order) => {
      order.tasks?.forEach((task: any) => {
        if (getCategoryType(task) === category) count++;
      });
    });

    return count;
  };

  /* ---------------- FORMAT ---------------- */
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  /* ---------------- RENDER ---------------- */
  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* HEADER */}
      <div className="bg-white p-4 rounded-b-2xl shadow">
        <h2 className="font-semibold text-lg">Order History</h2>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <Stat title="Total" value={total} />
          <Stat title="Completed" value={completed} color="text-green-600" />
          <Stat title="In Progress" value={inProgress} color="text-orange-500" />
        </div>

        {/* CATEGORY FILTER */}
        <div className="flex justify-around mt-3 text-sm">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() =>
                setActiveFilter(activeFilter === f ? null : f)
              }
              className={`px-2 py-1 rounded text-sm ${
                activeFilter === f ? "bg-red-500 text-white" : ""
              }`}
            >
              {f} ({getCategoryCount(f)})
            </button>
          ))}
        </div>

        {/* SERVICE DAYS */}
        <div className="mt-3 bg-gray-50 px-4 py-2 rounded-xl flex justify-between text-sm">
          <span>{serviceDays} Service days available</span>
        </div>

        {/* TABS */}
        <div className="mt-4 flex bg-gray-100 p-1 rounded-full">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-full ${
                activeTab === tab
                  ? "bg-primary text-white text-sm"
                  : "text-gray-600 text-sm"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* LIST */}
      <div className="p-4 space-y-4">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : !filteredOrders.length ? (
          <p className="text-center text-gray-500">
            No orders found
          </p>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              onClick={() =>
                router.push(`/order-details/${order._id}`)
              }
              className="bg-white p-4 rounded-xl shadow cursor-pointer"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">
                    {order.products?.[0]?.name || "Service"}
                  </p>
                  <p className="text-xs text-gray-500">
                    #{order._id.slice(-6)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">₹{order.totalAmount}</p>
                  <p
                    className={`text-xs ${
                      order.paymentStatus === "Confirmed"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {order.paymentStatus}
                  </p>
                </div>
              </div>

              <div className="text-xs text-gray-500 mt-2">
                {formatDate(order.createdAt)} •{" "}
                {formatTime(order.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENT ---------------- */
const Stat = ({ title, value, color = "" }: any) => (
  <div className="bg-gray-50 p-3 rounded-xl text-center">
    <p className={`font-semibold ${color}`}>{value}</p>
    <p className="text-xs text-gray-500">{title}</p>
  </div>
);