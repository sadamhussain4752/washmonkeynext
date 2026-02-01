"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { Phone, Mail, MessageCircle, Clock, HelpCircle } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com/";

const complaintOptions = [
  {
    issue: "Not Cleaned Properly",
    subIssues: ["Interior", "Exterior", "Tyres", "Windshield & Windows", "Dashboard", "Door Jambs", "Floor Mats", "Others"],
    requiredInputs: ["Date of Service", "Vehicle Type"],
    optionalInputs: ["Time Slot", "Comments", "Photo Upload"],
  },
  {
    issue: "Water Usage",
    subIssues: ["Excessive Water Consumption", "Water Spillage", "Water Wastage (Waterless Not Followed)", "Others"],
    requiredInputs: ["Date of Service", "Vehicle Type"],
    optionalInputs: ["Comments", "Photo Upload"],
  },
  {
    issue: "Payment & Billing",
    subIssues: ["Subscription Renewal Inquiry", "Wrong Amount Charged", "Refund Not Received", "Invoice Required", "Payment Failed / Not Reflected", "Others"],
    requiredInputs: ["Payment Amount", "Payment Date"],
    optionalInputs: ["Mode of Payment", "Transaction ID", "Comments"],
  },
  {
    issue: "Staff Behaviour or Timing",
    subIssues: ["Staff Arrived Late", "Staff Didn’t Show", "Rude or Unprofessional Behaviour", "Incomplete Cleaning & Left Early", "Different Staff Came", "Others"],
    requiredInputs: ["Date of Incident", "Time Slot"],
    optionalInputs: ["Staff Name", "Comments", "Photo Upload"],
  },
  {
    issue: "Damage to Car / Property",
    subIssues: ["Scratch on Paint or Glass", "Broken Mirror / Antenna / Accessory", "Chemical Spill Inside Car", "Pressure Wash Damage", "Property (Home) Damage", "Others"],
    requiredInputs: ["Date of Service", "Vehicle Type"],
    optionalInputs: ["Time Slot", "Comments", "Photo Upload"],
  },
  {
    issue: "Service Not Received / Incomplete",
    subIssues: ["Cleaner Didn’t Show Up", "High Pressure Wash Not Done", "Interior Vacuuming Missed", "Foam Wash Missed", "Air Freshener Not Provided", "Others"],
    requiredInputs: ["Scheduled Date", "Vehicle Type"],
    optionalInputs: ["Time Slot", "Comments"],
  },
  {
    issue: "Reschedule / Cancellation Request",
    subIssues: ["Pause Service", "Change Time Slot", "Change Cleaning Staff", "Request Service Hold (Vacation, Travel)", "Others"],
    requiredInputs: ["Original Booking Date", "Requested New Date"],
    optionalInputs: ["Original Time Slot", "New Time Slot", "Comments"],
  },
  {
    issue: "App / Booking Issues",
    subIssues: ["App Not Working / Crashing", "Unable to Book", "Booking Not Visible", "Notifications Not Received", "Others"],
    requiredInputs: [],
    optionalInputs: ["Date of Issue", "Device Info / OS", "Comments"],
  },
  {
    issue: "General Feedback / Others",
    subIssues: ["Suggestion", "Feedback on Service Quality", "Complaint Not Listed Above"],
    requiredInputs: [],
    optionalInputs: ["Comments", "Date"],
  },
];

// Fixed Time Slots
const timeSlots = ["6:00 AM – 9:00 AM", "9:00 AM – 12:00 PM", "12:00 PM – 3:00 PM", "3:00 PM – 6:00 PM"];

