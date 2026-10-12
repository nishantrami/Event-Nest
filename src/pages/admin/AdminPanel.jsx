import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';

// Tab Views
import { AdminOverview } from './tabs/AdminOverview';
import { AdminEvents } from './tabs/AdminEvents';
import { AdminBookings } from './tabs/AdminBookings';
import { AdminUsers } from './tabs/AdminUsers';
import { AdminFinancials } from './tabs/AdminFinancials';
import { AdminCategories } from './tabs/AdminCategories';
import { AdminBroadcast } from './tabs/AdminBroadcast';
import { AdminSettings } from './tabs/AdminSettings';
import { AlertCircle } from 'lucide-react';

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Admin Panel Error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Admin Module Recovered</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {this.state.error?.message || 'An unexpected rendering issue occurred. Click below to reload the admin interface safely.'}
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
              >
                Reload Admin Panel
              </button>
              <button
                onClick={() => {
                  window.location.href = '/admin?tab=dashboard';
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Go to Overview Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AdminPanelInner = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Active tab derived from URL query (?tab=...) with 'dashboard' as default
  const activeTab = (searchParams.get('tab') || 'dashboard').toLowerCase();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  const handleAddEventClick = () => {
    navigate('/organizer/create-event');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-indigo-600 selection:text-white">
      {/* Sidebar (Desktop persistent, Mobile drawer) */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-68'
        }`}
      >
        {/* Top Header */}
        <AdminHeader
          activeTab={activeTab}
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          onAddEventClick={handleAddEventClick}
        />

        {/* Tab Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <AdminOverview
                  setActiveTab={handleTabChange}
                  onAddEventClick={handleAddEventClick}
                />
              )}
              {activeTab === 'events' && (
                <AdminEvents onAddEventClick={handleAddEventClick} />
              )}
              {activeTab === 'bookings' && <AdminBookings />}
              {activeTab === 'users' && <AdminUsers />}
              {activeTab === 'financials' && <AdminFinancials />}
              {activeTab === 'categories' && <AdminCategories />}
              {activeTab === 'broadcast' && <AdminBroadcast />}
              {activeTab === 'settings' && <AdminSettings />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export const AdminPanel = () => {
  return (
    <AdminErrorBoundary>
      <AdminPanelInner />
    </AdminErrorBoundary>
  );
};
