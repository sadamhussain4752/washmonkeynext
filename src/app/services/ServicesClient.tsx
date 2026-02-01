"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Filter, Search } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

import { BASE_URL } from "../utils/config";

export default function ServicesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryFromURL = searchParams.get("category");

  const [products, setProducts] = useState<any[]>([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    fetch(`${BASE_URL}api/product/allProduct?lang=1`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          setProducts(data.products || []);
        }
      })
      .catch((err) => console.error("API Error:", err));
  }, []);

  /* ================= APPLY CATEGORY FROM URL ================= */
  useEffect(() => {
    if (categoryFromURL) {
      setSelectedCategory(decodeURIComponent(categoryFromURL));
    }
  }, [categoryFromURL]);

  /* ================= UPDATE URL ================= */
  useEffect(() => {
    if (selectedCategory !== "All") {
      router.push(
        `/services?category=${encodeURIComponent(selectedCategory)}`,
        { scroll: false }
      );
    }
  }, [selectedCategory, router]);

  /* ================= ADD TO CART ================= */
  const addToCart = (product: any) => {
    const newCart = [
      {
        _id: product._id,
        name: product.name,
        price: product.offerPrice || product.price,
        days: product.days || 1,
        quantity: 1,
        item: product,
      },
    ];

    localStorage.setItem("cart", JSON.stringify(newCart));
    router.push("/mycard");
  };

  /* ================= FILTER OPTIONS ================= */
  const vehicleTypes = [
    "All",
    ...new Set(products.map((p) => p.name).filter(Boolean)),
  ];

  const categories = [
    "All",
    ...new Set(products.flatMap((p) => p.category || [])),
  ];

  /* ================= FILTER LOGIC ================= */
  const filteredProducts = products.filter((product) => {
    const matchesVehicle =
      selectedVehicleType === "All" ||
      product.name === selectedVehicleType;

    const matchesCategory =
      selectedCategory === "All" ||
      product.category?.some(
        (cat: string) =>
          cat.toLowerCase() === selectedCategory.toLowerCase()
      );

    const matchesSearch =
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesVehicle && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-10 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-bold">Our Services</h1>
          <p className="text-sm md:text-lg opacity-90">
            Choose the perfect service for your vehicle
          </p>
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            {/* Search */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 gap-3 md:flex md:gap-4">
              <Select
                value={selectedVehicleType}
                onValueChange={setSelectedVehicleType}
              >
                <SelectTrigger className="w-full md:w-48 text-sm">
                  <SelectValue placeholder="Vehicle Type" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full md:w-48 text-sm">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="w-full md:w-auto text-sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-xl transition">
                <Link href={`/product/${product._id}`}>
                  <div className="relative cursor-pointer">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 md:h-48 object-cover"
                    />
                    {product.is_hot && (
                      <Badge className="absolute top-2 left-2 bg-red-600 text-xs">
                        Hot
                      </Badge>
                    )}
                  </div>
                </Link>

                <div className="p-3 md:p-4">
                  <h3 className="font-semibold text-sm md:text-lg">
                    {product.name}
                  </h3>

                  <div className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: product.description,
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-red-600 font-bold">
                        ₹{product.offerPrice || product.price}
                      </span>
                      {product.offeramount && (
                        <span className="text-xs line-through ml-2 text-gray-400">
                          ₹{product.offeramount}
                        </span>
                      )}
                    </div>

                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                      }}
                    >
                      Book
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No services found</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSelectedVehicleType("All");
                setSelectedCategory("All");
                setSearchQuery("");
                router.push("/services");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
