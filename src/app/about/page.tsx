import Link from "next/link";
import {
  Car,
  Droplets,
  Sparkles,
  Leaf,
  CalendarCheck,
  Clock,
  ShieldCheck,
  Users,
  CheckCircle,
} from "lucide-react";

export const metadata = {
  title: "About Wash Monkey | Car Wash Services",
  description:
    "Wash Monkey provides professional car wash and detailing services with eco-friendly solutions and expert care.",
};

export default function AboutPage() {
  return (
    <main className="bg-white text-gray-800">
      {/* HERO */}
      <section className="bg-gray-100 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            About Wash Monkey
          </h1>

          <p className="text-lg max-w-3xl mx-auto">
            Premium car wash & detailing service focused on quality, speed,
            and eco-friendly cleaning.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/services"
              className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primaryDark transition"
            >
              Our Services
            </Link>

            <Link
              href="/contact"
              className="px-6 py-3 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-primary">
            Our Story
          </h2>
          <p className="mb-4">
            Wash Monkey was started to bring reliable, professional,
            and affordable car wash services to every car owner.
          </p>
          <p>
            From daily commuters to premium vehicles, we provide safe
            and high-quality cleaning for every car.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12 text-primary">
            Our Services
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard
              icon={<Car className="text-primary" />}
              title="Exterior Wash"
              description="Foam wash, pressure cleaning & safe drying."
            />
            <ServiceCard
              icon={<Droplets className="text-primary" />}
              title="Interior Cleaning"
              description="Vacuum, dashboard polish & seat cleaning."
            />
            <ServiceCard
              icon={<Sparkles className="text-primary" />}
              title="Car Detailing"
              description="Deep detailing, waxing & polish."
            />
            <ServiceCard
              icon={<Leaf className="text-primary" />}
              title="Eco-Friendly Wash"
              description="Low-water & safe chemical cleaning."
            />
            <ServiceCard
              icon={<CalendarCheck className="text-primary" />}
              title="Monthly Plans"
              description="Affordable subscription packages."
            />
            <ServiceCard
              icon={<Clock className="text-primary" />}
              title="On-Demand Service"
              description="Quick booking at your convenience."
            />
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12 text-primary">
            Our Process
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            <Step icon={<CalendarCheck className="text-primary" />} title="Book" />
            <Step icon={<Car className="text-primary" />} title="Inspection" />
            <Step icon={<Sparkles className="text-primary" />} title="Cleaning" />
            <Step icon={<ShieldCheck className="text-primary" />} title="Quality Check" />
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12 text-primary">
            Why Choose Wash Monkey
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <WhyItem icon={<Users className="text-primary" />} text="Skilled professionals" />
            <WhyItem icon={<ShieldCheck className="text-primary" />} text="Safe for all vehicles" />
            <WhyItem icon={<Leaf className="text-primary" />} text="Eco-friendly products" />
            <WhyItem icon={<CheckCircle className="text-primary" />} text="Transparent pricing" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6 text-center">
          <Stat icon={<Car className="text-primary" />} number="5000+" label="Cars Washed" />
          <Stat icon={<Users className="text-primary" />} number="98%" label="Happy Customers" />
          <Stat icon={<Sparkles className="text-primary" />} number="50+" label="Experts" />
          <Stat icon={<ShieldCheck className="text-primary" />} number="100%" label="Quality Check" />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">
            Book Your Car Wash Today
          </h2>

          <div className="flex justify-center gap-4">
            <Link
              href="/services"
              className="px-6 py-3 bg-white text-primary rounded-md hover:bg-gray-100 transition"
            >
              Book Now
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border border-white rounded-md hover:bg-white hover:text-primary transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* COMPONENTS */

function ServiceCard({ icon, title, description }: any) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-3">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Step({ icon, title }: any) {
  return (
    <div className="p-6 border rounded-lg">
      <div className="flex justify-center mb-3">{icon}</div>
      <p className="font-semibold">{title}</p>
    </div>
  );
}

function WhyItem({ icon, text }: any) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function Stat({ icon, number, label }: any) {
  return (
    <div>
      <div className="flex justify-center mb-2">{icon}</div>
      <h3 className="text-3xl font-bold text-primary">{number}</h3>
      <p>{label}</p>
    </div>
  );
}
