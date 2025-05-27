// lib/themes.ts
export interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  variants?: string[];
  colorContainer?: string;
  images: {
    hero: string;
    gallery: string[];
    logo: string;
  };
  features: string[];
  content: {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
  };
}

export const themes: Record<string, ThemeConfig> = {
  rifad: {
    id: "rifad",
    name: "Mathaba Rifad",
    colors: {
      primary: "#0066CC",
      secondary: "#004499",
      background: "#F0F8FF",
      text: "#1A1A1A",
      accent: "#00AAFF",
    },
    colorContainer: "container-red",
    images: {
      hero: "/images/blue/hero.jpg",
      gallery: ["/images/blue/1.jpg", "/images/blue/2.jpg"],
      logo: "/rifad.png",
    },
    features: ["analytics", "charts", "reports"],
    content: {
      title: "Mathaba Rifad",
      subtitle: "Dive Deep into Data",
      description: "Professional analytics solution for maritime businesses",
      cta: "Start Analytics",
    },
  },
  red: {
    id: "red",
    name: "Fire Theme",
    colors: {
      primary: "#CC0000",
      secondary: "#990000",
      background: "#FFF5F5",
      text: "#1A1A1A",
      accent: "#FF3333",
    },
    images: {
      hero: "/images/red/hero.jpg",
      gallery: ["/images/red/1.jpg", "/images/red/2.jpg"],
      logo: "/images/red/logo.svg",
    },
    features: ["gaming", "tournaments", "leaderboards"],
    content: {
      title: "Fire Gaming Hub",
      subtitle: "Ignite Your Passion",
      description: "Ultimate gaming platform for competitive players",
      cta: "Join Tournament",
    },
  },
  green: {
    id: "green",
    name: "Nature Theme",
    colors: {
      primary: "#00AA00",
      secondary: "#008800",
      background: "#F0FFF0",
      text: "#1A1A1A",
      accent: "#33CC33",
    },
    images: {
      hero: "/images/green/hero.jpg",
      gallery: ["/images/green/1.jpg", "/images/green/2.jpg"],
      logo: "/images/green/logo.svg",
    },
    features: ["sustainability", "tracking", "community"],
    content: {
      title: "EcoTracker Platform",
      subtitle: "Grow Sustainably",
      description: "Environmental tracking for conscious businesses",
      cta: "Go Green",
    },
  },
};

export function getAllThemeIds(): string[] {
  return Object.keys(themes);
}

export function getTheme(id: string): ThemeConfig | null {
  if (!id) return null;
  return themes[id] || null;
}
