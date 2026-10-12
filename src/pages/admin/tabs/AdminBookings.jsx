import React, { useState } from 'react';
import {
  Ticket,
  Search,
  CheckCircle2,
  QrCode,
  Eye,
  AlertCircle,
  ScanLine,
  Trash2
} from 'lucide-react';
import { useBooking } from '../../../context/BookingContext';
import { formatDate } from '../../../utils/formatDate';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';

export const AdminBookings = () => {
  const { bookings = [], updateBookingStatus, deleteBooking } = useBooking();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'upcoming' | 'attended' | 'cancelled'
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [scannerQuery, setScannerQuery] = useState('');
  const [scannerResult, setScannerResult] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  const bookingList = Array.isArray(bookings) ? bookings : [];

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleStatusChange = (bookingId, newStatus) => {
    if (updateBookingStatus) {
      updateBookingStatus(bookingId, newStatus);
    }
    showNotice(`Booking ${bookingId} status changed to "${newStatus}".`);
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, status: newStatus });
    }
  };

  const handleDelete = (bookingId) => {
    if (deleteBooking) {
      deleteBooking(bookingId);
    }
    showNotice(`Booking ${bookingId} permanently deleted.`);
    setSelectedBooking(null);
  };

  const handleSimulateScan = (e) => {
    e.preventDefault();
    if (!scannerQuery.trim()) return;

    const query = scannerQuery.trim().toLowerCase();
    const found = bookingList.find(
      (b) =>
        (b?.id || '').toLowerCase() === query ||
        (b?.qrCodeData || '').toLowerCase().includes(query) ||
        (b?.customer?.email || '').toLowerCase() === query
    );

    if (found) {
      setScannerResult({ found, verified: true });
    } else {
      setScannerResult({ found: null, verified: false, query: scannerQuery });
    }
  };

  const filteredBookings = bookingList.filter((b) => {
    if (!b) return false;
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !searchLower ||
      (b.id || '').toLowerCase().includes(searchLower) ||
      (b.eventTitle || '').toLowerCase().includes(searchLower) ||
      (b.customer?.name || '').toLowerCase().includes(searchLower) ||
      (b.customer?.email || '').toLowerCase().includes(searchLower) ||
      (b.userEmail || '').toLowerCase().includes(searchLower);

    const status = (b.status || 'upcoming').toLowerCase();
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'upcoming' && (status === 'upcoming' || status === 'confirmed')) ||
      (statusFilter === 'attended' && (status === 'attended' || status === 'checked-in')) ||
      (statusFilter === 'cancelled' && status === 'cancelled');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Bookings, Passes & Gate Check-In
          </h2>
          <p className="text-xs text-slate-500">
            Total {bookingList.length} reservations recorded. Scan gate tickets, manage attendance, or process cancellations.
          </p>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Gate Pass Scanner Simulator Card (Crisp White Card) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
              <ScanLine className="w-4 h-4" /> Gate QR & Pass Validation Tool
            </div>
            <h3 className="text-base font-black text-slate-900">
              Instant Attendee Ticket Check-In
            </h3>
            <p className="text-xs text-slate-500">
              Paste or type Booking ID or QR Payload to verify entrance pass in real time.
            </p>
          </div>

          <form onSubmit={handleSimulateScan} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="e.g. EN-2026-X8K9M2..."
              value={scannerQuery}
              onChange={(e) => setScannerQuery(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono w-full md:w-64 transition-all"
            />
            <Button type="submit" variant="primary" size="sm" icon={ScanLine} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shrink-0 shadow-2xs">
              Verify
            </Button>
          </form>
        </div>

        {/* Scan Result Box */}
        {scannerResult && (
          <div className="pt-3 border-t border-slate-100">
            {scannerResult.verified && scannerResult.found ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-slate-900 text-sm">
                      Valid Pass Verified! ({scannerResult.found.id})
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {scannerResult.found.status || 'confirmed'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Event: <strong className="text-slate-900">{scannerResult.found.eventTitle || 'Event'}</strong> • Attendee: <strong className="text-slate-900">{scannerResult.found.customer?.name || 'Attendee'}</strong> • Qty: <strong>{scannerResult.found.quantity || 1} pass(es)</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStatusChange(scannerResult.found.id, 'attended')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-2xs"
                  >
                    Mark Checked-In
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedBooking(scannerResult.found)}
                    className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-bold"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-xs text-rose-700">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <span>
                  No matching ticket found for identifier "{scannerResult.query}". Please check the Booking ID or QR code data.
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter and Search Bar (Crisp White Card) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search booking ID, customer, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs w-full md:w-auto overflow-x-auto">
          {['all', 'upcoming', 'attended', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg font-bold capitalize transition-colors cursor-pointer text-[11px] whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-white text-indigo-600 shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table (Crisp White Table) */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3.5">Booking ID</th>
              <th className="px-4 py-3.5">Event Title</th>
              <th className="px-4 py-3.5">Customer</th>
              <th className="px-4 py-3.5">Passes</th>
              <th className="px-4 py-3.5">Total Paid (₹)</th>
              <th className="px-4 py-3.5">Booking Date</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((b) => (
                <tr key={b.id || Math.random()} className="hover:bg-slate-50 transition-colors">
                  {/* ID */}
                  <td className="px-4 py-3.5 whitespace-nowrap font-mono font-bold text-indigo-600">
                    {b.id || 'N/A'}
                  </td>

                  {/* Event */}
                  <td className="px-4 py-3.5">
                    <div className="space-y-0.5 max-w-xs">
                      <span className="font-bold text-slate-900 block truncate">
                        {b.eventTitle || 'Event'}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {formatDate(b.date) || 'Date TBA'}
                      </span>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-900 block">
                        {b.customer?.name || 'Customer'}
                      </span>
                      <span className="text-[11px] text-slate-500 block font-mono">
                        {b.customer?.email || b.userEmail || '-'}
                      </span>
                    </div>
                  </td>

                  {/* Quantity & Tier */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px] border border-slate-200">
                      {b.quantity || 1} pass(es)
                    </span>
                  </td>

                  {/* Amount Paid */}
                  <td className="px-4 py-3.5 whitespace-nowrap font-mono font-bold text-emerald-600">
                    ₹{Number(b.totalAmount || 0).toLocaleString('en-IN')}
                  </td>

                  {/* Date Booked */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 text-[11px]">
                    {formatDate(b.bookedAt || b.date) || 'Recently'}
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        (b.status === 'confirmed' || b.status === 'upcoming')
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : (b.status === 'attended' || b.status === 'checked-in')
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : b.status === 'cancelled'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {b.status || 'confirmed'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors cursor-pointer border border-indigo-200"
                        title="View Full Ticket Pass"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleStatusChange(b.id, b.status === 'attended' ? 'upcoming' : 'attended')}
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer border border-emerald-200"
                        title={b.status === 'attended' ? 'Revert Attendance' : 'Mark Checked-In'}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer border border-rose-200"
                        title="Delete Booking"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                  No ticket bookings found matching filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Ticket Details Modal */}
      {selectedBooking && (
        <Modal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title={`Digital Ticket Pass: ${selectedBooking.id || 'Pass'}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-5 text-xs text-slate-700">
            {/* Ticket Header Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <img
                src={selectedBooking.eventImage || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=300&q=80'}
                alt={selectedBooking.eventTitle || 'Event'}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 shadow-2xs"
              />
              <div className="space-y-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-indigo-600">
                  {selectedBooking.category || 'Event'}
                </span>
                <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                  {selectedBooking.eventTitle || 'Untitled Event'}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span>{formatDate(selectedBooking.date) || 'Date TBA'}</span>
                  <span>•</span>
                  <span>{selectedBooking.time || '07:00 PM'}</span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase text-slate-400 font-bold">Attendee Name</span>
                <span className="font-semibold text-slate-900 block">{selectedBooking.customer?.name || 'Attendee'}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase text-slate-400 font-bold">Email Address</span>
                <span className="font-mono text-slate-600 block truncate">{selectedBooking.customer?.email || selectedBooking.userEmail || '-'}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase text-slate-400 font-bold">Seats Reserved</span>
                <span className="font-bold text-indigo-600 block">
                  {Array.isArray(selectedBooking.selectedSeats) && selectedBooking.selectedSeats.length > 0
                    ? selectedBooking.selectedSeats.join(', ')
                    : 'General Admission'}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase text-slate-400 font-bold">Payment Method</span>
                <span className="font-semibold text-slate-900 block">{selectedBooking.paymentMethod || 'UPI (Google Pay)'}</span>
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between">
                <span>Subtotal ({selectedBooking.quantity || 1} Passes)</span>
                <span className="font-mono font-semibold">₹{Number(selectedBooking.subtotal || selectedBooking.totalAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Convenience Service Fee</span>
                <span className="font-mono">₹{Number(selectedBooking.serviceFee || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST (18%)</span>
                <span className="font-mono">₹{Number(selectedBooking.gst || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                <span>Total Amount Paid</span>
                <span className="font-mono text-emerald-600">₹{Number(selectedBooking.totalAmount || 0).toLocaleString('en-IN')} INR</span>
              </div>
            </div>

            {/* QR Code Simulation */}
            <div className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-24 h-24 bg-white p-2 rounded-xl mx-auto flex items-center justify-center border border-slate-200 shadow-2xs">
                <QrCode className="w-20 h-20 text-slate-900" />
              </div>
              <span className="font-mono text-[10px] text-slate-500 block">
                {selectedBooking.qrCodeData || `EVENTNEST-${selectedBooking.id || 'PASS'}`}
              </span>
            </div>

            {/* Status Change Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                variant={selectedBooking.status === 'attended' ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => handleStatusChange(selectedBooking.id, selectedBooking.status === 'attended' ? 'upcoming' : 'attended')}
                className="flex-1 font-bold"
              >
                {selectedBooking.status === 'attended' ? 'Revert to Confirmed' : 'Mark as Checked-In'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                className="text-rose-600 border-rose-200 hover:bg-rose-50 font-bold"
              >
                Cancel Booking
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
