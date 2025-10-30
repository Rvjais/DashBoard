import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login(){
  const [f,setF]=useState({ phoneOrUsername:"", password:"" });
  const nav=useNavigate();
  const ch=e=>setF(s=>({...s,[e.target.name]:e.target.value}));
  const go=async e=>{
    e.preventDefault();
    const r = await fetch(import.meta.env.VITE_API_BASE + "/auth/login",{
      method:"POST", headers:{ "Content-Type":"application/json" },
      credentials:"include", body:JSON.stringify(f)
    });
    if(!r.ok){ alert("Invalid credentials"); return; }
    localStorage.setItem("token","dev");
    nav("/dashboard");
  };
  return (
    <div className="card">
      <h1 className="text-2xl font-semibold text-center">Welcome back</h1>
      <form className="space-y-3" onSubmit={go}>
        <label className="block space-y-1"><span>Phone or Username</span><input className="input" name="phoneOrUsername" onChange={ch} required/></label>
        <label className="block space-y-1"><span>Password</span><input className="input" type="password" name="password" onChange={ch} required/></label>
        <button className="btn bg-black text-white">Log In</button>
      </form>
      <div className="text-sm text-center">New here? <Link className="underline" to="/signup">Create account</Link></div>
    </div>
  );
}
