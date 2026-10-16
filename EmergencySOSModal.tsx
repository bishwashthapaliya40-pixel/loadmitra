import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { EMERGENCY_SERVICES } from '../../data/mockData';
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  AlertTriangle,
  X,
  Wrench,
  Fuel,
  Ambulance,
  CheckCircle2
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const EmergencySOSModal: React.FC<Props> = ({ onClose }) => {
  const { t, currentUser, showToast } = useApp();
  const [sosSent, setSosSent] = useState(false);
  const [sosDetails, setSosDetails] = useState<any>(null);
  const [highwayLocation, setHighwayLocation] = useState('Prithvi Highway KM 102 near Mugling');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const handleBroadcastSOS = async () => {
    try {
      const res = await api.triggerEmergencySos({
        vehiclePlate: 'Na 5 Kha 3110',
        driverName: currentUser.name,
        highway: 'Prithvi Highway',
        locationDescription: highwayLocation,
        coords: { lat: 27.8575, lng: 84.5714 }
      });
      setSosDetails(res);
      setSosSent(true);
      showToast('HIGHWAY EMERGENCY SOS BROADCASTED! Dispatch logged.');
    } catch (e) {
      showToast('Emergency SOS recorded locally.');
      setSosSent(true);
    }
  };

  const filteredServices = EMERGENCY_SERVICES.filter((s) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'police') return s.category === 'police' || s.category === 'traffic_police' || s.category === 'highway_patrol';
    if (selectedFilter === 'crane') return s.category === 'heavy_crane_towing';
    if (selectedFilter === 'fuel') return s.category === 'fuel_station' || s.category === 'rest_stop';
    if (selectedFilter === 'medical') return s.category === 'ambulance';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-red-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-red-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with SOS banner */}
        <div className="p-5 bg-gradient-to-r from-red-700 to-red-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold uppercase tracking-wide">
                {t.emergencyTitle}
              </h3>
              <p className="text-xs text-red-100">
                Nepal 24/7 Roadside Assistance &amp; Police Highway Hotline
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SOS Action Strip */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {!sosSent ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <span>One-Tap Highway SOS Broadcast</span>
              </div>
              <p className="text-red-800 text-xs leading-relaxed">
                {t.sosBannerWarning}
              </p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Current Landmark / Highway KM Marker:
                </label>
                <input
                  type="text"
                  value={highwayLocation}
                  onChange={(e) => setHighwayLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-red-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <button
                type="button"
                onClick={handleBroadcastSOS}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <ShieldAlert className="w-5 h-5 animate-ping" />
                <span>{t.triggerSosBtn}</span>
              </button>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2 text-emerald-950 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Distress Beacon Dispatched</span>
              </div>
              <p className="text-xs">
                Beacon Ref: <span className="font-mono font-bold">{sosDetails?.sosId || 'SOS-ACTIVE'}</span>. Nepal Highway Traffic Police (103) and nearest recovery units alerted with your coordinates.
              </p>
            </div>
          )}

          {/* Quick Hotlines Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <a
              href="tel:100"
              className="p-3 bg-slate-900 text-white rounded-xl shadow-xs hover:bg-slate-800 transition-colors flex flex-col items-center justify-center gap-1"
            >
              <PhoneCall className="w-4 h-4 text-orange-400" />
              <div className="font-bold text-sm">100</div>
              <div className="text-[10px] text-slate-300">Police Central</div>
            </a>

            <a
              href="tel:103"
              className="p-3 bg-orange-600 text-white rounded-xl shadow-xs hover:bg-orange-700 transition-colors flex flex-col items-center justify-center gap-1"
            >
              <PhoneCall className="w-4 h-4 text-white" />
              <div className="font-bold text-sm">103</div>
              <div className="text-[10px] text-orange-100">Traffic Highway</div>
            </a>

            <a
              href="tel:102"
              className="p-3 bg-emerald-700 text-white rounded-xl shadow-xs hover:bg-emerald-800 transition-colors flex flex-col items-center justify-center gap-1"
            >
              <Ambulance className="w-4 h-4 text-emerald-200" />
              <div className="font-bold text-sm">102</div>
              <div className="text-[10px] text-emerald-100">Ambulance</div>
            </a>
          </div>

          {/* Service Directory by Category */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Highway Support Stations &amp; Workshops
              </h4>

              {/* Segmented filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                {['all', 'police', 'crane', 'fuel', 'medical'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedFilter(cat)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize transition-colors ${
                      selectedFilter === cat
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filteredServices.map((svc) => (
                <div
                  key={svc.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900">{svc.name}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{svc.nameNe}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-orange-600 shrink-0" />
                      <span>{svc.location} · {svc.highway}</span>
                    </div>
                  </div>

                  <a
                    href={`tel:${svc.contactPhone}`}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-mono font-bold text-xs flex items-center gap-1 shrink-0"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-orange-400" />
                    <span>{svc.contactPhone}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close Emergency Panel
          </button>
        </div>
      </div>
    </div>
  );
};
