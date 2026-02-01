"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import {
  useLoginUserMutation,
  useVerifyOtpMutation,
} from "@/store/slices/apiSlice";
import { BASE_URL } from "../utils/config";
import { useRouter } from "next/navigation";

type LoginResponse = {
  userId: string;
  UserType?: string;
};

type ApiError = {
  data?: {
    message?: string;
  };
};

const SignIn: React.FC = () => {
  const router = useRouter();

  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const [verifyOtp, { isLoading: verifyingOtp }] = useVerifyOtpMutation();

  const [emailOrMobile, setEmailOrMobile] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [otpModalVisible, setOtpModalVisible] = useState<boolean>(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState<string>("");

const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const isMobile = (v: string): boolean => /^[0-9]{10}$/.test(v);
  const isEmail = (v: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const loginWithLocation = async (userId: string): Promise<void> => {
    await axios.post(`${BASE_URL}api/activity/login`, { userId });
  };

  const handleLogin = async (): Promise<void> => {
    if (!emailOrMobile) {
      alert("Please enter email or mobile");
      return;
    }

    try {
      // 📱 Mobile login
      if (isMobile(emailOrMobile)) {
        const payload : any=
          password.length > 0
            ? { mobilenumber: emailOrMobile, password, isMobileLogin: false }
            : { mobilenumber: emailOrMobile, isMobileLogin: true };

        const res = (await loginUser(payload).unwrap()) as LoginResponse;

        if (!password) {
          setOtpModalVisible(true);
          return;
        }

        localStorage.setItem("userId", res.userId);
        router.push("/");
        return;
      }

      // 📧 Email login
      if (isEmail(emailOrMobile)) {
        if (!password) {
          alert("Password required");
          return;
        }

        const res = (await loginUser({
          email: emailOrMobile,
          password,
        }).unwrap()) as LoginResponse;

        if (res.UserType !== "3") {
          await loginWithLocation(res.userId);
        }

        localStorage.setItem("userId", res.userId);
        router.push("/");
        return;
      }

      alert("Invalid email or mobile number");
    } catch (err) {
      const apiError = err as ApiError;
      alert(apiError?.data?.message || "Login failed");
    }
  };

  const handleVerifyOtp = async (): Promise<void> => {
    const otp = otpDigits.join("");

    if (otp.length !== 6) {
      setOtpError("Enter valid 6-digit OTP");
      return;
    }

    try {
      const res = (await verifyOtp({
        mobilenumber: emailOrMobile,
        otp,
      }).unwrap()) as LoginResponse;

      localStorage.setItem("userId", res.userId);
      router.push("/");
    } catch {
      setOtpError("Invalid OTP");
    }
  };

  const handleOtpChange = (value: string, index: number): void => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Welcome Back 👋</h2>
        <p className="subtitle">Login to continue</p>

        <input
          className="input"
          placeholder="Email or Mobile"
          value={emailOrMobile}
          onChange={(e) => setEmailOrMobile(e.target.value)}
        />

        <div className="password-box">
          <input
            className="input"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="toggle"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <button
          className="btn-primary"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading
            ? "Signing in..."
            : isMobile(emailOrMobile) && !password
            ? "Send OTP"
            : "Sign In"}
        </button>

        {error && (
          <p className="error">
            {(error as ApiError)?.data?.message}
          </p>
        )}

        <div className="links">
          <span onClick={() => router.push("/forgot-password")}>
            Forgot password?
          </span>
          <span onClick={() => router.push("/signup")}>
            Create account
          </span>
        </div>
      </div>

      {/* OTP MODAL */}
      {otpModalVisible && (
        <div className="otp-modal">
          <div className="otp-card">
            <h3>Verify OTP</h3>

            <div className="otp-inputs">
              {otpDigits.map((digit, i) => (
                <input
                  key={i}
ref={(el) => {
  inputs.current[i] = el;
}}
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleOtpChange(e.target.value, i)
                  }
                />
              ))}
            </div>

            {otpError && <p className="error">{otpError}</p>}

            <button
              className="btn-primary"
              onClick={handleVerifyOtp}
              disabled={verifyingOtp}
            >
              Verify OTP
            </button>

            <button
              className="btn-secondary"
              onClick={() => setOtpModalVisible(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
