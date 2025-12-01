import { useState } from "react";
import { useNavigate } from "react-router-dom";
import foodimetricLogo from "/img/logo.png";
import { FOODIMETRIC_HOST_URL } from "../utils";
import { toast, ToastContainer } from "react-toastify";
// import { useAnalytics } from "../contexts/AnalyticsContext";

const Login = () => {
  const navigate = useNavigate();
  // const { clearData } = useAnalytics();
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // clearData();

    try {
      const response = await fetch(`${FOODIMETRIC_HOST_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid login credentials");
      }

      const data = await response.json();

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userRole", data.role);

      toast.success(data.message || "Verification code sent to your email.");
      setTimeout(() => {
        navigate("/verify-email", { state: { email } });
      }, 1500);
    } catch (error: any) {
      setError(error.message || "An error occurred.");
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <ToastContainer />
      <div className="relative w-full max-w-md p-8 rounded-xl shadow-lg bg-white bg-opacity-10 backdrop-blur-lg border border-white/20">
        <img
          src={foodimetricLogo}
          alt="Foodimetric Logo"
          className="w-24 h-auto mx-auto"
        />
        <h2 className="text-center text-3xl font-extrabold text-white">
          Admin Login
        </h2>

        {error && <p className="text-red-400 text-center mt-2">{error}</p>}

        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-white">
              Select Role
            </label>
            <select
              title="Select Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-transparent text-white"
            >
              <option value="admin" className="text-black">
                Admin
              </option>
              <option value="super-admin" className="text-black">
                Super Admin
              </option>
              <option value="marketing" className="text-black">
                Marketing
              </option>
              <option value="developer" className="text-black">
                Developer
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-transparent text-white"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-transparent text-white"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 text-white rounded-md ${loading
              ? "cursor-wait bg-gray-500"
              : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
