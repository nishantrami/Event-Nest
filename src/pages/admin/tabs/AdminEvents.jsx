import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  MapPin,
  Search,
  Star,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useEvents } from '../../../context/EventsContext';
import { formatDate } from '../../../utils/formatDate';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';

export const AdminEvents = ({ onAddEventClick }) => {
  const { events = [], deleteEvent, duplicateEvent, updateEvent } = useEvents();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedHostType, setSelectedHostType] = useState('all'); // 'all' | 'admin' | 'user'
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Edit Event State
  const [editingEvent, setEditingEvent] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = () => {
    if (deleteTargetId) {
      deleteEvent(deleteTargetId);
      setDeleteTargetId(null);
      showNotification('Event permanently deleted from catalog.');
    }
  };

  const handleDuplicate = (id) => {
    duplicateEvent(id);
    showNotification('Event duplicated as a new copy.');
  };

  const handleToggleFeatured = (evt) => {
    updateEvent(evt.id, { featured: !evt.featured });
    showNotification(`Event "${evt.title}" ${!evt.featured ? 'marked as Featured' : 'removed from Featured'}.`);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingEvent) return;
    updateEvent(editingEvent.id, editingEvent);
    setEditingEvent(null);
    showNotification('Event details updated successfully.');
  };

  // Filtered Events
  const eventList = Array.isArray(events) ? events : [];
  const filteredEvents = eventList.filter((evt) => {
    if (!evt) return false;
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !searchLower ||
      (evt.title || '').toLowerCase().includes(searchLower) ||
      (evt.city || '').toLowerCase().includes(searchLower) ||
      (evt.venue || '').toLowerCase().includes(searchLower) ||
      (evt.organizer?.name || '').toLowerCase().includes(searchLower);

    const matchesCategory =
      selectedCategory === 'all' || (evt.category || '').toLowerCase() === selectedCategory.toLowerCase();

    const matchesHost =
      selectedHostType === 'all' ||
      (selectedHostType === 'user' && evt.adminFeePaid) ||
      (selectedHostType === 'admin' && !evt.adminFeePaid);

    return matchesSearch && matchesCategory && matchesHost;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Events Catalog & Master Inventory
          </h2>
          <p className="text-xs text-slate-500">
            Total of {eventList.length} events published. Filter, modify tiers, approve user submissions, or delete.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={PlusCircle}
          onClick={onAddEventClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs shrink-0"
        >
          Create New Event
        </Button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter and Search Controls (Crisp White Card) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search title, city, venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Host Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setSelectedHostType('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer text-[11px] whitespace-nowrap ${
                selectedHostType === 'all'
                  ? 'bg-white text-indigo-600 shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Hosts ({eventList.length})
            </button>
            <button
              onClick={() => setSelectedHostType('admin')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer text-[11px] whitespace-nowrap ${
                selectedHostType === 'admin'
                  ? 'bg-white text-indigo-600 shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin Created
            </button>
            <button
              onClick={() => setSelectedHostType('user')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer text-[11px] whitespace-nowrap ${
                selectedHostType === 'user'
                  ? 'bg-amber-600 text-white shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              User Hosted (₹499 Paid)
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          {['all', 'music', 'comedy', 'technology', 'festivals', 'sports'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl font-bold capitalize transition-colors cursor-pointer text-[11px] ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table (Crisp White Table) */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3.5">Event Details</th>
              <th className="px-4 py-3.5">Category & Location</th>
              <th className="px-4 py-3.5">Host Origin</th>
              <th className="px-4 py-3.5">Base Price</th>
              <th className="px-4 py-3.5">Seats</th>
              <th className="px-4 py-3.5">Featured</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50 transition-colors">
                  {/* Event Thumbnail & Title */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={evt.image}
                        alt={evt.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 shadow-2xs"
                      />
                      <div className="space-y-0.5 min-w-0 max-w-xs">
                        <span className="font-bold text-slate-900 block truncate">
                          {evt.title}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <span className="font-mono text-[10px]">ID: {evt.id}</span>
                          <span>•</span>
                          <span>{formatDate(evt.date)}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category & Location */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold capitalize inline-block bg-slate-100 text-slate-700 border border-slate-200">
                        {evt.category}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{evt.city} • {evt.venue}</span>
                      </div>
                    </div>
                  </td>

                  {/* Host Origin */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {evt.adminFeePaid ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        User (₹499 Paid)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        Platform Admin
                      </span>
                    )}
                  </td>

                  {/* Base Price */}
                  <td className="px-4 py-3.5 whitespace-nowrap font-mono font-bold text-slate-900">
                    ₹{Number(evt.price || 0).toLocaleString('en-IN')}
                  </td>

                  {/* Seats Status */}
                  <td className="px-4 py-3.5 whitespace-nowrap font-mono text-[11px] text-slate-600">
                    <span className="text-slate-900 font-bold">{evt.availableSeats ?? 50}</span> / {evt.totalSeats ?? 100}
                  </td>

                  {/* Featured Toggle */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleFeatured(evt)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        evt.featured
                          ? 'bg-amber-50 border-amber-300 text-amber-600'
                          : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600'
                      }`}
                      title={evt.featured ? 'Remove from Featured' : 'Mark as Featured'}
                    >
                      <Star className={`w-4 h-4 ${evt.featured ? 'fill-amber-500' : ''}`} />
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/events/${evt.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => setEditingEvent({ ...evt })}
                        className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors cursor-pointer border border-indigo-200"
                        title="Edit Event"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDuplicate(evt.id)}
                        className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors cursor-pointer border border-purple-200"
                        title="Duplicate Event"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteTargetId(evt.id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer border border-rose-200"
                        title="Delete Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                  No events found matching your filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Confirm Event Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <p>
              Are you sure you want to delete this event from the platform catalog? This action will permanently remove it from public search and bookings.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setDeleteTargetId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Event
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Event Modal */}
      {editingEvent && (
        <Modal
          isOpen={!!editingEvent}
          onClose={() => setEditingEvent(null)}
          title={`Edit Event: ${editingEvent.title}`}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Event Title</label>
              <input
                type="text"
                value={editingEvent.title}
                onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Category</label>
                <select
                  value={editingEvent.category}
                  onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 capitalize"
                >
                  <option value="music">Music</option>
                  <option value="comedy">Comedy</option>
                  <option value="technology">Technology</option>
                  <option value="festivals">Festivals</option>
                  <option value="sports">Sports</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Base Price (₹ INR)</label>
                <input
                  type="number"
                  value={editingEvent.price}
                  onChange={(e) => setEditingEvent({ ...editingEvent, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Venue</label>
                <input
                  type="text"
                  value={editingEvent.venue}
                  onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">City</label>
                <input
                  type="text"
                  value={editingEvent.city}
                  onChange={(e) => setEditingEvent({ ...editingEvent, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Banner Image URL</label>
              <input
                type="url"
                value={editingEvent.image}
                onChange={(e) => setEditingEvent({ ...editingEvent, image: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-[11px] focus:bg-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <Button variant="secondary" onClick={() => setEditingEvent(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
