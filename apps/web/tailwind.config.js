/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Literary Journal & Field Guide Palette
        parchment: "#fefffc",
        paper: "#ffffff",
        linen: "#f9faf7",
        inkBlack: "#171717",
        graphite: "#2c2c2c",
        charcoal: "#444141",
        ash: "#646464",
        fog: "#b4b8b4",
        mist: "#dee2de",
        twilight: "#282834",
        dusk: "#1f1f29",
        signalBlue: "#41a1cf",
        cerulean: "#0081c0",

        // Existing / Backwards compatibility tokens
        primaryBg: "#0B1719",
        altBg: "#102124",
        cardElevated: "#142629",
        cardSecondary: "#192E31",
        primaryText: "#F1F0E9",
        secondaryText: "#B8C5C2",
        mutedText: "#829492",
        subtleBorder: "rgba(190, 210, 202, 0.13)",
        sage: {
          DEFAULT: "#B6C6A3",
          light: "#DCE7CD",
          muted: "#98A885",
        },
        champagne: {
          DEFAULT: "#D1C6A5",
          light: "#E4DCBF",
          muted: "#B8AC8B",
        },
        midnight: "#0B1719",
        forestCharcoal: "#102124",
        atmosphericTeal: "#142629",
        mountainSlate: "#192E31",
        softMist: "#B8C5C2",
        warmIvory: "#F1F0E9",
        main: "#0B1719",
        section: "#102124",
        surface: "#142629",
      },
      fontFamily: {
        serif: ["'Fraunces'", "'Cormorant Garamond'", "'DM Serif Display'", "'Instrument Serif'", "Georgia", "serif"],
        display: ["'Fraunces'", "'Cormorant Garamond'", "'DM Serif Display'", "Georgia", "serif"],
        cormorant: ["'Cormorant Garamond'", "'Fraunces'", "'DM Serif Display'", "Georgia", "serif"],
        sans: ["'Inter'", "'Manrope'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'IBM Plex Mono'", "'JetBrains Mono'", "monospace"],
        space: ["'Space Grotesk'", "sans-serif"],
        outfit: ["'Outfit'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
