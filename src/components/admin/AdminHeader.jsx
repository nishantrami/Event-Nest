import React from 'react';
import {
  Menu,
  Search,
  PlusCircle,
  ShieldCheck,
  ChevronRight,
  Bell
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../common/Button';

export const AdminHeader = ({
  activeTab,
  onOpenMobileSidebar,
  globalSearch,
  setGlobalSearch,
  onAddEventClick
}) => {
  const { unreadCount } = useNotifications();

  const tabTitles = {
    dashboard: 'Platform Overview & KPI Analytics',
    events: 'Events Management & Catalog Control',
    bookings: 'Ticket Bookings & Pass Verification',
    users: 'Users Directory & Access Permissions',
    financials: 'Financials, Revenue & Hosting Charges (₹)',
    categories: 'Event Categories, Cities & Venues',
    broadcast: 'System Announcements & Push Alerts',
    settings: 'Platform Configurations & Master Keys'
  };

  return (
    <header className="sticky top-0 z-30 h-18 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Mobile Toggle & Breadcrumb Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            <span className="text-purple-600 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Core
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="capitalize font-semibold text-slate-700">{activeTab}</span>
          </div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 truncate tracking-tight">
            {tabTitles[activeTab] || 'Super-Admin Command Center'}
          </h1>
        </div>
      </div>

      {/* Right: Search, Live Status, Fast Action */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Global Filter Search (Desktop) */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search events, bookings..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white font-sans transition-all"
          />
        </div>

        {/* Live Operational Health Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono font-bold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>INR (₹) Gateway Live</span>
        </div>

        {/* Notification Bell Badge */}
        {unreadCount > 0 && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-bold" title={`${unreadCount} Unread Platform Alerts`}>
            <Bell className="w-3.5 h-3.5" />
            <span>{unreadCount}</span>
          </div>
        )}

        {/* Secret Key Reminder */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
          <span className="text-[10px] font-mono text-slate-400">Shortcut:</span>
          <kbd className="px-1 py-0.5 rounded bg-white text-indigo-600 font-mono text-[10px] border border-slate-200 font-bold">
            Ctrl + A
          </kbd>
        </div>

        {/* Add Event Action */}
        <Button
          variant="primary"
          size="sm"
          icon={PlusCircle}
          onClick={onAddEventClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
        >
          <span className="hidden sm:inline">Add Event</span>
        </Button>
      </div>
    </header>
  );
};
