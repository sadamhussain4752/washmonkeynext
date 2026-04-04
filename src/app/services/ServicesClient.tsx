"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Filter, Search, Clock, Car, Gift } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

import { BASE_URL } from "@/app/utils/config";

export default function ServicesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryFromURL = searchParams.get("category");

  const [products, setProducts] = useState<any[]>([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

   const [plans, setPlans] = useState<any[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [open, setOpen] = useState(false);

  /* ================= FETCH ================= */
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

  /* ================= CATEGORY FROM URL ================= */
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

  /* ================= FILTER ================= */
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
      product.name?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesVehicle && matchesCategory && matchesSearch;
  });

 const parseDescription = (html: string) => {
  if (!html) return [];

  // ✅ CLEAN HTML
  html = html
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .trim();

  // ✅ SAFE split (NO "s" flag)
  const blocks = html
    .split(/(<p>[\s\S]*?<\/p>|<ul>[\s\S]*?<\/ul>|<ol>[\s\S]*?<\/ol>)/gi)
    .filter(Boolean);

  const sections: any[] = [];
  let currentSection: any = null;

  // ✅ COMMON CLEAN FUNCTION (🔥 reuse everywhere)
  const cleanText = (text: string) => {
    return text
      .replace(/<\/?[^>]+(>|$)/g, "")       // remove HTML tags
      .replace(/^[a-zA-Z][\.\)\-]\s*/, "") // remove a. b) c-
      .trim();
  };

  blocks.forEach((block) => {
    block = block.trim();

    // -------- PARAGRAPH --------
    const pMatch = block.match(/<p>([\s\S]*?)<\/p>/i);
    if (pMatch) {
      const content = pMatch[1];

      const strongMatch = content.match(/<strong>(.*?)<\/strong>/i);

      // ✅ Section Title
      if (strongMatch) {
        currentSection = {
          title: strongMatch[1].trim(),
          items: [],
        };
        sections.push(currentSection);
      } 
      // ✅ Normal paragraph
      else if (currentSection) {
        const clean = cleanText(content);
        if (clean) currentSection.items.push(clean);
      }
    }

    // -------- UNORDERED LIST --------
    const ulMatch = block.match(/<ul>([\s\S]*?)<\/ul>/i);
    if (ulMatch && currentSection) {
      const items = ulMatch[1].match(/<li>([\s\S]*?)<\/li>/gi);
      if (items) {
        items.forEach((li) => {
          const clean = cleanText(li);
          if (clean) currentSection.items.push(clean);
        });
      }
    }

    // -------- ORDERED LIST --------
    const olMatch = block.match(/<ol>([\s\S]*?)<\/ol>/i);
    if (olMatch && currentSection) {
      const items = olMatch[1].match(/<li>([\s\S]*?)<\/li>/gi);
      if (items) {
        items.forEach((li) => {
          const clean = cleanText(li);
          if (clean) currentSection.items.push(clean);
        });
      }
    }
  });

  return sections;
};

