/* brand-config.js
 * Đổi "màu công ty" tại đây (nếu muốn). Mặc định: corporate (xanh dương hiện đại).
 * App sẽ tự áp vào CSS variables cho toàn bộ site.
 */
window.BRAND_CONFIG = {
  defaultPalette: "corporate",
  palettes: {
    corporate: {
      label: "Corporate blue",
      light: {
        bg1: "#F7FAFF",
        bg2: "#EEF2FF",
        primary: "#1D4ED8",
        secondary: "#0EA5E9",
        accent: "#7C3AED",
        text: "#0F172A",
        muted: "#475569",
        card: "rgba(255,255,255,0.86)",
        card2: "rgba(255,255,255,0.72)",
        border: "rgba(15,23,42,0.12)",
        good: "#10B981",
        warn: "#F59E0B",
        bad: "#EF4444"
      },
      dark: {
        bg1: "#0B1220",
        bg2: "#0F172A",
        primary: "#60A5FA",
        secondary: "#22D3EE",
        accent: "#A78BFA",
        text: "#E5E7EB",
        muted: "#94A3B8",
        card: "rgba(255,255,255,0.08)",
        card2: "rgba(255,255,255,0.06)",
        border: "rgba(148,163,184,0.18)",
        good: "#34D399",
        warn: "#FBBF24",
        bad: "#F87171"
      }
    },
    slate: {
      label: "Slate",
      light: {
        bg1: "#F8FAFC",
        bg2: "#EFF6FF",
        primary: "#0F172A",
        secondary: "#334155",
        accent: "#2563EB",
        text: "#0F172A",
        muted: "#475569",
        card: "rgba(255,255,255,0.86)",
        card2: "rgba(255,255,255,0.72)",
        border: "rgba(15,23,42,0.12)",
        good: "#10B981",
        warn: "#F59E0B",
        bad: "#EF4444"
      },
      dark: {
        bg1: "#0B1220",
        bg2: "#0B1220",
        primary: "#E2E8F0",
        secondary: "#94A3B8",
        accent: "#60A5FA",
        text: "#E5E7EB",
        muted: "#94A3B8",
        card: "rgba(255,255,255,0.08)",
        card2: "rgba(255,255,255,0.06)",
        border: "rgba(148,163,184,0.18)",
        good: "#34D399",
        warn: "#FBBF24",
        bad: "#F87171"
      }
    }
  }
};
