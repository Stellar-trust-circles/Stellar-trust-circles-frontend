import React from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import ContentSections from "./ContentSections";
import CallToAction from "./CallToAction";
import Footer from "./Footer";
import MobileNavbar from "./MobileNavbar";

interface HomePageProps {
  currentView: string;
  walletAddress: string | null;
  onNavigate: (view: string) => void;
  onConnectWallet: () => void;
}

const HomePage: React.FC<HomePageProps> = ({
  currentView,
  walletAddress,
  onNavigate,
  onConnectWallet,
}) => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#FAF8FC] text-on-surface">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(107,79,187,0.10),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(160,243,212,0.18),_transparent_30%),linear-gradient(180deg,_rgba(253,247,255,0.94),_rgba(250,248,252,1))]"
      />

      <div className="relative z-10">
        <Navbar
          currentView={currentView}
          onNavigate={onNavigate}
          onConnectWallet={onConnectWallet}
          walletAddress={walletAddress}
        />

        <main className="mx-auto max-w-container-max px-margin-mobile pb-28 pt-32 md:px-gutter">
          <HeroSection walletAddress={walletAddress} onConnectWallet={onConnectWallet} />
          <ContentSections />
          <CallToAction
            onCreateCircle={() => onNavigate("create")}
            onBrowseCircles={() => onNavigate("circles")}
          />
        </main>

        <Footer />
        <MobileNavbar currentView={currentView} onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default HomePage;
