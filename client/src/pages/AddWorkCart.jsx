import { useState } from "react";


function AddWorkCard({ onAdded }) {
const [title, setTitle] = useState("");
const [department, setDepartment] = useState("web");
const [metric, setMetric] = useState("");
const [value, setValue] = useState(1);
const [saving, setSaving] = useState(false);
const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    try {
      setSaving(true);
      const body = { title: title.trim(), department };
      if (metric) {
        body.metric = metric;
        body.value = Number(value) || 1;
      }

      const res = await fetch(import.meta.env.VITE_API_BASE + "/work", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to save work");
      }

      setTitle("");
      setMetric("");
      setValue(1);

      // notify parent so it can refresh metrics
      onAdded?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <span>📝</span>
        <h3 className="font-semibold">Add Work Update</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
        <input
          className="input lg:col-span-3"
          placeholder="What did you do?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="input lg:col-span-1"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="web">Web</option>
          <option value="seo">SEO</option>
          <option value="social">Social</option>
          <option value="graphics">Graphics</option>
          <option value="ads">Ads</option>
        </select>

        <select
          className="input lg:col-span-1"
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
        >
          <option value="">No metric</option>
          <option value="pages">Pages</option>
          <option value="leads">Leads</option>
          <option value="gmb_calls">GMB Calls</option>
          <option value="conversions">Conversions</option>
        </select>

        <input
          className="input lg:col-span-1"
          type="number"
          min="1"
          value={value}
          onChange={(e) => setValue(+e.target.value || 1)}
          disabled={!metric}
          placeholder="Value"
        />
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          className="btn bg-black text-white w-auto px-4"
          type="submit"
          disabled={saving}
        >
          {saving ? "Saving..." : "Add"}
        </button>
        {error && <span className="text-sm text-red-600">{error}</span>}
        {!metric && <span className="text-xs text-gray-500">Tip: choose a metric to update dashboard KPIs.</span>}
      </div>
    </form>
  );
}

export default AddWorkCard;