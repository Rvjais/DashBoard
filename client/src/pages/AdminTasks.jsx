import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function me() {
  try { return JSON.parse(localStorage.getItem("user") || "{}"); }
  catch { return {}; }
}

export default function AdminTasks() {
  const user = me();
  const isAdmin = user.role === "admin";

  // Non-admins get bounced back to dashboard
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    title: "",
    department: "web",
    description: "",
    dueDate: "",
  });

  async function load() {
    try {
      setLoading(true);
      setErr("");
      const r = await fetch(import.meta.env.VITE_API_BASE + "/tasks/all", {
        credentials: "include",
      });
      if (!r.ok) throw new Error("Failed to load tasks");
      const data = await r.json();
      setList(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function create(e) {
    e.preventDefault();
    try {
      setErr("");
      const r = await fetch(import.meta.env.VITE_API_BASE + "/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d.message || "Create failed");
      }
      setForm({ title: "", department: "web", description: "", dueDate: "" });
      load();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function update(id, payload) {
    const r = await fetch(import.meta.env.VITE_API_BASE + `/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (r.ok) load();
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Tasks</h1>
          <p className="text-sm text-gray-500">Assign tasks to departments and track progress.</p>
        </div>
        <button
          onClick={load}
          className="px-3 py-2 rounded-xl border text-sm hover:bg-gray-50"
        >
          Refresh
        </button>
      </header>

      {/* Create form */}
      <form
        onSubmit={create}
        className="bg-white border rounded-2xl p-4 grid grid-cols-1 md:grid-cols-6 gap-3"
      >
        <input
          className="input md:col-span-2"
          placeholder="Title *"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <select
          className="input"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
        >
          <option value="web">Web</option>
          <option value="seo">SEO</option>
          <option value="social">Social</option>
          <option value="graphics">Graphics</option>
          <option value="ads">Ads</option>
        </select>
        <input
          className="input"
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
        <button className="btn bg-black text-white md:col-span-1">Create</button>
        <textarea
          className="input md:col-span-6"
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        {err && <div className="text-sm text-red-600 md:col-span-6">{err}</div>}
      </form>

      {/* List */}
      <div className="space-y-3">
        {loading && <div className="text-sm text-gray-500">Loading…</div>}
        {!loading && list.length === 0 && (
          <div className="text-sm text-gray-500">No tasks yet.</div>
        )}
        {list.map((t) => (
          <div key={t._id} className="bg-white border rounded-2xl p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold">{t.title}</div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full border">
                  {t.department?.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">
                  {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "No due date"}
                </span>
              </div>
            </div>

            {t.description && (
              <div className="text-sm text-gray-600 mt-1">{t.description}</div>
            )}

            {/* Status controls */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full border">{t.status}</span>
              <button
                className="text-xs px-2 py-1 rounded border"
                onClick={() => update(t._id, { status: "todo" })}
              >
                Todo
              </button>
              <button
                className="text-xs px-2 py-1 rounded border"
                onClick={() => update(t._id, { status: "in-progress" })}
              >
                In Progress
              </button>
              <button
                className="text-xs px-2 py-1 rounded border"
                onClick={() => update(t._id, { status: "done" })}
              >
                Done
              </button>
            </div>

            {/* Feedback thread */}
            <div className="mt-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const m = e.currentTarget.msg.value.trim();
                  if (!m) return;
                  update(t._id, { feedbackMessage: m });
                  e.currentTarget.reset();
                }}
              >
                <input name="msg" className="input" placeholder="Add feedback…" />
              </form>
              <ul className="mt-2 space-y-1">
                {(t.feedback || []).slice().reverse().map((fb, i) => (
                  <li key={i} className="text-sm text-gray-700">• {fb.message}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
