import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Trip, TripStatus, TripPaymentStatus } from '../../types';
import {
  Calendar,
  Search,
  Filter,
  Download,
  Printer,
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Fuel,
  Wrench,
  DollarSign,
  FileText,
  Navigation,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';

interface Props {
  onSelectTripForTracking?: (trip: Trip) => void;
}

export const TripHistoryView: React.FC<Props> = ({ onSelectTripForTracking }) => {
  const { t, currentUser, setSelectedBookingForChallan, showToast } = useApp();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [period, setPeriod] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Detail Modal
  const [activeTripModal, setActiveTripModal] = useState<Trip | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  useEffect(() => {
    loadTrips();
  }, [period, statusFilter, currentUser.id, currentUser.role]);

  const loadTrips = async () => {
    setLoading(true);
    const params: Record<string, any> = {
      role: currentUser.role,
      userId: currentUser.id
    };
    if (period !== 'all' && period !== 'custom') params.period = period;
    if (period === 'custom' && startDate && endDate) {
      params.period = 'custom';
      params.startDate = startDate;
      params.endDate = endDate;
    }
    if (statusFilter !== 'all') params.status = statusFilter;
    if (searchQuery.trim()) params.search = searchQuery.trim();

    const data = await api.getTrips(params);
    setTrips(data);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadTrips();
  };

  // KPI Calculations
  const totalTrips = trips.length;
  const completedTrips = trips.filter((t) => t.tripStatus === 'delivered').length;
  const totalDistance = trips.reduce(
    (sum, t) => sum + (t.actualOdometerKm || t.distanceKm || 0),
    0
  );
  const totalGrossRevenue = trips.reduce(
    (sum, t) => sum + (t.grossRevenueNPR || t.agreedFreightNPR || 0),
    0
  );
  const totalNetEarnings = trips.reduce(
    (sum, t) => sum + (t.netEarningsNPR || 0),
    0
  );
  const totalPendingPayments = trips
    .filter((t) => t.paymentStatus !== 'paid')
    .reduce((sum, t) => sum + (t.agreedFreightNPR || 0), 0);

  // CSV Export
  const handleExportCSV = () => {
    if (trips.length === 0) {
      showToast('No trips to export');
      return;
    }

    const headers = [
      'Trip ID',
      'Tracking Code',
      'Date',
      'Cargo Title',
      'Vehicle Plate',
      'Driver Name',
      'Driver Phone',
      'Customer Name',
      'Pickup Location',
      'Destination Location',
      'Planned Distance (km)',
      'Odometer Distance (km)',
      'Agreed Freight (NPR)',
      'Additional Charges (NPR)',
      'Tolls & Parking (NPR)',
      'Loading Fee (NPR)',
      'Fuel Expenses (NPR)',
      'Platform Commission (NPR)',
      'Net Earnings (NPR)',
      'Trip Status',
      'Payment Status'
    ];

    const rows = trips.map((t) => [
      t.id,
      t.trackingCode,
      (t.pickupDateTime || t.createdAt).split('T')[0],
      `"${t.cargoTitle.replace(/"/g, '""')}"`,
      t.vehiclePlate,
      `"${t.driverName}"`,
      t.driverPhone,
      `"${t.customerName}"`,
      `"${t.pickupCity}, ${t.pickupAddress.replace(/"/g, '""')}"`,
      `"${t.destinationCity}, ${t.destinationAddress.replace(/"/g, '""')}"`,
      t.distanceKm,
      t.actualOdometerKm || 'N/A',
      t.agreedFreightNPR,
      t.additionalChargesNPR || 0,
      t.tollParkingNPR || 0,
      t.loadingUnloadingNPR || 0,
      t.fuelExpensesNPR || 0,
      t.platformCommissionNPR || 0,
      t.netEarningsNPR || 0,
      t.tripStatus,
      t.paymentStatus
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `LoadMitra_Trips_Report_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Trips CSV report downloaded successfully');
  };

  const getStatusBadge = (status: TripStatus) => {
    switch (status) {
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            {t.tripStatusInTransit}
          </span>
        );
      case 'delayed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            {t.tripStatusDelayed}
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {t.tripStatusDelivered}
          </span>
        );
      case 'assigned':
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            {t.tripStatusAccepted}
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
            <XCircle className="w-3 h-3 text-slate-500" />
            {t.tripStatusCancelled}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-orange-600" />
            <span>{t.tripsHistoryNav}</span>
          </h2>
          <p className="text-xs text-slate-500">
            Complete freight log, vehicle distance, start/end odometer, gross revenue and net earnings
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.exportCsvBtn}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.printReportBtn}</span>
          </button>
          <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Trips
          </div>
          <div className="text-2xl font-black text-slate-900 font-['Outfit'] mt-1">
            {totalTrips}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {completedTrips} Delivered
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Distance
          </div>
          <div className="text-2xl font-black text-slate-900 font-['Outfit'] mt-1">
            {totalDistance.toLocaleString()}{' '}
            <span className="text-xs font-semibold text-slate-500">km</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            Corridors &amp; Odometer
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Gross Freight
          </div>
          <div className="text-2xl font-black text-slate-900 font-['Outfit'] mt-1">
            Rs. {totalGrossRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Total Invoiced Freight
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-orange-200 bg-orange-50/30 shadow-2xs">
          <div className="text-[10px] font-bold text-orange-800 uppercase tracking-wider">
            Net Earnings
          </div>
          <div className="text-2xl font-black text-orange-600 font-['Outfit'] mt-1">
            Rs. {totalNetEarnings.toLocaleString()}
          </div>
          <div className="text-[11px] text-orange-800 font-medium mt-0.5">
            After fuel &amp; charges
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs col-span-2 lg:col-span-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Pending Balance
          </div>
          <div className="text-2xl font-black text-slate-800 font-['Outfit'] mt-1">
            Rs. {totalPendingPayments.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-0.5">
            Unsettled at unloading
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          {/* Search Box */}
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Trip ID, Tracking Code, City, Driver or Plate..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Period Filter */}
          <div className="sm:col-span-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700"
            >
              <option value="all">All Dates</option>
              <option value="daily">{t.filterDaily}</option>
              <option value="weekly">{t.filterWeekly}</option>
              <option value="monthly">{t.filterMonthly}</option>
              <option value="yearly">{t.filterYearly}</option>
              <option value="custom">{t.filterCustomDate}</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700"
            >
              <option value="all">{t.filterAllStatus}</option>
              <option value="in_transit">{t.tripStatusInTransit}</option>
              <option value="delayed">{t.tripStatusDelayed}</option>
              <option value="delivered">{t.tripStatusDelivered}</option>
              <option value="assigned">{t.tripStatusAssigned}</option>
              <option value="cancelled">{t.tripStatusCancelled}</option>
            </select>
          </div>

          {/* Submit Search */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors"
            >
              {t.filterBtn}
            </button>
          </div>
        </form>

        {/* Custom Date Range if selected */}
        {period === 'custom' && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500">{t.startDateLabel}:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md font-mono text-xs"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500">{t.endDateLabel}:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md font-mono text-xs"
              />
            </div>
            <button
              type="button"
              onClick={loadTrips}
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-md"
            >
              Apply Dates
            </button>
          </div>
        )}
      </div>

      {/* Trips Content */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500 space-y-2">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Loading trips and freight records...</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2 text-xs">
          <Truck className="w-8 h-8 text-slate-300 mx-auto" />
          <div className="font-bold text-slate-800">No trips found</div>
          <p className="text-slate-500 max-w-sm mx-auto">
            No freight trips match your filter criteria. Try choosing a different date range or resetting search query.
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="space-y-4">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow p-5 text-xs space-y-4"
            >
              {/* Trip Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                    {trip.id}
                  </span>
                  <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
                    {trip.trackingCode}
                  </span>
                  {getStatusBadge(trip.tripStatus)}
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {(trip.pickupDateTime || trip.createdAt).split('T')[0]}
                  </span>
                  {trip.actualDepartureTime && (
                    <span className="text-slate-400">
                      · Dep: {trip.actualDepartureTime.split('T')[1]?.slice(0, 5)}
                    </span>
                  )}
                </div>
              </div>

              {/* Main Info Columns */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Route & Cargo */}
                <div className="md:col-span-5 space-y-2">
                  <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <span>{trip.cargoTitle}</span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      ({trip.cargoWeightKg.toLocaleString()} kg)
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-slate-900">
                        {trip.pickupCity}:
                      </span>
                      <span className="truncate">{trip.pickupAddress}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <span className="font-semibold text-slate-900">
                        {trip.destinationCity}:
                      </span>
                      <span className="truncate">{trip.destinationAddress}</span>
                    </div>
                  </div>

                  {trip.currentCheckpoint && (
                    <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                      <span>
                        <strong>Last Checkpoint:</strong> {trip.currentCheckpoint}
                      </span>
                    </div>
                  )}
                </div>

                {/* Vehicle & Driver */}
                <div className="md:col-span-3 space-y-1.5 border-l border-slate-100 pl-4">
                  <div className="font-mono font-bold text-slate-900">
                    {trip.vehiclePlate}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {t[`cat_${trip.vehicleCategory}` as keyof typeof t] || trip.vehicleCategory}
                  </div>
                  <div className="pt-1 text-slate-700">
                    <div>
                      <strong>Driver:</strong> {trip.driverName}
                    </div>
                    <div className="text-slate-400 font-mono">{trip.driverPhone}</div>
                  </div>
                </div>

                {/* Distance, Odometer & Financials */}
                <div className="md:col-span-4 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{t.agreedFreight}:</span>
                    <span className="font-extrabold text-slate-900 font-['Outfit'] text-sm">
                      Rs. {trip.agreedFreightNPR.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Planned / Odometer:</span>
                    <span className="font-mono font-bold text-slate-700">
                      {trip.distanceKm} km
                      {trip.actualOdometerKm ? ` (${trip.actualOdometerKm} km odo)` : ''}
                    </span>
                  </div>

                  {trip.startOdometer && (
                    <div className="text-[10px] text-slate-400 font-mono">
                      Odo: {trip.startOdometer} km → {trip.endOdometer ? `${trip.endOdometer} km` : 'In transit'}
                    </div>
                  )}

                  <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-orange-800">{t.netEarnings}:</span>
                    <span className="font-black text-orange-600 font-['Outfit'] text-sm">
                      Rs. {trip.netEarningsNPR?.toLocaleString() || trip.agreedFreightNPR.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trip Actions Bar */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  <span>
                    <strong>Fuel Logs:</strong> {trip.fuelRecordsCount || 0}
                  </span>
                  <span>·</span>
                  <span>
                    <strong>Expenses:</strong> {trip.expensesCount || 0}
                  </span>
                  {trip.hasActiveDelay && (
                    <>
                      <span>·</span>
                      <span className="text-red-600 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Delay Reported
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {onSelectTripForTracking && (
                    <button
                      type="button"
                      onClick={() => onSelectTripForTracking(trip)}
                      className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Live Tracker</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveTripModal(trip)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3 h-3 text-slate-600" />
                    <span>View Ledger &amp; POD</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                  <th className="p-3">Trip ID &amp; Date</th>
                  <th className="p-3">Route &amp; Cargo</th>
                  <th className="p-3">Vehicle &amp; Driver</th>
                  <th className="p-3">Distance &amp; Odo</th>
                  <th className="p-3">Gross / Net</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {trips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3">
                      <div className="font-mono font-bold text-slate-900">{trip.id}</div>
                      <div className="text-[10px] font-mono text-orange-600">{trip.trackingCode}</div>
                      <div className="text-[11px] text-slate-400">
                        {(trip.pickupDateTime || trip.createdAt).split('T')[0]}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-800 truncate max-w-xs">{trip.cargoTitle}</div>
                      <div className="text-[11px] text-slate-500">
                        {trip.pickupCity} → {trip.destinationCity}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-mono font-bold text-slate-800">{trip.vehiclePlate}</div>
                      <div className="text-[11px] text-slate-400">{trip.driverName}</div>
                    </td>
                    <td className="p-3">
                      <div>{trip.distanceKm} km</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {trip.actualOdometerKm ? `${trip.actualOdometerKm} km odo` : 'Odo unsubmitted'}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">
                        Rs. {trip.agreedFreightNPR.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-orange-600 font-bold">
                        Net: Rs. {trip.netEarningsNPR?.toLocaleString() || trip.agreedFreightNPR.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-3">
                      {getStatusBadge(trip.tripStatus)}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => setActiveTripModal(trip)}
                        className="px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md font-semibold text-[11px]"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Comprehensive Trip Detail Modal */}
      {activeTripModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden text-xs flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm text-orange-400">
                    {activeTripModal.id}
                  </span>
                  <span className="font-mono text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                    {activeTripModal.trackingCode}
                  </span>
                  {getStatusBadge(activeTripModal.tripStatus)}
                </div>
                <h3 className="font-bold text-sm text-white mt-1">
                  {activeTripModal.cargoTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTripModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Route Summary */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Origin / Pickup
                  </div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {activeTripModal.pickupCity}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    {activeTripModal.pickupAddress}
                  </div>
                  <div className="text-slate-400 text-[10px] mt-1">
                    Scheduled: {activeTripModal.pickupDateTime}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Destination / Consignee
                  </div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {activeTripModal.destinationCity}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    {activeTripModal.destinationAddress}
                  </div>
                  <div className="text-slate-400 text-[10px] mt-1">
                    Delivery ETA: {activeTripModal.eta || 'Completed'}
                  </div>
                </div>
              </div>

              {/* Odometer & Distance Breakdown */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-orange-600" />
                  <span>Distance &amp; Odometer Record</span>
                </h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-[10px] text-slate-400 font-semibold">
                      Planned Highway
                    </div>
                    <div className="text-lg font-black text-slate-900 font-['Outfit'] mt-0.5">
                      {activeTripModal.distanceKm} km
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-[10px] text-slate-400 font-semibold">
                      Start Odometer
                    </div>
                    <div className="text-lg font-black text-slate-900 font-['Outfit'] mt-0.5">
                      {activeTripModal.startOdometer ? `${activeTripModal.startOdometer} km` : 'N/A'}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-[10px] text-slate-400 font-semibold">
                      End Odometer
                    </div>
                    <div className="text-lg font-black text-slate-900 font-['Outfit'] mt-0.5">
                      {activeTripModal.endOdometer ? `${activeTripModal.endOdometer} km` : 'Pending'}
                    </div>
                  </div>
                </div>
                {activeTripModal.actualOdometerKm && (
                  <div className="text-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 py-1.5 rounded-lg border border-emerald-200">
                    Total Distance Run: {activeTripModal.actualOdometerKm} km recorded by vehicle odometer
                  </div>
                )}
              </div>

              {/* Financial Breakdown & Deductions */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-orange-600" />
                  <span>Freight Earnings Ledger &amp; Operating Expenses</span>
                </h4>

                <div className="divide-y divide-slate-100 font-medium">
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-600">Base Agreed Freight</span>
                    <span className="font-bold text-slate-900">
                      Rs. {activeTripModal.agreedFreightNPR.toLocaleString()}
                    </span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-600">Additional Surcharges</span>
                    <span className="font-bold text-slate-900">
                      + Rs. {(activeTripModal.additionalChargesNPR || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="py-2 flex justify-between text-red-600">
                    <span>Recorded Fuel Expense</span>
                    <span className="font-bold">
                      - Rs. {(activeTripModal.fuelExpensesNPR || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="py-2 flex justify-between text-red-600">
                    <span>Tolls, Parking &amp; Loading Charges</span>
                    <span className="font-bold">
                      - Rs. {((activeTripModal.tollParkingNPR || 0) + (activeTripModal.loadingUnloadingNPR || 0)).toLocaleString()}
                    </span>
                  </div>
                  <div className="py-2 flex justify-between text-slate-500">
                    <span>LoadMitra Platform Commission (5%)</span>
                    <span className="font-bold">
                      - Rs. {(activeTripModal.platformCommissionNPR || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="py-3 flex justify-between text-sm bg-orange-50/60 px-3 rounded-lg border border-orange-200">
                    <span className="font-extrabold text-orange-950">Net Driver Earnings</span>
                    <span className="font-black text-orange-600 font-['Outfit'] text-base">
                      Rs. {activeTripModal.netEarningsNPR.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Proof of Delivery (POD) section */}
              {activeTripModal.proofOfDelivery ? (
                <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl space-y-2">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Proof of Delivery (POD) Verified</span>
                  </div>
                  <div className="text-slate-700 text-[11px] space-y-1">
                    <div>
                      <strong>Consignee:</strong> {activeTripModal.proofOfDelivery.consigneeName} ({activeTripModal.proofOfDelivery.consigneePhone})
                    </div>
                    <div>
                      <strong>Delivered At:</strong> {activeTripModal.proofOfDelivery.deliveredAt}
                    </div>
                    {activeTripModal.proofOfDelivery.notes && (
                      <div className="italic text-slate-600">
                        "{activeTripModal.proofOfDelivery.notes}"
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center text-slate-500">
                  Proof of Delivery (POD) pending consignee signature and delivery OTP verification upon arrival.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTripModal(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Report Preview Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  LoadMitra Freight Performance &amp; Trip Ledger Report
                </h3>
                <p className="text-[11px] text-slate-500">
                  LM Logistics &amp; Cargo · Generated on {new Date().toLocaleDateString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <div>
                <span className="text-[10px] text-slate-400 font-bold">Total Trips:</span>
                <div className="font-bold text-slate-900 text-sm">{totalTrips}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold">Total Distance:</span>
                <div className="font-bold text-slate-900 text-sm">{totalDistance} km</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold">Gross Revenue:</span>
                <div className="font-bold text-slate-900 text-sm">Rs. {totalGrossRevenue.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold">Net Earnings:</span>
                <div className="font-bold text-orange-600 text-sm">Rs. {totalNetEarnings.toLocaleString()}</div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden max-h-72 overflow-y-auto">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead className="bg-slate-100 font-bold text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-2">Trip</th>
                    <th className="p-2">Route</th>
                    <th className="p-2">Vehicle</th>
                    <th className="p-2">Distance</th>
                    <th className="p-2">Gross</th>
                    <th className="p-2">Net</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {trips.map((t) => (
                    <tr key={t.id}>
                      <td className="p-2 font-mono font-bold">{t.id}</td>
                      <td className="p-2">{t.pickupCity} → {t.destinationCity}</td>
                      <td className="p-2 font-mono">{t.vehiclePlate}</td>
                      <td className="p-2">{t.distanceKm} km</td>
                      <td className="p-2">Rs. {t.agreedFreightNPR.toLocaleString()}</td>
                      <td className="p-2 text-orange-600 font-bold">Rs. {t.netEarningsNPR?.toLocaleString()}</td>
                      <td className="p-2">{t.tripStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  window.print();
                  setIsPrintModalOpen(false);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Confirm Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
