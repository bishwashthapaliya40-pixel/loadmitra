import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Vehicle, VehicleCategory, BodyType } from '../../types';
import { FLEET_IMAGE } from '../../data/mockData';
import { X, Truck, FileCheck, Shield, Upload } from 'lucide-react';

interface Props {
  onClose: () => void;
  onRegistered: () => void;
}

export const RegisterVehicleModal: React.FC<Props> = ({ onClose, onRegistered }) => {
  const { t, currentUser, showToast } = useApp();

  const [plateNumber, setPlateNumber] = useState('Ba Pra 01-028 Cha 9912');
  const [modelName, setModelName] = useState('Mahindra Bolero Maxi Truck Plus');
  const [category, setCategory] = useState<VehicleCategory>('four_wheel_pickup');
  const [wheelCount, setWheelCount] = useState(4);
  const [payloadCapacityKg, setPayloadCapacityKg] = useState('1800');
  const [bodyType, setBodyType] = useState<BodyType>('open_body');
  const [lengthFt, setLengthFt] = useState('9');
  const [widthFt, setWidthFt] = useState('5.5');
  const [heightFt, setHeightFt] = useState('5');
  const [currentCity, setCurrentCity] = useState('Kathmandu');
  const [bluebookNumber, setBluebookNumber] = useState('BB-BAG-882190');
  const [bluebookExpiry, setBluebookExpiry] = useState('2027-04-30');
  const [routePermitNumber, setRoutePermitNumber] = useState('RP-NATIONAL-5501');
  const [routePermitExpiry, setRoutePermitExpiry] = useState('2027-05-15');
  const [pollutionExpiry, setPollutionExpiry] = useState('2027-01-30');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber.trim() || !bluebookNumber.trim()) {
      showToast('Please provide valid vehicle number plate and Bluebook number');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<Vehicle> = {
        ownerId: currentUser.id,
        ownerName: currentUser.name,
        ownerPhone: currentUser.phone,
        plateNumber,
        modelName,
        category,
        wheelCount: Number(wheelCount),
        payloadCapacityKg: Number(payloadCapacityKg),
        dimensions: {
          lengthFt: Number(lengthFt),
          widthFt: Number(widthFt),
          heightFt: Number(heightFt)
        },
        bodyType,
        photoUrl: FLEET_IMAGE,
        bluebookNumber,
        bluebookExpiry,
        routePermitNumber,
        routePermitExpiry,
        pollutionExpiry,
        currentCity,
        hasGps: true,
        lat: 27.7,
        lng: 85.3
      };

      await api.createVehicle(payload);
      showToast('Commercial vehicle registered! Sent for admin Bluebook verification.');
      onRegistered();
      onClose();
    } catch (e) {
      showToast('Failed to register vehicle');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              {t.registerVehicleBtn}
            </h3>
            <p className="text-xs text-slate-500">
              Commercial Freight Vehicle, Bluebook &amp; Route Permit Enrollment
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
          {/* Identity & Specs */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              1. Vehicle Classification &amp; Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.vehiclePlate} * (e.g. Na 5 Kha 3110 / Ba Pra 01)
                </label>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold font-mono focus:ring-2 focus:ring-orange-500/20"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Make &amp; Commercial Model *
                </label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="e.g. Tata 1109 LPT / Mahindra Bolero"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Vehicle Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    const cat = e.target.value as VehicleCategory;
                    setCategory(cat);
                    if (cat === 'three_wheel') setWheelCount(3);
                    else if (cat === 'four_wheel_pickup' || cat === 'mini_truck' || cat === 'cargo_van') setWheelCount(4);
                    else if (cat === 'six_wheel_truck') setWheelCount(6);
                    else if (cat === 'ten_wheel_truck') setWheelCount(10);
                    else if (cat === 'fourteen_wheel_truck') setWheelCount(14);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                >
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
                <label className="block font-semibold text-slate-700 mb-1">
                  Wheel Count
                </label>
                <input
                  type="number"
                  value={wheelCount}
                  onChange={(e) => setWheelCount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Payload Capacity (kg) *
                </label>
                <input
                  type="number"
                  value={payloadCapacityKg}
                  onChange={(e) => setPayloadCapacityKg(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Body Type
                </label>
                <select
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value as BodyType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                >
                  <option value="open_body">{t.body_open_body}</option>
                  <option value="covered_container">{t.body_covered_container}</option>
                  <option value="tarpaulin_high_side">{t.body_tarpaulin_high_side}</option>
                  <option value="refrigerated_reefer">{t.body_refrigerated_reefer}</option>
                  <option value="flatbed_trailer">{t.body_flatbed_trailer}</option>
                  <option value="liquid_tanker">{t.body_liquid_tanker}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Base Operating Station (City)
                </label>
                <input
                  type="text"
                  value={currentCity}
                  onChange={(e) => setCurrentCity(e.target.value)}
                  placeholder="e.g. Birgunj, Kathmandu, Narayangarh"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  required
                />
              </div>
            </div>
          </div>

          {/* Government Compliance & Documents */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              2. Government Documents &amp; Verification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.bluebookNumber} *
                </label>
                <input
                  type="text"
                  value={bluebookNumber}
                  onChange={(e) => setBluebookNumber(e.target.value)}
                  placeholder="BB-BAG-XXXXX"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Bluebook Expiry Date
                </label>
                <input
                  type="date"
                  value={bluebookExpiry}
                  onChange={(e) => setBluebookExpiry(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.routePermit} *
                </label>
                <input
                  type="text"
                  value={routePermitNumber}
                  onChange={(e) => setRoutePermitNumber(e.target.value)}
                  placeholder="RP-NATIONAL-XXXX"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Route Permit Expiry Date
                </label>
                <input
                  type="date"
                  value={routePermitExpiry}
                  onChange={(e) => setRoutePermitExpiry(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  required
                />
              </div>
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
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors shadow-xs"
            >
              {submitting ? 'Registering...' : t.registerVehicleBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
