import { getAllThemeIds, getTheme } from "@/lib/themes";
import ThemeProvider from "./components/ThemeProvider";
import RootComponent from "./components/RootComponent";

interface PageProps {
  params: { company: string };
}

export async function generateStaticParams() {
  const companies = getAllThemeIds(); // Assuming these are your company IDs
  return companies.map((company) => ({
    company, // This matches the [company] folder name
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const theme = getTheme(params.company);

  if (!theme) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: theme.content.title,
    description: theme.content.description,
    keywords: theme.features.join(", "),
  };
}

export default function Home({ params }: PageProps) {
  const theme = getTheme(params.company);

  if (!theme) {
    return <div>Page Not Found</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <RootComponent theme={theme} />
    </ThemeProvider>
  );
}
