import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Share2,
  Heart,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  User,
  MessageSquarePlus,
  Send
} from 'lucide-react';
import { useEvents } from '../context/EventsContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { formatDate, formatTime } from '../utils/formatDate';
import { TicketSelector } from '../components/booking/TicketSelector';
import { SeatMap } from '../components/booking/SeatMap';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { CountdownTimer } from '../components/common/CountdownTimer';

export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById, trackRecentlyViewed, reviewsMap, addReview } = useEvents();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const { reservedSeatsMap, getReservedSeatsForEvent } = useBooking();

  const event = getEventById(id);

  // Booking states
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    if (event) {
      trackRecentlyViewed(event.id);
      if (event.ticketTypes?.length > 0 && !selectedTicketType) {
        setSelectedTicketType(event.ticketTypes[0]);
      }
    }
    window.scrollTo(0, 0);
  }, [id, event]);

  if (!event) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4 px-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Event Not Found
        </h2>
        <p className="text-xs text-slate-500">
          The event you are looking for may have expired or been removed.
        </p>
        <Link to="/events">
          <Button variant="primary">Browse All Events</Button>
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(event.id);
  const bookedSeats = getReservedSeatsForEvent
    ? getReservedSeatsForEvent(event.id)
    : (reservedSeatsMap[event.id] || []);
  const eventReviews = reviewsMap[event.id] || [];

  const handleSeatToggle = (seatId) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((s) => s !== seatId);
      }
      // If adding exceeds selected ticket quantity, automatically update quantity
      if (prev.length >= ticketQuantity) {
        setTicketQuantity(prev.length + 1);
      }
      return [...prev, seatId];
    });
  };

  const handleAddToCart = () => {
    if (!selectedTicketType) return;
    addToCart({
      event,
      ticketType: selectedTicketType,
      quantity: ticketQuantity,
      selectedSeats,
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBookNow = () => {
    if (!selectedTicketType) return;
    addToCart({
      event,
      ticketType: selectedTicketType,
      quantity: ticketQuantity,
      selectedSeats,
    });
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out ${event.title} on EventNest!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    addReview(event.id, {
      rating: reviewRating,
      reviewText: reviewText.trim(),
      userName: user?.name || 'Verified Explorer',
    });
    setReviewText('');
    setIsReviewModalOpen(false);
  };

  const subtotal = (selectedTicketType?.price || 0) * ticketQuantity;

  return (
    <div className="pb-24">
      {/* Toast Notification */}
      <AnimatePresence>
        {addedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold">Added {ticketQuantity} ticket(s) to Cart!</span>
            <Link to="/cart" className="text-xs text-indigo-400 underline font-semibold ml-2">
              View Cart
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Visual Banner */}
      <div className="relative h-[45vh] sm:h-[55vh] w-full bg-slate-900 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80';
          }}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between">
          <Link
            to="/events"
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80 transition-colors"
          >
            ← Back to Events
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80 transition-colors"
              title="Share event"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(event.id)}
              className={`p-2.5 rounded-full backdrop-blur-md border border-white/20 transition-colors ${
                favorited ? 'bg-red-600 text-white' : 'bg-black/60 text-white hover:text-red-400'
              }`}
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Hero Title & Badges in Banner */}
        <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 max-w-4xl text-white space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="glass" size="sm" className="capitalize">
              {event.category}
            </Badge>
            {event.trending && (
              <Badge variant="trending" size="sm" className="bg-yellow-400 text-slate-950 font-black border-none">
                Trending
              </Badge>
            )}
            <div className="flex items-center gap-1 bg-yellow-400 text-slate-950 px-2 py-0.5 rounded-full font-black text-xs">
              <Star className="w-3.5 h-3.5 fill-slate-950" />
              <span>{event.rating || 4.9}</span>
              <span className="text-[10px] text-slate-800">({event.reviewsCount || 120} reviews)</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-orange-400" />
              {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-orange-400" />
              {formatTime(event.time)} ({event.duration || '3 Hours'})
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-400" />
              {event.venue}, {event.city}
            </span>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Event In-depth Info & Interactive Booking flow */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Live Countdown Banner */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Event Countdown
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  Get ready for the live experience
                </h4>
              </div>
              <CountdownTimer date={event.date} time={event.time} />
            </div>

            {/* About & Description */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                About the Event
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {event.description}
              </p>

              {/* Highlights */}
              {event.highlights?.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Experience Highlights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {event.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Step 1: Ticket Selection */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
              <TicketSelector
                ticketTypes={event.ticketTypes}
                selectedType={selectedTicketType}
                onSelectType={setSelectedTicketType}
                quantity={ticketQuantity}
                onQuantityChange={setTicketQuantity}
              />
            </section>

            {/* Step 2: Interactive Seat Selection */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      2. Choose Your Seats (Optional)
                    </h3>
                    {bookedSeats.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {bookedSeats.length} Seats Packed / Booked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Select up to {ticketQuantity} seats. Locked seats are already booked & packed by attendees.
                  </p>
                </div>
                {selectedSeats.length > 0 && (
                  <button
                    onClick={() => setSelectedSeats([])}
                    className="text-xs text-rose-500 hover:underline font-semibold"
                  >
                    Clear Seats
                  </button>
                )}
              </div>

              <SeatMap
                selectedSeats={selectedSeats}
                onSeatToggle={handleSeatToggle}
                bookedSeats={bookedSeats}
                ticketType={selectedTicketType}
                maxSeats={ticketQuantity}
              />
            </section>

            {/* Event Schedule Timeline */}
            {event.schedule?.length > 0 && (
              <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Event Schedule
                </h3>
                <div className="space-y-4 border-l-2 border-indigo-200 dark:border-indigo-900/60 ml-3 pl-5">
                  {event.schedule.map((item, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-900" />
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {item.time}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                        {item.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Terms and Conditions */}
            {event.terms?.length > 0 && (
              <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Terms & Entry Conditions
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 list-disc pl-4">
                  {event.terms.map((term, i) => (
                    <li key={i}>{term}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Reviews Section */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Attendee Reviews
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {event.rating || 4.9} out of 5 ({eventReviews.length + (event.reviewsCount || 0)} ratings)
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  icon={MessageSquarePlus}
                  onClick={() => setIsReviewModalOpen(true)}
                >
                  Write a Review
                </Button>
              </div>

              {/* Review Cards List */}
              <div className="space-y-3">
                {eventReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                          {rev.userName[0]}
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {rev.userName}
                        </span>
                      </div>
                      <div className="flex items-center text-amber-500 text-xs gap-1 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      "{rev.text}"
                    </p>
                    <span className="text-[10px] text-slate-400 block">{rev.date}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Booking Card on Desktop */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Total Investment
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({ticketQuantity} {ticketQuantity > 1 ? 'tickets' : 'ticket'})
                  </span>
                </div>
              </div>

              {/* Order Summary Lines */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tier:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedTicketType?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected Seats:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Auto-assigned'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gate Access:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    Instant E-Pass QR
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full text-base font-bold shadow-lg shadow-indigo-600/30"
                  onClick={handleBookNow}
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  className="w-full"
                  onClick={handleAddToCart}
                  icon={ShoppingBag}
                >
                  Add to Cart
                </Button>
              </div>

              {/* Guarantee */}
              <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Buyer Protection & Refund Guarantee</span>
              </div>
            </div>

            {/* Organizer Profile Card */}
            {event.organizer && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Event Organizer
                </span>
                <div className="flex items-center gap-3">
                  <img
                    src={event.organizer.avatar}
                    alt={event.organizer.name}
                    className="w-12 h-12 rounded-2xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1">
                      {event.organizer.name}
                      {event.organizer.verified && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-500 fill-indigo-100 dark:fill-indigo-950" />
                      )}
                    </h4>
                    <span className="text-xs text-slate-500">
                      {event.organizer.followers || '25K'} Followers
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {event.organizer.bio}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Booking Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between gap-4 shadow-2xl">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Subtotal
          </span>
          <span className="text-xl font-black text-slate-900 dark:text-white">
            ₹{subtotal.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="md" onClick={handleAddToCart} icon={ShoppingBag} />
          <Button variant="primary" size="md" onClick={handleBookNow}>
            Book Now
          </Button>
        </div>
      </div>

      {/* Write a Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Write an Event Review"
        subtitle={`Share your experience for "${event.title}"`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= reviewRating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Your Review
            </label>
            <textarea
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="What made this event special? Venue acoustics, crowd energy, performance..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Send} iconPosition="right">
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
