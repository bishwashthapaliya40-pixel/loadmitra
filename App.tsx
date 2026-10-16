import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/marketplace/HeroSection';
import { CargoMarketplace } from './components/marketplace/CargoMarketplace';
import { VehicleFleetDirectory } from './components/fleet/VehicleFleetDirectory';
import { ReturnLoadMatcher } from './components/marketplace/ReturnLoadMatcher';
import { TripTrackerAndPOD } from './components/shipment/TripTrackerAndPOD';
import { DigitalChallanView } from './components/shipment/DigitalChallanView';
import { InsuranceManager } from './components/insurance/InsuranceManager';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BiddingNegotiationModal } from './components/marketplace/BiddingNegotiationModal';
import { PostCargoModal } from './components/marketplace/PostCargoModal';
import { RegisterVehicleModal } from './components/fleet/RegisterVehicleModal';
import { EmergencySOSModal } from './components/emergency/EmergencySOSModal';
import { AuthModal } from './components/auth/AuthModal';
import { SplashScreen } from './components/common/SplashScreen';
import { UserRoleDashboardBanner } from './components/dashboard/UserRoleDashboardBanner';
import { CheckCircle2, Info } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    selectedCargoForBidding,
    setSelectedCargoForBidding,
    selectedBookingForChallan,
    setSelectedBookingForChallan,
    isPostCargoModalOpen,
    setIsPostCargoModalOpen,
    isRegisterVehicleModalOpen,
    setIsRegisterVehicleModalOpen,
    isEmergencyModalOpen,
    setIsEmergencyModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    toastMessage,
    t
  } = useApp();

  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans'] text-slate-900">
      {/* Splash Screen on load */}
      {showSplash && <SplashScreen onDismiss={() => setShowSplash(false)} />}

      {/* Top Navigation */}
      <Navbar />

      {/* User Role & Operational Profile Banner */}
      <UserRoleDashboardBanner />

      {/* Demonstration Data Banner with Dismissible Disclaimer */}
      <div className="bg-orange-50/70 border-b border-orange-200/60 text-xs py-2 px-4 text-center text-orange-950 font-medium">
        <span className="font-bold text-orange-800 uppercase tracking-wide mr-1.5">
          {t.demoBadge}:
        </span>
        <span>{t.demoBannerDesc}</span>
      </div>

      {/* Main Viewport Container */}
      <main className="flex-1">
        {activeTab === 'marketplace' && (
          <div>
            <HeroSection />
            <CargoMarketplace />
          </div>
        )}

        {activeTab === 'vehicles' && <VehicleFleetDirectory />}

        {activeTab === 'return_trips' && <ReturnLoadMatcher />}

        {activeTab === 'shipments' && <TripTrackerAndPOD />}

        {activeTab === 'insurance' && <InsuranceManager />}

        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Interactive Modals */}
      {selectedCargoForBidding && (
        <BiddingNegotiationModal
          cargo={selectedCargoForBidding}
          onClose={() => setSelectedCargoForBidding(null)}
        />
      )}

      {selectedBookingForChallan && (
        <DigitalChallanView
          booking={selectedBookingForChallan}
          onClose={() => setSelectedBookingForChallan(null)}
        />
      )}

      {isPostCargoModalOpen && (
        <PostCargoModal
          onClose={() => setIsPostCargoModalOpen(false)}
          onCreated={() => {}}
        />
      )}

      {isRegisterVehicleModalOpen && (
        <RegisterVehicleModal
          onClose={() => setIsRegisterVehicleModalOpen(false)}
          onRegistered={() => {}}
        />
      )}

      {isEmergencyModalOpen && (
        <EmergencySOSModal onClose={() => setIsEmergencyModalOpen(false)} />
      )}

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-800 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
