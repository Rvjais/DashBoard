import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  // --- All component logic is unchanged ---
  const [f, setF] = useState({ phoneOrUsername: "", password: "" });
  const nav = useNavigate();

  const ch = (e) => setF((s) => ({ ...s, [e.target.name]: e.target.value }));

  const go = async (e) => {
    e.preventDefault();

    try {
      const r = await fetch(import.meta.env.VITE_API_BASE + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(f),
      });

      if (!r.ok) {
        alert("Invalid credentials");
        return;
      }

      const data = await r.json();

      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", "dev");

      nav("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed, try again later.");
    }
  };
  // --- End of unchanged logic ---

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-[#0b0c10] dark:to-[#0e1116] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-2xl shadow">⚡</div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to continue</p>
        </div>

        <div className="rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur shadow-sm p-5">
          <form className="space-y-4" onSubmit={go}>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Phone or Username</label>
              <input
                className="mt-1 w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/30"
                name="phoneOrUsername"
                value={f.phoneOrUsername}
                onChange={ch}
                placeholder="e.g. john or +911234567890"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
              <input
                className="mt-1 w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/30"
                type="password"
                name="password"
                value={f.password}
                onChange={ch}
                placeholder="Your password"
                required
              />
            </div>

            <button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 font-medium transition">Log In</button>
          </form>

          <div className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
            New here? <Link className="text-blue-600 hover:underline" to="/signup">Create account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}