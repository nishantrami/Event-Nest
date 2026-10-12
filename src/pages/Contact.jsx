import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  Ticket,
  Building,
  CreditCard,
  Handshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

const TOPICS = [
  { id: 'tickets', label: 'Ticket & Bookings', icon: Ticket },
  { id: 'hosting', label: 'Hosting & Organizer', icon: Building },
  { id: 'payments', label: 'Payments & Refunds', icon: CreditCard },
  { id: 'partnerships', label: 'Partnerships', icon: Handshake },
];

const FAQS = [
  {
    question: 'How do I access and display my event digital ticket?',
    answer: 'Once your booking is confirmed, your digital pass is instantly saved to "My Bookings" and sent to your email. You can present the live dynamic QR code on your mobile device at the venue gate for instant NFC or barcode scanning.'
  },
  {
    question: 'What happens if an event is postponed or cancelled?',
    answer: 'If an event is postponed, your pass remains 100% valid for the rescheduled date. In the event of a cancellation by the organizer, our 100% Buyer Protection Guarantee automatically processes a full refund to your original payment method within 3–5 business days.'
  },
  {
    question: 'How do I host and publish an event on EventNest?',
    answer: 'Any verified user can host an event by visiting "Host an Event" in the navigation. A nominal platform verification fee of ₹499 (INR) covers anti-fraud gate protection, digital QR ticketing, and automated attendee check-in.'
  },
  {
    question: 'Can I transfer my ticket pass to a friend or family member?',
    answer: 'Yes! From your Digital Ticket page, tap "Share E-Pass" to generate a secure transfer link or download the official PDF pass to forward to your companion.'
  }
];

export const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('tickets');
  const [bookingRef, setBookingRef] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedTicket = `NEST-TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(generatedTicket);
      setIsSubmitting(false);
      setName('');
      setEmail('');
      setPhone('');
      setBookingRef('');
      setMessage('');
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* 1. Header Hero Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>24/7 Dedicated Concierge & Live Support</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
          We’re Here for Your <br className="hidden sm:inline" />
          <span className="text-red-600 dark:text-red-500">Live Experience.</span>
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Need assistance with ticketing, venue entry gates, organizer partnerships, or booking changes? Our dedicated live support team is on standby to help.
        </p>
      </div>

      {/* 2. Direct Channels & Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Direct Channels & Hubs */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Support Channels Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Direct Channels
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Desk Online
              </span>
            </div>

            <div className="space-y-4">
              <a
                href="mailto:support@eventnest.com"
                className="flex items-start gap-4 p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
              >
                <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/70 text-red-600 dark:text-red-400 group-hover:scale-105 transition-transform shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Support Desk
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-red-600 transition-colors">
                    support@eventnest.com
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Fast response within ~15 minutes
                  </span>
                </div>
              </a>

              <a
                href="tel:+912280006378"
                className="flex items-start gap-4 p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
              >
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Customer & Gate Hotline
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    +91 (022) 8000-NEST (6378)
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Toll-free across India
                  </span>
                </div>
              </a>

              <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Operating Windows
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white block">
                    24/7 Active Gate Coverage
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Live show days: Dedicated on-ground concierges
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Regional Experience Hubs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-600" /> Regional Experience Hubs
            </h3>
            
            <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  Mumbai Headquarters
                </span>
                Level 14, Platina Tower, Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  Bengaluru Experience Hub
                </span>
                100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038
              </div>
            </div>
          </div>

          {/* Security & Buyer Guarantee Callout */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950 to-slate-900 text-white border border-indigo-800/50 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold block text-white">
                100% Anti-Fraud Pass Guarantee
              </span>
              <span className="text-[11px] text-slate-300">
                Every booking is cryptographically verified with dynamic QR entry tokens.
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Contact Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Send Us a Message
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Fill in the details below and an EventNest specialist will follow up with you.
              </p>
            </div>

            {/* Success Notification Alert */}
            <AnimatePresence>
              {ticketId && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm font-bold">
                        Inquiry Received Successfully!
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-200/60 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                      {ticketId}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
                    A dedicated live concierge ticket has been opened under reference <strong>{ticketId}</strong>. We have dispatched a confirmation email and will reach out to you within 15 minutes.
                  </p>
                  <button
                    type="button"
                    onClick={() => setTicketId(null)}
                    className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 underline hover:no-underline pt-1 block"
                  >
                    Submit another inquiry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Topic Selection Chips */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  What is your inquiry regarding?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {TOPICS.map((topic) => {
                    const IconComponent = topic.icon;
                    const isSelected = selectedTopic === topic.id;
                    return (
                      <button
                        type="button"
                        key={topic.id}
                        onClick={() => setSelectedTopic(topic.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-red-50 dark:bg-red-950/60 border-red-500 text-red-600 dark:text-red-400 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <IconComponent className="w-4 h-4 mb-1.5" />
                        <span>{topic.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="e.g. Nishant Rami"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Phone & Booking Reference Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone Number (Optional)"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Input
                  label="Booking / Pass ID (Optional)"
                  placeholder="e.g. NEST-BK-8931"
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value)}
                />
              </div>

              {/* Message Box */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Message Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe how we can assist you..."
                  required
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/80 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon={Send}
                iconPosition="right"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? 'Submitting Message...' : 'Send Message to Concierge'}
              </Button>
            </form>
          </div>
        </div>

      </div>

      {/* 3. Common Support FAQ Accordion */}
      <div className="bg-slate-100/60 dark:bg-slate-900/40 rounded-3xl p-6 sm:p-12 border border-slate-200/60 dark:border-slate-800/60 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
            Quick Answers
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Find rapid resolutions for common ticketing, entry, and hosting queries.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm text-slate-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-red-600' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
