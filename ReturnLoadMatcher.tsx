import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { ReturnTrip, VehicleCategory } from '../../types';
import {
  RotateCcw,
  Sparkles,
  ArrowRight,
  MapPin,
  Calendar,
  Truck,
  Plus,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';

export const ReturnLoadMatcher: React.FC = () => {
  const { t, currentUser, showToast } = useApp();
  const [returnTrips, setReturnTrips] = useState<ReturnTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPostingReturn, setIsPostingReturn] = useState(false);

  // New return trip state
  const [fromCity, setFromCity] = useState('Kathmandu');
  const [toCity, setToCity] = useState('Birgunj');
  const [departureDate, setDepartureDate] = useState('Tomorrow Evening');
  const [availableCapacityKg, setAvailableCapacityKg] = useState('20000');
  const [standardFareNPR, setStandardFareNPR] = useState('38000');
  const [discountedFareNPR, setDiscountedFareNPR] = useState('26000');
  const [notes, setNotes] = useState('Empty truck returning to Birgunj dry port. Will carry any safe commercial cargo at discounted backhaul rate.');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    const data = await api.getReturnTrips();
    setReturnTrips(data);
    setLoading(false);
  };

  const handleCreateReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTrip: Partial<ReturnTrip> = {
      driverId: currentUser.id,
      driverName: currentUser.name,
      driverPhone: currentUser.phone,
      vehicleId: 'veh-ret',
      vehiclePlate: 'Na 5 Kha 3110',
      vehicleCategory: 'ten_wheel_truck',
      fromCity,
      toCity,
      departureDate,
      availableCapacityKg: Number(availableCapacityKg),
      standardFareNPR: Number(standardFareNPR),
      discountedFareNPR: Number(discountedFareNPR),
      notes
    };

    await api.createReturnTrip(newTrip);
    showToast('Empty return route published! Shippers on this corridor can book at discount.');
    setIsPostingReturn(false);
    fetchTrips();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-orange-900/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-md text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.returnDiscountBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.returnSaverTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.returnSaverSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPostingReturn(!isPostingReturn)}
          className="px-5 py-3 text-xs font-bold text-slate-950 bg-orange-500 hover:bg-orange-400 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>{t.postReturnRouteBtn}</span>
        </button>
      </div>

      {/* Driver Post Return Corridor Form */}
      {isPostingReturn && (
        <div className="bg-white rounded-2xl p-6 border border-orange-200 shadow-md space-y-4 text-xs animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-orange-600" />
              <span>Publish Return Empty Journey Corridor</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsPostingReturn(false)}
              className="text-slate-400 hover:text-slate-700 text-xs font-bold"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateReturn} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Origin (Returning From)
                </label>
                <input
                  type="text"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Destination (Returning To)
                </label>
                <input
                  type="text"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Return Departure Date
                </label>
                <input
                  type="text"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Available Capacity (kg)
                </label>
                <input
                  type="number"
                  value={availableCapacityKg}
                  onChange={(e) => setAvailableCapacityKg(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Standard Corridor Fare (NPR)
                </label>
                <input
                  type="number"
                  value={standardFareNPR}
                  onChange={(e) => setStandardFareNPR(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Discounted Return Load Fare (NPR) ~30% OFF
                </label>
                <input
                  type="number"
                  value={discountedFareNPR}
                  onChange={(e) => setDiscountedFareNPR(e.target.value)}
                  className="w-full px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg font-bold text-orange-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Route &amp; Freight Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors"
              >
                Publish Return Route
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Return Trips Feed */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs">
          Scanning empty return truck corridors across Nepal...
        </div>
      ) : returnTrips.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8 space-y-3">
          <RotateCcw className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No empty return trips currently posted</h3>
          <p className="text-xs text-slate-500">
            Drivers heading back on empty highway runs can post here to save fuel and earn extra freight.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {returnTrips.map((trip) => {
            const savingsPercent = Math.round(
              ((trip.standardFareNPR - trip.discountedFareNPR) / trip.standardFareNPR) * 100
            );
            return (
              <div
                key={trip.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Unboxed Metadata (Zero-pill) */}
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="text-orange-600 flex items-center gap-1.5">
                      <Truck className="w-4 h-4" />
                      <span>{trip.vehiclePlate}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-600 font-normal">
                        {t[`cat_${trip.vehicleCategory}` as keyof typeof t] || trip.vehicleCategory}
                      </span>
                    </div>

                    <div className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                      {savingsPercent}% OFF
                    </div>
                  </div>

                  {/* Highway Corridor */}
                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">From</div>
                      <div className="font-bold text-sm text-slate-900">{trip.fromCity}</div>
                    </div>

                    <ArrowRight className="w-5 h-5 text-orange-500 mx-2" />

                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-slate-400">To</div>
                      <div className="font-bold text-sm text-slate-900">{trip.toCity}</div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{trip.departureDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span>Available: {trip.availableCapacityKg.toLocaleString()} kg</span>
                    </div>
                  </div>

                  {trip.notes && (
                    <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg italic">
                      "{trip.notes}"
                    </p>
                  )}
                </div>

                {/* Price Breakdown & Contact */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 line-through">
                      Reg. Fare: NPR रू {trip.standardFareNPR.toLocaleString()}
                    </div>
                    <div className="text-lg font-black text-slate-900 font-['Outfit'] tabular-nums text-emerald-800">
                      NPR रू {trip.discountedFareNPR.toLocaleString()}
                    </div>
                  </div>

                  <a
                    href={`tel:${trip.driverPhone}`}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-orange-400" />
                    <span>Book Return Load</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
