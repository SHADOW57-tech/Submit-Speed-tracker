import { Routes, Route, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Components
import GlobalNetwork from "./components/GlobalNetwork";
import ThemeToggle from "./components/ThemeToggle";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";

// Pages
import Home from "./pages/Home";
import TrackingResults from "@/pages/TrackingResults";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";

function App() {
  return (
    <div className="min-h-screen transition-colors bg-background text-foreground">
      <GlobalNetwork />
      <ThemeToggle />
      <Header />
      <Toaster position="top-right" />

      <div className="pt-20">
        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/track/:id" element={<TrackingResults />} />

          <Route path="/login" element={<AdminLogin />} />
          <Route path="/register" element={<AdminRegister />} />

          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/user-register" element={<UserRegister />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      <footer className="py-10 text-center border-t border-border mt-20">
        <Link
          to="/login"
          className="text-muted-foreground text-xs hover:text-primary transition-colors"
        >
          SUBMIT SPEED © 2026 | Operator Terminal
        </Link>
      </footer>
    </div>
  );
}

export default App;
