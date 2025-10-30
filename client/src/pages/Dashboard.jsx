import { useEffect, useMemo, useState } from "react";

function formatDate(d = new Date()) {
  return d.toLocaleDateString(undefined, {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
}

function Progress({ value = 0 }) {
  return (
    <div className="h-2 w-full rounded bg-gray-200 overflow-hidden">
      <div
        className="h-2 rounded bg-black transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function StatCard({
  color = "bg-gray-100",
  icon = "🏷️",
  title,
  subtitle = "Monthly Targets",
  current = 0,
  target = 0,
  unit = "",
  badgeValue // 0-100
}) {
  const pct = target ? Math.round((current / target) * 100) : 0;
  const badge = badgeValue ?? pct;
  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${color}`}>
            <span>{icon}</span>
          </div>
          <div>
            <div className="font-semibold">{title}</div>
            <div className="text-xs text-gray-500">{subtitle}</div>
          </div>
        </div>
        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
          {badge}% 
        </span>
      </div>

      <div className="flex items-end gap-2">
        <div className="text-2xl font-bold">{current}</div>
        <div className="text-gray-500">/ {target} {unit}</div>
      </div>

      <Progress value={pct} />

      <div className="text-xs text-gray-500">
        {target - current > 0 ? `${target - current} ${unit || "remaining"}` : "Target achieved 🎉"}
      </div>
    </div>
  );
}

export default function Dashboard() {
  // ---- Mock metrics (replace with API later) ----
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    agency: { clients: { current: 42, target: 60 } },
    seo:    { leadsPerSite: { current: 15, target: 20 }, gmbCalls: { current: 85, target: 100 } },
    ads:    { conversions: { current: 8, target: 12 } },
    web:    { pages: { current: 165, target: 200 } },
  });

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const res = await fetch(import.meta.env.VITE_API_BASE + "/dashboard/metrics", { credentials: "include" });
      const data = await res.json();
      setMetrics(data);
      await new Promise(r => setTimeout(r, 500)); // mock delay
    } finally {
      setLoading(false);
    }
  };

  const todaysQuote = useMemo(() => ({
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    tag: "motivation"
  }), []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Top bar */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Agency Dashboard</h1>
          <p className="text-gray-500">Welcome to our agency dashboard – explore our services and capabilities</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500 text-right">
            <div className="font-medium">{new Date().toLocaleDateString(undefined, { weekday: "long" })}</div>
            <div>{formatDate()}</div>
          </div>
          <button className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm">About Us</button>
          <button className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm">Services</button>
          <button className="px-3 py-2 rounded-xl bg-blue-600 text-white text-sm">Login</button>
        </div>
      </header>

      {/* Department Targets */}
      <section className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🎯</span>
          <h2 className="text-xl font-semibold">Department Targets</h2>
          <span className="text-xs text-gray-500">2025-10 Progress Tracking</span>
          <button
            onClick={handleRefresh}
            className={`ml-auto text-xs px-3 py-1 rounded-lg border ${loading ? "opacity-60" : ""}`}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            color="bg-blue-100"
            icon="🏢"
            title="Full Agency"
            subtitle="Monthly Targets"
            current={metrics.agency.clients.current}
            target={metrics.agency.clients.target}
            unit="clients"
          />
          <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl">🟩</div>
                <div>
                  <div className="font-semibold">SEO</div>
                  <div className="text-xs text-gray-500">Monthly Targets</div>
                </div>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                {Math.round((metrics.seo.leadsPerSite.current / metrics.seo.leadsPerSite.target) * 100)}%
              </span>
            </div>

            {/* Leads per site */}
            <div>
              <div className="flex items-end gap-2">
                <div className="text-sm text-gray-600">✍️ leads per website</div>
                <div className="ml-auto text-sm text-gray-700">
                  <span className="font-semibold">{metrics.seo.leadsPerSite.current}</span> / {metrics.seo.leadsPerSite.target}
                </div>
              </div>
              <Progress value={(metrics.seo.leadsPerSite.current / metrics.seo.leadsPerSite.target) * 100} />
            </div>

            {/* Calls per GMB */}
            <div>
              <div className="flex items-end gap-2">
                <div className="text-sm text-gray-600">📞 calls per GMB</div>
                <div className="ml-auto text-sm text-gray-700">
                  <span className="font-semibold">{metrics.seo.gmbCalls.current}</span> / {metrics.seo.gmbCalls.target}
                </div>
              </div>
              <Progress value={(metrics.seo.gmbCalls.current / metrics.seo.gmbCalls.target) * 100} />
            </div>
          </div>

          <StatCard
            color="bg-purple-100"
            icon="🎯"
            title="Ads"
            subtitle="Monthly Targets"
            current={metrics.ads.conversions.current}
            target={metrics.ads.conversions.target}
            unit="conversions"
          />

          <StatCard
            color="bg-orange-100"
            icon="🖥️"
            title="Web Development"
            subtitle="Monthly Targets"
            current={metrics.web.pages.current}
            target={metrics.web.pages.target}
            unit="pages per month"
          />
        </div>
      </section>

      {/* Tips */}
      <section className="mb-4">
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <span>💡</span>
            <h3 className="font-semibold">Target Achievement Tips</h3>
          </div>
          <div className="text-sm text-gray-700 space-y-1">
            <p><span className="font-semibold">SEO Team:</span> Focus on quality lead generation and GMB optimization</p>
            <p><span className="font-semibold">Web Team:</span> Streamline development processes for faster delivery</p>
            <p><span className="font-semibold">Ads Team:</span> Prioritize conversion tracking and client retention</p>
            <p><span className="font-semibold">Agency:</span> Maintain client satisfaction while scaling operations</p>
          </div>
        </div>
      </section>

      {/* Lower grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Inspiration */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">💬</span>
            <h3 className="font-semibold">Daily Inspiration</h3>
          </div>

          <div className="rounded-2xl bg-gray-900 text-white p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Daily Inspiration</div>
              <span className="text-xs bg-emerald-600/20 text-emerald-300 px-2 py-1 rounded-full">{todaysQuote.tag}</span>
            </div>
            <blockquote className="italic text-lg leading-snug">“{todaysQuote.text}”</blockquote>
            <div className="mt-3 text-sm text-gray-300">— {todaysQuote.author}</div>
            <div className="mt-4 text-xs text-gray-400">Daily motivation to fuel your success</div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">⚡</span>
            <h3 className="font-semibold">Quick Access</h3>
            <span className="text-sm text-gray-500">Frequently used tools and features</span>
          </div>

          <ul className="space-y-3">
            <li className="flex items-center justify-between p-3 border rounded-xl hover:bg-gray-50">
              <div className="flex items-center gap-3"><span>🎮</span><span>Arcade Program</span></div>
              <button className="text-sm px-3 py-1 rounded-lg border">Open</button>
            </li>
            <li className="flex items-center justify-between p-3 border rounded-xl hover:bg-gray-50">
              <div className="flex items-center gap-3"><span>📘</span><span>Company Guidebook & Policies</span></div>
              <button className="text-sm px-3 py-1 rounded-lg border">Open</button>
            </li>

            {/* Locked examples */}
            <li className="p-4 border rounded-xl bg-gray-100 text-gray-500 text-sm text-center">
              Please log in to access this content.
            </li>
            <li className="p-4 border rounded-xl bg-gray-100 text-gray-500 text-sm text-center">
              Please log in to access this content.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
