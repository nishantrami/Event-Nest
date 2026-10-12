import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  Smartphone,
  Check,
  Lock,
  Receipt,
  ExternalLink
} from 'lucide-react';
import { useEvents } from '../../context/EventsContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../data/categories';
import { Input, Select } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

const SAMPLE_POSTERS = [
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
];

export const CreateEvent = () => {
  const { createEvent, adminFeeAmount } = useEvents();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('music');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-11-20');
  const [time, setTime] = useState('19:30');
  const [city, setCity] = useState('Mumbai');
  const [venue, setVenue] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState(550);
  const [totalSeats, setTotalSeats] = useState(150);
  const [image, setImage] = useState(SAMPLE_POSTERS[0]);
  const [organizerName, setOrganizerName] = useState(user?.name || 'Live Soundscapes');

  // Payment & Receipt Modals for User Organizing Fee
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'netbanking'
  const [upiId, setUpiId] = useState(user?.email ? `${user.email.split('@')[0]}@okaxis` : 'user@okhdfcbank');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState(null);

  const validateForm = () => {
    if (!title.trim()) {
      alert('Please enter an event title.');
      return false;
    }
    if (!venue.trim()) {
      alert('Please enter a venue name.');
      return false;
    }
    return true;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isAdmin) {
      // Super Admin is exempt from fee
      const created = createEvent({
        title: title.trim(),
        category,
        description: description.trim() || 'Join us for an electrifying live experience packed with world-class production, curated food, and unforgettable memories.',
        date,
        time,
        city,
        venue: venue.trim(),
        location: location.trim() || `${venue.trim()}, ${city}`,
        price: Number(price) || 550,
        totalSeats: Number(totalSeats) || 120,
        image,
        organizerName: organizerName.trim(),
        organizerEmail: user?.email || 'admin@eventnest.com',
        organizedByUser: false,
        adminFeePaid: 0,
        recordFee: false,
        tags: [category, city, 'Admin Live'],
      });

      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => {
        navigate('/organizer/events');
      }, 1200);
    } else {
      // Normal User must pay the Admin Organization Charge in Indian Currency (₹)
      setIsPaymentModalOpen(true);
    }
  };

  const handlePayAdminFeeAndPublish = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      const generatedTxnId = `TXN-ADM-${Date.now().toString().slice(-6)}`;

      const created = createEvent({
        title: title.trim(),
        category,
        description: description.trim() || 'Join us for an electrifying live experience packed with world-class production, curated food, and unforgettable memories.',
        date,
        time,
        city,
        venue: venue.trim(),
        location: location.trim() || `${venue.trim()}, ${city}`,
        price: Number(price) || 550,
        totalSeats: Number(totalSeats) || 120,
        image,
        organizerName: organizerName.trim(),
        organizerEmail: user?.email || 'user@eventnest.com',
        userId: user?.id || 'usr-default',
        organizedByUser: true,
        adminFeePaid: adminFeeAmount,
        paymentStatus: 'Paid',
        paymentMethod: paymentMethod === 'upi' ? `UPI (${upiId})` : paymentMethod === 'card' ? 'RuPay / Card' : 'Net Banking',
        transactionId: generatedTxnId,
        tags: [category, city, 'User Hosted'],
      });

      setIsProcessingPayment(false);
      setIsPaymentModalOpen(false);

      // Celebration effect
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 },
      });

      setPaymentReceipt({
        event: created,
        transactionId: generatedTxnId,
        amount: adminFeeAmount,
        currency: 'INR',
        currencySymbol: '₹',
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <Link
          to={isAdmin ? '/organizer' : '/'}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {isAdmin ? 'Back to Dashboard' : 'Back to Home'}
        </Link>
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
          {isAdmin ? 'Super Admin Publishing' : 'Event Organizer Studio'}
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {isAdmin ? 'Publish Catalog Event (Admin)' : 'Organize Your Live Event'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Publish your event to EventNest. It will instantly be discoverable across our discovery feed, category listings, and search.
        </p>
      </div>

      {/* Admin Fee Notice Card (Indian Currency INR) */}
      {!isAdmin ? (
        <div className="p-6 rounded-3xl bg-orange-50 dark:bg-slate-900 border-2 border-orange-500 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-orange-500/20 shrink-0">
                ₹
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                    Admin Organizing Charge
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300">
                    Indian Currency (INR)
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Flat ₹{adminFeeAmount} Platform Publishing Fee
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  To ensure authentic live events and maintain 100% verified experiences, EventNest Admin charges a simple flat fee of <strong>₹{adminFeeAmount} INR</strong> to verify and publish your event live.
                </p>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-emerald-200 dark:sm:border-emerald-800/80 sm:pl-6 shrink-0">
              <span className="text-xs font-semibold text-slate-400 block">Total Due</span>
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                ₹{adminFeeAmount}
              </span>
              <span className="text-[10px] text-slate-500 block">One-time payment</span>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40 flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Fraud Guarantee Included
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-4 h-4 text-indigo-500" /> Reaches 500,000+ Fans
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4 text-emerald-500" /> Instant Payment via UPI / Cards
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-purple-800 dark:text-purple-300 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Super Administrator Mode Active: Platform publishing charge is waived (₹0).</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-[10px]">
            Admin Exemption
          </span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleFormSubmit} className="space-y-8">
        
        {/* Section 1: Core Details */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            1. Event Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sonic Odyssey 2026 Live"
              required
              className="sm:col-span-2"
            />

            <Select
              label="Event Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={CATEGORIES.map((c) => ({ label: c.name, value: c.slug }))}
            />

            <Input
              label="Organizer / Host Name"
              value={organizerName}
              onChange={(e) => setOrganizerName(e.target.value)}
              required
            />

            <div className="sm:col-span-2 space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Event Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Give an overview of the performers, lineup, venue ambiance, and stage highlights..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Date, Time & Venue */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            2. Date, Time & Location
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Event Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <Input
              label="Start Time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />

            <Select
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              options={[
                { label: 'Mumbai', value: 'Mumbai' },
                { label: 'Bengaluru', value: 'Bengaluru' },
                { label: 'Delhi', value: 'Delhi' },
                { label: 'Hyderabad', value: 'Hyderabad' },
                { label: 'Kolkata', value: 'Kolkata' },
                { label: 'Goa', value: 'Goa' },
              ]}
            />

            <Input
              label="Venue Name"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Jio World Garden Arena"
              required
            />

            <Input
              label="Complete Address / Sub-area"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bandra Kurla Complex, Mumbai"
              className="sm:col-span-2"
            />
          </div>
        </div>

        {/* Section 3: Tickets & Seating */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            3. Ticketing & Seating Capacity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Starting Ticket Price (₹550 - ₹1,500 INR)"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min={550}
              max={1500}
              required
            />

            <Input
              label="Total Available Seats"
              type="number"
              value={totalSeats}
              onChange={(e) => setTotalSeats(Number(e.target.value))}
              min={10}
              required
            />
          </div>
        </div>

        {/* Section 4: Event Poster / Image */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            4. Cover Poster & Visuals
          </h3>

          <Input
            label="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            required
          />

          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 block">
              Or pick a high-resolution preset:
            </span>
            <div className="grid grid-cols-5 gap-3">
              {SAMPLE_POSTERS.map((posterUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setImage(posterUrl)}
                  className={`relative aspect-4/3 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    image === posterUrl
                      ? 'border-indigo-600 ring-2 ring-indigo-400 shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={posterUrl} alt="Sample" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Link to={isAdmin ? '/organizer' : '/'}>
            <Button variant="secondary" size="lg">
              Cancel
            </Button>
          </Link>

          {isAdmin ? (
            <Button type="submit" variant="primary" size="lg" icon={Sparkles}>
              Publish Live Event (Admin)
            </Button>
          ) : (
            <Button type="submit" variant="primary" size="lg" icon={CreditCard}>
              Proceed to Pay Admin Fee (₹{adminFeeAmount}) & Publish
            </Button>
          )}
        </div>
      </form>

      {/* Payment Modal for Admin Organization Charge (Indian Currency ₹) */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => !isProcessingPayment && setIsPaymentModalOpen(false)}
        title="Pay Admin Event Organization Fee"
        maxWidth="max-w-md"
      >
        <div className="space-y-6">
          {/* Fee Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Event Title:</span>
              <strong className="text-slate-900 dark:text-white max-w-[200px] truncate">{title}</strong>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Organized By:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{organizerName}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Platform Admin Fee:</span>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">₹{adminFeeAmount} INR</span>
            </div>
            <div className="my-2 border-t border-slate-200 dark:border-slate-700" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Amount Due:</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                ₹{adminFeeAmount}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
              Choose Indian Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <Smartphone className="w-5 h-5 text-indigo-500" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <CreditCard className="w-5 h-5 text-indigo-500" />
                <span>RuPay / Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'netbanking'
                    ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <Building className="w-5 h-5 text-indigo-500" />
                <span>Net Banking</span>
              </button>
            </div>
          </div>

          {/* Payment Method Details */}
          {paymentMethod === 'upi' && (
            <div className="space-y-3 p-3.5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                Instant UPI Payment (Google Pay / PhonePe / Paytm)
              </span>
              <Input
                label="UPI ID / VPA"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@okaxis"
              />
              <span className="text-[11px] text-slate-500 block">
                Supported Apps: Google Pay, PhonePe, Paytm, BHIM, Cred
              </span>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
              <Input label="Card Number" defaultValue="4382 •••• •••• 9102" disabled />
              <div className="grid grid-cols-2 gap-2">
                <Input label="Expiry" defaultValue="08/28" disabled />
                <Input label="CVV" defaultValue="•••" disabled />
              </div>
              <span className="text-[10px] text-slate-400 block">
                Supports all Indian RuPay, Visa, and Mastercard debit & credit cards.
              </span>
            </div>
          )}

          {paymentMethod === 'netbanking' && (
            <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                Popular Indian Banks:
              </span>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <span className="p-2 rounded-xl bg-white dark:bg-slate-900 border text-center font-bold text-[11px]">HDFC Bank</span>
                <span className="p-2 rounded-xl bg-white dark:bg-slate-900 border text-center font-bold text-[11px]">State Bank of India</span>
                <span className="p-2 rounded-xl bg-white dark:bg-slate-900 border text-center font-bold text-[11px]">ICICI Bank</span>
                <span className="p-2 rounded-xl bg-white dark:bg-slate-900 border text-center font-bold text-[11px]">Axis Bank</span>
              </div>
            </div>
          )}

          {/* Pay Button */}
          <div className="space-y-2 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-lg shadow-emerald-600/20 bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
              isLoading={isProcessingPayment}
              onClick={handlePayAdminFeeAndPublish}
            >
              Pay ₹{adminFeeAmount} INR to Admin & Publish
            </Button>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-Bit Encrypted Payment • EventNest Verified Admin Gateway</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Official Receipt Modal for User Event Organization Charge */}
      {paymentReceipt && (
        <Modal
          isOpen={!!paymentReceipt}
          onClose={() => navigate(`/events/${paymentReceipt.event.id}`)}
          title="Payment Successful & Event Published"
          maxWidth="max-w-md"
        >
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Admin Fee Verified
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Payment of ₹{paymentReceipt.amount} Received
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your event has been successfully registered and is now live across the EventNest catalog.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2.5">
              <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{paymentReceipt.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">₹{paymentReceipt.amount} INR</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Beneficiary:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">EventNest Platform Admin</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Event:</span>
                <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{paymentReceipt.event.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="text-slate-600 dark:text-slate-400">{paymentReceipt.date}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                icon={ExternalLink}
                onClick={() => navigate(`/events/${paymentReceipt.event.id}`)}
              >
                View Your Live Event Listing
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-slate-500"
                onClick={() => navigate('/')}
              >
                Return to Discover Page
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
