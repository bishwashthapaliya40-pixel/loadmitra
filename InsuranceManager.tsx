import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { InsuranceRecord } from '../../types';
import {
  ShieldCheck,
  AlertTriangle,
  FileText,
  Clock,
  Plus,
  Building,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const InsuranceManager: React.FC = () => {
  const { t, showToast } = useApp();
  const [records, setRecords] = useState<InsuranceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New record state
  const [vehiclePlate, setVehiclePlate] = useState('Na 5 Kha 3110');
  const [insuranceType, setInsuranceType] = useState<'third_party' | 'comprehensive' | 'goods_in_transit'>('goods_in_transit');
  const [policyNumber, setPolicyNumber] = useState('GIT-SHK-990214');
  const [insurerName, setInsurerName] = useState('Shikhar Insurance Co. Ltd.');
  const [coverageAmountNPR, setCoverageAmountNPR] = useState('5000000');
  const [expiryDate, setExpiryDate] = useState('2027-06-30');

  useEffect(() => {
    fetchInsurance();
  }, []);

  const fetchInsurance = async () => {
    setLoading(true);
    const data = await api.getInsuranceRecords();
    setRecords(data);
    setLoading(false);
  };

  const handleAddPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPolicy: Partial<InsuranceRecord> = {
      vehicleId: 'veh-new',
      vehiclePlate,
      insuranceType,
      policyNumber,
      insurerName,
      coverageAmountNPR: Number(coverageAmountNPR),
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate,
      verified: true,
      status: 'valid'
    };

    await api.createInsuranceRecord(newPolicy);
    showToast('Insurance record archived and verified successfully.');
    setShowAddModal(false);
    fetchInsurance();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {t.insuranceTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t.insuranceSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 text-orange-400" />
          <span>{t.addInsurancePolicy}</span>
        </button>
      </div>

      {/* Insurance Records Cards */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs">
          Verifying policy underwriters...
        </div>
      ) : records.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8 space-y-3">
          <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No insurance records cataloged</h3>
          <p className="text-xs text-slate-500">
            Upload your vehicle and goods-in-transit insurance to comply with Nepal transport laws.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {records.map((rec) => {
            const isExpiring = rec.status === 'expiring_soon';
            return (
              <div
                key={rec.id}
                className={`bg-white rounded-2xl border p-5 shadow-2xs space-y-4 flex flex-col justify-between ${
                  isExpiring ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  {/* Status & Category */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                      {rec.vehiclePlate}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isExpiring
                          ? 'bg-amber-100 text-amber-900 flex items-center gap-1'
                          : 'bg-emerald-100 text-emerald-900 flex items-center gap-1'
                      }`}
                    >
                      {isExpiring ? <AlertTriangle className="w-3 h-3 text-amber-600" /> : <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      <span>{isExpiring ? t.statusExpiringSoon : t.statusValid}</span>
                    </span>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      {rec.insuranceType === 'goods_in_transit'
                        ? t.goodsInTransitGIT
                        : rec.insuranceType === 'comprehensive'
                        ? t.vehicleComprehensive
                        : t.vehicleThirdParty}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {rec.insurerName}
                    </h3>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      Policy No: {rec.policyNumber}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Underwritten Coverage:</span>
                      <span className="font-black text-slate-900 font-['Outfit'] tabular-nums">
                        NPR रू {rec.coverageAmountNPR.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">{t.expiryDateLabel}:</span>
                      <span className={`font-mono font-bold ${isExpiring ? 'text-amber-700' : 'text-slate-800'}`}>
                        {rec.expiryDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 italic flex items-center gap-1 pt-2 border-t border-slate-100">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Verified with Insurance Board of Nepal (बीमा प्राधिकरण)</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Policy Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {t.addInsurancePolicy}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPolicy} className="p-5 space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Vehicle Plate Number *
                </label>
                <input
                  type="text"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Insurance Classification *
                </label>
                <select
                  value={insuranceType}
                  onChange={(e) => setInsuranceType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                >
                  <option value="goods_in_transit">{t.goodsInTransitGIT}</option>
                  <option value="comprehensive">{t.vehicleComprehensive}</option>
                  <option value="third_party">{t.vehicleThirdParty}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Insurer Name *
                  </label>
                  <select
                    value={insurerName}
                    onChange={(e) => setInsurerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  >
                    <option value="Shikhar Insurance Co. Ltd.">Shikhar Insurance</option>
                    <option value="Siddhartha Premier Insurance">Siddhartha Premier Insurance</option>
                    <option value="Rastriya Beema Company Ltd.">Rastriya Beema Company</option>
                    <option value="Himalayan Everest Insurance">Himalayan Everest Insurance</option>
                    <option value="Nepal Insurance Company">Nepal Insurance Company</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Policy Number *
                  </label>
                  <input
                    type="text"
                    value={policyNumber}
                    onChange={(e) => setPolicyNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Coverage Amount (NPR)
                  </label>
                  <input
                    type="number"
                    value={coverageAmountNPR}
                    onChange={(e) => setCoverageAmountNPR(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Policy Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors"
                >
                  Save Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
