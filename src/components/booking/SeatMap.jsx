import React from 'react';
import { motion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';
import { seatVariants } from '../../animations/variants';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const SEATS_PER_ROW = 10;

export const SeatMap = ({
  selectedSeats = [],
  onSeatToggle,
  maxSeats = 6,
  bookedSeats = [],
  ticketType = null
}) => {
  const getSeatTier = (row) => {
    if (row === 'A' || row === 'B') return { name: 'VIP', color: 'border-amber-500 text-amber-500' };
    if (row === 'C' || row === 'D') return { name: 'Premium', color: 'border-indigo-500 text-indigo-500' };
    return { name: 'General', color: 'border-slate-400 text-slate-400' };
  };

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    onSeatToggle(seatId);
  };

  return (
    <div className="w-full bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl overflow-x-auto">
      {/* Stage / Screen Visual */}
      <div className="text-center mb-8 max-w-md mx-auto">
        <div className="h-2 w-full bg-red-600 rounded-full mb-2 shadow-lg shadow-red-600/40" />
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-orange-400">
          Stage / Performance Screen
        </span>
        {bookedSeats.length > 0 && (
          <div className="text-center text-[11px] text-slate-400 mt-2 font-medium flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-red-400" />
            <span>
              <strong className="text-white">{bookedSeats.length} seats</strong> already booked & packed
            </span>
          </div>
        )}
      </div>

      {/* Seat Grid */}
      <div className="min-w-[420px] max-w-xl mx-auto space-y-3">
        {ROWS.map((row) => {
          const tier = getSeatTier(row);
          return (
            <div key={row} className="flex items-center justify-center gap-2 sm:gap-3">
              {/* Row Label */}
              <span className="w-6 text-xs font-bold text-slate-400 text-center">
                {row}
              </span>

              {/* Seats in Row */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {Array.from({ length: SEATS_PER_ROW }, (_, idx) => {
                  const seatNumber = idx + 1;
                  const seatId = `${row}${seatNumber}`;
                  const isBooked = bookedSeats.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);
                  const isAisle = seatNumber === 3 || seatNumber === 7;

                  return (
                    <React.Fragment key={seatId}>
                      <motion.button
                        type="button"
                        variants={seatVariants}
                        initial="idle"
                        animate={isSelected ? 'selected' : 'idle'}
                        whileHover={!isBooked ? 'hover' : undefined}
                        onClick={() => handleSeatClick(seatId)}
                        disabled={isBooked}
                        title={`Seat ${seatId} (${tier.name}) - ${isBooked ? 'Packed / Already Booked' : isSelected ? 'Selected' : 'Available'}`}
                        className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all duration-150 ${
                          isBooked
                            ? 'bg-slate-800/90 text-slate-500 border border-slate-700/60 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'bg-indigo-600 text-white border-2 border-indigo-400 shadow-md shadow-indigo-600/40 ring-2 ring-indigo-400/30'
                            : row === 'A' || row === 'B'
                            ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-slate-950 cursor-pointer'
                            : row === 'C' || row === 'D'
                            ? 'bg-indigo-950/40 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600 hover:text-white cursor-pointer'
                            : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white cursor-pointer'
                        }`}
                      >
                        {isBooked ? (
                          <Lock className="w-3 h-3 text-rose-400/80" />
                        ) : isSelected ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          seatNumber
                        )}
                      </motion.button>

                      {/* Aisle Spacer */}
                      {isAisle && <div className="w-2 sm:w-4" />}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Row Label Right */}
              <span className="w-6 text-xs font-bold text-slate-400 text-center">
                {row}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-slate-800 border border-slate-700" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-indigo-600 border-2 border-indigo-400" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-amber-950/40 border border-amber-500/40" />
          <span>VIP (Rows A-B)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-indigo-950/40 border border-indigo-500/40" />
          <span>Premium (Rows C-D)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-slate-800/90 border border-slate-700/60 flex items-center justify-center">
            <Lock className="w-2.5 h-2.5 text-rose-400" />
          </div>
          <span className="font-semibold text-rose-400">Booked / Packed</span>
        </div>
      </div>
    </div>
  );
};
