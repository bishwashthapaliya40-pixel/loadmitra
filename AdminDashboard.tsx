import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Vehicle, DisputeReport } from '../../types';
import { BrandLogo } from '../common/BrandLogo';
import {
  SlidersHorizontal,
  ShieldCheck,
  Truck,
  Package,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  FileCheck,
  Scale,
  DollarSign
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { t, showToast } = useApp();
  const [stats, setStats] = useState<any>({
    activeShipments: 1,
    openCargoPosts: 3,
    registeredTrucks: 6,
    verifiedFleets: 4,
    totalFreightTons: 1465
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [disputes, setDisputes] = useState<DisputeReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    const [st, veh, disp] = await Promise.all([
      api.getStats(),
      api.getVehicles(),
      api.getDisputes()
    ]);
    setStats(st);
    setVehicles(veh);
    setDisputes(disp);
    setLoading(false);
  };

  const handleVerifyVehicle = async (vehicleId: string, verified: boolean) => {
    await api.adminVerifyVehicle(vehicleId, verified);
    showToast(verified ? 'Vehicle Bluebook & Route Permit Approved' : 'Vehicle verification revoked');
    loadAdminData();
  };

  const handleResetDemoData = async () => {
    if (confirm('Reset platform data to authentic Nepal freight seed database?')) {
      await api.resetDemoDatabase();
      showToast('Database reset to fresh authentic Nepal logistics seed data');
      loadAdminData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header with Brand Logo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <BrandLogo size="md" />
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-2">
            {t.adminOverviewTitle}
          </h2>
          <p className="text-xs text-slate-500">
            {t.adminOverviewSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDemoData}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>{t.resetDemoDatabase}</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t.totalFreightHandled}
          </div>
          <div className="text-2xl font-black text-slate-900 font-['Outfit'] tabular-nums">
            {stats.totalFreightTons?.toLocaleString()} Tons
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">Nepal Highways Corridor</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t.registeredTrucksCount}
          </div>
          <div className="text-2xl font-black text-slate-900 font-['Outfit'] tabular-nums">
            {stats.registeredTrucks}
          </div>
          <div className="text-[11px] text-slate-500">Pickups, 6W, 10W &amp; 14W</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t.activeShipmentsCount}
          </div>
          <div className="text-2xl font-black text-orange-600 font-['Outfit'] tabular-nums">
            {stats.activeShipments}
          </div>
          <div className="text-[11px] text-orange-600 font-semibold">Live GPS En Route</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Open Cargo Posts
          </div>
          <div className="text-2xl font-black text-slate-900 font-['Outfit'] tabular-nums">
            {stats.openCargoPosts}
          </div>
          <div className="text-[11px] text-slate-500">Bidding &amp; Negotiation</div>
        </div>
      </div>

      {/* Vehicle Document Verification Desk */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-orange-600" />
              <span>{t.pendingVerifications} (Bluebook &amp; Route Permits)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Department of Transport Management (DoTM) regulatory compliance audit
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            {vehicles.length} Vehicles Audited
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                <th className="p-3">Plate &amp; Model</th>
                <th className="p-3">Owner / Transport Co.</th>
                <th className="p-3">Category &amp; Wheels</th>
                <th className="p-3">Bluebook (Bilbook)</th>
                <th className="p-3">Route Permit</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-slate-900 font-mono">{v.plateNumber}</div>
                    <div className="text-[11px] text-slate-500">{v.modelName}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-800">{v.ownerName}</div>
                    <div className="text-[11px] text-slate-400">{v.ownerPhone}</div>
                  </td>
                  <td className="p-3">
                    <div>{t[`cat_${v.category}` as keyof typeof t] || v.category}</div>
                    <div className="text-[11px] text-slate-400">{v.wheelCount} Wheels · {v.payloadCapacityKg} kg</div>
                  </td>
                  <td className="p-3">
                    <div className="font-mono text-slate-700">{v.bluebookNumber}</div>
                    <div className="text-[10px] text-slate-400">Exp: {v.bluebookExpiry}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-mono text-slate-700">{v.routePermitNumber}</div>
                    <div className="text-[10px] text-slate-400">Exp: {v.routePermitExpiry}</div>
                  </td>
                  <td className="p-3">
                    {v.verified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Pending</span>
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {v.verified ? (
                      <button
                        type="button"
                        onClick={() => handleVerifyVehicle(v.id, false)}
                        className="px-2.5 py-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md font-semibold text-[11px] transition-colors"
                      >
                        {t.rejectVehicle}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleVerifyVehicle(v.id, true)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold text-[11px] transition-colors"
                      >
                        {t.approveVehicle}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cargo Claims & Disputes Arbitration */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-orange-600" />
              <span>{t.disputeArbitration}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Freight claims, goods damage and road delay settlement
            </p>
          </div>
        </div>

        {disputes.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            No active cargo claims or disputes logged.
          </div>
        ) : (
          <div className="space-y-3">
            {disputes.map((d) => (
              <div
                key={d.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{d.reporterName}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-mono text-orange-600 font-bold">{d.bookingId}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {d.status}
                  </span>
                </div>

                <p className="text-slate-700 leading-relaxed font-medium">
                  "{d.description}"
                </p>

                {d.adminNotes && (
                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-600">
                    <span className="font-bold text-slate-800">Arbitration Notes: </span>
                    {d.adminNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
