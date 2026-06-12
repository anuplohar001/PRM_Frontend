import { BrowserRouter } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import AppRoutes from "./routes";
import { AlertProvider } from "./components/CustomAlert/AlertContext"
import "./App.css"
function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <AlertProvider>
        <AppRoutes theme={theme} onToggleTheme={toggleTheme} />
      </AlertProvider>
    </BrowserRouter>
  );
}

export default App;