const getIcon = (title: string) => {
  if (!title) return Gift;

  const t = title.toLowerCase();

  if (t.includes("interior")) return Car;
  if (t.includes("exterior")) return Car;
  if (t.includes("wash")) return Gift;

  return Clock;
};

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-8 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-xl md:text-4xl font-bold">
            Our Services
          </h1>
          <p className="text-xs md:text-lg opacity-90 mt-1">
            Choose the perfect service for your vehicle
          </p>
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">

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
            <div className="grid grid-cols-2 gap-2 md:flex md:gap-3">
              <Select
                value={selectedVehicleType}
                onValueChange={setSelectedVehicleType}
              >
                <SelectTrigger className="w-full md:w-44 text-xs md:text-sm">
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
                <SelectTrigger className="w-full md:w-44 text-xs md:text-sm">
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

            <Button variant="outline" className="w-full md:w-auto text-xs md:text-sm">
              <Filter className="w-4 h-4 mr-1" />
              Filters
            </Button>

          </div>
        </div>
      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-5 md:py-8">

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">

          {filteredProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >

              {/* ================= MOBILE CARD ================= */}
              <div className="block md:hidden bg-white rounded-xl shadow-sm overflow-hidden"
               onClick={() => {
      setSelectedPlan(product);
      setOpen(true);
    }}
              >

                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-24 object-contain bg-gray-50"
                  />
                  {product.is_hot && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded">
                      Hot
                    </span>
                  )}
                </div>

                <div className="p-2">
                  <div className="flex justify-between">

                    <div>
                      <p className="text-[10px] text-red-500 font-medium">
                        {product.tag || "Daily Shine"}
                      </p>

                      <h3 className="text-sm font-semibold">
                        {product.name}
                      </h3>

                      <p className="text-[10px] text-green-600">
                        {product.discount || "10% Off"}
                      </p>
                    </div>

                    <div className="text-right">
                      {product.offeramount && (
                        <p className="text-[11px] text-gray-400 line-through">
                          ₹{product.offeramount}
                        </p>
                      )}
                      <p className="text-red-600 font-semibold text-sm">
                        ₹{product.offerPrice || product.price}
                      </p>
                    </div>

                  </div>

                  <div className="flex justify-between text-[10px] text-gray-500 mt-2 border-t pt-2">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {product.days + product.interior } Days
                    </span>
                    <span className="flex items-center gap-1">
                      <Car size={12} /> {product.interior } {" "}Interior 
                    </span>
                    <span className="flex items-center gap-1">
                      <Gift size={12} /> Foam
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="mt-2 w-full bg-red-600 text-white text-xs py-1.5 rounded-md"
                  >
                    Book Now
                  </button>
                </div>
              </div>

              {/* ================= DESKTOP CARD ================= */}
              <div className="hidden md:flex flex-col bg-white rounded-xl shadow-sm hover:shadow-xl transition overflow-hidden h-full">

                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {product.is_hot && (
                    <Badge className="absolute top-3 left-3 bg-red-600">
                      Hot
                    </Badge>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">

                  <h3 className="text-lg font-semibold mb-1">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-500 mb-3">
                    {product.tag || "Premium Plan"}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock size={14} /> {product.days + product.interior} Days Service
                    </div>
                    <div className="flex items-center gap-2">
                      <Car size={14} /> {product.interior} Interior
                    </div>
                    <div className="flex items-center gap-2">
                      <Gift size={14} /> Foam Wash
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between">

                    <div>
                      {product.offeramount && (
                        <p className="text-sm text-gray-400 line-through">
                          ₹{product.offeramount}
                        </p>
                      )}
                      <p className="text-red-600 text-xl font-bold">
                        ₹{product.offerPrice || product.price}
                      </p>
                    </div>

                   <div className="flex gap-2">
  <button
    onClick={() => addToCart(product)}
    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
  >
    Book Now
  </button>

  <button
    onClick={() => {
      setSelectedPlan(product);
      setOpen(true);
    }}
    className="border border-red-600 text-red-600 px-4 py-2 rounded-md text-sm hover:bg-red-50"
  >
    View More
  </button>
</div>

                  </div>

                </div>
              </div>

            </motion.div>
          ))}

        </div>
      </div>
     {open && selectedPlan && (
  <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40">

    <div className="w-full md:max-w-md bg-white rounded-t-2xl md:rounded-2xl shadow-lg overflow-hidden animate-[slideUp_0.3s_ease]">

      {/* Close */}
      <div className="flex justify-end p-3">
        <button
          onClick={() => setOpen(false)}
          className="text-gray-500 text-lg"
        >
          ✕
        </button>
      </div>

      {/* Image */}
      <div className="flex justify-center px-4">
        <img
          src={selectedPlan.image}
          className="h-28 object-contain"
        />
      </div>

      {/* Title */}
      <div className="text-center px-4 mt-2">
        <h3 className="text-sm font-semibold text-red-600">
         {selectedPlan.category[0]}
        </h3>
        <p className="text-xs text-gray-600">
          {selectedPlan.name}
        </p>
      </div>

      {/* Content */}
      <div className="max-h-[55vh] overflow-y-auto px-3 py-3 space-y-3">

        {parseDescription(selectedPlan.description).map((section, index) => {
          const Icon = getIcon(section.title);

          return (
            <div key={index} className="border rounded-lg p-3 text-xs">

              <div className="flex items-center gap-2 font-semibold mb-2">
                <Icon size={14} />
                {section.title}
              </div>

              <ul className="space-y-1 text-gray-600">
                {section.items.map((item: string, i: number) => (
                  <li key={i}>
                    • {item}
                  </li>
                ))}
              </ul>

            </div>
          );
        })}

      </div>

      {/* Footer */}
      <div className="p-3 border-t mb-[80px]">
        <button
          onClick={() => {
            addToCart(selectedPlan);
            setOpen(false);
          }}
           className="w-full bg-primary text-white py-2 rounded-lg text-sm "
        >
          Book Now
        </button>
      </div>

    </div>
  </div>
)}

    </div>
  );
}