"use client"; // if using hooks like useState, useEffect


import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle, Leaf, ArrowRight,MessageCircle  } from "lucide-react";
import { servicePlans } from "@/app/data/products";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import Categories from "@/app/components/Categories";
import PlansSection from "@/app/components/PlansSection";
import HeroSection from "@/app/components/HeroSection";

export default function Page() {
  const highlights = [
    {
      icon: <CheckCircle className="w-8 h-8 text-red-600" />,
      title: "100% Satisfaction Guarantee",
      description: "We ensure quality service or your money back"
    },
    {
      icon: <Leaf className="w-8 h-8 text-red-600" />,
      title: "Eco-Friendly Products",
      description: "Biodegradable and environment-safe cleaning solutions"
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-red-600" />,
      title: "Certified Professionals",
      description: "Trained experts with years of experience"
    }
  ];

  const howWeServe = [
    {
      title: "What We Do",
      description: "Professional car cleaning at your doorstep with premium products and equipment",
      items: ["Exterior Wash", "Interior Detailing", "Waxing & Polish", "Eco-Friendly Clean"]
    },
    {
      title: "Why We Do",
      description: "To provide convenient, quality car care while saving your time and protecting the environment",
      items: ["Save Time", "Quality Service", "Eco-Conscious", "Affordable Pricing"]
    },
    {
      title: "For Whom",
      description: "For busy professionals, families, and anyone who values their car and time",
      items: ["Busy Professionals", "Families", "Car Enthusiasts", "Fleet Owners"]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}


     <HeroSection/>
<Categories/>
<PlansSection/>


      {/* Trust Stats */}
<section className="py-16 bg-white">
  <div className="container mx-auto px-4 container-min">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      {[
        { value: "5,000+", label: "Cars Cleaned" },
        { value: "1,200+", label: "Happy Customers" },
        { value: "4.9★", label: "Average Rating" },
        { value: "100%", label: "Eco Friendly" },
      ].map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-4xl text-red-600">{stat.value}</h3>
          <p className="text-gray-600 mt-2">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* Highlights Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 container-min">
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">{highlight.icon}</div>
                  <h3 className="mb-2">{highlight.title}</h3>
                  <p className="text-gray-600">{highlight.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      

      {/* How We Serve Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 container-min">
          <h2 className="text-center mb-12">How We Serve You</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {howWeServe.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <h3 className="mb-3 text-red-600">{section.title}</h3>
                  <p className="text-gray-600 mb-4">{section.description}</p>
                  <ul className="space-y-2">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Plans Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 container-min">
          <h2 className="text-center mb-4">Our Popular Plans</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Choose the perfect plan for your car care needs
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {servicePlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`overflow-hidden h-full hover:shadow-xl transition-shadow ${plan.popular ? 'ring-2 ring-red-600' : ''}`}>
                  {plan.popular && (
                    <div className="bg-red-600 text-white text-center py-2 text-sm">
                      Most Popular
                    </div>
                  )}
                  <img 
                    src={plan.image} 
                    alt={plan.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{plan.description}</p>
                    <div className="mb-4">
                      <span className="text-3xl">₹{plan.price}</span>
                      <span className="text-gray-500">/service</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <CheckCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={`/services`}>
                      <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}
      {/* How It Works */}
<section className="py-16 bg-gray-50">
  <div className="container mx-auto px-4 container-min">
    <h2 className="text-center mb-12">How It Works</h2>

    <div className="grid md:grid-cols-3 gap-8">
      {[
        {
          step: "01",
          title: "Choose Service",
          desc: "Select a car wash plan that fits your needs",
        },
        {
          step: "02",
          title: "Schedule Time",
          desc: "Pick a date & time at your convenience",
        },
        {
          step: "03",
          title: "We Clean",
          desc: "Our experts arrive and clean your car",
        },
      ].map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15 }}
          viewport={{ once: true }}
        >
          <Card className="p-6 text-center hover:shadow-lg transition">
            <div className="text-5xl text-red-600 mb-4">{item.step}</div>
            <h3 className="mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* CTA Section */}
      <section className="py-20 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center container-min">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-white">Ready to Give Your Car the Care It Deserves?</h2>
            <p className="mb-8 text-xl opacity-90 max-w-2xl mx-auto">
              Book your service today and experience the Wash Monkey difference
            </p>
            <Link href="/services">
              <Button size="lg" variant="secondary">
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      {/* Testimonials */}
<section className="py-16 bg-white">
  <div className="container mx-auto px-4 container-min">
    <h2 className="text-center mb-12">What Our Customers Say</h2>

    <div className="grid md:grid-cols-3 gap-8">
      {[
        {
          name: "Rahul Sharma",
          text: "Amazing service! My car looks brand new every time.",
        },
        {
          name: "Anjali Verma",
          text: "Very professional and eco-friendly. Highly recommended.",
        },
        {
          name: "Mohammed Faiz",
          text: "On-time service and great attention to detail.",
        },
      ].map((review, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <Card className="p-6 hover:shadow-lg transition">
            <p className="text-gray-600 mb-4">“{review.text}”</p>
            <h4 className="text-red-600">{review.name}</h4>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
</section>
<a
  href="https://wa.me/918148274827"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-18 md:bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:scale-105 transition z-50 flex items-center justify-center"
>
  <MessageCircle size={24} />
</a>

    </div>
  );
}
