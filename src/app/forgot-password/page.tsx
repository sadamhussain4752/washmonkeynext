"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendResetEmail = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${BASE_URL}api/user/forgot-password`, {
        email,
      });

      alert(
        "Check your email.\nA password reset link has been sent to your inbox."
      );

      router.replace("/signin"); // navigate to sign in
    } catch (err: any) {
      alert(
        err?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        
        {/* Header */}
        <h1 className="text-2xl font-bold mb-4">Forgot password</h1>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          Please enter your email address. You will receive a code to create a
          new password via email.
        </p>

        {/* Email Input */}
        <input
          type="email"
          placeholder="jordanhebert@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-red-500"
        />

        {/* Button */}
        <button
          onClick={handleSendResetEmail}
          disabled={!email || loading}
          className={`w-full py-2 rounded-lg text-white transition ${
            !email || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Sending..." : "Send"}
        </button>

        {/* Back to login */}
        <p className="mt-4 text-center text-sm">
          Remember your password?{" "}
          <span
            onClick={() => router.replace("/login")}
            className="text-red-600 cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
