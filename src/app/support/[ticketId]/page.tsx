"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter, usePathname,useParams } from "next/navigation";

import { BASE_URL } from "@/app/utils/config";

/* ================= TYPES ================= */

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

/* ================= PAGE ================= */

export default function SupportTicketDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
const params = useParams();
const ticketId = params?.ticketId as string;
  const scrollRef = useRef<HTMLDivElement>(null);

  const [ticketDetail, setTicketDetail] = useState<TicketDetail | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  /* ================= FETCH ================= */

 const fetchTicket = async () => {
  if (!ticketId) {
    console.log("❌ No ticketId found");
    return;
  }


  try {
    setFetching(true);
    const res = await axios.get(
      `${BASE_URL}api/support/ticket/${ticketId}`
    );

    setTicketDetail(res.data);
  } catch (err) {
    console.error("❌ Fetch error:", err);
  } finally {
    setFetching(false);
  }
};
  /* ================= AUTO REFRESH ================= */

  useEffect(() => {
    fetchTicket();

    const interval = setInterval(fetchTicket, 10000); // every 10 sec
    return () => clearInterval(interval);
  }, [ticketId]);

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  }, [ticketDetail]);

  /* ================= SEND MESSAGE ================= */

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
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */

  if (fetching && !ticketDetail) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  /* ================= MERGE MESSAGES ================= */

  const allMessages = ticketDetail
    ? [
        {
          sender: "user",
          content: ticketDetail.description,
          sentAt: ticketDetail.submittedAt,
        },
        ...(ticketDetail.messages || []),
      ].sort(
        (a, b) =>
          new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
      )
    : [];

  /* ================= UI ================= */

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* HEADER */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => router.back()}
          className="text-lg font-bold"
        >
          ←
        </button>

        <div>
          <h1 className="font-semibold text-gray-800 text-sm">
            {ticketDetail?.issue}
          </h1>
          {ticketDetail?.subIssue && (
            <p className="text-xs text-gray-500">
              {ticketDetail.subIssue}
            </p>
          )}
        </div>
      </div>

      {/* CHAT */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-4 space-y-3"
      >
        {allMessages.map((msg, index) => {
          const isUser = msg.sender === "user";

          return (
            <div
              key={index}
              className={`flex ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm text-sm ${
                  isUser
                    ? "bg-red-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                {/* MESSAGE */}
                <p>{msg.content}</p>

                {/* TIME */}
                <div
                  className={`text-[10px] mt-1 ${
                    isUser
                      ? "text-red-100 text-right"
                      : "text-gray-400"
                  }`}
                >
                  {new Date(msg.sentAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div className="fixed bottom-20 left-0 w-full bg-white border-t px-3 py-2 flex items-center gap-2 z-50">
  <input
    type="text"
    placeholder="Type your message..."
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") handleReply();
    }}
    className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none"
  />

  <button
    onClick={handleReply}
    disabled={!message.trim() || loading}
    className="bg-red-600 text-white px-4 py-2 rounded-full text-sm disabled:opacity-50"
  >
    {loading ? "..." : "Send"}
  </button>
</div>
    </div>
  );
}