"use client";

import OrderDetailsClient from "./OrderDetailsClient";
import { useParams } from "next/navigation";

export default function OrderDetailsPage() {
  const params = useParams<{ orderId: string }>();

  const orderId = params.orderId; // ✅ string

  console.log(params, "params");

  return <OrderDetailsClient orderId={orderId} />;
}
