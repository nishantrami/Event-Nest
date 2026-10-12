import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  Users,
  IndianRupee,
  Layers,
  Megaphone,
  Settings,
  Sparkles,
  ExternalLink,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventsContext';
import { useBooking } from '../../context/BookingContext';

export const AdminSidebar = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const { user, logout, registeredUsers } = useAuth();
  const { events } = useEvents();
  const { bookings } = useBooking();
  const navigate = useNavigate();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Overview & KPI',
      icon: LayoutDashboard,
      badge: 'Live',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    },
    {
      id: 'events',
      label: 'Events Catalog',
      icon: Calendar,
      badge: events?.length ?? 0,
      badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-100'
    },
    {
      id: 'bookings',
      label: 'Bookings & Passes',
      icon: Ticket,
      badge: bookings?.length ?? 0,
      badgeColor: 'bg-purple-50 text-purple-700 border border-purple-100'
    },
    {
      id: 'users',
      label: 'Users & Roles',
      icon: Users,
      badge: registeredUsers?.length ?? 0,
      badgeColor: 'bg-blue-50 text-blue-700 border border-blue-100'
    },
    {
      id: 'financials',
      label: 'Financials & Fees',
      icon: IndianRupee,
      badge: '₹ INR',
      badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200'
    },
    {
      id: 'categories',
      label: 'Categories & Cities',
      icon: Layers
    },
    {
      id: 'broadcast',
      label: 'Announcements',
      icon: Megaphone
    },
    {
      id: 'settings',
      label: 'Platform Settings',
      icon: Settings
    }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container (White Background, Crisp Borders) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white border-r border-slate-200 text-slate-800 shadow-sm transition-all duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-68'}`}
      >
        {/* Top Brand & Header */}
        <div className="h-18 px-4 flex items-center justify-between border-b border-slate-100 bg-white">
          <Link
            to="/admin"
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-base font-black tracking-tight text-slate-900 flex items-center gap-1">
                  Event<span className="text-indigo-600">Nest</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-purple-600 font-extrabold flex items-center gap-1 -mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-purple-600" /> Super-Admin
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Trigger */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            aria-label="Close Mobile Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar bg-white">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
              Admin Core Navigation
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/25 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-semibold'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? 'text-white scale-110' : 'text-slate-500'
                  }`}
                />

                {!isCollapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}

                {!isCollapsed && item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Utility Actions (Crisp Light Theme, Theme Toggle Removed) */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
          {/* Secret Key Indicator */}
          {!isCollapsed && (
            <div className="p-2 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600 shadow-2xs">
              <span className="text-[10px] font-mono text-slate-500 font-semibold">Secret Key:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-indigo-600 font-mono text-[10px] border border-slate-200 font-bold">
                Ctrl + A
              </kbd>
            </div>
          )}

          {/* Quick External Link to Storefront */}
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all shadow-none hover:shadow-2xs"
            title="View Live Storefront"
          >
            <ExternalLink className="w-4 h-4 text-emerald-600 shrink-0" />
            {!isCollapsed && <span>Live Storefront</span>}
          </Link>

          {/* Admin Profile & Disconnect */}
          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={user?.name || 'Admin'}
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/30 shrink-0 shadow-2xs"
              />
              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {user?.name || 'Platform Admin'}
                  </div>
                  <div className="text-[10px] text-purple-600 font-mono font-semibold truncate">
                    Root Administrator
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
              title="Sign Out from Admin Core"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
