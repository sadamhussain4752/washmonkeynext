"use client";

import { useState } from "react";
import axios from "axios";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

const ACTIVE = "bg-primary text-white border-primary";
const INACTIVE = "bg-gray-100 text-gray-700 border-gray-300";

const contactMethods = [
  {
    title: "Phone Support",
    description: "Call us anytime",
    value: "+91 81482 74827",
    action: "tel:+918148274827",
  },
  {
    title: "Email Support",
    description: "We'll respond within 24 hours",
    value: "support@washmonkey.in",
    action: "mailto:support@washmonkey.in",
  },
];

const complaintOptions = [
  {
    issue: "Not Cleaned Properly",
    subIssues: [
      "Interior", "Exterior", "Tyres", "Windshield & Windows",
      "Dashboard", "Door Jambs", "Floor Mats", "Others"
    ],
    requiredInputs: ["Date of Service", "Vehicle Type"],
    optionalInputs: ["Time Slot", "Comments", "Photo Upload"]
  },
  {
    issue: "Water Usage",
    subIssues: [
      "Excessive Water Consumption", "Water Spillage",
      "Water Wastage (Waterless Not Followed)", "Others"
    ],
    requiredInputs: ["Date of Service", "Vehicle Type","Time Slot"],
    optionalInputs: ["Comments", "Photo Upload"]
  },
  {
    issue: "Payment & Billing",
    subIssues: [
      "Subscription Renewal Inquiry", "Wrong Amount Charged",
      "Refund Not Received", "Invoice Required",
      "Payment Failed / Not Reflected", "Others"
    ],
    requiredInputs: ["Payment Amount", "Payment Date"],
    optionalInputs: ["Mode of Payment", "Transaction ID", "Comments"]
  },
  {
    issue: "Staff Behaviour",
    subIssues: [
      "Staff Arrived Late", "Staff Didn’t Show", "Rude or Unprofessional Behaviour",
      "Incomplete Cleaning & Left Early", "Different Staff Came", "Others"
    ],
    requiredInputs: ["Date of Incident","Vehicle Type", "Time Slot"],
    optionalInputs: ["Staff Name", "Comments", "Photo Upload"]
  },
  {
    issue: "Damage to Property",
    subIssues: [
      "Scratch on Paint or Glass", "Broken Mirror / Antenna / Accessory",
      "Chemical Spill Inside Car", "Pressure Wash Damage", "Property (Home) Damage", "Others"
    ],
    requiredInputs: ["Date of Service", "Vehicle Type"],
    optionalInputs: ["Time Slot", "Comments", "Photo Upload"]
  },
  {
    issue: "Service Unfinished",
    subIssues: [
      "Cleaner Didn’t Show Up", "High Pressure Wash Not Done",
      "Interior Vacuuming Missed", "Foam Wash Missed",
      "Air Freshener Not Provided", "Others"
    ],
    requiredInputs: ["Scheduled Date", "Vehicle Type"],
    optionalInputs: ["Time Slot", "Comments"]
  },
  // {
  //   issue: "Reschedule Cancel",
  //   subIssues: [
  //     "Pause Service", "Change Time Slot", "Change Cleaning Staff",
  //     "Request Service Hold (Vacation, Travel)", "Others"
  //   ],
  //   requiredInputs: ["Original Booking Date", "Requested New Date"],
  //   optionalInputs: ["Original Time Slot", "New Time Slot", "Comments"]
  // },
  {
    issue: "App / Booking Issues",
    subIssues: [
      "App Not Working / Crashing", "Unable to Book",
      "Booking Not Visible", "Notifications Not Received", "Others"
    ],
    requiredInputs: [],
    optionalInputs: ["Date of Issue", "Device Info / OS", "Comments"]
  },
  {
    issue: "General Feedback",
    subIssues: [
      "Suggestion", "Feedback on Service Quality", "Complaint Not Listed Above"
    ],
    requiredInputs: [],
    optionalInputs: ["Comments", "Date","Photo Upload"]
  }
];

const timeSlots = [
  "6:00 AM – 9:00 AM",
  "9:00 AM – 12:00 PM",
  "12:00 PM – 3:00 PM",
  "3:00 PM – 6:00 PM",
];