export default function HelpPage() {
  const router = useRouter();

  // Form State
  const [selectedIssue, setSelectedIssue] = useState(complaintOptions[0]);
  const [selectedSubIssue, setSelectedSubIssue] = useState("");
  const [formValues, setFormValues] = useState<Record<string, string | File | Date | any>>({});
  const [description, setDescription] = useState("");

  // Contact Cards
  const contactMethods = [
    { icon: <Phone className="w-6 h-6" />, title: "Phone Support", description: "Call us anytime", value: "+91 98765 43210", action: "tel:+919876543210" },
    { icon: <Mail className="w-6 h-6" />, title: "Email Support", description: "We'll respond within 24 hours", value: "support@washmonkey.com", action: "mailto:support@washmonkey.com" },
    { icon: <MessageCircle className="w-6 h-6" />, title: "Live Chat", description: "Chat with our team", value: "Start Chat", action: "#" },
    { icon: <Clock className="w-6 h-6" />, title: "Working Hours", description: "Mon - Sun", value: "9:00 AM - 6:00 PM", action: null },
  ];

  const faqs = [
    { question: "How do I book a car cleaning service?", answer: "You can book a service by browsing our services page, selecting your preferred service, choosing your vehicle and location, and confirming the booking. We'll send you a confirmation with all details." },
    { question: "Can I cancel or reschedule my booking?", answer: "Yes, you can cancel or reschedule your booking at least 4 hours before the scheduled time through the My Orders section. No cancellation fees will be charged." },
    { question: "What payment methods do you accept?", answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets. Payment is secured and can be made after the service is completed." },
    { question: "Are your cleaning products eco-friendly?", answer: "Yes! All our cleaning products are 100% eco-friendly, biodegradable, and safe for your car's paint and the environment." },
    { question: "Do you provide service on holidays?", answer: "Yes, we provide services 7 days a week, including holidays. You can book your preferred time slot through our app." },
    { question: "What if I'm not satisfied with the service?", answer: "We offer a 100% satisfaction guarantee. If you're not happy with our service, contact us within 24 hours and we'll re-do the service free of charge or provide a full refund." },
  ];

  const handleInputChange = (label: string, value: string | File | Date | null) => {
    setFormValues((prev) => ({ ...prev, [label]: value }));
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login first.");
      router.push("/login");
      return;
    }

    const payload = new FormData();
    payload.append("userId", userId);
    payload.append("issue", selectedIssue.issue);
    payload.append("subIssue", selectedSubIssue);
    payload.append("description", description);

    Object.entries(formValues).forEach(([key, value]) => {
      if (value instanceof File) payload.append(key, value);
      else if (value instanceof Date) payload.append(key, value.toISOString());
      else payload.append(key, value as string);
    });

    try {
      await axios.post(`${BASE_URL}api/support/create`, payload, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Support request submitted successfully!");
      setDescription("");
      setSelectedSubIssue("");
      setFormValues({});
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    }
  };

  const renderField = (label: string, required: boolean = false) => {
    if (/photo/i.test(label)) {
      return (
        <div key={label} className="mb-4">
          <Label>{label}{required && "*"}</Label>
          <input type="file" accept="image/*" onChange={(e) => e.target.files && handleInputChange(label, e.target.files[0])} />
          {formValues[label] instanceof File && <p>Uploaded: {(formValues[label] as File).name}</p>}
        </div>
      );
    }

    if (/date/i.test(label)) {
      return (
        <div key={label} className="mb-4">
          <Label>{label}{required && "*"}</Label>
          <DatePicker selected={formValues[label] instanceof Date ? (formValues[label] as Date) : null} onChange={(date: Date | null) => handleInputChange(label, date)}
 dateFormat="dd/MM/yyyy" />
        </div>
      );
    }

    if (/time/i.test(label) || /time slot/i.test(label)) {
      return (
        <div key={label} className="mb-4">
          <Label>{label}{required && "*"}</Label>
          <div className="flex gap-2 flex-wrap mt-1">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                className={`px-3 py-1 rounded border ${formValues[label] === slot ? "bg-blue-500 text-white border-blue-500" : "bg-gray-100 text-gray-800 border-gray-300"}`}
                onClick={() => handleInputChange(label, slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div key={label} className="mb-4">
        <Label>{label}{required && "*"}</Label>
        <Input value={(formValues[label] as string) || ""} onChange={(e) => handleInputChange(label, e.target.value)} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle className="w-8 h-8" />
            <h1 className="text-white text-2xl font-bold">Help & Support</h1>
          </div>
          <p className="text-lg opacity-90">We're here to help you</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        {/* Contact Methods & Form */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-semibold">Contact Us</h2>
          {contactMethods.map((method, index) => (
            <Card key={index} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="text-red-600">{method.icon}</div>
                <div className="flex-1">
                  <h3 className="text-sm mb-1 font-semibold">{method.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{method.description}</p>
                  {method.action ? <a href={method.action} className="text-sm text-red-600 hover:underline">{method.value}</a> : <p className="text-sm">{method.value}</p>}
                </div>
              </div>
            </Card>
          ))}

          <Card className="p-6">
            <h3 className="mb-4 font-semibold">Send us a message</h3>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div>{renderField("Name", true)}</div>
              <div>{renderField("Email", true)}</div>
              <div>{renderField("Message", true)}</div>
              <Button className="w-full">Send Message</Button>
            </form>
          </Card>
        </div>

        {/* Dynamic Complaint Form & FAQs */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Submit a Support Ticket</h3>
            <div className="space-y-4">
              <div>
                <Label>Select Issue</Label>
                <div className="flex gap-2 flex-wrap mt-2">
                  {complaintOptions.map((item) => (
                    <button key={item.issue} type="button" className={`px-3 py-1 rounded ${selectedIssue.issue === item.issue ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => { setSelectedIssue(item); setSelectedSubIssue(""); setFormValues({}); }}>
                      {item.issue}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Select Sub-Issue</Label>
                <div className="flex gap-2 flex-wrap mt-2">
                  {selectedIssue.subIssues.map((sub) => (
                    <button key={sub} type="button" className={`px-3 py-1 rounded ${selectedSubIssue === sub ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setSelectedSubIssue(sub)}>
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {selectedIssue.requiredInputs.map((label) => renderField(label, true))}
              {selectedIssue.optionalInputs.map((label) => renderField(label, false))}

              <div>
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Enter description" />
              </div>

              <Button onClick={handleSubmit} className="w-full">Submit Ticket</Button>
            </div>
          </Card>

          <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
          <Card className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      </div>
    </div>
  );
}
