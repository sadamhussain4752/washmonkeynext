"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import moment from "moment";
import { BASE_URL } from "@/app/utils/config";

const COLORS = {
  primary: "#E53935",
  success: "#16A34A",
  danger: "#DC2626",
};

export default function WalletPage() {
  const [walletAmount, setWalletAmount] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */

  const fetchWalletHistory = async (userId: string) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}api/wallet/history/${userId}`
      );

      if (res.data.success) {
        setTransactions(res.data.transactions || []);
        setOrders(res.data.orders || []);
        setWalletAmount(res.data.currentbalance || 0);
      }
    } catch (err) {
      console.log("Wallet API error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserId = () => {
    const userId = localStorage.getItem("userId");
    if (userId) fetchWalletHistory(userId);
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  /* ================= MERGE ================= */

  const mergedData = useMemo(() => {
    const tx = transactions.map((t) => ({
      ...t,
      source: "transaction",
    }));

    const ord = orders.map((o) => ({
      ...o,
      source: "order",
    }));

    return [...tx, ...ord].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
  }, [transactions, orders]);

  const hasWalletDebit = useMemo(() => {
    return transactions.some((t) => t.type === "DEBIT");
  }, [transactions]);

  /* ================= UI ================= */

  return (
    <div className="max-w-2xl mx-auto p-4">

      {/* HEADER */}
      <h1 className="text-xl font-bold mb-4">
        Wallet & Transactions
      </h1>

      {/* BALANCE */}
      <div className="mb-4 text-lg font-semibold">
        Wallet Balance: ₹{walletAmount}
      </div>

      {/* ALERT */}
      {!hasWalletDebit && (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 rounded mb-4 text-center font-medium">
          Wallet debit transactions are not available yet.
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="text-center mt-10">
          <p>Loading...</p>
        </div>
      )}

      {/* EMPTY */}
      {!loading && mergedData.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No wallet activity found.
        </p>
      )}

      {/* LIST */}
      <div className="space-y-4 mb-20">
        {mergedData.map((item, index) => {
          const isTransaction = item.source === "transaction";
          const isCredit = item.type === "CREDIT";

          const amount = isTransaction
            ? item.amount
            : item.totalAmount;

          return (
            <div
              key={index}
              className="bg-white border rounded-xl p-4 shadow-sm"
            >
              {/* TOP */}
              <div className="flex justify-between">
                <p className="text-sm font-semibold">
                  {isTransaction
                    ? `Transaction ID: #${item._id?.slice(-6)}`
                    : `Order ID: #${item._id?.slice(-6)}`}
                </p>

                <p className="font-bold text-sm">
                  ₹{amount || 0}
                </p>
              </div>

              {/* STATUS */}
              <p
                className={`text-xs font-semibold mt-1 ${
                  isTransaction
                    ? isCredit
                      ? "text-green-600"
                      : "text-red-600"
                    : item.paymentStatus === "Confirmed"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {isTransaction
                  ? `${isCredit ? "Credited" : "Debited"} - ${
                      item.reason || ""
                    }`
                  : item.paymentStatus}
              </p>

              <hr className="my-2" />

              {/* BOTTOM */}
              <div className="flex justify-between items-center text-xs text-gray-500">

                <div>
                  {moment(item.createdAt).format("DD MMM YYYY")} |{" "}
                  {moment(item.createdAt).format("hh:mm A")}
                </div>

                <div className="flex items-center gap-1">
                  <span
                    className={
                      isTransaction
                        ? isCredit
                          ? "text-green-600"
                          : "text-red-600"
                        : "text-red-500"
                    }
                  >
                    {isTransaction
                      ? isCredit
                        ? "Wallet Added"
                        : "Wallet Deducted"
                      : `- ₹${item.walletamount || 0}`}
                  </span>
                  💰
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}