/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-",
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Theme-aware custom colors
        "theme-primary": "var(--theme-primary, #1890ff)",
        "theme-secondary": "var(--theme-secondary, #722ed1)",
        "theme-accent": "var(--theme-accent, #fa541c)",
        "theme-success": "var(--theme-success, #52c41a)",
        "theme-warning": "var(--theme-warning, #faad14)",
        "theme-error": "var(--theme-error, #ff4d4f)",
        "theme-info": "var(--theme-info, #1890ff)",
      },
      backgroundColor: {
        "theme-primary": "var(--bg-primary)",
        "theme-secondary": "var(--bg-secondary)",
        "theme-tertiary": "var(--bg-tertiary)",
      },
      textColor: {
        "theme-primary": "var(--text-primary)",
        "theme-secondary": "var(--text-secondary)",
        "theme-tertiary": "var(--text-tertiary)",
      },
      borderColor: {
        "theme-primary": "var(--border-primary)",
        "theme-secondary": "var(--border-secondary)",
      },
      boxShadow: {
        "theme-sm": "var(--shadow-sm)",
        "theme-md": "var(--shadow-md)",
        "theme-lg": "var(--shadow-lg)",
      },
      transitionProperty: {
        theme: "background-color, border-color, color, box-shadow",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "bounce-in": "bounceIn 0.6s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [
    // Add any additional Tailwind plugins here
  ],
};
