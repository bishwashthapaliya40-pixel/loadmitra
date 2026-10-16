import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { CargoPost, BidOffer } from '../../types';
import {
  X,
  DollarSign,
  Truck,
  UserCheck,
  Star,
  Check,
  RotateCcw,
  Clock,
  ArrowRight
} from 'lucide-react';

interface Props {
  cargo: CargoPost;
  onClose: () => void;
}

export const BiddingNegotiationModal: React.FC<Props> = ({ cargo, onClose }) => {
  const { t, currentUser, showToast, setActiveTab, setSelectedBookingForChallan } = useApp();
  const [bids, setBids] = useState<BidOffer[]>([]);
  const [loading, setLoading] = useState(true);

  // New Bid state for driver
  const [offerAmount, setOfferAmount] = useState(cargo.initialBudgetNPR.toString());
  const [pickupETA, setPickupETA] = useState('Ready for pickup within 2 hours');
  const [message, setMessage] = useState('');
  const [counterInput, setCounterInput] = useState<Record<string, string>>({});

  useEffect(() => {
    loadBids();
  }, [cargo.id]);

  const loadBids = async () => {
    setLoading(true);
    const data = await api.getBids(cargo.id);
    setBids(data);
    setLoading(false);
  };

  const handleDriverSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    const fare = Number(offerAmount);
    if (!fare || fare <= 0) {
      showToast('Please enter a valid fare amount');
      return;
    }

    const newBid: Partial<BidOffer> = {
      cargoId: cargo.id,
      cargoTitle: cargo.title,
      driverId: currentUser.id,
      driverName: currentUser.name,
      driverPhone: currentUser.phone,
      driverRating: currentUser.rating || 4.8,
      vehicleId: 'veh-current',
      vehiclePlate: 'Ba Pra 01-026 Cha 4410',
      vehicleCategory: cargo.requiredVehicleCategory || 'four_wheel_pickup',
      offeredFareNPR: fare,
      pickupETA,
      message
    };

    await api.createBid(newBid);
    showToast('Fare offer submitted successfully!');
    loadBids();
  };

  const handleCustomerCounter = async (bidId: string) => {
    const amount = Number(counterInput[bidId]);
    if (!amount || amount <= 0) {
      showToast('Please enter your counter offer amount');
      return;
    }

    await api.updateBid(bidId, { customerCounterFareNPR: amount });
    showToast(`Counter offer of NPR रू ${amount.toLocaleString()} sent to driver`);
    loadBids();
  };

  const handleAcceptBid = async (bid: BidOffer) => {
    await api.updateBid(bid.id, { status: 'accepted' });
    showToast(`Booking confirmed with ${bid.driverName}! Official Challan generated.`);
    onClose();
    setActiveTab('shipments');
  };

  const handleRejectBid = async (bidId: string) => {
    await api.updateBid(bidId, { status: 'rejected' });
    showToast('Offer declined');
    loadBids();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">
              {t.negotiationTitle}
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {cargo.title}
            </h3>
            <div className="text-xs text-slate-500">
              {cargo.pickupLocation.city} → {cargo.destinationLocation.city} · {cargo.weightKg} kg · Budget: NPR रू {cargo.initialBudgetNPR.toLocaleString()}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Driver Make Offer Form (if role is driver / fleet) */}
          {currentUser.role !== 'customer' && (
            <div className="p-4 bg-orange-50/60 border border-orange-200 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-orange-950 uppercase tracking-wider">
                Submit Your Fare Proposal (inDrive Style)
              </h4>
              <form onSubmit={handleDriverSubmitBid} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      {t.offeredFare}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">NPR</span>
                      <input
                        type="number"
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(e.target.value)}
                        placeholder="18500"
                        className="w-full pl-12 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-orange-500/20"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Estimated Pickup Time
                    </label>
                    <input
                      type="text"
                      value={pickupETA}
                      onChange={(e) => setPickupETA(e.target.value)}
                      placeholder="e.g. In 1 hour, or Tomorrow 7 AM"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Message / Truck Specs
                  </label>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Mahindra Bolero with full tarpaulin, experienced driver"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs transition-colors"
                >
                  {t.makeOfferBtn}
                </button>
              </form>
            </div>
          )}

          {/* List of active bids on this consignment */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Received Fare Offers ({bids.length})
            </h4>

            {loading ? (
              <div className="py-6 text-center text-xs text-slate-400">Loading bids...</div>
            ) : bids.length === 0 ? (
              <div className="py-6 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
                No driver offers submitted yet. Shippers and drivers can negotiate directly here.
              </div>
            ) : (
              bids.map((bid) => {
                const effectiveFare =
                  bid.driverCounterFareNPR || bid.customerCounterFareNPR || bid.offeredFareNPR;
                return (
                  <div
                    key={bid.id}
                    className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{bid.driverName}</span>
                          <span className="flex items-center text-amber-500 text-xs font-bold">
                            <Star className="w-3 h-3 fill-current mr-0.5" />
                            {bid.driverRating}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {bid.vehiclePlate} · {t[`cat_${bid.vehicleCategory}` as keyof typeof t] || bid.vehicleCategory}
                        </div>
                        {bid.pickupETA && (
                          <div className="text-[11px] text-slate-600 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{bid.pickupETA}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Offered Fare</div>
                        <div className="text-lg font-black text-slate-900 font-['Outfit'] tabular-nums">
                          NPR रू {effectiveFare.toLocaleString()}
                        </div>
                        {bid.customerCounterFareNPR && (
                          <div className="text-[10px] text-orange-600 font-bold">
                            Customer Counter: रू {bid.customerCounterFareNPR.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {bid.message && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg italic">
                        "{bid.message}"
                      </p>
                    )}

                    {/* Negotiation Controls */}
                    {bid.status !== 'accepted' && bid.status !== 'rejected' && (
                      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                        {/* Shipper counteroffer field */}
                        {currentUser.role === 'customer' && (
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <input
                              type="number"
                              value={counterInput[bid.id] || ''}
                              onChange={(e) =>
                                setCounterInput({ ...counterInput, [bid.id]: e.target.value })
                              }
                              placeholder="Counter Fare (NPR)"
                              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold w-36"
                            />
                            <button
                              type="button"
                              onClick={() => handleCustomerCounter(bid.id)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
                            >
                              Counter
                            </button>
                          </div>
                        )}

                        {/* Acceptance buttons */}
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <button
                            type="button"
                            onClick={() => handleRejectBid(bid.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 transition-colors"
                          >
                            {t.declineOfferBtn}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAcceptBid(bid)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{t.acceptOfferBtn}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {bid.status === 'accepted' && (
                      <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-bold flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Accepted! Consignment booked with digital Challan issued.</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
