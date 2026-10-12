import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  CheckCircle2,
  CreditCard,
  Edit2,
  Save,
  FileSpreadsheet
} from 'lucide-react';
import { useEvents } from '../../../context/EventsContext';
import { useBooking } from '../../../context/BookingContext';
import { Button } from '../../../components/common/Button';

export const AdminFinancials = () => {
  const {
    organizationFees = [],
    totalOrganizationFees = 0,
    adminFeeAmount = 499,
    updateAdminFeeAmount
  } = useEvents();
  const { bookings = [] } = useBooking();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isEditingFee, setIsEditingFee] = useState(false);
  const [tempFee, setTempFee] = useState(adminFeeAmount);
  const [notice, setNotice] = useState(null);

  // Financial Computations
  const feeList = Array.isArray(organizationFees) ? organizationFees : [];
  const bookingList = Array.isArray(bookings) ? bookings : [];

  const grossTicketSales = bookingList.reduce((sum, b) => sum + (Number(b?.totalAmount) || 0), 0);
  const platformConvenienceFeeTotal = bookingList.reduce((sum, b) => sum + (Number(b?.serviceFee) || 0), 0);
  const totalAdminEarnings = (Number(totalOrganizationFees) || 0) + platformConvenienceFeeTotal;

  const showNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleSaveFee = () => {
    updateAdminFeeAmount(Number(tempFee));
    setIsEditingFee(false);
    showNotice(`Platform hosting fee updated to ₹${tempFee} INR for all new user submissions!`);
  };

  // Export CSV Report
  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Event Title', 'User Name', 'Email', 'Amount (INR)', 'Payment Method', 'Date', 'Status'];
    const rows = feeList.map((f) => [
      f.transactionId,
      `"${f.eventTitle?.replace(/"/g, '""')}"`,
      `"${f.userName?.replace(/"/g, '""')}"`,
      f.userEmail,
      f.amount,
      f.paymentMethod,
      f.paidAt,
      f.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `eventnest_financial_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotice('Financial statement downloaded as CSV.');
  };

  const filteredFees = feeList.filter((fee) => {
    if (!fee) return false;
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !searchLower ||
      (fee.eventTitle || '').toLowerCase().includes(searchLower) ||
      (fee.userName || '').toLowerCase().includes(searchLower) ||
      (fee.userEmail || '').toLowerCase().includes(searchLower) ||
      (fee.transactionId || '').toLowerCase().includes(searchLower);
    const matchesCategory = categoryFilter === 'all' || fee.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Platform Financials & INR (₹) Revenue Center
          </h2>
          <p className="text-xs text-slate-500">
            Audit user hosting fee collections, manage the standard ₹{adminFeeAmount} organizing tariff, and export tax summaries.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={FileSpreadsheet}
          onClick={handleExportCSV}
          className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs font-bold shrink-0"
        >
          Export CSV Ledger
        </Button>
      </div>

      {notice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* KPI Cards (Crisp White Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Hosting Fees Collected */}
        <div className="p-6 rounded-3xl bg-white border-2 border-amber-300 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-amber-700">
              User Event Hosting Fees
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-black text-lg">
              ₹
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              ₹{Number(totalOrganizationFees || 0).toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-amber-600">INR</span>
          </div>
          <span className="text-[11px] text-slate-500 block">
            Collected directly from {feeList.length} user event submissions
          </span>
        </div>

        {/* Card 2: Convenience Ticket Fees */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Ticketing Convenience Revenue
            </span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-black text-lg">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              ₹{platformConvenienceFeeTotal.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-indigo-600">INR</span>
          </div>
          <span className="text-[11px] text-slate-500 block">
            From {bookingList.length} reservations processed
          </span>
        </div>

        {/* Card 3: Total Net Admin Profit */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
              Combined Admin Revenue
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-black text-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">
              ₹{totalAdminEarnings.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-emerald-600">INR</span>
          </div>
          <span className="text-[11px] text-slate-500 block">
            Hosting charges + Ticketing fees combined
          </span>
        </div>
      </div>

      {/* Admin Fee Tariff Controller Bar (Crisp White Card) */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-slate-900">
              Platform Organization Fee Tariff Setting
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Mandatory Paywall
            </span>
          </div>
          <p className="text-xs text-slate-500">
            This amount is charged in Indian Rupee (₹) whenever a regular user hosts a new public event listing.
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 shrink-0">
          <div className="text-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Standard Fee per Event:</span>
            {isEditingFee ? (
              <div className="flex items-center gap-2 mt-1">
                <span className="font-bold text-slate-900">₹</span>
                <input
                  type="number"
                  value={tempFee}
                  onChange={(e) => setTempFee(e.target.value)}
                  className="w-24 px-2 py-1 text-xs rounded-lg border border-indigo-500 bg-white text-slate-900 font-mono font-bold"
                />
                <button
                  onClick={handleSaveFee}
                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-2xs"
                  title="Save Tariff"
                >
                  <Save className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <span className="text-base font-black text-amber-600 font-mono">
                ₹{adminFeeAmount} INR
              </span>
            )}
          </div>

          {!isEditingFee && (
            <button
              onClick={() => {
                setTempFee(adminFeeAmount);
                setIsEditingFee(true);
              }}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer shadow-2xs"
              title="Edit Tariff Amount"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Hosting Transactions Ledger (Crisp White Table) */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search transaction, organizer, event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs w-full md:w-auto overflow-x-auto">
            {['all', 'music', 'comedy', 'technology', 'sports'].map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition-colors cursor-pointer text-[11px] whitespace-nowrap ${
                  categoryFilter === c
                    ? 'bg-white text-indigo-600 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Transaction ID</th>
                <th className="px-4 py-3.5">Event Title</th>
                <th className="px-4 py-3.5">Organizer</th>
                <th className="px-4 py-3.5">Hosting Fee (₹)</th>
                <th className="px-4 py-3.5">Payment Method</th>
                <th className="px-4 py-3.5">Date Paid</th>
                <th className="px-4 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFees.length > 0 ? (
                filteredFees.map((fee) => (
                  <tr key={fee.transactionId || Math.random()} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 whitespace-nowrap font-mono font-bold text-indigo-600">
                      {fee.transactionId}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-900 block truncate max-w-xs">
                        {fee.eventTitle}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-900 block">{fee.userName}</span>
                        <span className="text-[11px] text-slate-500 block font-mono">{fee.userEmail}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap font-mono font-bold text-amber-600">
                      ₹{fee.amount} INR
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px] border border-slate-200">
                        {fee.paymentMethod || 'Razorpay UPI'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 text-[11px] font-mono">
                      {fee.paidAt || 'Recently'}
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {fee.status || 'Verified'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    No hosting fee transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
