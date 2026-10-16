import React from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import { LanguageSelector } from '../common/LanguageSelector';
import { ShieldCheck, PhoneCall, MapPin, Truck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, setActiveTab } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-3">
            <BrandLogo size="lg" inverted={true} />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm mt-2">
              {t.tagline}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-slate-300 font-semibold">{t.selectLanguage}:</span>
              <LanguageSelector variant="header" />
            </div>
          </div>

          {/* Col 2: Goods Transport Categories */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 tracking-wide">
              {t.navVehicles}
            </h4>
            <ul className="space-y-2">
              <li>{t.cat_four_wheel_pickup}</li>
              <li>{t.cat_mini_truck}</li>
              <li>{t.cat_cargo_van}</li>
              <li>{t.cat_six_wheel_truck}</li>
              <li>{t.cat_ten_wheel_truck}</li>
              <li>{t.cat_fourteen_wheel_truck}</li>
            </ul>
          </div>

          {/* Col 3: Key Corridors & Safety */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 tracking-wide">
              {t.navReturnTrips}
            </h4>
            <ul className="space-y-2">
              <li>Kathmandu — Birgunj Dry Port</li>
              <li>Kathmandu — Pokhara (Prithvi Highway)</li>
              <li>Narayangarh — Butwal — Nepalgunj</li>
              <li>Biratnagar — Itahari — Dharan</li>
              <li>Hetauda — Pathlaiya — Janakpur</li>
            </ul>
          </div>

          {/* Col 4: Emergency Hotlines & Compliance */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 tracking-wide">
              {t.emergencyTitle}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-400 font-medium">
                <PhoneCall className="w-4 h-4 shrink-0" />
                <span>Nepal Police: 100</span>
              </div>
              <div className="flex items-center gap-2 text-amber-400 font-medium">
                <PhoneCall className="w-4 h-4 shrink-0" />
                <span>Traffic Police Highway Desk: 103</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <PhoneCall className="w-4 h-4 shrink-0" />
                <span>Highway Ambulance: 102</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-2 leading-tight">
                {t.legalDisclaimer}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimers */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} LoadMitra. LM Logistics &amp; Cargo Nepal. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('insurance')}
              className="hover:text-slate-300 transition-colors"
            >
              {t.navInsurance}
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActiveTab('emergency')}
              className="hover:text-slate-300 transition-colors"
            >
              {t.navEmergency}
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className="hover:text-slate-300 transition-colors"
            >
              {t.navAdmin}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
