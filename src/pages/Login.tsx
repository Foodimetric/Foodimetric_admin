import { useState } from "react";
import foodimetricLogo from "../assets/logo-alt.png"; // Adjust path as needed

const FOODIMETRIC_HOST_URL = "https://foodimetric-backend.onrender.com";

const Login = () => {
    const [role, setRole] = useState("admin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

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

            const data: { token: string; name: string; role: string  } = await response.json();

            localStorage.setItem("authToken", data.token);
            localStorage.setItem("userRole", data.role); // Store role for access control

            alert(`Welcome, ${data.name}!`);

            // Redirect to dashboard (features are controlled by role)
            window.location.href = "/dashboard";
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
            <div className="relative w-full max-w-md p-8 rounded-xl shadow-lg bg-white bg-opacity-10 backdrop-blur-lg border border-white/20">
                <img src={foodimetricLogo} alt="Foodimetric Logo" className="w-24 h-auto mx-auto" />
                <h2 className="text-center text-3xl font-extrabold text-white">Admin Login</h2>

                {error && <p className="text-red-400 text-center mt-2">{error}</p>}

                <form className="mt-6 space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium text-white">Select Role</label>
                        <select
                            title="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-transparent text-white focus:outline-none"
                        >
                            <option value="admin" className="text-black">Admin</option>
                            <option value="super-admin" className="text-black">Super Admin</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white">Email address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-transparent text-white placeholder-gray-300 focus:outline-none"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-transparent text-white placeholder-gray-300 focus:outline-none"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 p-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none transition-all duration-300 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
                                    ></path>
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;