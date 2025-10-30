const base = import.meta.env.VITE_API_BASE;
export async function api(path, { method='GET', body }={}) {
  const res = await fetch(`${base}${path}`, {
    method, headers: { 'Content-Type': 'application/json' },
    credentials: 'include', body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(()=> ({}));
  if (!res.ok) throw new Error(data?.message || 'API error');
  return data;
}
