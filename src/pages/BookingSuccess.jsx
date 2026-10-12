import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Ticket,
  Calendar,
  MapPin,
  ArrowRight,
  Home,
  Sparkles,
  Smartphone,
  Copy,
  Check,
  ExternalLink,
  Wifi,
  QrCode,
  Download
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { formatDate, formatTime } from '../utils/formatDate';
import { Button } from '../components/common/Button';
import {
  getNetworkHost,
  getMobileTicketUrl,
  generateQrCodeDataUrl
} from '../utils/ticketQr';

export const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const { getBookingById } = useBooking();
  const bookingId = searchParams.get('id');
  const booking = getBookingById(bookingId);

  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [ticketMobileUrl, setTicketMobileUrl] = useState('');
  const [networkHost, setNetworkHost] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  // Generate mobile QR code and URL
  useEffect(() => {
    let isMounted = true;

    const loadQr = async () => {
      if (!booking) return;

      const host = await getNetworkHost();
      if (!isMounted) return;

      setNetworkHost(host);
      const mobileUrl = getMobileTicketUrl(booking, host);
      setTicketMobileUrl(mobileUrl);

      const qr = await generateQrCodeDataUrl(mobileUrl, {
        width: 260,
        margin: 1,
        darkColor: '#0f172a',
        lightColor: '#ffffff'
      });

      if (isMounted) {
        setQrCodeUrl(qr);
      }
    };

    loadQr();

    return () => {
      isMounted = false;
    };
  }, [booking]);

  const handleCopyLink = () => {
    if (!ticketMobileUrl) return;
    navigator.clipboard?.writeText(ticketMobileUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handlePreviewMobile = () => {
    if (!ticketMobileUrl) return;
    const width = 420;
    const height = 850;
    const left = Math.max(0, (window.innerWidth - width) / 2);
    const top = Math.max(0, (window.innerHeight - height) / 2);
    window.open(
      ticketMobileUrl,
      'mobile_ticket_preview',
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
  };

  if (!booking) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4 px-4">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
          Booking Confirmed!
        </h2>
        <p className="text-xs text-slate-500">
          Your transaction was verified successfully. Check your bookings page to view all tickets.
        </p>
        <Link to="/my-bookings">
          <Button variant="primary">Go to My Bookings</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 space-y-8">
      {/* Celebratory Hero Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-3"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 mx-auto flex items-center justify-center ring-8 ring-emerald-500/10 shadow-lg">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Transaction Verified
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Booking Confirmed!
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          We’ve reserved your seats and generated your verified digital pass. Scan the QR code below to open this pass on your phone immediately!
        </p>
      </motion.div>

      {/* Prominent Scannable Mobile Pass Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-2 border-red-500/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-2xl shadow-sm flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 animate-pulse" />
          <span>Mobile Pass Ready</span>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* QR Code Container */}
          <div className="relative shrink-0 text-center">
            <div className="p-3 bg-white rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-xl inline-block group">
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt={`Scannable ticket QR code for ${booking.eventTitle}`}
                  className="w-48 h-48 sm:w-52 sm:h-52 object-contain select-none"
                />
              ) : (
                <div className="w-48 h-48 sm:w-52 sm:h-52 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                  Generating QR...
                </div>
              )}
            </div>
            <span className="block font-mono text-[11px] font-bold text-slate-400 mt-2">
              Ref: {booking.id}
            </span>
          </div>

          {/* Details & Mobile Actions */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                <QrCode className="w-3.5 h-3.5" /> Scannable with Smartphone Camera
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Scan to Open on Mobile
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Point your iPhone Camera or Android Google Lens at the QR code to open your verified ticket instantly on your mobile phone.
              </p>
            </div>

            {/* Network Host Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
              <Wifi className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>
                Wi-Fi Network Address: <strong className="font-mono text-indigo-600 dark:text-indigo-400">{networkHost}</strong>
              </span>
            </div>

            {/* Actions for Mobile */}
            <div className="flex flex-wrap items-center gap-2 pt-1 justify-center md:justify-start">
              <Button
                variant="primary"
                size="sm"
                icon={isCopied ? Check : Copy}
                onClick={handleCopyLink}
              >
                {isCopied ? 'Link Copied!' : 'Copy Mobile Link'}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                icon={ExternalLink}
                onClick={handlePreviewMobile}
              >
                Preview Mobile View
              </Button>

              <Link to={`/ticket/${booking.id}`}>
                <Button variant="ghost" size="sm" icon={Ticket}>
                  View Full Pass
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Booking Summary Ticket Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl"
      >
        <div className="p-5 sm:p-6 bg-gradient-to-r from-red-600 to-red-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 fill-white" />
            <span className="font-bold text-sm tracking-wide">EventNest Pass Overview</span>
          </div>
          <span className="font-mono text-xs font-black tracking-wider bg-white/20 px-2.5 py-1 rounded-lg">
            {booking.id}
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <img
              src={booking.eventImage}
              alt={booking.eventTitle}
              className="w-20 h-20 rounded-2xl object-cover shrink-0"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                {booking.category}
              </span>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {booking.eventTitle}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-red-500" />
                  {formatDate(booking.date)} at {formatTime(booking.time)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {booking.venue}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Pass Type</span>
              <span className="font-bold text-slate-900 dark:text-white">{booking.ticketTypeName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Seats</span>
              <span className="font-bold text-red-600 dark:text-red-400">
                {booking.selectedSeats?.length > 0 ? booking.selectedSeats.join(', ') : 'Open Lawn'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Payment</span>
              <span className="font-bold text-slate-900 dark:text-white">{booking.paymentMethod}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Total Paid</span>
              <span className="font-black text-slate-900 dark:text-white">
                ₹{Number(booking.totalAmount).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link to={`/ticket/${booking.id}`} className="w-full sm:w-auto">
          <Button variant="primary" size="lg" icon={Ticket} className="w-full sm:w-auto">
            View Digital Ticket
          </Button>
        </Link>
        <Link to="/my-bookings" className="w-full sm:w-auto">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            My Bookings
          </Button>
        </Link>
        <Link to="/" className="w-full sm:w-auto">
          <Button variant="ghost" size="lg" icon={Home} className="w-full sm:w-auto">
            Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
