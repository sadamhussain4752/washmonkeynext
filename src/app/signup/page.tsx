"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/logo.png";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function SignUpPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          mobilenumber: mobileNumber,
          email,
          password,
          UserType: "3",
          lang: "1",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", data.user._id);
        localStorage.removeItem("empId");

        router.replace("/"); // or /dashboard
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl p-6 shadow">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src={Logo}
            alt="Wash Monkey"
            width={80}
            height={80}
            className="rounded-full"
          />
          <h2 className="mt-3 text-xl font-semibold text-red-600">
            Wash Monkey
          </h2>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

        {/* Inputs */}
        <div className="space-y-3">
          <input
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="input"
          />

          <input
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="input"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />

          <input
            placeholder="Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="input"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input pr-10"
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-2 text-sm text-gray-500"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full mt-6 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {/* Footer */}
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <span
            onClick={() => router.replace("/signin")}
            className="text-red-600 cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </div>

      {/* Simple input styling */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          outline: none;
        }
        .input:focus {
          border-color: #b81414;
        }
      `}</style>
    </div>
  );
}
