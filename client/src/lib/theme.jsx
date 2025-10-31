import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext({ theme: "light", toggle: () => {} });

export function useTheme(){
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }){
  const [theme, setTheme] = useState(() => {
    try {
      const t = localStorage.getItem("theme");
      if (t === "dark" || t === "light") return t;
    } catch {}
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    if (theme === 'dark') root.classList.add('dark');
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  const value = useMemo(() => ({ theme, toggle: () => setTheme(t => t === 'dark' ? 'light' : 'dark') }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}


