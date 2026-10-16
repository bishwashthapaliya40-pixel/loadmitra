import React from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import {
  Package,
  Truck,
  RotateCcw,
  Navigation,
  ShieldCheck,
  UserCheck,
  Plus
} from 'lucide-react';

export const UserRoleDashboardBanner: React.FC = () => {
  const {
    t,
    currentUser,
    setActiveTab,
    setIsPostCargoModalOpen,
    setIsRegisterVehicleModalOpen,
    setIsAuthModalOpen
  } = useApp();

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* User profile & Active Role */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm shrink-0 border border-slate-800">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-50 text-orange-800 border border-orange-200">
                  {t[`role_${currentUser.role}` as keyof typeof t] || currentUser.role}
                </span>
                {currentUser.verified && (
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500">
                {currentUser.companyName || currentUser.location} · {currentUser.phone}
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {currentUser.role === 'customer' && (
              <button
                type="button"
                onClick={() => setIsPostCargoModalOpen(true)}
                className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.postCargoBtn}</span>
              </button>
            )}

            {(currentUser.role === 'driver' || currentUser.role === 'fleet_company') && (
              <>
                <button
                  type="button"
                  onClick={() => setIsRegisterVehicleModalOpen(true)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5 text-orange-400" />
                  <span>{t.registerVehicleBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('return_trips')}
                  className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Post Return Load</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors flex items-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.profileText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
