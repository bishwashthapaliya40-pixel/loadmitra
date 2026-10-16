import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole, Language } from '../../types';
import { INITIAL_USERS } from '../../data/mockData';
import { BrandLogo } from '../common/BrandLogo';
import { X, UserCheck, ShieldCheck, Globe, LogIn, UserPlus } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ onClose }) => {
  const { t, language, setLanguage, currentUser, setCurrentUser, showToast } = useApp();
  const [isRegister, setIsRegister] = useState(false);

  // Registration fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+977-98');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [companyName, setCompanyName] = useState('');
  const [panVat, setPanVat] = useState('');
  const [preferredLang, setPreferredLang] = useState<Language>(language);

  const handleQuickLogin = (user: User) => {
    setCurrentUser(user);
    if (user.preferredLanguage) {
      setLanguage(user.preferredLanguage);
    }
    showToast(`Logged in as ${user.name} (${t[`role_${user.role}` as keyof typeof t] || user.role})`);
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast('Please provide your name and phone number');
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      role,
      companyName,
      panVatNumber: panVat,
      preferredLanguage: preferredLang,
      verified: true,
      rating: 5.0,
      totalTrips: 0,
      location: 'Kathmandu, Nepal'
    };

    setCurrentUser(newUser);
    setLanguage(preferredLang);
    showToast(`Welcome ${name}! Your account is registered with ${preferredLang.toUpperCase()} as preferred language.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-xs">
        {/* Header with Brand Logo */}
        <div className="p-6 bg-slate-900 text-white text-center relative space-y-2">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex justify-center">
            <BrandLogo size="lg" inverted={true} layout="vertical" />
          </div>
          <p className="text-[11px] text-slate-400">
            {t.subtitle}
          </p>
        </div>

        {/* Tab switch: Quick Login vs Register */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 text-center font-bold">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`py-3 transition-colors ${
              !isRegister
                ? 'bg-white text-slate-900 border-b-2 border-orange-500'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.loginText}
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`py-3 transition-colors ${
              isRegister
                ? 'bg-white text-slate-900 border-b-2 border-orange-500'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.registerText}
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!isRegister ? (
            <div className="space-y-3">
              <div className="text-[11px] text-slate-500 font-medium">
                Choose a pre-configured role to immediately test the marketplace:
              </div>
              <div className="space-y-2">
                {INITIAL_USERS.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      currentUser.id === u.id
                        ? 'border-orange-500 bg-orange-50/50 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {t[`role_${u.role}` as keyof typeof t] || u.role} · {u.companyName || u.location}
                      </div>
                    </div>
                    {currentUser.id === u.id && (
                      <span className="text-[10px] font-bold text-orange-600 bg-white px-2 py-0.5 rounded-md border border-orange-200">
                        Current
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name / Legal Representative *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sujan Shrestha"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+977-98XXXXXXXX"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Account Type / Role *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                >
                  <option value="customer">{t.role_customer}</option>
                  <option value="driver">{t.role_driver}</option>
                  <option value="courier">{t.role_courier}</option>
                  <option value="fleet_company">{t.role_fleet_company}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Company / Organization Name (Optional)
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Sagarmatha Logistics Pvt. Ltd."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                />
              </div>

              {/* Preferred Language Selection (Crucial Requirement) */}
              <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-xl space-y-1.5">
                <label className="block font-bold text-orange-950 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-orange-600" />
                  <span>Preferred Language (प्राथमिक भाषा) *</span>
                </label>
                <select
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value as Language)}
                  className="w-full px-3 py-2 bg-white border border-orange-300 rounded-lg font-bold text-slate-800"
                >
                  <option value="ne">नेपाली (Nepali - Default for Nepal)</option>
                  <option value="en">English (English)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="zh">中文 (Simplified Chinese)</option>
                </select>
                <p className="text-[10px] text-orange-800">
                  Your selected language will be saved to your profile and restored automatically on future logins.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors mt-2"
              >
                Create Account &amp; Save Preference
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
