import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, Calendar, MapPin } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/formatDate';

export const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
      
      {/* Event Thumbnail & Info */}
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <img
          src={item.event.image}
          alt={item.event.title}
          className="w-20 h-20 rounded-2xl object-cover shrink-0"
        />

        <div className="space-y-1 min-w-0 flex-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {item.event.category}
          </span>

          <Link
            to={`/events/${item.event.id}`}
            className="block font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate"
          >
            {item.event.title}
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-indigo-500" />
              {formatDate(item.event.date)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {item.event.venue}, {item.event.city}
            </span>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-300 pt-0.5">
            <span className="font-semibold text-slate-900 dark:text-white">
              {item.ticketType.name}
            </span>
            {item.selectedSeats?.length > 0 && (
              <span className="text-indigo-600 dark:text-indigo-400 font-medium ml-2">
                Seats: {item.selectedSeats.join(', ')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stepper, Price & Remove */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
        {/* Quantity Stepper */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white tabular-nums">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total Price */}
        <div className="text-right min-w-[80px]">
          <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white block">
            ₹{item.subtotal.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400 block">
            ₹{item.ticketType.price} each
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.id)}
          className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          title="Remove from cart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
