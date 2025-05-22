import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AnimeForm from "@/pages/AnimeForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { apiRequest } from "./lib/queryClient";

function Router() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiRequest("GET", "/api/auth/me");
        const userData = await response.json();
        setIsAuthenticated(true);
        setIsAdmin(userData.isAdmin);
      } catch (error) {
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      setIsAuthenticated(false);
      setIsAdmin(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={handleLogout} />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/admin/login">
          {isAuthenticated && isAdmin ? 
            () => { window.location.href = "/admin"; return null; } : 
            () => <AdminLogin onLoginSuccess={() => { setIsAuthenticated(true); setIsAdmin(true); }} />
          }
        </Route>
        <Route path="/admin">
          {isAuthenticated && isAdmin ? 
            () => <AdminDashboard /> : 
            () => { window.location.href = "/admin/login"; return null; }
          }
        </Route>
        <Route path="/admin/anime/new">
          {isAuthenticated && isAdmin ? 
            () => <AnimeForm /> : 
            () => { window.location.href = "/admin/login"; return null; }
          }
        </Route>
        <Route path="/admin/anime/:id">
          {isAuthenticated && isAdmin ? 
            (params) => <AnimeForm id={parseInt(params.id)} /> : 
            () => { window.location.href = "/admin/login"; return null; }
          }
        </Route>
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
