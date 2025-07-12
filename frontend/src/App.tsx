
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
import Login from "./pages/Login";
// import Profile from "./pages/Profile";
// import SwapRequests from "./pages/SwapRequests";
// import AdminDashboard from "./pages/AdminDashboard";
// import NotFound from "./pages/NotFound";
// import Layout from "./components/Layout";
// import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="swap-requests" element={<SwapRequests />} />
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
            <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
