'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "../utils/config";

type Category = {
  _id: string;
  name: string;
  imageUrl: string;
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch(`${BASE_URL}api/header/allbanner?lang=1`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          setCategories(data.Categorys || []);
        }
      })
      .catch((err) => console.error("API Error:", err));
  }, []);

  if (!categories.length) return null;

  return (
    <section className="py-8 md:py-14 bg-gray-50">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-xl md:text-3xl font-semibold text-gray-800">
            Explore Categories
          </h2>

          <button
            onClick={() => router.push("/services")}
            className="text-sm md:text-base font-medium text-red-600 hover:underline"
          >
            View All
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-3 gap-4 md:gap-6">
          {categories.map((item) => (
            <div
              key={item._id}
              onClick={() =>
                router.push(`/services?category=${encodeURIComponent(item.name)}`)
              }
              className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 p-3 md:p-5 flex flex-col items-center text-center"
            >
              {/* Image */}
              <div className="w-20 h-20 md:w-28 md:h-28 mb-2 md:mb-3 overflow-hidden bg-gray-100 rounded-full">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Name */}
              <p className="text-xs sm:text-sm md:text-base font-medium text-gray-700 leading-tight">
                {item.name}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Categories;
