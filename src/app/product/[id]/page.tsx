"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { BASE_URL } from "@/app/utils/config";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  offeramount: number;
  image: string;
  weight: string;
  category: string[];
  exterior: number;
  interior: number;
  is_new: boolean;
  is_hot: boolean;
  is_recommended: boolean;
  days: number;
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<"exterior" | "interior" | "free">("exterior");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BASE_URL}api/product/Product/${id}`);
        setProduct(res.data.Products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  if (!product) {
    return <div className="h-screen flex items-center justify-center text-gray-500">Product not found</div>;
  }

  const finalPrice = product.price * quantity;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* IMAGE */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-2xl object-cover shadow-lg"
          />

          {/* BADGES */}
          <div className="absolute top-4 left-4 flex gap-2">
            {product.is_new && badge("New", "green")}
            {product.is_hot && badge("Hot", "red")}
            {product.is_recommended && badge("Recommended", "yellow")}
          </div>
        </div>

        {/* DETAILS */}
        <div className="flex flex-col gap-5">

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {product.name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {product.category.join(" • ")}
            </p>
          </div>

          {/* PRICE */}
          <div className="flex items-end gap-4">
            <p className="text-gray-400 line-through text-lg">
              ₹{product.offeramount * quantity}
            </p>
            <p className="text-3xl font-bold text-red-600">
              ₹{finalPrice}
            </p>
          </div>

          {/* META INFO */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {info("Duration", product.weight)}
            {info("Exterior Wash", `${product.exterior} times`)}
            {info("Interior Wash", `${product.interior} times`)}
            {info("Validity", `${product.days} days`)}
          </div>

          {/* TABS */}
          <div>
            <div className="flex gap-2 mb-3">
              {tabButton("exterior", "Exterior")}
              {tabButton("interior", "Interior")}
              {tabButton("free", "Free Wash")}
            </div>

            <Card className="p-4 md:p-5 text-sm leading-relaxed text-gray-700">
              {tab === "exterior" && (
                <div
                  className="space-y-2"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}

              {tab === "interior" && (
                <ul className="list-disc pl-5 space-y-1">
                  <li>Vacuum cleaning</li>
                  <li>Dashboard polish</li>
                  <li>AC vents cleaning</li>
                  <li>Floor mat wash</li>
                </ul>
              )}

              {tab === "free" && (
                <ul className="list-disc pl-5 space-y-1">
                  <li>High-pressure foam wash</li>
                  <li>Complimentary air freshener</li>
                </ul>
              )}
            </Card>
          </div>

          {/* ACTION */}
          <Button className="mt-4 bg-red-600 hover:bg-red-700 text-white text-lg py-6 rounded-xl mb-30">
            Book Now
          </Button>

        </div>
      </div>
    </div>
  );

  function tabButton(value: typeof tab, label: string) {
    return (
      <button
        onClick={() => setTab(value)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition
          ${tab === value ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
      >
        {label}
      </button>
    );
  }
}

/* helpers */
const badge = (text: string, color: "red" | "green" | "yellow") => (
  <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-${color}-100 text-${color}-800`}>
    {text}
  </span>
);

const info = (label: string, value: string) => (
  <div className="bg-gray-50 rounded-lg p-3">
    <p className="text-gray-500 text-xs">{label}</p>
    <p className="font-semibold text-gray-800">{value}</p>
  </div>
);
