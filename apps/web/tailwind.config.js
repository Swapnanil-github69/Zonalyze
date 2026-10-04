/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
        // Backwards compatibility tokens
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
        serif: ["'DM Serif Display'", "'Cormorant Garamond'", "'Instrument Serif'", "Georgia", "serif"],
        display: ["'DM Serif Display'", "'Cormorant Garamond'", "Georgia", "serif"],
        cormorant: ["'Cormorant Garamond'", "'DM Serif Display'", "Georgia", "serif"],
        sans: ["'Manrope'", "'Inter'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'IBM Plex Mono'", "'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
