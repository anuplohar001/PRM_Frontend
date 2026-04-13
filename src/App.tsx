import { AlertProvider } from "./components/CustomAlert/AlertContext"
import AppRoutes from "./routes/Routes"
import "./styles/utils.css"

const App = () => {
  return <>
    <AlertProvider>
      <AppRoutes />
    </AlertProvider>
  </>
}

export default App