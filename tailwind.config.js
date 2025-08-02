/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-",
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Add theme-aware custom colors
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
    },
  },
  plugins: [],
};
