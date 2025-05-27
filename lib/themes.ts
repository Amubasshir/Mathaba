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
  website?: string;
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
    colorContainer: "container-purple",
    images: {
      hero: "/images/blue/hero.jpg",
      gallery: ["/images/blue/1.jpg", "/images/blue/2.jpg"],
      logo: "/rifad.png",
    },
    features: ["analytics", "charts", "reports"],
    website: "https://rifad.com.sa",
    content: {
      title: "Mathaba Rifad",
      subtitle: "Dive Deep into Data",
      description: "Professional analytics solution for maritime businesses",
      cta: "Start Analytics",
    },
  },

  alrifadah: {
    id: "alrifadah",
    name: "Mathaba AlRifadah",
    colors: {
      primary: "#0066CC",
      secondary: "#004499",
      background: "#F0F8FF",
      text: "#1A1A1A",
      accent: "#00AAFF",
    },
    colorContainer: "container-purple",
    images: {
      hero: "/images/blue/hero.jpg",
      gallery: ["/images/blue/1.jpg", "/images/blue/2.jpg"],
      logo: "/rifad.png",
    },
    features: ["analytics", "charts", "reports"],
    website: "https://alrifadah.com.sa",
    content: {
      title: "Mathaba AlRifadah",
      subtitle: "Dive Deep into Data",
      description: "Professional analytics solution for maritime businesses",
      cta: "Start Analytics",
    },
  },

  thaker: {
    id: "thaker",
    name: "Mathaba Thaker",
    colors: {
      primary: "#0066CC",
      secondary: "#004499",
      background: "#F0F8FF",
      text: "#1A1A1A",
      accent: "#00AAFF",
    },
    colorContainer: "container-purple",
    images: {
      hero: "/images/blue/hero.jpg",
      gallery: ["/images/blue/1.jpg", "/images/blue/2.jpg"],
      logo: "/rifad.png",
    },
    features: ["analytics", "charts", "reports"],
    website: "https://karamthakher.sa",
    content: {
      title: "Mathaba Thaker",
      subtitle: "Dive Deep into Data",
      description: "Professional analytics solution for maritime businesses",
      cta: "Start Analytics",
    },
  },

  arbhaj: {
    id: "arbhaj",
    name: "Mathaba Arbhaj",
    colors: {
      primary: "#0066CC",
      secondary: "#004499",
      background: "#F0F8FF",
      text: "#1A1A1A",
      accent: "#00AAFF",
    },
    colorContainer: "container-purple",
    images: {
      hero: "/images/blue/hero.jpg",
      gallery: ["/images/blue/1.jpg", "/images/blue/2.jpg"],
      logo: "/rifad.png",
    },
    features: ["analytics", "charts", "reports"],
    website: "https://www.arbhaj.com/%D8%B4%D8%B1%D9%83%D8%A9-%D8%A7%D9%83%D8%B1%D8%A7%D9%85-%D8%A7%D9%84%D8%B6%D9%8A%D9%81-%D9%84%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D8%A9",
    content: {
      title: "Mathaba Arbhaj",
      subtitle: "Dive Deep into Data",
      description: "Professional analytics solution for maritime businesses",
      cta: "Start Analytics",
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
