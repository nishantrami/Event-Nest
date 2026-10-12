import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  ShieldCheck,
  UserCheck,
  UserX,
  Edit2,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';

export const AdminUsers = () => {
  const {
    registeredUsers = [],
    addUser,
    updateUser,
    deleteUser,
    toggleUserRole,
    toggleUserStatus
  } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'admin' | 'user'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'suspended'
  const [notification, setNotification] = useState(null);

  // Add User Modal State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Mumbai',
    role: 'user',
    password: 'password123'
  });

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleToggleRole = (userId) => {
    const res = toggleUserRole(userId);
    if (res.success) {
      showNotification('User authorization role updated successfully.');
    } else {
      showNotification(res.error || 'Failed to modify role.');
    }
  };

  const handleToggleStatus = (userId) => {
    const res = toggleUserStatus(userId);
    if (res.success) {
      showNotification('User account status updated.');
    } else {
      showNotification(res.error || 'Failed to update status.');
    }
  };

  const handleDeleteUser = (userId) => {
    const res = deleteUser(userId);
    if (res.success) {
      showNotification('User deleted from database.');
    } else {
      showNotification(res.error || 'Failed to delete user.');
    }
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    const res = addUser(newUserData);
    if (res.success) {
      setIsAddUserOpen(false);
      setNewUserData({
        name: '',
        email: '',
        phone: '',
        city: 'Mumbai',
        role: 'user',
        password: 'password123'
      });
      showNotification(`New user ${res.user.name} created successfully.`);
    } else {
      showNotification(res.error || 'Failed to add user.');
    }
  };

  const handleSaveEditUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUser(editingUser.id, editingUser);
    setEditingUser(null);
    showNotification(`User profile for ${editingUser.name} updated.`);
  };

  // Filtered Users List
  const userList = Array.isArray(registeredUsers) ? registeredUsers : [];
  const filteredUsers = userList.filter((u) => {
    if (!u) return false;
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !searchLower ||
      (u.name || '').toLowerCase().includes(searchLower) ||
      (u.email || '').toLowerCase().includes(searchLower) ||
      (u.phone || '').toLowerCase().includes(searchLower) ||
      (u.city || '').toLowerCase().includes(searchLower);

    const matchesRole =
      roleFilter === 'all' || u.role === roleFilter;

    const matchesStatus =
      statusFilter === 'all' || (u.status || 'active') === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            User Accounts & Permission Directory
          </h2>
          <p className="text-xs text-slate-500">
            Total {userList.length} platform members registered. Assign super-admin rights or manage suspensions.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={UserPlus}
          onClick={() => setIsAddUserOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs shrink-0"
        >
          Add New User
        </Button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter and Search Bar (Crisp White Card) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, phone, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs w-full md:w-auto">
          {/* Role Filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
            {['all', 'admin', 'user'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition-colors cursor-pointer text-[11px] ${
                  roleFilter === r
                    ? 'bg-white text-indigo-600 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === 'all' ? 'All Roles' : `${r}s`}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
            {['all', 'active', 'suspended'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition-colors cursor-pointer text-[11px] ${
                  statusFilter === s
                    ? 'bg-white text-purple-600 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table (Crisp White Table) */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3.5">User Identity</th>
              <th className="px-4 py-3.5">Contact Details</th>
              <th className="px-4 py-3.5">Location</th>
              <th className="px-4 py-3.5">System Role</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Joined</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  {/* Identity */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={u.name}
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200 shadow-2xs"
                      />
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 block">
                          {u.name}
                        </span>
                        <span className="text-[11px] text-slate-500 block font-mono">
                          ID: {u.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <span className="text-slate-900 block font-medium">
                        {u.email}
                      </span>
                      <span className="text-[11px] text-slate-500 block font-mono">
                        {u.phone || 'Phone not set'}
                      </span>
                    </div>
                  </td>

                  {/* City */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-slate-700 font-medium">
                    {u.city || 'Mumbai, IN'}
                  </td>

                  {/* Role Badge */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {u.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        <ShieldCheck className="w-3 h-3 text-purple-600" />
                        Super-Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        Platform User
                      </span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {u.status === 'suspended' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <UserX className="w-3 h-3 text-rose-600" />
                        Suspended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <UserCheck className="w-3 h-3 text-emerald-600" />
                        Active
                      </span>
                    )}
                  </td>

                  {/* Joined Date */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-[11px] text-slate-500 font-mono">
                    {u.joinedAt || 'Oct 2026'}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleToggleRole(u.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          u.role === 'admin'
                            ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                        }`}
                        title={u.role === 'admin' ? 'Revoke Admin Privileges' : 'Promote to Admin'}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          u.status === 'suspended'
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                        }`}
                        title={u.status === 'suspended' ? 'Re-activate Account' : 'Suspend Account'}
                      >
                        {u.status === 'suspended' ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => setEditingUser({ ...u })}
                        className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors cursor-pointer border border-indigo-200"
                        title="Edit Account Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer border border-rose-200"
                        title="Delete User"
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
                  No users found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Add New User Account"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Full Name</label>
            <input
              type="text"
              value={newUserData.name}
              onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
              placeholder="e.g. Vikram Malhotra"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Email Address</label>
            <input
              type="email"
              value={newUserData.email}
              onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              placeholder="vikram@example.com"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Phone Number</label>
              <input
                type="text"
                value={newUserData.phone}
                onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">City</label>
              <input
                type="text"
                value={newUserData.city}
                onChange={(e) => setNewUserData({ ...newUserData, city: e.target.value })}
                placeholder="Mumbai"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Initial Role</label>
              <select
                value={newUserData.role}
                onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="user">Regular User</option>
                <option value="admin">Platform Admin</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Temporary Password</label>
              <input
                type="text"
                value={newUserData.password}
                onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <Button variant="secondary" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
              Create Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      {editingUser && (
        <Modal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          title={`Edit Account: ${editingUser.name}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSaveEditUser} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Email</label>
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Phone</label>
                <input
                  type="text"
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">City</label>
                <input
                  type="text"
                  value={editingUser.city || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <Button variant="secondary" onClick={() => setEditingUser(null)}>
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
