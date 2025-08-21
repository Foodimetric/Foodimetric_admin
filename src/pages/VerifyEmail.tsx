import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FOODIMETRIC_HOST_URL } from "../utils";
import { useAnalytics } from "../contexts/AnalyticsContext";

const VerifyEmail = () => {
  const { refetch } = useAnalytics(); 
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(300);
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!email) navigate("/login"); // If no email, redirect back
    toast.info(`OTP sent to ${email}. Please verify.`);
  }, [email, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (resending) return;
    setResending(true);

    try {
      const response = await fetch(`${FOODIMETRIC_HOST_URL}/admin/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to resend OTP");
      }

      // If API returns success
      toast.success(`New OTP sent to ${email}.`);
      setTimer(300);
    } catch (error: any) {
      toast.error(error.message || "An error occurred while resending OTP.");
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter the complete OTP.");
      return;
    }

    setVerifying(true);
    try {
      const response = await fetch(
        `${FOODIMETRIC_HOST_URL}/admin/login-verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: otpCode,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid verification code");
      }

      const data = await response.json();

      // Store token if API returns one
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userRole", data.role);
      }
      await refetch()
      
      toast.success("Email verified successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error: any) {
      toast.error(error.message || "An error occurred during verification.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <ToastContainer />
      <div className="relative w-full max-w-md p-8 rounded-xl shadow-lg bg-white bg-opacity-10 backdrop-blur-lg border border-white/20 text-center">
        <h2 className="text-2xl font-bold text-white mb-6">
          Verify Your Email
        </h2>
        <p className="text-gray-200 mb-4">
          Enter the 6-digit code sent to <b>{email}</b>
        </p>

        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 text-center text-lg font-bold rounded-md border border-gray-300"
            />
          ))}
        </div>

        <div className="mb-4 text-gray-200">
          {timer > 0 ? (
            <p>
              Code expires in{" "}
              <span className="font-bold">
                {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
              </span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-indigo-300 hover:text-indigo-100"
            >
              {resending ? "Resending..." : "Resend Code"}
            </button>
          )}
        </div>

        <button
          onClick={handleVerify}
          disabled={verifying}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md"
        >
          {verifying ? "Verifying..." : "Verify Email"}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
