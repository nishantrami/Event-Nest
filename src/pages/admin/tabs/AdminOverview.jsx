import React, { useState } from 'react';
import {
  Calendar,
  Ticket,
  PlusCircle,
  Users,
  ArrowUpRight,
  IndianRupee,
  Megaphone
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
import { useEvents } from '../../../context/EventsContext';
import { useBooking } from '../../../context/BookingContext';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';

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

export const AdminOverview = ({ setActiveTab, onAddEventClick }) => {
  const { events, customEvents, organizationFees, totalOrganizationFees, adminFeeAmount } = useEvents();
  const { bookings } = useBooking();
  const { registeredUsers } = useAuth();

  const [timeRange, setTimeRange] = useState('30d');

  // Key Metrics
  const totalEventsCount = events?.length || 0;
  const totalBookingsCount = bookings?.length || 0;
  const grossTicketRevenue = (bookings || []).reduce((sum, b) => sum + (Number(b?.totalAmount) || 0), 0);
  const totalUsersCount = registeredUsers?.length || 0;
  const platformCommissionRate = 0.10; // 10% platform share
  const estimatedTicketCommission = Math.round(grossTicketRevenue * platformCommissionRate);
  const totalAdminEarnings = (totalOrganizationFees || 0) + estimatedTicketCommission;

  // Chart 1: Revenue & Fee Line Chart
  const lineChartData = {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct (Live)'],
    datasets: [
      {
        label: 'Gross Ticket Revenue (₹ in Thousands)',
        data: [120, 185, 240, 310, 420, 560],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.10)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Hosting Fees Collected (₹ in Hundreds)',
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
    labels: ['Concerts & Music', 'Standup Comedy', 'Tech & AI Summits', 'Sports Matches', 'Festivals'],
    datasets: [
      {
        data: [42, 24, 18, 10, 6],
        backgroundColor: ['#6366f1', '#f59e0b', '#06b6d4', '#10b981', '#ec4899'],
        borderWidth: 0,
      },
    ],
  };

  // Chart 3: Weekly Ticket Velocity
  const barChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tickets Sold This Week',
        data: [42, 68, 55, 89, 145, 220, 195],
        backgroundColor: '#8b5cf6',
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
          color: '#475569',
          boxWidth: 12,
          font: { size: 11, family: 'sans-serif', weight: '600' },
        },
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
        ticks: { color: '#64748b', font: { size: 10 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 10 } },
      },
    },
  };

  // Recent 5 Bookings
  const recentBookings = (bookings || []).slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner (Crisp White Card with Soft Gradient Tint) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-white border border-indigo-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
              Super-Admin Mode Active
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Platform Status: 100% Operational
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome to the EventNest Master Command Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Monitor real-time ticket sales velocity, manage user event hostings, collect mandatory ₹{adminFeeAmount} INR platform organizing fees, and verify gate tickets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveTab('events')}
            className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs font-bold"
          >
            Catalog ({totalEventsCount})
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={onAddEventClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs font-bold"
          >
            Publish Event
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid (Crisp White Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Admin Organization Fees Collected (PRIMARY) */}
        <div
          onClick={() => setActiveTab('financials')}
          className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-amber-700">
              User Hosting Fees
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-black text-lg group-hover:scale-105 transition-transform">
              ₹
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{Number(totalOrganizationFees || 0).toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-amber-600">INR</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{(organizationFees || []).length} hosted events</span>
            <span className="text-emerald-600 flex items-center gap-0.5 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" /> ₹{adminFeeAmount}/event
            </span>
          </div>
        </div>

        {/* Card 2: Gross Ticket Revenue */}
        <div
          onClick={() => setActiveTab('bookings')}
          className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Gross Ticket Sales
            </span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-black text-lg group-hover:scale-105 transition-transform">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{grossTicketRevenue.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-indigo-600">Gross</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{totalBookingsCount} total reservations</span>
            <span className="text-emerald-600 font-bold">100% Verified</span>
          </div>
        </div>

        {/* Card 3: Active Events Catalog */}
        <div
          onClick={() => setActiveTab('events')}
          className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Live Catalog Events
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-black text-lg group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalEventsCount}
            </span>
            <span className="text-xs font-bold text-emerald-600">+3 this week</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{(customEvents || []).length} custom submissions</span>
            <span className="text-purple-600 font-bold">Active</span>
          </div>
        </div>

        {/* Card 4: Registered Users & Admins */}
        <div
          onClick={() => setActiveTab('users')}
          className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Platform Accounts
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-black text-lg group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalUsersCount}
            </span>
            <span className="text-xs font-bold text-blue-600">Members</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>1 Super-Admin</span>
            <span className="text-emerald-600 font-bold">Active Roles</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Revenue Trajectory Chart */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Gross Sales & User Organizing Fees Trajectory
              </h3>
              <p className="text-xs text-slate-500">
                Monthly revenue velocity in Indian Rupee (₹ INR).
              </p>
            </div>
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-[11px] font-bold">
              {['7d', '30d', '90d', 'all'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2.5 py-1 rounded-lg uppercase transition-colors cursor-pointer ${
                    timeRange === range
                      ? 'bg-white text-indigo-600 shadow-2xs font-extrabold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        {/* Category Share Doughnut Chart */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Ticket Share by Category
            </h3>
            <p className="text-xs text-slate-500">
              Distribution of passes across music, comedy, and sports.
            </p>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>

          <div className="pt-2 text-center text-xs text-slate-500 font-medium">
            Music & Concerts lead with 42% volume share.
          </div>
        </div>

        {/* Day-of-Week Sales Velocity */}
        <div className="lg:col-span-12 bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Weekly Velocity (Daily Ticket Bookings)
              </h3>
              <p className="text-xs text-slate-500">
                Peak transaction spikes occur on Friday & Saturday evenings.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 self-start sm:self-auto">
              Total 819 passes this cycle
            </span>
          </div>

          <div className="h-60 w-full pt-4">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Two Column Bottom Grid: Recent Bookings & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Bookings Feed (Responsive Table) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Recent Ticket Bookings
              </h3>
              <p className="text-xs text-slate-500">
                Latest customer reservations processed across the platform.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('bookings')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
            >
              View All ({(bookings || []).length}) →
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase font-bold text-slate-500 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Booking ID</th>
                  <th className="px-4 py-3">Event Title</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Amount (₹)</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.length > 0 ? (
                  recentBookings.map((b) => (
                    <tr key={b?.id || Math.random()} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-indigo-600 font-bold whitespace-nowrap">
                        {b?.id || 'N/A'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900 max-w-[180px] truncate">
                        {b?.eventTitle || 'Event'}
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {b?.customer?.name || b?.userEmail || 'Customer'}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-600 whitespace-nowrap">
                        ₹{Number(b?.totalAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          b?.status === 'confirmed' || b?.status === 'upcoming'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : b?.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}>
                          {b?.status || 'confirmed'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No ticket bookings registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Admin Navigation Panel */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 space-y-4 shadow-xs">
          <h3 className="text-lg font-black text-slate-900">
            Quick Administrative Shortcuts
          </h3>
          <p className="text-xs text-slate-500">
            One-click navigation to core management modules.
          </p>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => setActiveTab('events')}
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 flex items-center justify-between text-xs font-bold text-slate-700 hover:text-indigo-900 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Manage Events & Approvals</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">{totalEventsCount}</span>
            </button>

            <button
              onClick={() => setActiveTab('financials')}
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 flex items-center justify-between text-xs font-bold text-slate-700 hover:text-amber-900 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <IndianRupee className="w-4 h-4 text-amber-600" />
                <span>Adjust ₹{adminFeeAmount} Platform Fee</span>
              </div>
              <span className="text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-bold">Live</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 flex items-center justify-between text-xs font-bold text-slate-700 hover:text-blue-900 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-blue-600" />
                <span>User Permissions & Admins</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">{totalUsersCount}</span>
            </button>

            <button
              onClick={() => setActiveTab('broadcast')}
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 flex items-center justify-between text-xs font-bold text-slate-700 hover:text-purple-900 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Megaphone className="w-4 h-4 text-purple-600" />
                <span>Send Push Alert Announcement</span>
              </div>
              <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 font-bold">Push</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
