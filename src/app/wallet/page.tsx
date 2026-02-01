'use client'


import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

import { BASE_URL, ENDPOINTS } from "@/app/utils/config";

const Wallet = () => {
  const [userId, setUserId] = useState(null);
  const [walletAmount, setWalletAmount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [walletHistory, setWalletHistory] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [activeTab, setActiveTab] = useState("wallet");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /* ---------------- FETCH USER & WALLET ---------------- */
  useEffect(() => {
    const id :any = localStorage.getItem("userId");
    if (!id) return;

    setUserId(id);

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}${ENDPOINTS.get.usersgetid}/${id}`
        );
        setWalletAmount(res?.data?.User?.loyalty_point || 0);
      } catch (err) {
        setError(true);
      }
    };

    fetchUser();
  }, []);

  /* ---------------- FETCH ORDERS ---------------- */
  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}api/order/OrderlistById/${userId}`
        );

        const orderList = res?.data?.orders || [];

        let total = 0;
        const normalOrders: any = [];
        const walletOrders: any = [];

        orderList.forEach((order: any) => {
          const orderTotal = Number(order.totalAmount || 0);
          const walletUsed = Number(order.walletamount || 0);

          total += orderTotal;

          walletUsed > 0 ? walletOrders.push(order) : normalOrders.push(order);
        });

        setOrders(normalOrders);
        setWalletHistory(walletOrders);
        setTotalAmount(total);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const formatAmount = (amt: any) => Number(amt || 0).toFixed(0);

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b p-4">
        <h1 className="text-lg font-semibold">Transaction History</h1>
      </div>

      {/* WALLET SUMMARY */}
      <div className="px-4 py-4 flex justify-between items-center">
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-600">Failed to load wallet</p>
        ) : (
          <p className="text-xl font-bold text-gray-800">
            ₹
            {activeTab === "wallet"
              ? formatAmount(walletAmount)
              : formatAmount(totalAmount)}
          </p>
        )}
      </div>

      {/* TABS */}
      <div className="flex gap-2 px-4">
        {["wallet", "transaction"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition ${
              activeTab === tab
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab === "wallet" ? "Wallet History" : "Transaction History"}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-4">
        {activeTab === "transaction" &&
          (orders.length === 0 ? (
            <p className="text-gray-500 text-sm">No transaction history</p>
          ) : (
            orders.map((item, idx) => (
              <Card key={idx} item={item} />
            ))
          ))}

        {activeTab === "wallet" &&
          (walletHistory.length === 0 ? (
            <p className="text-gray-500 text-sm">No wallet history</p>
          ) : (
            walletHistory.map((item, idx) => (
              <Card key={idx} item={item} wallet />
            ))
          ))}
      </div>
    </div>
  );
};

export default Wallet;
type CardProps = {
  item: any;
  wallet?: any;
};

/* ---------------- CARD COMPONENT ---------------- */
const Card: React.FC<CardProps> = ({ item, wallet }) => {
  return (
    <div className="bg-white rounded-xl p-4 border shadow-sm">
      <p className="text-sm font-semibold text-gray-800">
        Order ID: ORD-
        {item?._id?.slice(0, 3).toUpperCase()}-
        {item?._id?.slice(-3).toUpperCase()}
      </p>

      <div className="mt-2 space-y-1 text-sm text-gray-600">
        <p>Amount: ₹{item?.totalAmount || 0}</p>
        {wallet && <p>Wallet Used: ₹{item?.walletamount || 0}</p>}
        <p>Status: {item?.paymentStatus || "N/A"}</p>
        <p className="text-xs text-gray-400">
          {moment(item?.createdAt).format("DD MMM YYYY, hh:mm A")}
        </p>
      </div>
    </div>
  );
};