export default function HelpPage() {
  const [selectedIssue, setSelectedIssue] = useState(complaintOptions[0]);
  const [selectedSubIssue, setSelectedSubIssue] = useState("");
  const [formValues, setFormValues] = useState<any>({});
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<any>(null);
    // ✅ Desktop form state
  const [desktopForm, setDesktopForm] = useState({
    issue: "",
    description: "",
  });


  const handleInputChange = (key: string, value: any) => {
    setFormValues((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("issue", selectedIssue.issue);
      formData.append("subIssue", selectedSubIssue);
      formData.append("description", description);
      formData.append("details", JSON.stringify(formValues));

      if (image) {
        formData.append("file", image);
      }

      await axios.post(`${BASE_URL}/api/support/create`, formData);

      alert("Submitted successfully");
    } catch (err) {
      alert("Error submitting");
    }
  };

  const handleDesktopSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await axios.post(`${BASE_URL}/api/support/create`, desktopForm);
      alert("Ticket submitted!");
      setDesktopForm({ issue: "", description: "" });
    } catch {
      alert("Error");
    }
  };


  const renderField = (label: string) => {
    if (/date/i.test(label)) {
      return (
        <div key={label}>
          <p className="text-sm font-medium mb-2">{label}</p>
          <input
            type="date"
            className="w-full border rounded-lg p-2 text-sm"
            onChange={(e) => handleInputChange(label, e.target.value)}
          />
        </div>
      );
    }

    if (/time/i.test(label)) {
      return (
        <div key={label}>
          <p className="text-sm font-medium mb-2">{label}</p>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => handleInputChange(label, slot)}
                className={`p-2 rounded-lg border text-sm ${
                  formValues[label] === slot ? ACTIVE : INACTIVE
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (/photo/i.test(label)) {
      return (
        <div key={label}>
          <p className="text-sm font-medium mb-2">Attachments</p>
          <input
            type="file"
            onChange={(e: any) => setImage(e.target.files[0])}
            className="w-full border-dashed border text-sm p-3 rounded-lg"
          />
        </div>
      );
    }

    if (/comment/i.test(label)) {
      return (
        <div key={label}>
          <p className="text-sm font-medium mb-2">{label}</p>
          <textarea
            className="w-full border rounded-lg p-2 text-sm"
            rows={3}
            onChange={(e) => handleInputChange(label, e.target.value)}
          />
        </div>
      );
    }

    return (
      <div key={label}>
        <p className="text-sm font-medium mb-2">{label}</p>
        <input
          type="text"
          className="w-full border rounded-lg p-2 text-sm mb-2"
          onChange={(e) => handleInputChange(label, e.target.value)}
        />
      </div>
    );
  };

  return (
  <div className="min-h-screen bg-[#F6F7F9]">

    {/* MAIN CONTAINER */}
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* LEFT SIDE (DESKTOP ONLY) */}
        <div className="hidden md:block space-y-4">

          <h2 className="text-lg font-semibold">Contact Us</h2>

          {contactMethods.map((m, i) => (
            <Card key={i} className="p-4">
              <p className="font-medium">{m.title}</p>
              <p className="text-xs text-gray-500">{m.description}</p>
              <a href={m.action} className="text-red-600 text-sm">
                {m.value}
              </a>
            </Card>
          ))}

          {/* DESKTOP FORM */}
          <Card className="p-4">
            <form onSubmit={handleDesktopSubmit} className="space-y-3">
              <Label>Issue</Label>
              <Input
                value={desktopForm.issue}
                onChange={(e) =>
                  setDesktopForm({ ...desktopForm, issue: e.target.value })
                }
              />

              <Label>Description</Label>
              <Textarea
                value={desktopForm.description}
                onChange={(e) =>
                  setDesktopForm({
                    ...desktopForm,
                    description: e.target.value,
                  })
                }
              />

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Card>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:col-span-2 space-y-4">

          <h2 className="text-lg font-semibold">Support Dashboard</h2>

          {/* GREETING */}
       
<div className="flex items-center justify-between">
  <div>
    <h2 className="text-sm font-semibold">Hi Siva,</h2>
    <p className="text-xs text-gray-500">
      We're here to support you at every step.
    </p>
  </div>

  <Link href="/mytickets">
    <button className="text-xs font-medium text-red-600 border border-red-600 px-3 py-1 rounded-md hover:bg-red-50">
      Your tickets (1)
    </button>
  </Link>
</div>

          {/* MAIN ISSUES */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-sm font-semibold mb-2">Main Issues</p>

            <div className="grid grid-cols-2 gap-2">
              {complaintOptions.map((item) => (
                <button
                  key={item.issue}
                  onClick={() => {
                    setSelectedIssue(item);
                    setSelectedSubIssue("");
                    setFormValues({});
                  }}
                  className={`p-2 text-xs rounded-lg border ${
                    selectedIssue.issue === item.issue
                      ? ACTIVE
                      : INACTIVE
                  }`}
                >
                  {item.issue}
                </button>
              ))}
            </div>
          </div>

          {/* SUB ISSUES */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-sm font-semibold mb-2">Sub-Issues</p>

            <div className="space-y-2">
              {selectedIssue.subIssues.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubIssue(sub)}
                  className={`w-full text-left p-2 rounded-lg border text-sm ${
                    selectedSubIssue === sub ? ACTIVE : INACTIVE
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* FORM */}
          <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
            <p className="text-sm font-semibold">Service Details</p>

            {selectedIssue.requiredInputs.map((f) => renderField(f))}
            {selectedIssue.optionalInputs.map((f) => renderField(f))}

            {/* DESCRIPTION */}
            <div>
              <p className="text-sm font-medium">Description</p>
              <textarea
                className="w-full border rounded-lg p-2 text-sm"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold"
          >
            Send Review
          </button>

        </div>
      </div>
    </div>
  </div>
);
}