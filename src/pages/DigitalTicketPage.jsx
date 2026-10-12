import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Smartphone, CheckCircle2, Ticket } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { DigitalTicket } from '../components/booking/DigitalTicket';
import { Button } from '../components/common/Button';
import { decodeTicketData } from '../utils/ticketQr';

export const DigitalTicketPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { getBookingById, importBooking } = useBooking();

  const [activeBooking, setActiveBooking] = useState(() => getBookingById(id));
  const [isMobileScanned, setIsMobileScanned] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const localBooking = getBookingById(id);
    const passParam = searchParams.get('pass') || searchParams.get('data');

    if (passParam) {
      const decoded = decodeTicketData(passParam);
      if (decoded && decoded.id === id) {
        setActiveBooking(decoded);
        setIsMobileScanned(true);
        // Persist booking to local storage on this device
        if (importBooking) {
          importBooking(decoded);
        }
        return;
      }
    }

    if (localBooking) {
      setActiveBooking(localBooking);
    }
  }, [id, searchParams, getBookingById, importBooking]);

  if (!activeBooking) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4 px-4">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Ticket Not Found
        </h2>
        <p className="text-xs text-slate-500">
          The requested booking ticket (ID: {id}) could not be located on this device.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to="/my-bookings">
            <Button variant="primary">My Bookings</Button>
          </Link>
          <Link to="/events">
            <Button variant="secondary">Browse Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 sm:space-y-8">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 print:hidden">
        <Link
          to="/my-bookings"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>My Bookings</span>
        </Link>

        <div className="flex items-center gap-2">
          {isMobileScanned && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Smartphone className="w-3 h-3" />
              <span>Scanned from QR</span>
            </span>
          )}
          <span className="text-xs font-mono font-bold text-slate-400">
            Status: <strong className="text-emerald-500 capitalize">{activeBooking.status || 'Active'}</strong>
          </span>
        </div>
      </div>

      {/* Digital Ticket Render */}
      <DigitalTicket booking={activeBooking} isMobileScanned={isMobileScanned} />
    </div>
  );
};
