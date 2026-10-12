import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { useEvents } from '../../context/EventsContext';
import { CATEGORIES } from '../../data/categories';
import { Input, Select } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById, updateEvent } = useEvents();

  const event = getEventById(id);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('music');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [venue, setVenue] = useState('');
  const [price, setPrice] = useState(550);
  const [image, setImage] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setCategory(event.category || 'music');
      setDescription(event.description || '');
      setDate(event.date || '');
      setTime(event.time || '');
      setCity(event.city || 'Mumbai');
      setVenue(event.venue || '');
      setPrice(event.price || 550);
      setImage(event.image || '');
    }
  }, [event]);

  if (!event) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4 px-4">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Event Not Found
        </h2>
        <Link to="/organizer/events">
          <Button variant="primary">Back to My Events</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    updateEvent(event.id, {
      title,
      category,
      description,
      date,
      time,
      city,
      venue,
      price: Number(price),
      image,
    });

    setIsSaved(true);
    setTimeout(() => {
      navigate('/organizer/events');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <Link
          to="/organizer/events"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Events
        </Link>
        <span className="text-xs font-mono font-bold text-slate-400">
          Editing: {event.id}
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Edit Event Details
        </h1>
        <p className="text-xs text-slate-500">
          Update event details, dates, ticket pricing, and cover images.
        </p>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>Changes successfully saved! Redirecting...</span>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
          <Input
            label="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={CATEGORIES.map((c) => ({ label: c.name, value: c.slug }))}
            />

            <Select
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              options={[
                { label: 'Mumbai', value: 'Mumbai' },
                { label: 'Bengaluru', value: 'Bengaluru' },
                { label: 'Delhi', value: 'Delhi' },
                { label: 'Hyderabad', value: 'Hyderabad' },
                { label: 'Kolkata', value: 'Kolkata' },
                { label: 'Goa', value: 'Goa' },
              ]}
            />

            <Input
              label="Event Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <Input
              label="Event Time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />

            <Input
              label="Venue Name"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
            />

            <Input
              label="Starting Ticket Price (₹550 - ₹1,500 INR)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min={550}
              max={1500}
              required
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <Input
            label="Cover Poster URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link to="/organizer/events">
            <Button variant="secondary" size="lg">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="primary" size="lg" icon={Save}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
