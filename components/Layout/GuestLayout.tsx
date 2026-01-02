import LandingTopbar from "./_Topbar";
import LandingFooter from "./_Footer";
import Banner from "./_Banner";
import { PublicAlbum } from "@/services/publicPageService";

interface LandingPageLayoutProps {
  children: React.ReactNode;
  pageData?: {
    title?: string;
    album?: PublicAlbum | null;
  };
}

export default function LandingPageLayout({
  children,
  pageData,
}: LandingPageLayoutProps) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <LandingTopbar />

      <Banner
        title={pageData?.title}
        album={pageData?.album}
      />

      <main className="flex-grow-1 py-5">
        <div className="container">{children}</div>
      </main>

      <LandingFooter />
    </div>
  );
}
