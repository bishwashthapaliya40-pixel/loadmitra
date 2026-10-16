import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { CargoPost, CargoCategory, VehicleCategory } from '../../types';
import { WAREHOUSE_IMAGE } from '../../data/mockData';
import { X, Package, MapPin, Truck, Calendar, Users, DollarSign, AlertCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export const PostCargoModal: React.FC<Props> = ({ onClose, onCreated }) => {
  const { t, currentUser, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CargoCategory>('fmcg');
  const [weightKg, setWeightKg] = useState('1500');
  const [pickupCity, setPickupCity] = useState('Kathmandu');
  const [pickupDistrict, setPickupDistrict] = useState('Kathmandu');
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupContact, setPickupContact] = useState(currentUser.name);
  const [pickupPhone, setPickupPhone] = useState(currentUser.phone);

  const [destCity, setDestDestCity] = useState('Pokhara');
  const [destDistrict, setDestDistrict] = useState('Kaski');
  const [destAddress, setDestAddress] = useState('');
  const [destContact, setDestContact] = useState('');
  const [destPhone, setDestPhone] = useState('');

  const [requiredVehicle, setRequiredVehicle] = useState<VehicleCategory>('four_wheel_pickup');
  const [declaredValueNPR, setDeclaredValueNPR] = useState('250000');
  const [initialBudgetNPR, setInitialBudgetNPR] = useState('18000');
  const [pickupDate, setPickupDate] = useState('Tomorrow 08:00 AM');
  const [deliveryDeadline, setDeliveryDeadline] = useState('Tomorrow 06:00 PM');
  const [laborRequired, setLaborRequired] = useState(2);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !pickupAddress.trim() || !destAddress.trim()) {
      showToast('Please fill all required address and cargo details');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<CargoPost> = {
        customerId: currentUser.id,
        customerName: currentUser.name,
        customerPhone: currentUser.phone,
        customerCompany: currentUser.companyName,
        title,
        category,
        weightKg: Number(weightKg) || 1000,
        pickupLocation: {
          city: pickupCity,
          district: pickupDistrict,
          address: pickupAddress,
          contactPerson: pickupContact,
          contactPhone: pickupPhone
        },
        destinationLocation: {
          city: destCity,
          district: destDistrict,
          address: destAddress,
          contactPerson: destContact || 'Consignee',
          contactPhone: destPhone || '+977-9800000000'
        },
        requiredVehicleCategory: requiredVehicle,
        declaredValueNPR: Number(declaredValueNPR) || 100000,
        initialBudgetNPR: Number(initialBudgetNPR) || 15000,
        pickupDate,
        deliveryDeadline,
        laborRequired,
        specialInstructions,
        photos: [WAREHOUSE_IMAGE]
      };

      await api.createCargo(payload);
      showToast('Cargo posted successfully! Commercial drivers notified.');
      onCreated();
      onClose();
    } catch (err) {
      showToast('Failed to post cargo');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              {t.postCargoBtn}
            </h3>
            <p className="text-xs text-slate-500">
              Commercial freight consignment notice for Nepal highway operators
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Goods Title & Category */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              1. Goods & Freight Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Consignment Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 50 Cartons FMCG Groceries & Beverage Packs"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-orange-500/20"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CargoCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                >
                  <option value="fmcg">{t.cargo_fmcg}</option>
                  <option value="construction">{t.cargo_construction}</option>
                  <option value="agricultural">{t.cargo_agricultural}</option>
                  <option value="perishable">{t.cargo_perishable}</option>
                  <option value="machinery">{t.cargo_machinery}</option>
                  <option value="courier_parcels">{t.cargo_courier_parcels}</option>
                  <option value="furniture">{t.cargo_furniture}</option>
                  <option value="electronics">{t.cargo_electronics}</option>
                  <option value="other">{t.cargo_other}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.cargoWeight} *
                </label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.declaredValue} *
                </label>
                <input
                  type="number"
                  value={declaredValueNPR}
                  onChange={(e) => setDeclaredValueNPR(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.targetBudget} *
                </label>
                <input
                  type="number"
                  value={initialBudgetNPR}
                  onChange={(e) => setInitialBudgetNPR(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-orange-600"
                  required
                />
              </div>
            </div>
          </div>

          {/* Pickup & Destination Corridors */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              2. Route & Location Points
            </h4>

            {/* Pickup */}
            <div className="p-3 bg-slate-50 rounded-xl space-y-2">
              <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{t.pickupPoint}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-0.5">City</label>
                  <input
                    type="text"
                    value={pickupCity}
                    onChange={(e) => setPickupCity(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-0.5">District</label>
                  <input
                    type="text"
                    value={pickupDistrict}
                    onChange={(e) => setPickupDistrict(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-medium"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-500 mb-0.5">Full Loading Address *</label>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="e.g. Kalimati Wholesale Yard, Shed 12, Kathmandu"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-medium"
                  required
                />
              </div>
            </div>

            {/* Destination */}
            <div className="p-3 bg-slate-50 rounded-xl space-y-2">
              <div className="font-bold text-orange-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-orange-600" />
                <span>{t.destinationPoint}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-0.5">City</label>
                  <input
                    type="text"
                    value={destCity}
                    onChange={(e) => setDestDestCity(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-0.5">District</label>
                  <input
                    type="text"
                    value={destDistrict}
                    onChange={(e) => setDestDistrict(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-medium"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-500 mb-0.5">Full Unloading Address *</label>
                <input
                  type="text"
                  value={destAddress}
                  onChange={(e) => setDestAddress(e.target.value)}
                  placeholder="e.g. Prithvi Chowk Commercial Warehouse, Pokhara"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-medium"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-0.5">Receiver / Consignee Person</label>
                  <input
                    type="text"
                    value={destContact}
                    onChange={(e) => setDestContact(e.target.value)}
                    placeholder="e.g. Binod Paudel"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-0.5">Receiver Contact Phone</label>
                  <input
                    type="text"
                    value={destPhone}
                    onChange={(e) => setDestPhone(e.target.value)}
                    placeholder="+977-98XXXXXXXX"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Category & Logistics Requirements */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              3. Vehicle & Labor Requirement
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Required Vehicle
                </label>
                <select
                  value={requiredVehicle}
                  onChange={(e) => setRequiredVehicle(e.target.value as VehicleCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                >
                  <option value="three_wheel">{t.cat_three_wheel}</option>
                  <option value="four_wheel_pickup">{t.cat_four_wheel_pickup}</option>
                  <option value="cargo_van">{t.cat_cargo_van}</option>
                  <option value="mini_truck">{t.cat_mini_truck}</option>
                  <option value="six_wheel_truck">{t.cat_six_wheel_truck}</option>
                  <option value="eight_wheel_truck">{t.cat_eight_wheel_truck}</option>
                  <option value="ten_wheel_truck">{t.cat_ten_wheel_truck}</option>
                  <option value="twelve_wheel_truck">{t.cat_twelve_wheel_truck}</option>
                  <option value="fourteen_wheel_truck">{t.cat_fourteen_wheel_truck}</option>
                  <option value="heavy_freight_trailer">{t.cat_heavy_freight_trailer}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.laborCount}
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={laborRequired}
                  onChange={(e) => setLaborRequired(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pickup Schedule
                </label>
                <input
                  type="text"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {t.specialInstructions}
              </label>
              <textarea
                rows={2}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Tarpaulin cover mandatory, moisture sensitive boxes, weighbridge slip required at loading point"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors shadow-xs"
            >
              {submitting ? 'Posting...' : t.postCargoBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
