import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* צבע ראשי - טורקיז/כחול עמוק (מקצועי) */
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "hsl(186, 40%, 96%)",
          100: "hsl(186, 45%, 90%)",
          200: "hsl(186, 45%, 80%)",
          300: "hsl(186, 45%, 65%)",
          400: "hsl(186, 45%, 45%)",
          500: "hsl(186, 55%, 35%)",
          600: "hsl(186, 60%, 28%)",
          700: "hsl(186, 65%, 22%)",
          800: "hsl(186, 70%, 18%)",
          900: "hsl(186, 75%, 14%)",
        },
        /* גרדיאנט הדגשה - צהוב, כתום, ורוד (CTA, אייקונים) */
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          yellow: "hsl(45, 95%, 55%)",
          orange: "hsl(25, 95%, 55%)",
          pink: "hsl(340, 82%, 60%)",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
      },
      backgroundImage: {
        "accent-gradient":
          "linear-gradient(135deg, hsl(45, 95%, 55%) 0%, hsl(25, 95%, 55%) 50%, hsl(340, 82%, 60%) 100%)",
      },
      fontFamily: {
        sans: ["var(--font-assistant)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
