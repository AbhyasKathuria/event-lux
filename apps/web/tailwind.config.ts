import type { Config } from "tailwindcss";

const config: Config = {
  // Enable dark mode via class strategy
  darkMode: "class",

  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      // ─── COLOR PALETTE ────────────────────────────────────────
      colors: {
        // Light mode
        lux: {
          bg:       "#D1D5DB",  // Main background
          text:     "#2B4A7D",  // Primary text
          accent:   "#8F97A3",  // Accents / borders
          surface:  "#E8EAED",  // Card / panel backgrounds
          muted:    "#6B7280",  // Muted text
        },
        // Dark mode
        dark: {
          bg:       "#1A1C22",  // Main background
          surface:  "#22252E",  // Card / panel
          accent:   "#4B3F82",  // Purple accent
          text:     "#E8EAED",  // Primary text
          muted:    "#9CA3AF",  // Muted text
          border:   "#2E3140",  // Borders
        },
        // Semantic / brand
        brand: {
          50:  "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#4B3F82",  // Primary brand (dark accent)
          600: "#3B2F72",
          700: "#2B1F62",
          800: "#1B1040",
          900: "#0D0820",
        },
        blue: {
          50:  "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#2B4A7D",  // Primary blue (light text color)
          600: "#1E3A6E",
          700: "#162B55",
          800: "#0F1E3C",
          900: "#080F1F",
        },
      },

      // ─── TYPOGRAPHY ───────────────────────────────────────────
      fontFamily: {
        sans:    ["var(--font-sf-pro)", "SF Pro Display", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-sf-pro)", "SF Pro Display", "system-ui", "-apple-system", "sans-serif"],
        mono:    ["SF Mono", "JetBrains Mono", "Fira Code", "monospace"],
      },

      fontSize: {
        "2xs": ["0.625rem",  { lineHeight: "1rem" }],
        "xs":  ["0.75rem",   { lineHeight: "1.125rem" }],
        "sm":  ["0.875rem",  { lineHeight: "1.375rem" }],
        "base":["1rem",      { lineHeight: "1.625rem" }],
        "lg":  ["1.125rem",  { lineHeight: "1.75rem" }],
        "xl":  ["1.25rem",   { lineHeight: "1.875rem" }],
        "2xl": ["1.5rem",    { lineHeight: "2rem",    letterSpacing: "-0.01em" }],
        "3xl": ["1.875rem",  { lineHeight: "2.375rem",letterSpacing: "-0.02em" }],
        "4xl": ["2.25rem",   { lineHeight: "2.75rem", letterSpacing: "-0.025em" }],
        "5xl": ["3rem",      { lineHeight: "3.5rem",  letterSpacing: "-0.03em" }],
        "6xl": ["3.75rem",   { lineHeight: "4.25rem", letterSpacing: "-0.035em" }],
        "7xl": ["4.5rem",    { lineHeight: "5rem",    letterSpacing: "-0.04em" }],
      },

      fontWeight: {
        thin:       "100",
        extralight: "200",
        light:      "300",
        normal:     "400",
        medium:     "500",
        semibold:   "600",
        bold:       "700",
        extrabold:  "800",
        black:      "900",
      },

      letterSpacing: {
        tightest: "-0.05em",
        tighter:  "-0.03em",
        tight:    "-0.015em",
        normal:   "0",
        wide:     "0.025em",
        wider:    "0.05em",
        widest:   "0.1em",
      },

      // ─── SPACING (Apple-style generous whitespace) ─────────────
      spacing: {
        "4.5":  "1.125rem",
        "5.5":  "1.375rem",
        "6.5":  "1.625rem",
        "7.5":  "1.875rem",
        "8.5":  "2.125rem",
        "9.5":  "2.375rem",
        "13":   "3.25rem",
        "15":   "3.75rem",
        "17":   "4.25rem",
        "18":   "4.5rem",
        "22":   "5.5rem",
        "26":   "6.5rem",
        "30":   "7.5rem",
        "34":   "8.5rem",
        "38":   "9.5rem",
        "42":   "10.5rem",
        "46":   "11.5rem",
        "50":   "12.5rem",
        "screen-sm": "640px",
        "screen-md": "768px",
        "screen-lg": "1024px",
      },

      // ─── BORDER RADIUS (Apple-style rounded) ──────────────────
      borderRadius: {
        "none":  "0",
        "sm":    "8px",
        "md":    "12px",
        "lg":    "16px",
        "xl":    "20px",   // Default card radius
        "2xl":   "24px",
        "3xl":   "32px",
        "4xl":   "40px",
        "full":  "9999px",
      },

      // ─── BOX SHADOW (layered depth) ────────────────────────────
      boxShadow: {
        "sm":    "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        "md":    "0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.06)",
        "lg":    "0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.07)",
        "xl":    "0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.08)",
        "2xl":   "0 25px 50px -12px rgb(0 0 0 / 0.12)",
        "3xl":   "0 35px 60px -15px rgb(0 0 0 / 0.15)",
        // Glassmorphism shadows
        "glass":      "0 8px 32px 0 rgb(31 38 135 / 0.15)",
        "glass-dark": "0 8px 32px 0 rgb(0 0 0 / 0.4)",
        // Colored glows
        "glow-brand": "0 0 40px rgb(75 63 130 / 0.3)",
        "glow-blue":  "0 0 40px rgb(43 74 125 / 0.3)",
        // Inner shadows
        "inner-sm":   "inset 0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "inner-md":   "inset 0 2px 4px 0 rgb(0 0 0 / 0.06)",
        "none":  "none",
      },

      // ─── BACKDROP BLUR (glassmorphism) ────────────────────────
      backdropBlur: {
        "xs":   "2px",
        "sm":   "4px",
        "md":   "12px",
        "lg":   "16px",
        "xl":   "24px",
        "2xl":  "40px",
        "3xl":  "64px",
      },

      // ─── TRANSITIONS ──────────────────────────────────────────
      transitionDuration: {
        "0":    "0ms",
        "75":   "75ms",
        "100":  "100ms",
        "150":  "150ms",
        "200":  "200ms",
        "300":  "300ms",
        "500":  "500ms",
        "700":  "700ms",
        "1000": "1000ms",
      },

      transitionTimingFunction: {
        "apple":         "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "apple-spring":  "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "apple-ease-in": "cubic-bezier(0.42, 0, 1.0, 1.0)",
        "smooth":        "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      // ─── ANIMATION ────────────────────────────────────────────
      animation: {
        "fade-in":       "fadeIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
        "fade-up":       "fadeUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
        "fade-down":     "fadeDown 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
        "slide-in-left": "slideInLeft 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
        "scale-in":      "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "shimmer":       "shimmer 2s linear infinite",
        "pulse-soft":    "pulseSoft 2s ease-in-out infinite",
        "float":         "float 6s ease-in-out infinite",
      },

      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeDown: {
          "0%":   { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%":   { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%":   { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.6" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-8px)" },
        },
      },

      // ─── SCREENS ──────────────────────────────────────────────
      screens: {
        "xs":  "375px",
        "sm":  "640px",
        "md":  "768px",
        "lg":  "1024px",
        "xl":  "1280px",
        "2xl": "1440px",
        "3xl": "1920px",
      },

      // ─── Z-INDEX ──────────────────────────────────────────────
      zIndex: {
        "0":    "0",
        "10":   "10",
        "20":   "20",
        "30":   "30",
        "40":   "40",
        "50":   "50",
        "sticky":  "100",
        "overlay": "200",
        "modal":   "300",
        "toast":   "400",
        "tooltip": "500",
      },

      // ─── MAX WIDTH ────────────────────────────────────────────
      maxWidth: {
        "content":   "1200px",
        "wide":      "1440px",
        "narrow":    "680px",
        "ultrawide": "1920px",
      },
    },
  },

  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

export default config;
