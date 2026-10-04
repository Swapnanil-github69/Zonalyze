import { useState, useEffect, useCallback } from "react";
import { LandingPage } from "./pages/LandingPage";
import { InvestigationMapPage } from "./pages/InvestigationMapPage";

export function App() {
  const getInitialView = (): "landing" | "investigate" => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes("investigate") || hash.includes("investigate")) {
        return "investigate";
      }
    }
    return "landing";
  };

  const [currentView, setCurrentView] = useState<"landing" | "investigate">(getInitialView);

  // Synchronize browser history and hash navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes("investigate") || hash.includes("investigate")) {
        setCurrentView("investigate");
      } else {
        setCurrentView("landing");
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
    };
  }, []);

  const navigateToInvestigation = useCallback(() => {
    setCurrentView("investigate");
    if (window.history && window.history.pushState) {
      window.history.pushState({ view: "investigate" }, "", "#investigate");
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const navigateToLanding = useCallback(() => {
    setCurrentView("landing");
    if (window.history && window.history.pushState) {
      window.history.pushState({ view: "landing" }, "", "#home");
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  if (currentView === "investigate") {
    return <InvestigationMapPage onBackToHome={navigateToLanding} />;
  }

  return <LandingPage onNavigateToInvestigation={navigateToInvestigation} />;
}

export default App;
