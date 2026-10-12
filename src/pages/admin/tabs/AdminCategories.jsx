import React, { useState } from 'react';
import {
  Layers,
  MapPin,
  PlusCircle,
  CheckCircle2,
  Music,
  Smile,
  Cpu,
  Trophy,
  Sparkles
} from 'lucide-react';
import { useEvents } from '../../../context/EventsContext';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';

export const AdminCategories = () => {
  const { events = [] } = useEvents();

  const [categories, setCategories] = useState([
    {
      id: 'music',
      name: 'Music & Concerts',
      description: 'Stadium gigs, indie sessions, techno festivals, electronic raves',
      icon: Music,
      gradient: 'from-indigo-600 to-purple-600',
      activeColor: 'text-indigo-600'
    },
    {
      id: 'comedy',
      name: 'Standup Comedy',
      description: 'Comedy specials, open-mic showcases, roast battles & theater',
      icon: Smile,
      gradient: 'from-amber-500 to-orange-600',
      activeColor: 'text-amber-600'
    },
    {
      id: 'technology',
      name: 'Tech & AI Summits',
      description: 'Founders summits, hackathons, developer meetups, venture days',
      icon: Cpu,
      gradient: 'from-cyan-500 to-blue-600',
      activeColor: 'text-cyan-600'
    },
    {
      id: 'festivals',
      name: 'Festivals & Carnivals',
      description: 'Food fests, craft brew carnivals, cultural & wellness retreats',
      icon: Sparkles,
      gradient: 'from-pink-500 to-rose-600',
      activeColor: 'text-pink-600'
    },
    {
      id: 'sports',
      name: 'Sports & Marathons',
      description: 'Marathons, cricket leagues, esports arenas, badminton tourneys',
      icon: Trophy,
      gradient: 'from-emerald-500 to-teal-600',
      activeColor: 'text-emerald-600'
    }
  ]);

  const [cities, setCities] = useState([
    { name: 'Mumbai', state: 'Maharashtra', venues: ['Royal Opera House', 'Jio World Garden', 'Bandra Amphitheatre', 'NCPA Nariman Point'] },
    { name: 'Bengaluru', state: 'Karnataka', venues: ['Koramangala Tech Club', 'Bangalore Palace Grounds', 'Manpho Convention Center'] },
    { name: 'Delhi NCR', state: 'Delhi', venues: ['Hauz Khas Social', 'Major Dhyan Chand Stadium', 'Siri Fort Auditorium'] },
    { name: 'Goa', state: 'Goa', venues: ['Anjuna Beach Lawn', 'Vagator Hilltop', 'Panjim Heritage Center'] },
    { name: 'Pune', state: 'Maharashtra', venues: ['Koregaon Park Arena', 'Balewadi Stadium'] }
  ]);

  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [notice, setNotice] = useState(null);

  const showNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat = {
      id: newCatName.toLowerCase().replace(/\s+/g, '-'),
      name: newCatName.trim(),
      description: newCatDesc.trim() || 'Curated event category',
      icon: Sparkles,
      gradient: 'from-purple-600 to-indigo-600',
      activeColor: 'text-purple-600'
    };

    setCategories([...categories, newCat]);
    setIsAddCatOpen(false);
    setNewCatName('');
    setNewCatDesc('');
    showNotice(`New category "${newCat.name}" added to platform!`);
  };

  const eventList = Array.isArray(events) ? events : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Categories, Cities & Venue Hubs
          </h2>
          <p className="text-xs text-slate-500">
            Structure discovery taxonomies, manage metropolitan coverage, and audit venue associations.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={PlusCircle}
          onClick={() => setIsAddCatOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs shrink-0"
        >
          Add Category
        </Button>
      </div>

      {notice && (
        <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Section 1: Categories Grid (Crisp White Cards) */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>Primary Event Categories ({categories.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const eventCount = eventList.filter(
              (e) => (e?.category || '').toLowerCase() === cat.id.toLowerCase()
            ).length;

            return (
              <div
                key={cat.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 hover:shadow-md hover:border-slate-300 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${cat.gradient} flex items-center justify-center text-white shadow-2xs`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 border border-slate-200 text-slate-700">
                    {eventCount} {eventCount === 1 ? 'event' : 'events'}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-base">{cat.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Cities & Active Venues (Crisp White Cards) */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-600" />
          <span>Supported Metropolitan Cities & Venues</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cities.map((c) => (
            <div
              key={c.name}
              className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-slate-900 text-base">{c.name}</h4>
                  <span className="text-[11px] text-slate-500 font-medium">{c.state}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 font-mono">
                  {c.venues.length} venues
                </span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Verified Locations:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {c.venues.map((v) => (
                    <span
                      key={v}
                      className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-[11px]"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddCatOpen}
        onClose={() => setIsAddCatOpen(false)}
        title="Create New Event Category"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Category Name</label>
            <input
              type="text"
              placeholder="e.g. Wellness & Yoga"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Description</label>
            <textarea
              rows={3}
              placeholder="Brief description of this experience category..."
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <Button variant="secondary" onClick={() => setIsAddCatOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
              Add Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
