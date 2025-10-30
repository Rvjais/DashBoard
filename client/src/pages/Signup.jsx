import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup(){
  const [f,setF]=useState({name:"",phone:"",department:"web"});
  const nav=useNavigate();
  const ch=e=>setF(s=>({...s,[e.target.name]:e.target.value}));
  const go=async e=>{
    e.preventDefault();
    await fetch(import.meta.env.VITE_API_BASE + "/auth/signup",{
      method:"POST",headers:{ "Content-Type":"application/json" },
      credentials:"include", body:JSON.stringify(f)
    });
    await fetch(import.meta.env.VITE_API_BASE + "/auth/login",{
      method:"POST",headers:{ "Content-Type":"application/json" },
      credentials:"include", body:JSON.stringify({ phoneOrUsername:f.phone, password:f.phone })
    });
    localStorage.setItem("token","dev");
    nav("/dashboard");
  };
  return (
    <div className="card">
      <h1 className="text-2xl font-semibold text-center">Create account</h1>
      <form className="space-y-3" onSubmit={go}>
        <label className="block space-y-1"><span>Name</span><input className="input" name="name" onChange={ch} required/></label>
        <label className="block space-y-1"><span>Phone</span><input className="input" name="phone" onChange={ch} required/></label>
        <label className="block space-y-1"><span>Department</span>
          <select className="input" name="department" value={f.department} onChange={ch}>
            <option value="web">Web</option><option value="seo">SEO</option>
            <option value="social">Social</option><option value="graphics">Graphics</option>
          </select>
        </label>
        <button className="btn bg-black text-white">Sign Up</button>
      </form>
      <div className="text-sm text-center">Already have an account? <Link className="underline" to="/login">Log in</Link></div>
    </div>
  );
}
