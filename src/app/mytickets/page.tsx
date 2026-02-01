"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/app/components/ui/accordion";
// import { components } from "@/app/components";
import { Phone, Mail, MessageCircle, Clock, HelpCircle } from "lucide-react";

import { BASE_URL } from "@/app/utils/config";

interface Ticket {
    _id: string;
    issue: string;
    description: string;
    submittedAt: string;
}

export default function HelpAndSupportPage() {
    const router = useRouter();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loadingTickets, setLoadingTickets] = useState(true);
    const [formValues, setFormValues] = useState({ issue: "", description: "" });
    const [submitting, setSubmitting] = useState(false);

    // Fetch user's tickets
    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) return;

            const response = await axios.get(`${BASE_URL}api/support/${userId}`);
            setTickets(response.data.tickets || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingTickets(false);
        }
    };

    const handleTicketSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("Please login to submit a ticket.");
            return;
        }

        setSubmitting(true);
        try {
            await axios.post(`${BASE_URL}api/support/create`, {
                userId,
                issue: formValues.issue,
                description: formValues.description,
            });
            alert("Ticket submitted successfully!");
            setFormValues({ issue: "", description: "" });
            fetchTickets();
        } catch (err) {
            console.error(err);
            alert("Failed to submit ticket. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const contactMethods = [
        {
            icon: <Phone className="w-6 h-6 text-red-600" />,
            title: "Phone Support",
            description: "Call us anytime",
            value: "+91 98765 43210",
            action: "tel:+919876543210",
        },
        {
            icon: <Mail className="w-6 h-6 text-red-600" />,
            title: "Email Support",
            description: "We'll respond within 24 hours",
            value: "support@washmonkey.com",
            action: "mailto:support@washmonkey.com",
        },
        {
            icon: <MessageCircle className="w-6 h-6 text-red-600" />,
            title: "Live Chat",
            description: "Chat with our team",
            value: "Start Chat",
            action: "#",
        },
        {
            icon: <Clock className="w-6 h-6 text-red-600" />,
            title: "Working Hours",
            description: "Mon - Sun",
            value: "9:00 AM - 6:00 PM",
            action: null,
        },
    ];

    const faqs = [
        {
            question: "How do I book a car cleaning service?",
            answer: "You can book a service by browsing our services page, selecting your preferred service, choosing your vehicle and location, and confirming the booking. We'll send you a confirmation with all details.",
        },
        {
            question: "Can I cancel or reschedule my booking?",
            answer: "Yes, you can cancel or reschedule your booking at least 4 hours before the scheduled time through the My Orders section. No cancellation fees will be charged.",
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets. Payment is secured and can be made after the service is completed.",
        },
        {
            question: "Are your cleaning products eco-friendly?",
            answer: "Yes! All our cleaning products are 100% eco-friendly, biodegradable, and safe for your car's paint and the environment.",
        },
        {
            question: "Do you provide service on holidays?",
            answer: "Yes, we provide services 7 days a week, including holidays. You can book your preferred time slot through our app.",
        },
        {
            question: "What if I'm not satisfied with the service?",
            answer: "We offer a 100% satisfaction guarantee. If you're not happy with our service, contact us within 24 hours and we'll re-do the service free of charge or provide a full refund.",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero / Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-12">
                <div className="container mx-auto px-4 flex items-center gap-3">
                    <HelpCircle className="w-8 h-8" />
                    <h1 className="text-3xl font-bold">Help & Support</h1>
                </div>
                <p className="text-lg opacity-90 px-4 container mx-auto">We're here to help you</p>
            </div>

            <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
                {/* Contact Methods + Form */}
                <div className="lg:col-span-1 space-y-6">
                    <h2 className="text-xl font-semibold">Contact Us</h2>
                    <div className="space-y-4">
                        {contactMethods.map((method, index) => (
                            <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-3">
                                    {method.icon}
                                    <div className="flex-1">
                                        <h3 className="text-sm mb-1">{method.title}</h3>
                                        <p className="text-xs text-gray-500 mb-2">{method.description}</p>
                                        {method.action ? (
                                            <a href={method.action} className="text-sm text-red-600 hover:underline">
                                                {method.value}
                                            </a>
                                        ) : (
                                            <p className="text-sm">{method.value}</p>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Support Ticket Form */}
                    <Card className="p-6">
                        <h3 className="mb-4">Submit a Ticket</h3>
                        <form className="space-y-4" onSubmit={handleTicketSubmit}>
                            <div>
                                <Label>Issue</Label>
                                <Input
                                    placeholder="Describe your issue"
                                    className="mt-2"
                                    value={formValues.issue}
                                    onChange={(e) => setFormValues({ ...formValues, issue: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Textarea
                                    placeholder="Provide details"
                                    className="mt-2 resize-none"
                                    rows={4}
                                    value={formValues.description}
                                    onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={submitting}>
                                {submitting ? "Submitting..." : "Submit Ticket"}
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Tickets + FAQs */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Tickets List */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-blue-700">Your Tickets</h2>

                        {loadingTickets ? (
                            <div className="flex justify-center py-12">
                                {/* Spinner can be added here */}
                                <p className="text-gray-500 text-lg">Loading...</p>
                            </div>
                        ) : tickets.length === 0 ? (
                            <p className="text-center text-gray-500 mt-8 text-lg">
                                No tickets submitted yet.
                            </p>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6">
                                {tickets.map((ticket: any) => {
                                    const lastMessage =
                                        ticket.messages?.[ticket.messages.length - 1]?.content || "";
                                    const hasAdminResponded = ticket.messages?.some(
                                        (m: any) => m.sender === "admin"
                                    );

                                    return (
                                        <Card
                                            key={ticket._id}
                                            className="p-6 hover:shadow-lg cursor-pointer transition-shadow rounded-xl border border-gray-200 bg-white"
                                            onClick={() => router.push(`/support/${ticket._id}`)}
                                        >
                                            {/* Header */}
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="text-lg font-semibold text-blue-600">
                                                    {ticket.issue}
                                                </h3>
                                                <span className="text-sm text-gray-400">{ticket.ticketNumber}</span>
                                            </div>

                                            {/* Sub Issue */}
                                            {ticket.subIssue && (
                                                <p className="text-gray-700 mb-2">
                                                    <span className="font-semibold">Sub-Issue:</span> {ticket.subIssue}
                                                </p>
                                            )}

                                            {/* Vehicle & Service Details */}
                                            <div className="text-gray-700 mb-3 space-y-1 text-sm">
                                                {ticket.details["Vehicle Type"] && (
                                                    <p>
                                                        <span className="font-semibold">Vehicle Type:</span>{" "}
                                                        {ticket.details["Vehicle Type"]}
                                                    </p>
                                                )}
                                                {ticket.details["Date of Service"] && (
                                                    <p>
                                                        <span className="font-semibold">Service Date:</span>{" "}
                                                        {ticket.details["Date of Service"]}
                                                    </p>
                                                )}
                                                {ticket.details["Time Slot"] && (
                                                    <p>
                                                        <span className="font-semibold">Time Slot:</span>{" "}
                                                        {ticket.details["Time Slot"]}
                                                    </p>
                                                )}
                                                {ticket.details.Comments && (
                                                    <p>
                                                        <span className="font-semibold">Comments:</span>{" "}
                                                        {ticket.details.Comments}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Last Message */}
                                            {lastMessage && (
                                                <p className="text-gray-600 text-sm mb-2">
                                                    <span className="font-semibold">Last Message:</span> {lastMessage}
                                                </p>
                                            )}

                                            {/* Timestamp */}
                                            <p className="text-gray-400 text-xs mb-2">
                                                Submitted: {new Date(ticket.submittedAt).toLocaleString()}
                                            </p>

                                            {/* Status Badge */}
                                            <span
                                                className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${hasAdminResponded
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                {hasAdminResponded ? "Admin Responded" : "Pending Response"}
                                            </span>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* FAQs */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-blue-700">Frequently Asked Questions</h2>

                        <Card className="p-6">
                            <Accordion type="single" collapsible className="w-full">
                                {faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                                        <AccordionContent>{faq.answer}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </Card>

                        {/* Additional Help */}
                        <Card className="p-6 mt-6 bg-red-50 border border-red-200 rounded-xl">
                            <h3 className="mb-2 text-red-800 font-semibold">Still need help?</h3>
                            <p className="text-gray-700 mb-4">
                                Can't find the answer you're looking for? Our customer support team is ready to help you.
                            </p>
                            <Button className="bg-red-600 hover:bg-red-700 text-white">Contact Support</Button>
                        </Card>
                    </div>
                </div>

            </div>
        </div>
    );
}
