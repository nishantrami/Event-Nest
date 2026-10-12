import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Ticket,
  DollarSign,
  TrendingUp,
  PlusCircle,
  Clock,
  Sparkles,
  ArrowUpRight,
  Eye,
  BarChart3,
  Users,
  ShieldCheck,
  Search,
  CheckCircle2,
  ExternalLink,
  CreditCard,
  Edit2,
  Save,
  Sliders
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useEvents } from '../../context/EventsContext';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export const OrganizerDashboard = () => {
  const {
    events,
    customEvents,
    organizationFees,
    totalOrganizationFees,
    adminFeeAmount,
    updateAdminFeeAmount
  } = useEvents();
  const { bookings } = useBooking();
  const { user } = useAuth();

  // Search & Filter for User Event Organization Fees
  const [feeSearch, setFeeSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Admin Fee Setting inline edit state
  const [isEditingFee, setIsEditingFee] = useState(false);
  const [tempFee, setTempFee] = useState(adminFeeAmount);
  const [feeSavedNotice, setFeeSavedNotice] = useState(false);

  // Compute metrics from local data
  const totalEventsCount = events.length;
  const organizerEventsCount = customEvents.length;
  const totalBookingsCount = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const upcomingBookingsCount = bookings.filter((b) => b.status === 'upcoming').length;

  const handleSaveFee = () => {
    updateAdminFeeAmount(Number(tempFee));
    setIsEditingFee(false);
    setFeeSavedNotice(true);
    setTimeout(() => setFeeSavedNotice(false), 3000);
  };

  // Filtered User Fees
  const filteredFees = organizationFees.filter((fee) => {
    const matchesSearch =
      fee.eventTitle?.toLowerCase().includes(feeSearch.toLowerCase()) ||
      fee.userName?.toLowerCase().includes(feeSearch.toLowerCase()) ||
      fee.userEmail?.toLowerCase().includes(feeSearch.toLowerCase()) ||
      fee.transactionId?.toLowerCase().includes(feeSearch.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || fee.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Chart 1: Monthly Bookings & Revenue
  const lineChartData = {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct (Projected)'],
    datasets: [
      {
        label: 'Gross Ticket Revenue (₹ in Thousands)',
        data: [120, 185, 240, 310, 420, 560],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'User Organization Fees (₹ in Hundreds)',
        data: [15, 25, 30, 40, 55, 75],
        borderColor: '#10b981',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
      },
    ],
  };

  // Chart 2: Category Distribution
  const doughnutData = {
    labels: ['Music & Concerts', 'Standup Comedy', 'Technology', 'Sports', 'Festivals & Other'],
    datasets: [
      {
        data: [42, 24, 18, 10, 6],
        backgroundColor: ['#6366f1', '#f59e0b', '#06b6d4', '#10b981', '#ec4899'],
        borderWidth: 0,
      },
    ],
  };

  // Chart 3: Weekly Ticket Sales Breakdown
  const barChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tickets Sold This Week',
        data: [42, 68, 55, 89, 145, 220, 195],
        backgroundColor: '#6366f1',
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          font: { size: 11, family: 'sans-serif' },
        },
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { font: { size: 10 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } },
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Super Administrator Command Center
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              admin@eventnest.com (Static)
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Admin Organizer Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time analytics, user event submissions, catalog management, and platform organization fees collected in Indian Rupee (₹).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/organizer/events">
            <Button variant="secondary" size="sm">
              Catalog Events ({organizerEventsCount})
            </Button>
          </Link>
          <Link to="/host-event">
            <Button variant="primary" size="sm" icon={PlusCircle}>
              Publish Live Event
            </Button>
          </Link>
        </div>
      </div>

      {feeSavedNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Platform organization fee updated to ₹{adminFeeAmount} INR for all new user submissions!</span>
        </div>
      )}

      {/* KPI Stat Cards Grid (Including Indian Currency Admin Charges) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Admin Organization Fees Collected (PRIMARY METRIC) */}
        <div className="bg-white dark:bg-slate-900 border-2 border-orange-500 rounded-3xl p-6 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Admin Organizing Fees
            </span>
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-orange-500/30">
              ₹
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              ₹{totalOrganizationFees.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-orange-500">INR</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
            Collected from <strong>{organizationFees.length}</strong> user-organized events
          </span>
        </div>

        {/* Card 2: Active Events Catalog */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Catalog
            </span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {totalEventsCount}
            </span>
            <span className="text-xs font-bold text-emerald-500">+3 this week</span>
          </div>
          <span className="text-[11px] text-slate-400 block">
            {organizerEventsCount} custom hosted events
          </span>
        </div>

        {/* Card 3: Total Ticket Sales Volume */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Ticket Bookings
            </span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {totalBookingsCount}
            </span>
            <span className="text-xs font-bold text-emerald-500">100% Verified</span>
          </div>
          <span className="text-[11px] text-slate-400 block">
            {upcomingBookingsCount} upcoming reservations
          </span>
        </div>

        {/* Card 4: Gross Ticket Revenue */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Gross Ticket Sales
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-emerald-500">Live</span>
          </div>
          <span className="text-[11px] text-slate-400 block">
            Direct deposit ready
          </span>
        </div>
      </div>

      {/* DEDICATED ADMIN SECTION: User Event Submissions & Organization Fees (INR) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        
        {/* Section Title & Admin Fee Controller */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                User Event Submissions & Admin Charges
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                INR (₹) Collections
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Events submitted by normal users along with the mandatory platform organization charge collected by Admin.
            </p>
          </div>

          {/* Admin Fee Rate Setting Controller */}
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div className="text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Standard Admin Fee:</span>
              {isEditingFee ? (
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300">₹</span>
                  <input
                    type="number"
                    value={tempFee}
                    onChange={(e) => setTempFee(e.target.value)}
                    className="w-20 px-2 py-1 text-xs rounded-lg border border-indigo-400 bg-white dark:bg-slate-900 font-bold"
                  />
                  <button
                    onClick={handleSaveFee}
                    className="p-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
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
                className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                title="Change Platform Fee"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search user, event, or txn..."
              value={feeSearch}
              onChange={(e) => setFeeSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs w-full sm:w-auto">
            {['all', 'music', 'comedy', 'technology', 'festivals'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-colors cursor-pointer text-[11px] ${
                  categoryFilter === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Fees Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Event Details</th>
                <th className="px-4 py-3">Organized By (User)</th>
                <th className="px-4 py-3">Submission Date</th>
                <th className="px-4 py-3">Admin Fee Charged</th>
                <th className="px-4 py-3">Payment Method & Txn</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredFees.length > 0 ? (
                filteredFees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    
                    {/* Event Details */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {fee.eventTitle}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <span className="capitalize">{fee.category}</span>
                          <span>•</span>
                          <span>{fee.city}</span>
                        </div>
                      </div>
                    </td>

                    {/* User */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                          {fee.userName}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 block truncate max-w-[150px]">
                          {fee.userEmail}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {new Date(fee.paidAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>

                    {/* Admin Fee Charged (INR ₹) */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                          ₹{Number(fee.amount).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-slate-400">INR</span>
                      </div>
                    </td>

                    {/* Payment Method */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="space-y-0.5">
                        <span className="font-medium text-slate-700 dark:text-slate-300 block">
                          {fee.paymentMethod}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          {fee.transactionId}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Paid & Verified
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <Link to={`/events/${fee.eventId}`}>
                        <Button variant="ghost" size="sm" icon={ExternalLink}>
                          View Event
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                    No user event organization charges matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Revenue & Ticket Sales Line Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Revenue & Sales Trajectory
              </h3>
              <p className="text-xs text-slate-400">
                Monthly trajectory: Gross ticket sales vs. User platform organization charges (INR).
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-full">
              2026 Trend
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        {/* Category Share Doughnut Chart */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Category Distribution
            </h3>
            <p className="text-xs text-slate-400">
              Share of ticket bookings by category.
            </p>
          </div>

          <div className="h-60 w-full flex items-center justify-center pt-2">
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>

          <div className="pt-2 text-center text-xs text-slate-400">
            Music & Concerts lead with 42% of total seat bookings.
          </div>
        </div>

        {/* Weekly Ticket Velocity Bar Chart */}
        <div className="lg:col-span-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Weekly Velocity (Days of Week)
              </h3>
              <p className="text-xs text-slate-400">
                Peak booking activity spikes every Friday and Saturday evening.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              Total: 819 passes this week
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};
