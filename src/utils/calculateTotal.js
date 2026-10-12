/**
 * Price & Tax Calculations
 */

export const SERVICE_FEE_PERCENTAGE = 0.05; // 5% service fee
export const GST_PERCENTAGE = 0.18; // 18% GST on service fee

export const calculatePricing = (items = []) => {
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = (item.ticketType?.price || 0) * (item.quantity || 1);
    return sum + itemTotal;
  }, 0);

  const serviceFee = subtotal > 0 ? Math.round(subtotal * SERVICE_FEE_PERCENTAGE) : 0;
  const gst = serviceFee > 0 ? Math.round(serviceFee * GST_PERCENTAGE) : 0;
  const total = subtotal + serviceFee + gst;

  return {
    subtotal,
    serviceFee,
    gst,
    total,
    formattedSubtotal: `₹${subtotal.toLocaleString('en-IN')}`,
    formattedServiceFee: `₹${serviceFee.toLocaleString('en-IN')}`,
    formattedGst: `₹${gst.toLocaleString('en-IN')}`,
    formattedTotal: `₹${total.toLocaleString('en-IN')}`
  };
};

export const formatCurrency = (amount) => {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
};
