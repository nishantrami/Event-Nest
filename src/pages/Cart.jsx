import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck, Trash2, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/cart/CartItem';
import { Button } from '../components/common/Button';

export const Cart = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    formattedSubtotal,
    formattedServiceFee,
    formattedGst,
    formattedTotal,
    totalCount,
  } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/10">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            No tickets yet
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Discover your next experience. Add concerts, sports derbies, or comedy nights to your basket.
          </p>
        </div>
        <Link to="/events">
          <Button variant="primary" size="lg" icon={Sparkles}>
            Explore Events
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Booking Cart
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Review Your Tickets
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {totalCount} ticket{totalCount > 1 ? 's' : ''} reserved in your cart
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-rose-500 hover:underline flex items-center gap-1 font-semibold"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Order Breakdown
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal ({totalCount} items):</span>
                <span className="font-bold text-slate-900 dark:text-white">{formattedSubtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Platform Service Fee (5%):</span>
                <span className="font-bold text-slate-900 dark:text-white">{formattedServiceFee}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>GST (18% on fee):</span>
                <span className="font-bold text-slate-900 dark:text-white">{formattedGst}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Total Amount:</span>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {formattedTotal}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full text-base font-bold shadow-lg shadow-red-600/30"
              onClick={() => navigate('/checkout')}
              icon={ArrowRight}
              iconPosition="right"
            >
              Proceed to Checkout
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Secure 256-Bit SSL Checkout Simulation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
