import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { CargoPost } from '../../types';
import {
  Package,
  MapPin,
  Calendar,
  Users,
  Search,
  Filter,
  DollarSign,
  Truck,
  ArrowRight,
  Plus
} from 'lucide-react';

export const CargoMarketplace: React.FC = () => {
  const { t, setSelectedCargoForBidding, setIsPostCargoModalOpen, currentUser } = useApp();
  const [cargoList, setCargoList] = useState<CargoPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVehicleType, setSelectedVehicleType] = useState('all');

  useEffect(() => {
    fetchCargo();
  }, [selectedCity, selectedCategory, selectedVehicleType]);

  const fetchCargo = async () => {
    setLoading(true);
    const data = await api.getCargo({
      city: selectedCity,
      category: selectedCategory,
      vehicleType: selectedVehicleType
    });
    setCargoList(data);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Section Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {t.navMarketplace}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse verified commercial cargo consignments across Nepal highways
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPostCargoModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{t.postCargoBtn}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* City Filter */}
        <div className="relative">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            {t.pickupPoint} / {t.destinationPoint}
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              placeholder="Kathmandu, Birgunj, Pokhara..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
        </div>

        {/* Cargo Category */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Freight Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="all">All Cargo Types</option>
            <option value="fmcg">{t.cargo_fmcg}</option>
            <option value="construction">{t.cargo_construction}</option>
            <option value="agricultural">{t.cargo_agricultural}</option>
            <option value="perishable">{t.cargo_perishable}</option>
            <option value="machinery">{t.cargo_machinery}</option>
            <option value="courier_parcels">{t.cargo_courier_parcels}</option>
          </select>
        </div>

        {/* Vehicle Type Required */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Required Vehicle
          </label>
          <select
            value={selectedVehicleType}
            onChange={(e) => setSelectedVehicleType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="all">Any Vehicle Category</option>
            <option value="four_wheel_pickup">{t.cat_four_wheel_pickup}</option>
            <option value="mini_truck">{t.cat_mini_truck}</option>
            <option value="cargo_van">{t.cat_cargo_van}</option>
            <option value="six_wheel_truck">{t.cat_six_wheel_truck}</option>
            <option value="ten_wheel_truck">{t.cat_ten_wheel_truck}</option>
            <option value="fourteen_wheel_truck">{t.cat_fourteen_wheel_truck}</option>
          </select>
        </div>
      </div>

      {/* Cargo Posts Feed */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs">
          Loading active freight loads across Nepal...
        </div>
      ) : cargoList.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8 space-y-3">
          <Package className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No active cargo found matching filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your search parameters or be the first to post a new consignment.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCity('');
              setSelectedCategory('all');
              setSelectedVehicleType('all');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cargoList.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                {/* Unboxed Metadata (Zero-Pill discipline) */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span className="text-orange-600 font-semibold">
                    {t[`cargo_${post.category}` as keyof typeof t] || post.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{post.weightKg.toLocaleString()} kg</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{post.status}</span>
                </div>

                {/* Card Title */}
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {post.title}
                </h3>

                {/* Corridor Route */}
                <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-800">
                        {post.pickupLocation.city} ({post.pickupLocation.district})
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {post.pickupLocation.address}
                      </div>
                    </div>
                  </div>

                  <div className="border-l-2 border-dashed border-slate-300 ml-2 pl-3 py-1 text-[11px] text-slate-400">
                    Direct Highway Corridor
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-800">
                        {post.destinationLocation.city} ({post.destinationLocation.district})
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {post.destinationLocation.address}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule & Requirements */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{post.pickupDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{post.laborRequired} Helpers needed</span>
                  </div>
                </div>

                {post.specialInstructions && (
                  <p className="text-[11px] text-slate-500 line-clamp-2 bg-amber-50/50 p-2 rounded-lg border border-amber-100/60">
                    <span className="font-semibold text-amber-900">Note: </span>
                    {post.specialInstructions}
                  </p>
                )}
              </div>

              {/* Bottom Card Footer: Fare & Action */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    {t.targetBudget}
                  </div>
                  <div className="text-base font-extrabold text-slate-900 font-['Outfit'] tabular-nums">
                    NPR रू {post.initialBudgetNPR.toLocaleString()}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCargoForBidding(post)}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>{currentUser.role === 'customer' ? 'View Bids' : t.makeOfferBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
