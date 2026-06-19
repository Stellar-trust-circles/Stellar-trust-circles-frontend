import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import CirclesView from "./components/CirclesView";
import CreateCircle from "./components/CreateCircle";
import Footer from "./components/Footer";
import MobileNavbar from "./components/MobileNavbar";
import WalletView from "./components/WalletView";
import ProfileView from "./components/ProfileView";
import { useWallet } from "./hooks/useWallet";

function App() {
  const [view, setView] = useState<string>("home");
  const { address: walletAddress, connect: connectWallet } = useWallet();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  useEffect(() => {
    const syncViewFromLocation = () => {
      const path = window.location.pathname.substring(1);
      setView(["circles", "create", "wallet", "profile"].includes(path) ? path : "home");
    };

    syncViewFromLocation();
    window.addEventListener("popstate", syncViewFromLocation);
    return () => window.removeEventListener("popstate", syncViewFromLocation);
  }, []);

  const handleSetView = (newView: string) => {
    setView(newView);
    window.history.pushState({}, "", `/${newView === "home" ? "" : newView}`);
  };

  if (view === "home") {
    return (
      <HomePage
        currentView={view}
        walletAddress={walletAddress}
        onNavigate={handleSetView}
        onConnectWallet={() => void connectWallet()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8FC] text-on-surface transition-colors duration-200">
      <Navbar
        currentView={view}
        onNavigate={handleSetView}
        onConnectWallet={() => void connectWallet()}
        walletAddress={walletAddress}
      />

      <main className="mx-auto max-w-container-max px-margin-mobile pb-24 pt-32 md:px-gutter">
        {view === "circles" && <CirclesView />}
        {view === "create" && <CreateCircle setView={handleSetView} />}
        {view === "wallet" && <WalletView />}
        {view === "profile" && <ProfileView />}
      </main>

      <Footer />
      <MobileNavbar currentView={view} onNavigate={handleSetView} />
    </div>
  );
}

export default App;
