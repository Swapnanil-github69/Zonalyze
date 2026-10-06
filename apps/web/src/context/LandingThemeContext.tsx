import React, { createContext, useContext, useState, useEffect } from "react";

export type LandingTheme = "dark" | "literary";

interface LandingThemeContextType {
  theme: LandingTheme;
  isLiterary: boolean;
  toggleTheme: () => void;
  setTheme: (theme: LandingTheme) => void;
}

const LandingThemeContext = createContext<LandingThemeContextType | undefined>(undefined);

export const LandingThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<LandingTheme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("zonalyze_landing_theme");
      if (saved === "literary" || saved === "dark") {
        return saved;
      }
    }
    return "dark";
  });

  const setTheme = (newTheme: LandingTheme) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("zonalyze_landing_theme", newTheme);
    }
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "literary" : "dark";
    setTheme(next);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "literary") {
      root.classList.add("theme-literary");
      root.classList.remove("theme-dark");
    } else {
      root.classList.add("theme-dark");
      root.classList.remove("theme-literary");
    }
  }, [theme]);

  const isLiterary = theme === "literary";

  return (
    <LandingThemeContext.Provider value={{ theme, isLiterary, toggleTheme, setTheme }}>
      {children}
    </LandingThemeContext.Provider>
  );
};

export const useLandingTheme = (): LandingThemeContextType => {
  const context = useContext(LandingThemeContext);
  if (!context) {
    throw new Error("useLandingTheme must be used within a LandingThemeProvider");
  }
  return context;
};
