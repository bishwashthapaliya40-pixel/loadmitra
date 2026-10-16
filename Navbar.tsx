import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import { LanguageSelector } from '../common/LanguageSelector';
import { UserRole } from '../../types';
import {
  Package,
  Truck,
  RotateCcw,
  Navigation,
  ShieldAlert,
  SlidersHorizontal,
  PlusCircle,
  Menu,
  X,
  UserCheck,
  FileText
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    t,
    activeTab,
    setActiveTab,
    currentUser,
    switchUserRole,
    setIsPostCargoModalOpen,
    setIsEmergencyModalOpen
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const roles: { role: UserRole; label: string }[] = [
    { role: 'customer', label: t.role_customer },
    { role: 'driver', label: t.role_driver },
    { role: 'courier', label: t.role_courier },
    { role: 'fleet_company', label: t.role_fleet_company },
    { role: 'admin', label: t.role_admin }
  ];

  const navItems = [
    { id: 'marketplace', label: t.navMarketplace, icon: Package },
    { id: 'vehicles', label: t.navVehicles, icon: Truck },
    { id: 'return_trips', label: t.navReturnTrips, icon: RotateCcw },
    { id: 'shipments', label: t.navActiveShipments, icon: Navigation },
    { id: 'insurance', label: t.navInsurance, icon: FileText },
    { id: 'admin', label: t.navAdmin, icon: SlidersHorizontal }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark & Monogram */}
        <div
          onClick={() => setActiveTab('marketplace')}
          className="cursor-pointer shrink-0 transition-opacity hover:opacity-90"
        >
          <BrandLogo size="md" />
        </div>

        {/* Zone 2: Navigation Links (single-line, whitespace-nowrap) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 text-sm ${
                  isActive
                    ? 'text-orange-600 font-semibold border-b-2 border-orange-500'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (Language, SOS, Role, Post Cargo) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Emergency Roadside SOS Button */}
          <button
            type="button"
            onClick={() => setIsEmergencyModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
            title="Highway SOS & Nepal Police"
          >
            <ShieldAlert className="w-4 h-4 text-red-600 animate-pulse" />
            <span>SOS</span>
          </button>

          {/* Language Selector */}
          <LanguageSelector variant="header" />

          {/* Quick Role Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 whitespace-nowrap shrink-0 transition-colors min-h-[40px]"
              title={t.switchRole}
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline font-semibold text-slate-800">
                {t[`role_${currentUser.role}` as keyof typeof t] || currentUser.role}
              </span>
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 z-50 mt-1.5 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-400">{t.switchRole}</div>
                  <div className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{currentUser.companyName || currentUser.phone}</div>
                </div>
                {roles.map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => {
                      switchUserRole(r.role);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between ${
                      currentUser.role === r.role
                        ? 'bg-orange-50 font-bold text-orange-900'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{r.label}</span>
                    {currentUser.role === r.role && <span className="text-[10px] text-orange-600 font-bold">● Active</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Post Cargo Primary CTA */}
          <button
            type="button"
            onClick={() => setIsPostCargoModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
          >
            <PlusCircle className="w-4 h-4 text-orange-400" />
            <span className="hidden sm:inline">{t.postCargoBtn}</span>
            <span className="sm:hidden">Post</span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-orange-50 text-orange-800 border border-orange-200'
                      : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4 text-orange-600" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Emergency SOS Quick Tap on Mobile */}
          <button
            type="button"
            onClick={() => {
              setIsEmergencyModalOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 p-3 text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg"
          >
            <ShieldAlert className="w-4 h-4 text-red-600 animate-pulse" />
            <span>{t.triggerSosBtn}</span>
          </button>
        </div>
      )}
    </header>
  );
};
