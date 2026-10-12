import QRCode from 'qrcode';

/**
 * Encodes ticket booking details into a URL-safe UTF-8 base64 string
 */
export const encodeTicketData = (booking) => {
  if (!booking) return '';
  try {
    const compactPayload = {
      id: booking.id,
      userId: booking.userId || 'usr-guest',
      userEmail: booking.userEmail || booking.customer?.email || '',
      eventId: booking.eventId,
      eventTitle: booking.eventTitle,
      eventImage: booking.eventImage,
      category: booking.category,
      date: booking.date,
      time: booking.time,
      venue: booking.venue,
      location: booking.location,
      city: booking.city,
      ticketTypeName: booking.ticketTypeName,
      quantity: booking.quantity || 1,
      selectedSeats: booking.selectedSeats || [],
      subtotal: booking.subtotal,
      serviceFee: booking.serviceFee,
      gst: booking.gst,
      totalAmount: booking.totalAmount,
      status: booking.status || 'upcoming',
      bookedAt: booking.bookedAt || new Date().toISOString(),
      customer: {
        name: booking.customer?.name || 'Valued Guest',
        email: booking.customer?.email || '',
        phone: booking.customer?.phone || '',
      },
      paymentMethod: booking.paymentMethod || 'UPI',
      qrCodeData: booking.qrCodeData || `EVENTNEST-${booking.id}-PASS`,
    };

    const jsonString = JSON.stringify(compactPayload);
    // Safe Unicode to UTF-8 base64
    const utf8Bytes = new TextEncoder().encode(jsonString);
    let binary = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return encodeURIComponent(btoa(binary));
  } catch (error) {
    console.error('Error encoding ticket data:', error);
    return '';
  }
};

/**
 * Decodes ticket booking details from a URL-safe base64 string
 */
export const decodeTicketData = (encodedString) => {
  if (!encodedString) return null;
  try {
    const binary = atob(decodeURIComponent(encodedString));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonString = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(jsonString);
    if (!parsed || !parsed.id) return null;
    return parsed;
  } catch (error) {
    console.error('Error decoding ticket data:', error);
    return null;
  }
};

/**
 * Fetches the local network IP provided by Vite dev server
 */
let cachedNetworkHost = null;

export const getNetworkHost = async () => {
  // If user configured a custom host in localStorage
  const savedHost = localStorage.getItem('eventnest_custom_host');
  if (savedHost && savedHost.trim()) {
    return savedHost.trim();
  }

  if (cachedNetworkHost) {
    return cachedNetworkHost;
  }

  // If in production or not on localhost, use actual window.location.host
  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (!isLocalhost) {
      cachedNetworkHost = window.location.host;
      return cachedNetworkHost;
    }

    try {
      const res = await fetch('/api/network-ip');
      if (res.ok) {
        const data = await res.json();
        if (data.host) {
          cachedNetworkHost = data.host;
          return data.host;
        }
      }
    } catch {
      // Fallback
    }

    cachedNetworkHost = window.location.host;
    return cachedNetworkHost;
  }

  return 'localhost:5173';
};

/**
 * Builds the mobile-accessible Ticket URL
 */
export const getMobileTicketUrl = (booking, hostOverride = null) => {
  if (!booking) return '';

  const protocol =
    typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? 'https:'
      : 'http:';

  const host =
    hostOverride ||
    cachedNetworkHost ||
    (typeof window !== 'undefined' ? window.location.host : 'localhost:5173');

  const encodedData = encodeTicketData(booking);
  return `${protocol}//${host}/ticket/${booking.id}?pass=${encodedData}`;
};

/**
 * Generates high-res QR Code Data URL (PNG)
 */
export const generateQrCodeDataUrl = async (text, options = {}) => {
  try {
    return await QRCode.toDataURL(text, {
      width: options.width || 320,
      margin: options.margin !== undefined ? options.margin : 2,
      color: {
        dark: options.darkColor || '#0f172a', // Deep slate for sharp contrast
        light: options.lightColor || '#ffffff',
      },
      errorCorrectionLevel: options.level || 'M',
    });
  } catch (error) {
    console.error('Error generating QR code data URL:', error);
    return null;
  }
};

/**
 * Google Maps Directions Link
 */
export const getDirectionsUrl = (booking) => {
  if (!booking) return '#';
  const query = [booking.venue, booking.location, booking.city]
    .filter(Boolean)
    .join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

/**
 * Google Calendar Add Event Link
 */
export const getGoogleCalendarUrl = (booking) => {
  if (!booking || !booking.date) return '#';
  try {
    const [year, month, day] = booking.date.split('-');
    const [hours, minutes] = (booking.time || '18:00').split(':');
    const startIso = `${year}${month}${day}T${hours.padStart(2, '0')}${minutes.padStart(2, '0')}00`;
    // 3 hours duration
    const endHours = String((parseInt(hours, 10) + 3) % 24).padStart(2, '0');
    const endIso = `${year}${month}${day}T${endHours}${minutes.padStart(2, '0')}00`;

    const title = encodeURIComponent(booking.eventTitle || 'Event');
    const details = encodeURIComponent(
      `Pass: ${booking.ticketTypeName}\nSeats: ${booking.selectedSeats?.join(', ') || 'Open'}\nRef: ${booking.id}\nVerification: ${booking.qrCodeData || ''}`
    );
    const location = encodeURIComponent(`${booking.venue}, ${booking.location}`);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  } catch {
    return '#';
  }
};
