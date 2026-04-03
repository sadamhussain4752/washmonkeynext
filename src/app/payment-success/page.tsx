'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/app/utils/config";

const PaymentSuccess = () => {
  const router = useRouter();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const orderId = localStorage.getItem("currentOrderId");

    if (orderId) {
      verifyPayment(orderId);
    } else {
      setStatus("failed");
    }
  }, []);

  const verifyPayment = async (orderId: any) => {
    try {
      const res = await axios.post(
        `${BASE_URL}api/order/verify-payment-web`,
        { orderId }
      );

      if (res.data.success) {
        setStatus("success");

        localStorage.setItem("paymentStatus", "success");
        localStorage.removeItem("checkoutData");

        setTimeout(() => {
          router.push(`/order-details/${orderId}`);
        }, 3000);
      } else {
        setStatus("failed");
      }

    } catch (err) {
      console.error(err);
      setStatus("failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      {status === "loading" && <h2>⏳ Verifying Payment...</h2>}
      {status === "success" && <h2>✅ Payment Successful</h2>}
      {status === "failed" && <h2>❌ Payment Failed</h2>}
    </div>
  );
};

export default PaymentSuccess;