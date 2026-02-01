'use client'


import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { BASE_URL } from "@/app/utils/config";
import { useRouter } from "next/navigation";
const PlansSection = () => {
  const router = useRouter()
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}api/product/allProduct?lang=1`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          setPlans(data.products || []);
        }
      })
      .catch((err) => console.error("API Error:", err));
  }, []);



  const addToCart = (product: any) => {
  // Create new cart with only the latest product
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

  // Save to localStorage (array)
  localStorage.setItem("cart", JSON.stringify(newCart));

  // Optional: redirect to cart page
  router.push("/mycard");
};
  if (!plans.length) return null;

  

  return (
  <section className="py-6 md:py-16 bg-gray-50">
  <div className="container mx-auto px-4 container-min">

    {/* Heading */}
    <h2 className="text-center mb-1.5 text-lg md:text-3xl font-semibold">
      Our Popular Plans
    </h2>

    <p className="text-center text-gray-600 mb-6 md:mb-12 max-w-2xl mx-auto text-[11px] md:text-base">
      Choose the perfect plan for your car care needs
    </p>

    {/* Grid → 2 columns mobile */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
      {plans.map((plan, index) => (
        <motion.div
          key={plan._id}
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.08 }}
          viewport={{ once: true }}
          className="h-full"
        >
          <Card
            className={`overflow-hidden h-full transition-shadow hover:shadow-xl ${
              plan.is_hot ? "ring-1 md:ring-2 ring-red-600" : ""
            }`}
          >
            {/* Badge */}
          
            {/* Image (smaller on mobile) */}
            <img
              src={plan.image}
              alt={plan.name}
              className="w-full h-24 sm:h-28 md:h-58 object-cover"
            />

            {/* Content */}
            <div className="p-3 md:p-6 flex flex-col h-full">
              <h3 className="mb-1 text-sm md:text-xl font-semibold">
                {plan.name}
              </h3>

              <p className="text-gray-600 mb-2 md:mb-4 text-[11px] md:text-sm line-clamp-2 md:line-clamp-3">
               <div dangerouslySetInnerHTML={{ __html: plan.description }} />
              </p>

              {/* Price */}
              <div className="mb-2 md:mb-4">
                <span className="text-lg md:text-3xl font-bold">
                  ₹{plan.price}
                </span>
                <span className="text-gray-500 text-[10px] md:text-sm">
                  {" "} / service
                </span>
              </div>

              {/* Features (compact mobile) */}
              <ul className="space-y-1 md:space-y-2 mb-3 md:mb-6">
                <li className="flex items-start text-[10px] md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-red-600 mr-1.5 mt-0.5" />
                  {plan.days} Days Service
                </li>
                <li className="flex items-start text-[10px] md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-red-600 mr-1.5 mt-0.5" />
                  Interior: {plan.interior} times
                </li>
              </ul>

              {/* CTA */}
                <Button
                  onClick={()=>{
                      addToCart(plan);
                  }}
                  className="w-full text-xs md:text-base"
                  size="sm"
                  variant={plan.is_hot ? "default" : "outline"}
                >
                  Book Now
                </Button>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
</section>

  );
};

export default PlansSection;
