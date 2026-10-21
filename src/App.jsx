import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { CartProvider } from './context/CartContext';
import { EventsProvider } from './context/EventsContext';
import { BookingProvider } from './context/BookingContext';
import { NotificationProvider } from './context/NotificationContext';

// Common Layout & Utilities
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { ScrollToTop } from './components/common/ScrollToTop';
import { WebsiteLoader } from './components/common/WebsiteLoader';

// Secret Admin Components
import { SecretAdminGateway } from './components/admin/SecretAdminGateway';
import { AdminPanel } from './pages/admin/AdminPanel';
import { AdminLogin } from './pages/admin/AdminLogin';

// Public Pages
import { Home } from './pages/Home';
import { Events } from './pages/Events';
import { EventDetails } from './pages/EventDetails';
import { Categories } from './pages/Categories';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { BookingSuccess } from './pages/BookingSuccess';
import { DigitalTicketPage } from './pages/DigitalTicketPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// User Dashboard Pages
import { MyBookings } from './pages/MyBookings';
import { Favorites } from './pages/Favorites';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';

// Organizer Pages
import { CreateEvent } from './pages/organizer/CreateEvent';
import { EditEvent } from './pages/organizer/EditEvent';

// Information & Error Pages
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Help } from './pages/Help';
import { NotFound } from './pages/NotFound';
import { AccessDenied } from './pages/AccessDenied';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {/* Global Secret Admin Gateway Trigger (Ctrl + A) */}
      <SecretAdminGateway />

      {isAdminRoute ? (
        /* Dedicated Admin Panel routes (Has its own sidebar and header layout) */
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      ) : (
        /* Standard Storefront Layout */
        <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Discovery Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/search" element={<Events />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/booking-success" element={<BookingSuccess />} />
              <Route path="/ticket/:id" element={<DigitalTicketPage />} />

              {/* Protected Booking & User Routes */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* Event Hosting Routes (User can host event for ₹499 Admin Fee) */}
              <Route
                path="/host-event"
                element={
                  <ProtectedRoute>
                    <CreateEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/create-event"
                element={
                  <ProtectedRoute>
                    <CreateEvent />
                  </ProtectedRoute>
                }
              />

              {/* Legacy Organizer Routes Redirected to Admin Panel */}
              <Route
                path="/organizer"
                element={<Navigate to="/admin" replace />}
              />
              <Route
                path="/organizer/events"
                element={<Navigate to="/admin?tab=events" replace />}
              />
              <Route
                path="/organizer/edit/:id"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <EditEvent />
                  </ProtectedRoute>
                }
              />

              {/* Support, Access Control & Legal Pages */}
              <Route path="/access-denied" element={<AccessDenied />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<Help />} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventsProvider>
          <FavoritesProvider>
            <CartProvider>
              <BookingProvider>
                <NotificationProvider>
                  <WebsiteLoader />
                  <Router>
                    <AppContent />
                  </Router>
                </NotificationProvider>
              </BookingProvider>
            </CartProvider>
          </FavoritesProvider>
        </EventsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
