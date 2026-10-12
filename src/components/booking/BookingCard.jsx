import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, AlertCircle, QrCode } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/formatDate';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { MobileQrModal } from './MobileQrModal';

export const BookingCard = ({ booking, onCancel }) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="primary" size="sm">Upcoming</Badge>;
      case 'completed':
        return <Badge variant="success" size="sm">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="danger" size="sm">Cancelled</Badge>;
      default:
        return <Badge size="sm">{status}</Badge>;
    }
  };

  const handleConfirmCancel = () => {
    if (onCancel) {
      onCancel(booking.id);
    }
    setIsCancelModalOpen(false);
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left Side: Thumbnail & Event Info */}
        <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
          <img
            src={booking.eventImage}
            alt={booking.eventTitle}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0"
          />

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {getStatusBadge(booking.status)}
              <span className="font-mono text-[11px] text-slate-400 font-semibold">
                ID: {booking.id}
              </span>
            </div>

            <Link
              to={`/events/${booking.eventId}`}
              className="block font-bold text-base sm:text-lg text-slate-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors truncate"
            >
              {booking.eventTitle}
            </Link>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-red-500" />
                {formatDate(booking.date)} at {formatTime(booking.time)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {booking.venue}, {booking.city}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 pt-1">
              <span className="font-semibold text-red-600 dark:text-red-400">
                {booking.ticketTypeName}
              </span>
              {booking.selectedSeats?.length > 0 && (
                <span>• Seats: <strong>{booking.selectedSeats.join(', ')}</strong></span>
              )}
              <span>• Total: <strong>₹{Number(booking.totalAmount || 0).toLocaleString('en-IN')}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
          {booking.status === 'upcoming' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCancelModalOpen(true)}
              className="text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              Cancel
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            icon={QrCode}
            onClick={() => setIsQrModalOpen(true)}
            title="Scan with phone to open ticket on mobile"
          >
            Scan Pass
          </Button>

          <Link to={`/ticket/${booking.id}`}>
            <Button variant="primary" size="sm" icon={Ticket}>
              View Ticket
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile QR Scan Guide Modal */}
      <MobileQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        booking={booking}
      />

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Ticket Reservation"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>
              Are you sure you want to cancel your booking for <strong>{booking.eventTitle}</strong>? This action will release your reserved seats immediately.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setIsCancelModalOpen(false)}
            >
              Keep My Booking
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmCancel}
            >
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
