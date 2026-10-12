import React, { useRef, useState, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Download,
  Share2,
  CheckCircle2,
  Ticket,
  Smartphone,
  Navigation,
  CalendarPlus,
  Maximize2,
  Wifi,
  SunMedium
} from 'lucide-react';
import { formatDate, formatTime } from '../../utils/formatDate';
import { Button } from '../common/Button';
import { MobileQrModal } from './MobileQrModal';
import {
  getNetworkHost,
  getMobileTicketUrl,
  generateQrCodeDataUrl,
  getDirectionsUrl,
  getGoogleCalendarUrl
} from '../../utils/ticketQr';

export const DigitalTicket = ({ booking, isMobileScanned = false }) => {
  const ticketRef = useRef(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [networkHost, setNetworkHost] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Generate the actual scannable QR Code on mount or booking change
  useEffect(() => {
    let isMounted = true;

    const generateQR = async () => {
      if (!booking) return;

      const host = await getNetworkHost();
      if (!isMounted) return;

      setNetworkHost(host);
      const ticketUrl = getMobileTicketUrl(booking, host);
      const qrUrl = await generateQrCodeDataUrl(ticketUrl, {
        width: 280,
        margin: 1,
        darkColor: '#0f172a',
        lightColor: '#ffffff'
      });

      if (isMounted) {
        setQrCodeDataUrl(qrUrl);
      }
    };

    generateQR();

    return () => {
      isMounted = false;
    };
  }, [booking]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: `EventNest Ticket: ${booking.eventTitle}`,
          text: `My verified entry ticket for ${booking.eventTitle} at ${booking.venue}! Booking Ref: ${booking.id}`,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
      alert('Ticket link copied to clipboard!');
    }
  };

  if (!booking) return null;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Mobile Scanned Header Alert */}
      {isMobileScanned && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 dark:text-emerald-300">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xs">
            <p className="font-bold">Pass Active on Mobile!</p>
            <p className="opacity-80">This verified pass is synced and ready to show at the gate.</p>
          </div>
        </div>
      )}

      {/* Screen Brightness Tip for Mobile Users */}
      <div className="sm:hidden bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 text-amber-800 dark:text-amber-300 text-xs">
        <SunMedium className="w-4 h-4 shrink-0 text-amber-500" />
        <span>Increase screen brightness for fastest scanning at the venue turnstiles.</span>
      </div>

      {/* The Printable / Viewable Digital Pass */}
      <div
        ref={ticketRef}
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl print:border-none print:shadow-none"
      >
        {/* Top Header / Branding Banner */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-5 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight block leading-tight">EventNest</span>
              <span className="text-[10px] tracking-widest uppercase opacity-85 font-bold block">
                Official E-Pass & Gate Ticket
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block">
              Booking Ref
            </span>
            <span className="font-mono text-xs sm:text-sm font-black block tracking-wider bg-white/15 px-2 py-0.5 rounded-lg backdrop-blur-xs">
              {booking.id}
            </span>
          </div>
        </div>

        {/* Hero Event Snapshot */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900">
          <img
            src={booking.eventImage}
            alt={booking.eventTitle}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 sm:left-6 sm:right-6">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-600 text-white mb-1.5 shadow-sm">
              {booking.category}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white line-clamp-1 drop-shadow-md">
              {booking.eventTitle}
            </h3>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-red-500" /> Date
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {formatDate(booking.date)}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-red-500" /> Time
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {formatTime(booking.time)}
              </p>
            </div>

            <div className="col-span-2 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" /> Venue & Location
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {booking.venue}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {booking.location}, {booking.city || ''}
              </p>
            </div>
          </div>

          {/* Perforated Divider with Ticket Notches */}
          <div className="relative py-2">
            <div className="border-t-2 border-dashed border-slate-200 dark:border-slate-800" />
            <div className="absolute -left-8 sm:-left-9 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" />
            <div className="absolute -right-8 sm:-right-9 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" />
          </div>

          {/* Attendee & Seats Info Box */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Attendee
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                {booking.customer?.name || 'Guest User'}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Tier & Qty
              </span>
              <span className="text-xs font-bold text-red-600 dark:text-red-400 truncate block">
                {booking.ticketTypeName}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Seats
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white truncate block">
                {booking.selectedSeats?.length > 0 ? booking.selectedSeats.join(', ') : 'Open Lawn'}
              </span>
            </div>
          </div>

          {/* Dynamic Scannable QR Code Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
            {/* The Scannable QR Code Box */}
            <div className="flex items-center gap-4">
              <div
                onClick={() => setIsQrModalOpen(true)}
                className="group relative p-2.5 rounded-2xl bg-white border-2 border-slate-200 dark:border-slate-700 shadow-md shrink-0 cursor-pointer hover:border-red-500 transition-all hover:scale-105"
                title="Click to scan with mobile camera or enlarge"
              >
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt={`Scannable QR code for ticket ${booking.id}`}
                    className="w-24 h-24 object-contain select-none"
                  />
                ) : (
                  <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                    Loading QR...
                  </div>
                )}

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-red-600/10 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="p-1 rounded-full bg-white text-slate-900 shadow-md">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>Scannable Mobile Pass</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Scan with smartphone camera to open and save pass on mobile.
                </p>
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(true)}
                  className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Open Mobile QR Guide</span>
                </button>
              </div>
            </div>

            {/* Barcode Lines Visual */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-0.5 h-10">
                {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4, 1, 3, 1, 2].map((w, i) => (
                  <div
                    key={i}
                    style={{ width: `${w * 1.5}px` }}
                    className="h-full bg-slate-900 dark:bg-slate-300"
                  />
                ))}
              </div>
              <span className="font-mono text-[10px] text-slate-400 mt-1 tracking-widest">
                {booking.id}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-3 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Government photo ID required at gate.</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">Verified Pass</span>
        </div>
      </div>

      {/* Useful Quick Links (Directions & Calendar) */}
      <div className="grid grid-cols-2 gap-3 print:hidden">
        <a
          href={getDirectionsUrl(booking)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900 transition-all shadow-xs"
        >
          <Navigation className="w-4 h-4 text-red-500" />
          <span>Get Directions</span>
        </a>

        <a
          href={getGoogleCalendarUrl(booking)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900 transition-all shadow-xs"
        >
          <CalendarPlus className="w-4 h-4 text-indigo-500" />
          <span>Add to Calendar</span>
        </a>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
        <Button
          variant="primary"
          icon={Smartphone}
          onClick={() => setIsQrModalOpen(true)}
          size="lg"
          className="w-full sm:w-auto"
        >
          Scan on Mobile
        </Button>

        <Button
          variant="secondary"
          icon={Download}
          onClick={handlePrint}
          size="lg"
          className="w-full sm:w-auto"
        >
          Print / PDF
        </Button>

        <Button
          variant="ghost"
          icon={Share2}
          onClick={handleShare}
          size="lg"
          className="w-full sm:w-auto"
        >
          Share Pass
        </Button>
      </div>

      {/* QR Code Scan Guide Modal */}
      <MobileQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        booking={booking}
      />
    </div>
  );
};
