import React from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import { BrandLogo } from '../common/BrandLogo';
import { X, Printer, Download, ShieldCheck, QrCode } from 'lucide-react';

interface Props {
  booking: Booking;
  onClose: () => void;
}

export const DigitalChallanView: React.FC<Props> = ({ booking, onClose }) => {
  const { t } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Control Bar (Hidden during print) */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t.challanTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-orange-400" />
              <span>{t.printDocument}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Challan Body */}
        <div id="printable-challan" className="p-8 overflow-y-auto space-y-6 text-slate-900 text-xs">
          {/* Header Block with Brand Logo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-900">
            <div className="space-y-1">
              <BrandLogo size="lg" />
              <div className="text-[11px] text-slate-600 font-medium pt-1">
                Government of Nepal Commercial Goods Carrier Compliance (चलानी फारम)
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                VAT / PAN: 601994821 · Regd: Kathmandu Central Commercial Transport Bureau
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Official Transport Challan
              </div>
              <div className="text-lg font-black font-mono tracking-tight text-slate-900">
                {booking.challanNumber}
              </div>
              <div className="text-[11px] text-slate-500">
                Date: {new Date(booking.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Consignor and Consignee 2-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Consignor */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                {t.consignorDetails}
              </div>
              <div className="font-bold text-sm text-slate-900">{booking.customerName}</div>
              <div className="text-slate-600">{booking.pickupAddress}</div>
              <div className="font-semibold text-slate-800">{booking.pickupCity}, Nepal</div>
              <div className="text-slate-500 font-mono text-[11px]">Tel: {booking.customerPhone}</div>
            </div>

            {/* Consignee */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                {t.consigneeDetails}
              </div>
              <div className="font-bold text-sm text-slate-900">
                {booking.proofOfDelivery?.consigneeName || 'Consignee Receiver'}
              </div>
              <div className="text-slate-600">{booking.destinationAddress}</div>
              <div className="font-semibold text-slate-800">{booking.destinationCity}, Nepal</div>
              <div className="text-slate-500 font-mono text-[11px]">
                Tel: {booking.proofOfDelivery?.consigneePhone || '+977-9800000000'}
              </div>
            </div>
          </div>

          {/* Carrier & Vehicle Details */}
          <div className="p-4 border border-slate-200 rounded-xl bg-white space-y-2">
            <div className="text-[10px] uppercase font-bold text-slate-400">
              {t.carrierDetails}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <div className="text-slate-500 text-[11px]">Assigned Driver:</div>
                <div className="font-bold text-slate-800">{booking.driverName}</div>
              </div>
              <div>
                <div className="text-slate-500 text-[11px]">Vehicle Number:</div>
                <div className="font-bold font-mono text-slate-900 text-sm">{booking.vehiclePlate}</div>
              </div>
              <div>
                <div className="text-slate-500 text-[11px]">Vehicle Type:</div>
                <div className="font-medium text-slate-800">{t[`cat_${booking.vehicleCategory}` as keyof typeof t] || booking.vehicleCategory}</div>
              </div>
              <div>
                <div className="text-slate-500 text-[11px]">Driver Mobile:</div>
                <div className="font-mono text-slate-800">{booking.driverPhone}</div>
              </div>
            </div>
          </div>

          {/* Consignment Itemization Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-[11px] uppercase font-bold text-slate-600 border-b border-slate-200">
                  <th className="p-3">SN</th>
                  <th className="p-3">Freight Description</th>
                  <th className="p-3 text-right">Net Weight</th>
                  <th className="p-3 text-right">Route Corridor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-mono">01</td>
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{booking.cargoTitle}</div>
                    <div className="text-slate-500 text-[11px]">Inspected and loaded in standard protective freight packaging</div>
                  </td>
                  <td className="p-3 text-right font-mono font-bold">
                    {booking.cargoWeightKg.toLocaleString()} kg
                  </td>
                  <td className="p-3 text-right font-medium">
                    {booking.pickupCity} → {booking.destinationCity} ({booking.distanceKm} km)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown & Digital QR */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-2">
            {/* QR Code Security Stamp */}
            <div className="sm:col-span-5 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
              {/* Clean SVG Vector QR simulation */}
              <div className="w-16 h-16 bg-white p-1 rounded-md border border-slate-300 shrink-0 flex items-center justify-center">
                <QrCode className="w-14 h-14 text-slate-900" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.officialQrValidation}</span>
                </div>
                <div className="text-[11px] text-slate-600 font-mono">
                  VERIFIED: {booking.challanNumber}
                </div>
                <div className="text-[10px] text-slate-400">
                  Scan to verify authentic transport challan on Nepal highway checkpoints
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="sm:col-span-7 p-4 bg-orange-50/50 border border-orange-200 rounded-xl space-y-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Agreed Total Freight Fare:</span>
                <span className="font-bold font-mono text-slate-900">
                  NPR रू {booking.agreedFareNPR.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs text-emerald-700 font-medium">
                <span>{t.advanceAmount}:</span>
                <span className="font-mono">
                  - NPR रू {booking.advanceAmountNPR.toLocaleString()}
                </span>
              </div>
              <div className="border-t border-orange-200 pt-1.5 flex justify-between text-sm font-black text-orange-950">
                <span>{t.balancePayable}:</span>
                <span className="font-mono font-['Outfit']">
                  NPR रू {booking.balanceAmountNPR.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Legal Signatures Block */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-3 gap-4 text-center text-[11px] text-slate-500">
            <div>
              <div className="h-10 border-b border-slate-300 mb-1" />
              <div className="font-bold text-slate-800">Shipper Signature</div>
              <div>(Consignor Agent)</div>
            </div>

            <div>
              <div className="h-10 border-b border-slate-300 mb-1 flex items-center justify-center font-mono text-xs font-bold text-slate-700">
                {booking.driverName}
              </div>
              <div className="font-bold text-slate-800">Carrier Signature</div>
              <div>(Vehicle Driver)</div>
            </div>

            <div>
              <div className="h-10 border-b border-slate-300 mb-1 flex items-center justify-center font-mono text-xs text-emerald-800 font-bold">
                {booking.proofOfDelivery?.otpVerified ? 'OTP Verified' : 'Awaiting Unloading'}
              </div>
              <div className="font-bold text-slate-800">Consignee Sign &amp; Seal</div>
              <div>(Delivery Receiver)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
