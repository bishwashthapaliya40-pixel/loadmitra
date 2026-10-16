import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Booking, ShipmentStatus } from '../../types';
import {
  Navigation,
  CheckCircle2,
  MapPin,
  Clock,
  Phone,
  FileText,
  KeyRound,
  PenTool,
  RotateCcw,
  Truck,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const TripTrackerAndPOD: React.FC = () => {
  const { t, setSelectedBookingForChallan, showToast, currentUser } = useApp();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  // POD Form State
  const [otpEntered, setOtpEntered] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [signatureHasStrokes, setSignatureHasStrokes] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    const data = await api.getBookings();
    setBookings(data);
    if (data.length > 0 && !selectedBooking) {
      setSelectedBooking(data[0]);
    }
    setLoading(false);
  };

  // Canvas drawing handlers for digital signature
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsSigning(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isSigning) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setSignatureHasStrokes(true);
  };

  const stopDrawing = () => {
    setIsSigning(false);
  };

  const clearSignatureCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureHasStrokes(false);
  };

  const handleUpdateStatus = async (status: ShipmentStatus, checkpoint: string, eta: string) => {
    if (!selectedBooking) return;
    await api.updateShipmentStatus(selectedBooking.id, { status, checkpoint, eta });
    showToast(`Shipment status updated to ${status}`);
    loadBookings();
    setSelectedBooking({
      ...selectedBooking,
      status,
      currentCheckpoint: checkpoint,
      eta
    });
  };

  const handleVerifyPOD = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    if (otpEntered.trim() !== selectedBooking.otpCode) {
      showToast(`Invalid OTP! Please enter correct 4-digit code provided by consignee.`);
      return;
    }

    if (!signatureHasStrokes) {
      showToast('Consignee signature required on canvas before POD confirmation.');
      return;
    }

    const canvas = canvasRef.current;
    const signatureData = canvas ? canvas.toDataURL('image/png') : '';

    try {
      await api.submitProofOfDelivery(selectedBooking.id, {
        otpEntered,
        digitalSignature: signatureData,
        unloadingPhotoUrl: '/src/assets/images/cargo_loading_warehouse_1792079810527.jpg',
        notes: 'Goods physically verified and signed by consignee.'
      });
      showToast('Proof of Delivery confirmed! Payment released and shipment completed.');
      loadBookings();
    } catch (err: any) {
      showToast(err.message || 'Error verifying POD');
    }
  };

  const checkpointsList = [
    { title: 'Origin Bay Loading', time: '07:30 AM', passed: true },
    { title: 'Nagdhunga Security Checkpoint', time: '09:00 AM', passed: true },
    { title: 'Mugling Highway Junction', time: '11:45 AM', passed: selectedBooking?.status !== 'assigned' },
    { title: 'Narayangarh Bypass Weighbridge', time: '01:30 PM', passed: selectedBooking?.status === 'at_destination' || selectedBooking?.status === 'delivered' },
    { title: 'Destination Unloading Point', time: '03:15 PM', passed: selectedBooking?.status === 'delivered' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {t.navActiveShipments} &amp; Live Tracking
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time highway progress, digital challans, delivery OTP and digital signature POD
          </p>
        </div>

        {selectedBooking && (
          <button
            type="button"
            onClick={() => setSelectedBookingForChallan(selectedBooking)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
          >
            <FileText className="w-4 h-4 text-orange-400" />
            <span>{t.viewChallanBtn}</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs">
          Loading active highway consignments...
        </div>
      ) : bookings.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8 space-y-3">
          <Truck className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No active shipments in transit</h3>
          <p className="text-xs text-slate-500">
            Accept a fare bid from the marketplace to start a live freight trip.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Shipment Selector & Highway Timeline */}
          <div className="lg:col-span-7 space-y-5">
            {/* Horizontal Booking Selector if multiple */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {bookings.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBooking(b)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    selectedBooking?.id === b.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-mono text-orange-400 mr-1.5">{b.challanNumber}</span>
                  <span>{b.pickupCity} → {b.destinationCity}</span>
                </button>
              ))}
            </div>

            {selectedBooking && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
                {/* Header Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      Consignment ID: {selectedBooking.id}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {selectedBooking.cargoTitle}
                    </h3>
                    <div className="text-xs text-slate-500">
                      {selectedBooking.vehiclePlate} · {t[`cat_${selectedBooking.vehicleCategory}` as keyof typeof t] || selectedBooking.vehicleCategory}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      {t.status_in_transit}
                    </div>
                    <span className="inline-block px-2.5 py-1 bg-orange-100 text-orange-800 rounded-md text-xs font-bold uppercase tracking-wider">
                      {t[`status_${selectedBooking.status}` as keyof typeof t] || selectedBooking.status}
                    </span>
                  </div>
                </div>

                {/* Simulated Highway Route Map Visual */}
                <div className="relative bg-slate-900 rounded-xl overflow-hidden p-5 text-white">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-orange-400 animate-pulse" />
                      <span className="font-bold">Nepal Highway Corridor Live Status</span>
                    </div>
                    <span className="font-mono text-slate-400 text-[11px]">
                      {selectedBooking.distanceKm} km · Prithvi Highway
                    </span>
                  </div>

                  {/* Route Visual Line */}
                  <div className="relative py-4">
                    <div className="h-1.5 bg-slate-800 rounded-full w-full relative">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-orange-500 rounded-full transition-all duration-500"
                        style={{
                          width:
                            selectedBooking.status === 'delivered'
                              ? '100%'
                              : selectedBooking.status === 'at_destination'
                              ? '85%'
                              : selectedBooking.status === 'in_transit'
                              ? '55%'
                              : '20%'
                        }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-medium">
                      <span>{selectedBooking.pickupCity}</span>
                      <span className="text-orange-400 font-bold">{selectedBooking.currentCheckpoint}</span>
                      <span>{selectedBooking.destinationCity}</span>
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                      <span className="text-slate-200">{selectedBooking.eta}</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">GPS Active</span>
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Highway Patrol Milestones &amp; Checkpoints
                  </h4>
                  <div className="space-y-2">
                    {checkpointsList.map((cp, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                          cp.passed
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 font-medium'
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2
                            className={`w-4 h-4 ${cp.passed ? 'text-emerald-600' : 'text-slate-300'}`}
                          />
                          <span>{cp.title}</span>
                        </div>
                        <span className="font-mono text-[11px]">{cp.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Driver Transit Status Control Bar (for driver / company role) */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="text-[11px] font-bold text-slate-700">
                    Update Shipment Progress (Driver / Transport Company Action):
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateStatus('loaded', 'Kathmandu Loading Bay Sealed', 'Departing in 15 mins')
                      }
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
                    >
                      Goods Loaded
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateStatus(
                          'in_transit',
                          'Mugling Junction Checkpoint',
                          'Approx 3 hours remaining'
                        )
                      }
                      className="p-2 bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 rounded-lg text-xs font-semibold"
                    >
                      In Transit
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateStatus(
                          'at_destination',
                          'Destination Receiving Bay',
                          'Arrived - Awaiting Unloading'
                        )
                      }
                      className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-xs font-semibold"
                    >
                      At Destination
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateStatus('delivered', 'Consignee Unloaded & Stored', 'Completed')
                      }
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold"
                    >
                      Mark Delivered
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Consignee OTP & Digital Signature POD */}
          <div className="lg:col-span-5 space-y-5">
            {selectedBooking && (
              <>
                {/* Consignee Security Box */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-slate-800 shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold tracking-wider text-orange-400 flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4" />
                      <span>Consignee Delivery OTP</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Share with driver upon arrival</span>
                  </div>

                  <div className="p-4 bg-white/10 rounded-xl text-center border border-white/10">
                    <div className="text-[10px] uppercase font-bold text-slate-300">
                      Official 4-Digit Secret Code
                    </div>
                    <div className="text-3xl font-black tracking-widest text-orange-400 font-mono mt-1">
                      {selectedBooking.otpCode}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Never disclose this OTP until all cargo packages have been counted, inspected, and safely unloaded at your premises.
                  </p>
                </div>

                {/* Proof of Delivery (POD) Form */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Proof of Delivery (POD) Verification
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Electronic consignee sign-off &amp; payment release
                      </p>
                    </div>
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>

                  {selectedBooking.proofOfDelivery?.otpVerified ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-900">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Consignment Officially Delivered</span>
                      </div>
                      <p className="text-xs">
                        Delivered to {selectedBooking.proofOfDelivery.consigneeName} on{' '}
                        {new Date(selectedBooking.proofOfDelivery.deliveredAt).toLocaleDateString()}. OTP verified and digital signature archived with challan.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleVerifyPOD} className="space-y-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Enter 4-Digit Consignee OTP *
                        </label>
                        <input
                          type="text"
                          maxLength={4}
                          value={otpEntered}
                          onChange={(e) => setOtpEntered(e.target.value)}
                          placeholder="e.g. 4892"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-center text-lg font-black tracking-widest focus:ring-2 focus:ring-orange-500/20"
                          required
                        />
                      </div>

                      {/* HTML5 Signature Canvas */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                            <PenTool className="w-3.5 h-3.5 text-orange-600" />
                            <span>Consignee Digital Signature *</span>
                          </label>
                          <button
                            type="button"
                            onClick={clearSignatureCanvas}
                            className="text-[10px] text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>{t.clearSignature}</span>
                          </button>
                        </div>

                        <div className="border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                          <canvas
                            ref={canvasRef}
                            width={360}
                            height={120}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            className="w-full h-28 touch-none bg-white cursor-crosshair"
                          />
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 italic">
                          Draw signature using finger or mouse
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t.submitPodBtn}</span>
                      </button>
                    </form>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
