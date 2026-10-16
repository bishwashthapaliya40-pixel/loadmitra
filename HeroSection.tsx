import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HERO_IMAGE } from '../../data/mockData';
import { ArrowRight, Calculator, CheckCircle2, ShieldCheck, MapPin, Truck } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { t, setIsPostCargoModalOpen, setActiveTab, setIsRegisterVehicleModalOpen } = useApp();

  // Quick freight rate estimator state
  const [estOrigin, setEstOrigin] = useState('Kathmandu');
  const [estDest, setEstDest] = useState('Birgunj');
  const [estWeight, setEstWeight] = useState('2000'); // kg
  const [calculatedFare, setCalculatedFare] = useState<number | null>(null);

  const calculateEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    const weightKg = Number(estWeight) || 1000;
    // Authentic Nepal logistics benchmark rates:
    // Base per ton-km approx 12-18 NPR depending on terrain difficulty
    const distanceKmMap: Record<string, number> = {
      'Kathmandu-Birgunj': 135,
      'Kathmandu-Pokhara': 200,
      'Kathmandu-Butwal': 275,
      'Kathmandu-Biratnagar': 380,
      'Birgunj-Kathmandu': 135,
      'Pokhara-Kathmandu': 200,
      'Narayangarh-Kathmandu': 145
    };
    const key = `${estOrigin}-${estDest}`;
    const distance = distanceKmMap[key] || 180;
    const baseVehicleFare = 8000;
    const ratePerKgKm = 0.045;
    const estimatedNPR = Math.round(baseVehicleFare + weightKg * distance * ratePerKgKm);
    setCalculatedFare(estimatedNPR);
  };

  return (
    <div className="relative bg-slate-900 text-white overflow-hidden">
      {/* Background Hero Image with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="LoadMitra Commercial Freight Truck in Nepal"
          className="w-full h-full object-cover object-center opacity-35 filter brightness-75 contrast-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Demo & Domain Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-md text-orange-400 text-xs font-semibold tracking-wide">
              <span>{t.demoBadge}</span>
              <span aria-hidden="true">·</span>
              <span>100% Commercial Goods Transportation</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {t.tagline}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              {t.subtitle}
            </p>

            {/* Core Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                <span>inDrive-Style Direct Fare Negotiation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                <span>30-35% Off with Return Empty Loads</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Govt. Format Challans &amp; Bilty Receipts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Delivery OTP &amp; Digital Signature POD</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => setIsPostCargoModalOpen(true)}
                className="px-6 py-3.5 text-sm font-bold text-slate-900 bg-orange-500 hover:bg-orange-400 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center gap-2 min-h-[48px]"
              >
                <span>{t.postCargoBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsRegisterVehicleModalOpen(true)}
                className="px-6 py-3.5 text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl backdrop-blur-sm transition-all active:scale-[0.98] min-h-[48px] flex items-center gap-2"
              >
                <Truck className="w-4 h-4 text-orange-400" />
                <span>{t.registerVehicleBtn}</span>
              </button>
            </div>
          </div>

          {/* Quick Rate Estimator Card */}
          <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t.targetBudget} Calculator
                </h3>
                <p className="text-xs text-slate-500">Instant Nepal highway freight estimate</p>
              </div>
              <Calculator className="w-5 h-5 text-orange-500" />
            </div>

            <form onSubmit={calculateEstimate} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.pickupPoint}</label>
                  <select
                    value={estOrigin}
                    onChange={(e) => setEstOrigin(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-orange-500/20 focus:outline-hidden"
                  >
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Pokhara">Pokhara</option>
                    <option value="Birgunj">Birgunj Dry Port</option>
                    <option value="Narayangarh">Narayangarh</option>
                    <option value="Butwal">Butwal</option>
                    <option value="Biratnagar">Biratnagar</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.destinationPoint}</label>
                  <select
                    value={estDest}
                    onChange={(e) => setEstDest(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-orange-500/20 focus:outline-hidden"
                  >
                    <option value="Birgunj">Birgunj Dry Port</option>
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Pokhara">Pokhara</option>
                    <option value="Butwal">Butwal</option>
                    <option value="Hetauda">Hetauda</option>
                    <option value="Biratnagar">Biratnagar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.cargoWeight}</label>
                <div className="grid grid-cols-4 gap-2">
                  {['500', '1500', '5000', '15000'].map((w) => (
                    <button
                      type="button"
                      key={w}
                      onClick={() => setEstWeight(w)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-colors ${
                        estWeight === w
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {Number(w) >= 1000 ? `${Number(w) / 1000}T` : `${w}kg`}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors min-h-[40px]"
              >
                Calculate Benchmark Freight Rate
              </button>

              {calculatedFare && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between animate-in fade-in">
                  <div>
                    <div className="text-[11px] text-orange-800 font-medium">Estimated Benchmark Fare</div>
                    <div className="text-lg font-black text-orange-950 font-['Outfit'] tabular-nums">
                      NPR रू {calculatedFare.toLocaleString()}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPostCargoModalOpen(true)}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-md text-[11px]"
                  >
                    Post at This Rate
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
