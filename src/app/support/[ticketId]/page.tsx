"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
// import { components } from "@/app/components";
// import { theme } from "@/app/constants";

import { BASE_URL } from "@/app/utils/config";

interface Message {
  sender: "user" | "admin";
  content: string;
  sentAt: string;
}

interface TicketDetail {
  _id: string;
  issue: string;
  subIssue?: string;
  description: string;
  submittedAt: string;
  messages: Message[];
}

export default function SupportTicketDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const ticketId = pathname.split("/").pop(); // get ID from URL
  const scrollRef = useRef<HTMLDivElement>(null);

  const [ticketDetail, setTicketDetail] = useState<TicketDetail | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  /* ---------------- FETCH TICKET ---------------- */
  const fetchTicket = async () => {
    if (!ticketId) return;
    try {
      setFetching(true);
      const res = await axios.get(`${BASE_URL}api/support/ticket/${ticketId}`);
      setTicketDetail(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  /* ---------------- AUTO REFRESH ---------------- */
  useEffect(() => {
    fetchTicket();
    const interval = setInterval(fetchTicket, 10000); // every 10s
    return () => clearInterval(interval);
  }, [ticketId]);

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [ticketDetail]);

  /* ---------------- SEND REPLY ---------------- */
  const handleReply = async () => {
    if (!message.trim() || loading || !ticketId) return;

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}api/support/reply/${ticketId}`, {
        sender: "user",
        content: message.trim(),
      });
      setMessage("");
      fetchTicket();
    } catch (err) {
      alert("Could not send reply");
    } finally {
      setLoading(false);
    }
  };

  if (fetching && !ticketDetail) {
    return (
      <div className="flex justify-center items-center h-screen">
       <p>Loading ..</p>
      </div>
    );
  }

  const allMessages = ticketDetail
    ? [
        {
          sender: "user",
          content: ticketDetail.description,
          sentAt: ticketDetail.submittedAt,
        },
        ...(ticketDetail.messages || []),
      ].sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
    : [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-6 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ticket Detail</h1>
        <Button variant="ghost" onClick={() => router.back()} className="text-white">
          Close
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6" ref={scrollRef}>
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-blue-600">{ticketDetail?.issue}</h2>
          {ticketDetail?.subIssue && <p className="text-gray-500 mb-4">{ticketDetail.subIssue}</p>}

          {allMessages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 mb-4 rounded-lg max-w-[80%] ${
                msg.sender === "user" ? "bg-blue-50 ml-auto" : "bg-gray-100"
              }`}
            >
              <div className="text-xs font-semibold mb-1 text-gray-600">
                {msg.sender === "user" ? "You" : "Support"}
              </div>
              <div className="text-sm text-gray-800">{msg.content}</div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(msg.sentAt).toLocaleString()}
              </div>
            </div>
          ))}
        </Card>

        {/* REPLY FORM */}
        <Card className="p-6 sticky bottom-4 bg-white">
          <h3 className="text-lg font-semibold mb-2">Your Reply</h3>
          <Textarea
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="mb-3"
          />
          <Button onClick={handleReply} disabled={!message.trim() || loading} className="w-full">
            {loading ? "Sending..." : "Send Reply"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
