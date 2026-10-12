import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Wifi,
  Download,
  Edit2,
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import {
  getNetworkHost,
  getMobileTicketUrl,
  generateQrCodeDataUrl
} from '../../utils/ticketQr';

export const MobileQrModal = ({ isOpen, onClose, booking }) => {
  const [qrUrl, setQrUrl] = useState('');
  const [fullTicketUrl, setFullTicketUrl] = useState('');
  const [host, setHost] = useState('');
  const [isEditingHost, setIsEditingHost] = useState(false);
  const [customHostInput, setCustomHostInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and load network host & QR code
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      if (!booking || !isOpen) return;
      setIsLoading(true);

      const detectedHost = await getNetworkHost();
      if (!isMounted) return;

      setHost(detectedHost);
      setCustomHostInput(detectedHost);

      const url = getMobileTicketUrl(booking, detectedHost);
      setFullTicketUrl(url);

      const qr = await generateQrCodeDataUrl(url, {
        width: 340,
        margin: 2,
        darkColor: '#0f172a',
        lightColor: '#ffffff'
      });

      if (isMounted) {
        setQrUrl(qr);
        setIsLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [booking, isOpen]);

  // Handle host change/override
  const handleApplyCustomHost = async () => {
    const trimmed = customHostInput.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setHost(trimmed);
    localStorage.setItem('eventnest_custom_host', trimmed);
    setIsEditingHost(false);

    const url = getMobileTicketUrl(booking, trimmed);
    setFullTicketUrl(url);

    const qr = await generateQrCodeDataUrl(url, {
      width: 340,
      margin: 2,
      darkColor: '#0f172a',
      lightColor: '#ffffff'
    });
    setQrUrl(qr);
    setIsLoading(false);
  };

  const handleResetHost = async () => {
    localStorage.removeItem('eventnest_custom_host');
    setIsLoading(true);
    setIsEditingHost(false);

    const detected = await getNetworkHost();
    setHost(detected);
    setCustomHostInput(detected);

    const url = getMobileTicketUrl(booking, detected);
    setFullTicketUrl(url);

    const qr = await generateQrCodeDataUrl(url, {
      width: 340,
      margin: 2,
      darkColor: '#0f172a',
      lightColor: '#ffffff'
    });
    setQrUrl(qr);
    setIsLoading(false);
  };

  const handleCopyLink = () => {
    if (!fullTicketUrl) return;
    navigator.clipboard?.writeText(fullTicketUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDownloadQr = () => {
    if (!qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `eventnest-ticket-${booking?.id || 'pass'}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePreviewMobile = () => {
    if (!fullTicketUrl) return;
    // Open in a mobile-like popup window
    const width = 420;
    const height = 850;
    const left = Math.max(0, (window.innerWidth - width) / 2);
    const top = Math.max(0, (window.innerHeight - height) / 2);
    window.open(
      fullTicketUrl,
      'mobile_ticket_preview',
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
  };

  if (!booking) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Scan Ticket to Open on Mobile"
      maxWidth="max-w-lg"
    >
      <div className="space-y-6 text-center">
        {/* Subtitle / Event Mini Pill */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Smartphone className="w-4 h-4 text-red-500 animate-pulse" />
          <span>Point your phone camera to view and carry this ticket</span>
        </div>

        {/* The Scannable QR Code Frame */}
        <div className="relative inline-block mx-auto">
          <div className="relative p-5 bg-white rounded-3xl border-2 border-slate-900/10 dark:border-slate-800 shadow-2xl overflow-hidden group">
            {/* Top Bar Branding */}
            <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100 text-slate-900">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-red-600 flex items-center justify-center text-white">
                  <Sparkles className="w-3 h-3 fill-white" />
                </div>
                <span className="text-xs font-black tracking-tight">EventNest Mobile Pass</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400">
                {booking.id}
              </span>
            </div>

            {/* QR Image Container */}
            <div className="w-64 h-64 mx-auto flex items-center justify-center bg-white rounded-2xl relative">
              {isLoading ? (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-red-500" />
                  <span className="text-xs font-medium">Generating scannable QR...</span>
                </div>
              ) : qrUrl ? (
                <img
                  src={qrUrl}
                  alt={`Scannable QR Code for ${booking.eventTitle}`}
                  className="w-full h-full object-contain select-none"
                />
              ) : (
                <div className="text-xs text-rose-500">Failed to generate QR code</div>
              )}
            </div>

            {/* Bottom Tag */}
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>Camera Scan Ready • Mobile Verified Pass</span>
            </div>
          </div>
        </div>

        {/* Network & Device Info Box */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 text-left space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Wi-Fi Network Host: <code className="font-mono text-indigo-600 dark:text-indigo-400">{host}</code>
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Make sure your mobile phone is connected to the same Wi-Fi network.
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsEditingHost(!isEditingHost)}
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 cursor-pointer shrink-0"
              title="Edit host / IP"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditingHost ? 'Cancel' : 'Change IP'}</span>
            </button>
          </div>

          {isEditingHost && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customHostInput}
                  onChange={(e) => setCustomHostInput(e.target.value)}
                  placeholder="e.g. 192.168.1.15:5173"
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
                <Button size="sm" variant="primary" onClick={handleApplyCustomHost}>
                  Apply
                </Button>
                <Button size="sm" variant="ghost" onClick={handleResetHost}>
                  Reset
                </Button>
              </div>
              <p className="text-[10px] text-slate-400">
                Enter your PC's Wi-Fi IP address or ngrok/domain if your phone is on another network.
              </p>
            </div>
          )}
        </div>

        {/* 3 Step Instructions */}
        <div className="grid grid-cols-3 gap-2 text-left">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 text-[10px] font-black flex items-center justify-center mb-1.5">
              1
            </span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Open Camera</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Use iOS Camera or Android Google Lens
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 text-[10px] font-black flex items-center justify-center mb-1.5">
              2
            </span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Scan Code</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Point your camera steadily at the QR code
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 text-[10px] font-black flex items-center justify-center mb-1.5">
              3
            </span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">View on Phone</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Tap the notification to open and save ticket
            </p>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          <Button
            variant="primary"
            size="md"
            icon={isCopied ? Check : Copy}
            onClick={handleCopyLink}
          >
            {isCopied ? 'Link Copied!' : 'Copy Mobile Link'}
          </Button>

          <Button
            variant="secondary"
            size="md"
            icon={ExternalLink}
            onClick={handlePreviewMobile}
          >
            Simulate Mobile View
          </Button>

          <Button
            variant="ghost"
            size="md"
            icon={Download}
            onClick={handleDownloadQr}
          >
            Download QR
          </Button>
        </div>
      </div>
    </Modal>
  );
};
