import AppRoutes from "./Routes.jsx";
import { ThemeProvider } from "./lib/theme.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}
