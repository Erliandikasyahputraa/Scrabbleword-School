import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../providers/AuthProvider';
import { fetchApi } from '../lib/api';
import { PlusCircle, Edit, Trash2, X, Users as UsersIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { toast } from 'react-hot-toast';

type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export default function Users() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as 'admin' | 'teacher' | 'student',
    status: 'pending' as 'pending' | 'approved' | 'rejected',
  });

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => fetchApi('/users')
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      if (isEditMode && editingUserId) {
        return fetchApi(`/users/${editingUserId}`, {
          method: 'PUT',
          body: JSON.stringify(data)
        });
      }
      return fetchApi('/users', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(isEditMode ? 'User updated successfully' : 'User created successfully');
      closeModal();
    },
    onError: (error: any) => toast.error(error.message || 'Failed to save user')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => 
      fetchApi(`/users/${id}`, {
        method: 'DELETE'
      }),
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => toast.error(error.message || 'Failed to delete user')
  });

  const openModal = (u?: User) => {
    if (u) {
      setIsEditMode(true);
      setEditingUserId(u.id);
      setFormData({
        name: u.name,
        email: u.email,
        password: '',
        role: u.role,
        status: u.status,
      });
    } else {
      setIsEditMode(false);
      setEditingUserId(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'student',
        status: 'pending',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleDelete = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete User',
      description: 'Are you sure you want to delete this user? This action cannot be undone.',
      onConfirm: () => deleteMutation.mutate(id)
    });
  };

  if (user?.role !== 'admin') {
    return (
      <div className="p-12 text-center text-red-500 font-bold">
        Unauthorized access
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            User Management
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage all platform users, roles, and statuses.
          </p>
        </div>
        <Button 
          variant="primary" 
          className="gap-2 font-semibold"
          onClick={() => openModal()}
        >
          <PlusCircle size={20} />
          Create User
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
            <UsersIcon size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Users Found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md">
            No users have registered or been created in the platform yet.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Name</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Email</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Role</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Created At</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 text-slate-900 dark:text-slate-100 font-medium">{u.name}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        u.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                        : u.role === 'teacher' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        u.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : u.status === 'rejected' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={() => openModal(u)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost"
                        size="sm"
                        disabled={u.id === user.id || deleteMutation.isPending}
                        onClick={() => handleDelete(u.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={closeModal}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              {isEditMode ? 'Edit User' : 'Create New User'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Password {isEditMode && '(Leave empty to keep current)'}
                </label>
                <input
                  type="password"
                  required={!isEditMode}
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value as 'admin' | 'teacher' | 'student'})}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as 'pending' | 'approved' | 'rejected'})}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <Button type="submit" fullWidth disabled={saveMutation.isPending} className="h-12 mt-4">
                {saveMutation.isPending ? 'Saving...' : 'Save User'}
              </Button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
