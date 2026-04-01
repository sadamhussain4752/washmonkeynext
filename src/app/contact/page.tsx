import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Facebook,
  Instagram,
  Twitter,
  Car,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Contact Wash Monkey | Book Car Wash & Support",
  description:
    "Contact Wash Monkey for car wash bookings, service enquiries, and customer support. Available across Chennai.",
};

export default function ContactPage() {
  return (
    <main className="bg-white text-gray-800">

      {/* ================= HERO ================= */}
      <section className="bg-gray-100 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Contact Wash Monkey
          </h1>
          <p className="text-lg max-w-3xl mx-auto">
            Need help booking a car wash, managing your subscription, or
            enquiring about our services? We’re here to help.
          </p>
        </div>
      </section>

      {/* ================= CONTACT CARDS ================= */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">
          <ContactCard
            icon={<Phone className="text-primary" />}
            title="Call Us"
            description="+91 81482 74827"
          />
          <ContactCard
            icon={<Mail className="text-primary" />}
            title="Email"
            description="support@washmonkey.in"
          />
          <ContactCard
            icon={<MapPin className="text-primary" />}
            title="Service Area"
            description="Adyan, Thiruvanmiyur , OMR"
          />
          <ContactCard
            icon={<Clock className="text-primary" />}
            title="Working Hours"
            description="6:00 AM – 6:00 PM"
          />
        </div>
      </section>

      {/* ================= CONTACT FORM ================= */}
      {/* <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-10 text-primary">
            Send Us a Message
          </h2>

          <form className="bg-white p-8 rounded-lg shadow-sm space-y-6">
            <Input label="Full Name" placeholder="Enter your name" />
            <Input label="Email Address" placeholder="Enter your email" />
            <Input label="Phone Number" placeholder="Enter your phone number" />

            <div>
              <label className="block mb-2 font-medium">
                Select Service
              </label>
              <select className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-primary outline-none">
                <option>Exterior Wash</option>
                <option>Interior Cleaning</option>
                <option>Full Car Detailing</option>
                <option>Monthly Plan</option>
              </select>
            </div>

            <Textarea label="Message" placeholder="Write your message..." />

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-md flex items-center justify-center gap-2 hover:bg-primaryDark transition"
            >
              <Send size={18} />
              Submit Enquiry
            </button>
          </form>
        </div>
      </section> */}

      {/* ================= MAP ================= */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6 text-primary">
            Our Location
          </h2>

          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <MapPin className="text-primary" size={40} />
            <span className="ml-2 font-medium">
              Map integration (Google Maps / OpenStreetMap)
            </span>
          </div>
        </div>
      </section>

      {/* ================= BRANCHES ================= */}
      {/* <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12 text-primary">
            Our Branches
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Branch name="Anna Nagar" />
            <Branch name="Velachery" />
            <Branch name="OMR" />
          </div>
        </div>
      </section> */}

      {/* ================= SOCIAL ================= */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6 text-primary">
            Follow Us
          </h2>
<div className="flex justify-center gap-6">
  <a href="https://www.facebook.com/share/1Gb5WahkWp/" target="_blank" rel="noopener noreferrer">
    <Social icon={<Facebook />} />
  </a>

  <a href="https://www.instagram.com/washmonkey.in?igsh=dmNnc3M4bnR2OHo4" target="_blank" rel="noopener noreferrer">
    <Social icon={<Instagram />} />
  </a>
</div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12 text-primary">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <FAQ
              question="Do you provide doorstep car wash?"
              answer="Yes, we provide on-demand doorstep car wash services."
            />
            <FAQ
              question="Is waterless wash safe?"
              answer="Absolutely. We use certified eco-friendly products."
            />
            <FAQ
              question="Do you offer monthly plans?"
              answer="Yes, flexible monthly subscription plans are available."
            />
          </div>
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <ShieldCheck className="mx-auto text-primary mb-4" size={36} />
          <h2 className="text-2xl font-semibold mb-2">
            Trusted Car Care Professionals
          </h2>
          <p>
            Thousands of satisfied customers trust Wash Monkey for consistent
            and premium car wash services.
          </p>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-primary text-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">
            Ready to Book Your Car Wash?
          </h2>
          <p className="mb-8">
            Book now and enjoy premium car care with Wash Monkey.
          </p>

          <button className="bg-white text-primary px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition">
            <Link  href ="/services">
             Book Now
            </Link>
           
          </button>
        </div>
      </section>

    </main>
  );
}

/* ================= COMPONENTS ================= */

function ContactCard({ icon, title, description }: any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Input({ label, placeholder }: any) {
  return (
    <div>
      <label className="block mb-2 font-medium">{label}</label>
      <input
        placeholder={placeholder}
        className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
      />
    </div>
  );
}

function Textarea({ label, placeholder }: any) {
  return (
    <div>
      <label className="block mb-2 font-medium">{label}</label>
      <textarea
        rows={4}
        placeholder={placeholder}
        className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
      />
    </div>
  );
}

function Branch({ name }: any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <Car className="text-primary mb-3" />
      <h3 className="text-xl font-semibold">{name}</h3>
      <p className="text-sm text-gray-600">
        Doorstep car wash & detailing services available.
      </p>
    </div>
  );
}

function Social({ icon }: any) {
  return (
    <div className="p-4 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition cursor-pointer">
      {icon}
    </div>
  );
}

function FAQ({ question, answer }: any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <HelpCircle className="text-primary" />
        <h4 className="font-semibold">{question}</h4>
      </div>
      <p className="text-gray-600">{answer}</p>
    </div>
  );
}
