import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg0: "var(--bg-0)",
        text0: "var(--text-0)",
        text1: "var(--text-1)",
        border0: "var(--border-0)",
        accent0: "var(--accent-0)",
        accent1: "var(--accent-1)",
        danger0: "var(--danger-0)",
        success0: "var(--success-0)",
        glassTint: "var(--glass-tint)",
        glassFill: "var(--glass-fill)",
        glassFillStrong: "var(--glass-fill-strong)",
      },
      borderRadius: {
        panel: "var(--r-1)",
        sheet: "var(--r-2)",
        pill: "var(--r-pill)",
      },
      boxShadow: {
        glass1: "var(--shadow-1)",
        glass2: "var(--shadow-2)",
      },
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
      },
    },
  },
} satisfies Config;

