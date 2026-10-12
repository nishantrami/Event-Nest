import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Loader2,
  Tag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useNotifications } from '../context/NotificationContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const Checkout = () => {
  const { items, clearCart, subtotal, serviceFee, gst, total, formattedTotal } = useCart();
  const { user } = useAuth();
  const { createBooking } = useBooking();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  // Contact form state
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+91 98765 43210');

  // Keep contact info synced with current authenticated user
  React.useEffect(() => {
    if (user) {
      if (user.name) setCustomerName(user.name);
      if (user.email) setCustomerEmail(user.email);
      if (user.phone) setCustomerPhone(user.phone);
    }
  }, [user]);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [upiId, setUpiId] = useState(user?.email ? `${user.email.split('@')[0]}@okaxis` : 'user@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8921');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('842');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Promo code simulator
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState(null);

  // Payment processing animation simulation
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);

  if (items.length === 0 && !isProcessing) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4 px-4">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          No Tickets to Checkout
        </h2>
        <p className="text-xs text-slate-500">
          Your cart is currently empty. Please choose an event to book tickets.
        </p>
        <Link to="/events">
          <Button variant="primary">Browse Events</Button>
        </Link>
      </div>
    );
  }

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'EVENTNEST' || promoCode.trim().toUpperCase() === 'FIRST') {
      const discount = Math.round(subtotal * 0.1); // 10% discount
      setAppliedDiscount(discount);
      setPromoMessage({ success: true, text: `Code applied! Saved ₹${discount.toLocaleString('en-IN')}` });
    } else {
      setPromoMessage({ success: false, text: 'Invalid coupon code. Try "EVENTNEST"' });
    }
  };

  const finalTotal = Math.max(0, total - appliedDiscount);

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessStep(1); // Encrypting

    setTimeout(() => {
      setProcessStep(2); // Authorizing
    }, 1000);

    setTimeout(() => {
      setProcessStep(3); // Verified
    }, 2200);

    setTimeout(() => {
      // Create confirmed booking
      const newBooking = createBooking({
        items,
        pricing: {
          subtotal,
          serviceFee,
          gst,
          total: finalTotal,
        },
        customerInfo: {
          name: customerName || user?.name || 'Valued Attendee',
          email: customerEmail || user?.email || '',
          phone: customerPhone || user?.phone || '',
        },
        userId: user?.id,
        userEmail: user?.email || customerEmail,
        paymentDetails: {
          method: paymentMethod === 'upi' ? `UPI (${upiId})` : paymentMethod === 'card' ? 'Credit Card' : `Net Banking (${selectedBank})`,
        },
      });

      // Clear cart
      clearCart();

      // Trigger notification
      addNotification({
        title: 'Booking Confirmed!',
        message: `Your booking for ${items[0]?.event?.title} (Ref: ${newBooking.id}) is confirmed.`,
        type: 'success',
        link: `/ticket/${newBooking.id}`
      });

      // Navigate to booking success page
      navigate(`/booking-success?id=${newBooking.id}`);
    }, 3200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Checkout Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Step 3 of 3
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
          Complete Your Reservation
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review details and simulate instant checkout. No real money is charged.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Form & Payment Methods */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section 1: Contact Details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
              <Input
                label="Email Address (For E-Tickets)"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />
              <Input
                label="Phone Number (SMS Gate Pass)"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
                className="sm:col-span-2"
              />
            </div>
          </div>

          {/* Section 2: Payment Simulation Method */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                Payment Simulation Method
              </h3>
              <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-2.5 py-1 rounded-full border border-orange-200 dark:border-orange-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Sandbox Demo
              </span>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-red-600 bg-red-50/50 dark:bg-red-950/40 text-red-600 dark:text-red-400 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <QrCode className="w-6 h-6" />
                <span className="text-xs font-bold">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-red-600 bg-red-50/50 dark:bg-red-950/40 text-red-600 dark:text-red-400 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <CreditCard className="w-6 h-6" />
                <span className="text-xs font-bold">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === 'netbanking'
                    ? 'border-red-600 bg-red-50/50 dark:bg-red-950/40 text-red-600 dark:text-red-400 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Building2 className="w-6 h-6" />
                <span className="text-xs font-bold">Net Banking</span>
              </button>
            </div>

            {/* Method Inputs */}
            {paymentMethod === 'upi' && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-4">
                <Input
                  label="Virtual Payment Address (VPA / UPI ID)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@okhdfcbank"
                  helperText="Supports Google Pay, PhonePe, Paytm, and all BHIM UPI apps"
                />
                <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500">
                  <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    Google Pay
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    PhonePe
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    Paytm UPI
                  </span>
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-4">
                <Input
                  label="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4532 0000 0000 0000"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry (MM/YY)"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="12/28"
                  />
                  <Input
                    label="CVV"
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="•••"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Select Bank
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                    <button
                      type="button"
                      key={bank}
                      onClick={() => setSelectedBank(bank)}
                      className={`p-3 rounded-xl border text-xs font-bold text-center transition-colors ${
                        selectedBank === bank
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Pay CTA */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Booking Summary
            </h3>

            {/* Items Mini List */}
            <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 pr-1">
              {items.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {item.event.title}
                  </h4>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>{item.ticketType.name} (x{item.quantity})</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ₹{item.subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {item.selectedSeats?.length > 0 && (
                    <span className="text-[10px] text-indigo-500 font-bold block">
                      Seats: {item.selectedSeats.join(', ')}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo Code (try 'EVENTNEST')"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none uppercase font-semibold"
                />
                <Button type="submit" variant="secondary" size="sm">
                  Apply
                </Button>
              </div>
              {promoMessage && (
                <p className={`text-[11px] font-bold ${promoMessage.success ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {promoMessage.text}
                </p>
              )}
            </form>

            {/* Totals Breakdown */}
            <div className="space-y-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Service Fee:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ₹{serviceFee.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST (18%):</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ₹{gst.toLocaleString('en-IN')}
                </span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-500 font-bold">
                  <span>Special Promo Discount:</span>
                  <span>-₹{appliedDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Total Due:</span>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Pay Button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full text-base font-bold shadow-xl shadow-indigo-600/30 py-3.5"
              onClick={handlePaymentSubmit}
              disabled={isProcessing}
            >
              Pay ₹{finalTotal.toLocaleString('en-IN')}
            </Button>

            <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Simulated Payment Environment • No Real Charge</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Payment Processing Modal */}
      <AnimatePresence>
        {isProcessing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl"
            >
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-900 animate-ping opacity-40" />
                <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40">
                  {processStep === 3 ? (
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  ) : (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {processStep === 1 && 'Encrypting Transaction...'}
                  {processStep === 2 && 'Authorizing with Bank...'}
                  {processStep === 3 && 'Payment Verified!'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {processStep === 1 && 'Establishing 256-bit quantum-safe handshake.'}
                  {processStep === 2 && 'Confirming authorization with payment gateway.'}
                  {processStep === 3 && 'Generating your official digital E-Ticket...'}
                </p>
              </div>

              {/* Progress Steps Indicator */}
              <div className="flex items-center justify-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full transition-colors ${processStep >= 1 ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                <div className={`w-2.5 h-2.5 rounded-full transition-colors ${processStep >= 2 ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                <div className={`w-2.5 h-2.5 rounded-full transition-colors ${processStep >= 3 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
