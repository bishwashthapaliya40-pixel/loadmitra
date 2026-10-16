import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Vehicle, VehicleCategory } from '../../types';
import {
  Truck,
  ShieldCheck,
  MapPin,
  FileCheck2,
  Phone,
  Plus,
  Search,
  Scale
} from 'lucide-react';

export const VehicleFleetDirectory: React.FC = () => {
  const { t, setIsRegisterVehicleModalOpen } = useApp();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedWheelCount, setSelectedWheelCount] = useState('all');

  useEffect(() => {
    fetchVehicles();
  }, [selectedCategory, selectedCity, selectedWheelCount]);

  const fetchVehicles = async () => {
    setLoading(true);
    const data = await api.getVehicles({
      category: selectedCategory,
      city: selectedCity,
      wheelCount: selectedWheelCount
    });
    setVehicles(data);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {t.navVehicles}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Registered commercial goods transport fleet across Nepal with verified Bluebook &amp; Route Permits
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsRegisterVehicleModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 text-orange-400" />
          <span>{t.registerVehicleBtn}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Vehicle Class
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
          >
            <option value="all">All Commercial Categories</option>
            <option value="three_wheel">{t.cat_three_wheel}</option>
            <option value="four_wheel_pickup">{t.cat_four_wheel_pickup}</option>
            <option value="mini_truck">{t.cat_mini_truck}</option>
            <option value="cargo_van">{t.cat_cargo_van}</option>
            <option value="six_wheel_truck">{t.cat_six_wheel_truck}</option>
            <option value="eight_wheel_truck">{t.cat_eight_wheel_truck}</option>
            <option value="ten_wheel_truck">{t.cat_ten_wheel_truck}</option>
            <option value="twelve_wheel_truck">{t.cat_twelve_wheel_truck}</option>
            <option value="fourteen_wheel_truck">{t.cat_fourteen_wheel_truck}</option>
            <option value="heavy_freight_trailer">{t.cat_heavy_freight_trailer}</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Wheel Count
          </label>
          <select
            value={selectedWheelCount}
            onChange={(e) => setSelectedWheelCount(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
          >
            <option value="all">Any Wheel Configuration</option>
            <option value="3">3 Wheels (Auto / Tempo)</option>
            <option value="4">4 Wheels (Pickups / Vans / Mini)</option>
            <option value="6">6 Wheels (Single Axle Truck)</option>
            <option value="10">10 Wheels (Multi-Axle Heavy)</option>
            <option value="12">12 Wheels (Multi-Axle Heavy)</option>
            <option value="14">14 Wheels (Heavy Hauler)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Current Base Station / City
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              placeholder="e.g. Birgunj, Kathmandu, Butwal..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
            />
          </div>
        </div>
      </div>

      {/* Fleet Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs">
          Loading commercial fleet records...
        </div>
      ) : vehicles.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8 space-y-3">
          <Truck className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No vehicles match filters</h3>
          <p className="text-xs text-slate-500">
            Register your commercial freight vehicle to receive cargo requests.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              {/* Image banner with zero-broken-image fallback */}
              <div className="relative h-44 bg-slate-800 overflow-hidden">
                <img
                  src={v.photoUrl}
                  alt={v.modelName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wider">
                  {v.plateNumber}
                </div>
                {v.verified && (
                  <div className="absolute top-3 right-3 bg-emerald-600/95 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-3 text-white text-xs font-bold drop-shadow-sm">
                  {v.modelName}
                </div>
              </div>

              {/* Specs & Documents */}
              <div className="p-4 space-y-3 text-xs">
                {/* Unboxed Metadata (Zero-pill) */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <span className="font-semibold text-orange-600">
                    {t[`cat_${v.category}` as keyof typeof t] || v.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{v.wheelCount} Wheels</span>
                  <span aria-hidden="true">·</span>
                  <span>{t[`body_${v.bodyType}` as keyof typeof t] || v.bodyType}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Payload Capacity</div>
                    <div className="font-black text-slate-800 tabular-nums">
                      {v.payloadCapacityKg >= 1000
                        ? `${v.payloadCapacityKg / 1000} Tons`
                        : `${v.payloadCapacityKg} kg`}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Current Base</div>
                    <div className="font-bold text-slate-800 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-orange-600 shrink-0" />
                      <span className="truncate">{v.currentCity}</span>
                    </div>
                  </div>
                </div>

                {/* Government Documents Check */}
                <div className="space-y-1.5 pt-1 text-[11px] border-t border-slate-100">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.bluebookNumber}:</span>
                    </span>
                    <span className="font-mono text-slate-800">{v.bluebookNumber}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.routePermit}:</span>
                    </span>
                    <span className="font-mono text-slate-800">{v.routePermitNumber}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Owner / Driver</div>
                  <div className="font-bold text-xs text-slate-800 truncate">{v.ownerName}</div>
                </div>

                <a
                  href={`tel:${v.ownerPhone}`}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
