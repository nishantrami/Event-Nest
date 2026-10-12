import React from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Minus, Sparkles, ShieldCheck } from 'lucide-react';
import { Badge } from '../common/Badge';

export const TicketSelector = ({
  ticketTypes = [],
  selectedType,
  onSelectType,
  quantity = 1,
  onQuantityChange,
  maxPerOrder = 8,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            1. Select Ticket Tier
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Affordable entry tiers starting from ₹550 up to ₹1,500
          </p>
        </div>
        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Tiers ₹550 – ₹1,500
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {ticketTypes.map((tier) => {
          const isSelected = selectedType?.id === tier.id;

          return (
            <motion.div
              key={tier.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectType(tier)}
              className={`relative rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-lg shadow-indigo-600/10 dark:border-indigo-500'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {tier.id === 'prem' && (
                <div className="absolute -top-3 right-4">
                  <Badge variant="trending" size="sm" icon={Sparkles} className="bg-amber-500 text-slate-950 border-none font-bold">
                    Popular
                  </Badge>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {tier.name}
                  </h4>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    ₹{Number(tier.price).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                    / person
                  </span>
                </div>

                <ul className="space-y-1.5 mb-4">
                  {tier.benefits?.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 font-medium flex justify-between items-center">
                <span>Seats Available:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {tier.available} left
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quantity Selector */}
      {selectedType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Quantity of Tickets
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Maximum {maxPerOrder} tickets per transaction
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white dark:bg-slate-900 rounded-2xl p-1 border border-slate-200 dark:border-slate-700 shadow-xs">
              <button
                type="button"
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                aria-label="Decrease ticket quantity"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="w-12 text-center font-black text-base text-slate-900 dark:text-white tabular-nums">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => onQuantityChange(Math.min(maxPerOrder, quantity + 1))}
                disabled={quantity >= maxPerOrder}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                aria-label="Increase ticket quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="text-right min-w-[100px]">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Subtotal
              </span>
              <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                ₹{(Number(selectedType.price) * quantity).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
