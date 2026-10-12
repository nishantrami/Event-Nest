import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, HelpCircle, Ticket, ShieldCheck, RefreshCw, MessageSquare } from 'lucide-react';
import { Button } from '../components/common/Button';

const FAQ_ITEMS = [
  {
    category: 'Ticketing & Passes',
    question: 'How do I access and display my ticket at the venue?',
    answer: 'Once you book an event, an official verified E-Pass is instantly generated with a unique QR code. You can find it under "My Bookings" in your navigation bar or download it as a PDF. Simply show the QR code on your mobile device at the venue gate for turnstile entry.'
  },
  {
    category: 'Ticketing & Passes',
    question: 'Can I select specific seats for concerts and auditorium shows?',
    answer: 'Yes! EventNest provides an interactive visual Seat Map where you can handpick specific seats in VIP, Premium, or General tiers. If you prefer, you can also skip seat selection, and our smart allocation engine will assign the best consecutive seats available.'
  },
  {
    category: 'Cancellations & Refunds',
    question: 'What is the EventNest cancellation policy?',
    answer: 'You can cancel any upcoming reservation directly from your "My Bookings" dashboard up to 24 hours prior to the event start time. Refunds are simulated and credited back to your original payment method immediately in the sandbox environment.'
  },
  {
    category: 'Cancellations & Refunds',
    question: 'What happens if an event is rescheduled or postponed by the producer?',
    answer: 'If an event is rescheduled, your original ticket pass remains 100% valid for the new performance date. If you cannot attend the rescheduled date, you will have a 7-day window to claim a full refund.'
  },
  {
    category: 'For Organizers',
    question: 'How do I publish an event as an organizer on EventNest?',
    answer: 'Navigate to "Host an Event" or "Organizer Dashboard" from the menu. You can define event details, upload posters, configure ticket pricing tiers, set seating capacities, and track ticket sales velocity in real time through built-in Chart.js analytics.'
  },
  {
    category: 'Security & Safety',
    question: 'Are payments on EventNest secure?',
    answer: 'EventNest uses simulated 256-bit encryption for payment validation. In this frontend version, no real financial data is transmitted or stored on third-party servers. All data remains in your local browser sandbox.'
  }
];

export const Help = () => {
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const filteredFaqs = FAQ_ITEMS.filter(
    (item) =>
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Knowledge Base & Help Desk
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Quick answers to common questions about ticketing, digital passes, refunds, and hosting events.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by topic (e.g. refund, seats, QR pass)..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-md shadow-indigo-500/5"
        />
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                      {faq.category}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {faq.question}
                    </h4>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs">
            No questions matched your query "{search}". Try searching for "seats" or "pass".
          </div>
        )}
      </div>

      {/* Need more help banner */}
      <div className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Still need assistance with your booking?
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Our live concierge team is on standby 24/7 to help you out.
          </p>
        </div>
        <Link to="/contact">
          <Button variant="primary" size="md">
            Contact Support
          </Button>
        </Link>
      </div>
    </div>
  );
};
