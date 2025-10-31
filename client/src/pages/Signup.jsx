import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup(){
  const [f,setF]=useState({name:"",phone:"",department:"web"});
  const [err, setErr] = useState("");
  const nav=useNavigate();
  const ch=e=>setF(s=>({...s,[e.target.name]:e.target.value}));
  const go=async e=>{
    e.preventDefault();
    setErr("");
    // 1) Sign up
    const s = await fetch(import.meta.env.VITE_API_BASE + "/auth/signup",{
      method:"POST",headers:{ "Content-Type":"application/json" },
      credentials:"include", body:JSON.stringify(f)
    });
    if (!s.ok) {
      const d = await s.json().catch(()=>({}));
      setErr(d.message || "Signup failed. Try a different name/phone.");
      return;
    }
    // 2) Immediately log in using phone as username and password per server logic
    const l = await fetch(import.meta.env.VITE_API_BASE + "/auth/login",{
      method:"POST",headers:{ "Content-Type":"application/json" },
      credentials:"include", body:JSON.stringify({ phoneOrUsername:f.phone, password:f.phone })
    });
    if (!l.ok) {
      const d = await l.json().catch(()=>({}));
      setErr(d.message || "Auto login failed. Please try logging in.");
      return;
    }
    const user = await l.json();
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token","dev");
    nav("/dashboard");
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-[#0b0c10] dark:to-[#0e1116] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-2xl shadow">✨</div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Create account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Join the workspace</p>
        </div>

        <div className="rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur shadow-sm p-6">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={go}>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
              <input className="mt-1 w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/30" name="name" onChange={ch} required/>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Phone</label>
              <input className="mt-1 w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/30" name="phone" onChange={ch} required/>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Department</label>
              <select className="mt-1 w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/30" name="department" value={f.department} onChange={ch}>
                <option value="web">Web</option>
                <option value="seo">SEO</option>
                <option value="social">Social</option>
                <option value="graphics">Graphics</option>
              </select>
            </div>

            <button className="md:col-span-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 font-medium transition">Sign Up</button>
          </form>

          {err && <div className="mt-3 text-sm text-red-600">{err}</div>}

          <div className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
            Already have an account? <Link className="text-blue-600 hover:underline" to="/login">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
