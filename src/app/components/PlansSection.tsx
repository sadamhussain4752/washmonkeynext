'use client'

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BASE_URL } from "@/app/utils/config";
import { useRouter } from "next/navigation";
import { CheckCircle, Heart, Clock, Car, Gift } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";

const PlansSection = () => {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}api/product/allProduct?lang=1`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          const sortedPlans = (data.products || []).sort(
            (a, b) => a.price - b.price
          );

          setPlans(sortedPlans);
        }
      })
      .catch((err) => console.error("API Error:", err));
  }, []);

  const addToCart = (product: any) => {
    const newCart = [
      {
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        item: product,
      },
    ];

    localStorage.setItem("cart", JSON.stringify(newCart));
    router.push("/mycard");
  };
  const parseDescription = (html: string) => {
    if (typeof window === "undefined") return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const sections: any[] = [];
    let currentSection: any = null;

    doc.body.childNodes.forEach((node: any) => {

      // Section Title
      if (node.tagName === "P") {
        const strong = node.querySelector("strong");
        if (strong) {
          currentSection = {
            title: strong.innerText,
            items: [],
          };
          sections.push(currentSection);
        }
      }

      // List Items
      if (node.tagName === "OL" && currentSection) {
        const items = Array.from(node.querySelectorAll("li")).map(
          (li: any) => li.innerText
        );
        currentSection.items = items;
      }

    });

    return sections;
  };

  const getIcon = (title: string) => {
    const t = title.toLowerCase();

    if (t.includes("exterior")) return Clock;
    if (t.includes("interior")) return Car;
    if (t.includes("wash")) return Gift;

    return Clock;
  };


  if (!plans.length) return null;

  return (
    <section className="py-6 md:py-16 bg-gray-50">
      <div className="container mx-auto px-3 md:px-4">

        {/* Heading */}
        <h2 className="text-center text-lg md:text-3xl font-semibold mb-1">
          Our Popular Plans
        </h2>
        <p className="text-center text-gray-600 text-xs md:text-base mb-4 md:mb-12">
          Choose the perfect plan for your car care needs
        </p>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">

          {plans.map((plan, index) => (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
            >

              {/* ================= MOBILE CARD ================= */}
              <div className="block md:hidden bg-white rounded-xl shadow-sm overflow-hidden"
                onClick={() => {
                  setSelectedPlan(plan);
                  setOpen(true);
                }}

              >

                {/* Image */}
                <div className="relative">
                  <img
                    src={plan.image}
                    alt={plan.name}
                    className="w-full h-24 object-contain bg-gray-50"
                  />
                  <div className="absolute top-2 right-2">
                    <Heart size={16} className="text-gray-400" />
                  </div>
                </div>

                <div className="p-2">
                  <div className="flex flex-col gap-1">

                    {/* Top Row */}
                    <div className="flex items-center justify-between">
                      <div>


                        <p className="text-[10px] text-red-500 font-medium">
                          {plan.category[0]}
                        </p>

                        <p className="text-[10px] text-green-600">
                          {plan.discount || "10% Off"}
                        </p>
                        {/* Name */}
                        <p className="text-[12px] font-semibold leading-tight">
                          {plan.name}
                        </p>

                      </div>



                      <div className="flex items-center gap-1">
                        {plan.offeramount && (
                          <span className="text-[11px] text-gray-400 line-through">
                            ₹{plan.offeramount}
                          </span>
                        )}
                        <span className="text-red-600 font-semibold text-sm">
                          ₹{plan.price}
                        </span>
                      </div>
                    </div>



                    {/* Price */}


                  </div>
                  {/* Bottom Info */}
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mt-2 border-t pt-2">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {plan.days + plan.interior} Days
                    </div>
                    <div className="flex items-center gap-1">
                      <Car size={12} /> {plan.interior} {" "}Interior

                    </div>
                    <div className="flex items-center gap-1">
                      <Gift size={12} />
                      Foam
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(plan)}
                    className="mt-2 w-full bg-red-600 text-white text-xs py-1.5 rounded-md"
                  >
                    Book Now
                  </button>
                </div>
              </div>

              {/* ================= DESKTOP CARD (OLD DESIGN) ================= */}
              <Card className="hidden md:block overflow-hidden h-full hover:shadow-xl transition-shadow">

                <img
                  src={plan.image}
                  alt={plan.name}
                  className="w-full h-58 object-cover"
                />

                <div className="p-6 flex flex-col h-full">
                  <h3 className="mb-1 text-xl font-semibold">
                    {plan.name}
                  </h3>

                  <div
                    className="text-gray-600 mb-4 text-sm"
                    dangerouslySetInnerHTML={{ __html: plan.description }}
                  />

                  <div className="mb-4">
                    <span className="text-3xl font-bold">
                      ₹{plan.price}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {" "} / service
                    </span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start text-sm">
                      <CheckCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                      {plan.days + plan.interior} Days Service
                    </li>
                    <li className="flex items-start text-sm">
                      <CheckCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                      Interior: {plan.interior} times
                    </li>
                  </ul>

                  <Button
                    onClick={() => addToCart(plan)}
                    className="w-full"
                  >
                    Book Now
                  </Button>
                </div>
              </Card>

            </motion.div>
          ))}
        </div>
      </div>
      {open && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40">

          {/* Container */}
          <div className="w-full md:max-w-md bg-white rounded-t-2xl md:rounded-2xl shadow-lg overflow-hidden animate-slideUp">

            {/* Close */}
            <div className="flex justify-end p-3">
              <button onClick={() => setOpen(false)} className="text-gray-500 text-lg">
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
                {selectedPlan.tag || "Daily Shine Plan"}
              </h3>
              <p className="text-xs text-gray-600">
                {selectedPlan.name}
              </p>
            </div>

            {/* Scroll Content */}
            <div className="max-h-[50vh] overflow-y-auto px-3 py-3 space-y-3">

              {parseDescription(selectedPlan.description)?.map((section: any, index: number) => {
                const Icon = getIcon(section.title);

                return (
                  <div key={index} className="border rounded-lg p-3 text-xs">

                    {/* Title */}
                    <div className="flex items-center gap-2 font-semibold mb-2">
                      <Icon size={14} />
                      {section.title}
                    </div>

                    {/* Items */}
                    <ul className="space-y-1 text-gray-600">
                      {section.items.map((item: string, i: number) => (
                        <li key={i}>
                          {i + 1}. {item}
                        </li>
                      ))}
                    </ul>

                  </div>
                );
              })}
            </div>

            {/* Button */}
            <div className="p-3 border-t mb-10">
              <button
                onClick={() => {
                  addToCart(selectedPlan);
                  setOpen(false);
                }}
                className="w-full bg-red-600 text-white py-2 rounded-lg text-sm mb-10"
              >
                Book Now
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

export default PlansSection;