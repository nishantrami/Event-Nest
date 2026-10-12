import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  PlusCircle,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  MapPin,
  AlertCircle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useEvents } from '../../context/EventsContext';
import { formatDate } from '../../utils/formatDate';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const MyEvents = () => {
  const { events, customEvents, deleteEvent, duplicateEvent } = useEvents();
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  // If no custom events created yet, show the first 4 events so organizer can edit/duplicate them as demo
  const displayEvents = customEvents.length > 0 ? customEvents : events.slice(0, 5);

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteEvent(deleteTargetId);
      setDeleteTargetId(null);
      setActionNotice('Event deleted successfully.');
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const handleDuplicate = (id) => {
    duplicateEvent(id);
    setActionNotice('Event duplicated successfully as draft copy.');
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Event Management
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            My Events Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your published events, update ticket tiers, duplicate listings, or unpublish.
          </p>
        </div>

        <Link to="/organizer/create-event">
          <Button variant="primary" size="sm" icon={PlusCircle}>
            Create New Event
          </Button>
        </Link>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-indigo-500" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Events Table / Card List */}
      <div className="space-y-4">
        {displayEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            {/* Event Media & Information */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <img
                src={evt.image}
                alt={evt.title}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0"
              />

              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm" className="capitalize">
                    {evt.category}
                  </Badge>
                  {evt.adminFeePaid ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      ₹{evt.adminFeePaid} Admin Fee Paid
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      Admin Published
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 font-mono">
                    ID: {evt.id}
                  </span>
                </div>

                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white truncate">
                  {evt.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    {formatDate(evt.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {evt.venue}, {evt.city}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 pt-1 flex items-center gap-3">
                  <span>Starting: <strong>₹{Number(evt.price).toLocaleString('en-IN')}</strong></span>
                  <span>• Available Seats: <strong>{evt.availableSeats || 100}</strong></span>
                </div>
              </div>
            </div>

            {/* Actions Button Group */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
              <Link to={`/events/${evt.id}`} target="_blank">
                <Button variant="ghost" size="sm" icon={ExternalLink}>
                  Preview
                </Button>
              </Link>

              <Button
                variant="secondary"
                size="sm"
                icon={Copy}
                onClick={() => handleDuplicate(evt.id)}
              >
                Duplicate
              </Button>

              <Link to={`/organizer/edit/${evt.id}`}>
                <Button variant="secondary" size="sm" icon={Edit}>
                  Edit
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                icon={Trash2}
                onClick={() => setDeleteTargetId(evt.id)}
                className="text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Confirm Event Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>
              Are you sure you want to delete this event? It will be permanently removed from your catalog and discovery listings.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setDeleteTargetId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete Event
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
