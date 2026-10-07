import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { LandingThemeProvider } from "./context/LandingThemeContext";
import { ErrorBoundary } from "./components/common/ErrorBoundary";

const LandingPage = lazy(() =>
  import("./pages/LandingPage").then((m) => ({ default: m.LandingPage }))
);
const InvestigationMapPage = lazy(() =>
  import("./pages/InvestigationMapPage").then((m) => ({ default: m.InvestigationMapPage }))
);

const PageFallback = () => (
  <div className="min-h-screen w-full bg-[#161b13] flex items-center justify-center text-[#e2ffcc]">
    <div className="flex items-center gap-3 font-mono text-xs tracking-widest uppercase">
      <div className="w-2.5 h-2.5 rounded-full bg-[#e2ffcc] animate-ping" />
      <span>INITIALIZING ZONALYZE...</span>
    </div>
  </div>
);

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

  // Background preload of the heavy map chunk after initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      import("./pages/InvestigationMapPage");
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

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

  const navigateToInvestigation = useCallback((lat?: number, lon?: number) => {
    setCurrentView("investigate");
    let targetHash = "#investigate";
    if (typeof lat === "number" && typeof lon === "number") {
      targetHash = `#investigate?lat=${lat}&lon=${lon}`;
    } else if (typeof window !== "undefined" && window.location.hash.includes("lat=")) {
      targetHash = window.location.hash;
    }

    if (window.history && window.history.pushState) {
      window.history.pushState({ view: "investigate" }, "", targetHash);
    } else {
      window.location.hash = targetHash;
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
    return (
      <ErrorBoundary onReset={() => window.location.reload()}>
        <Suspense fallback={<PageFallback />}>
          <InvestigationMapPage onBackToHome={navigateToLanding} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <LandingThemeProvider>
      <Suspense fallback={<PageFallback />}>
        <LandingPage onNavigateToInvestigation={navigateToInvestigation} />
      </Suspense>
    </LandingThemeProvider>
  );
}

export default App;
