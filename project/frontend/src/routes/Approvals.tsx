import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../providers/AuthProvider';
import { fetchApi } from '../lib/api';
import { Check, X, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { toast } from 'react-hot-toast';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
};

export default function Approvals() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: pendingUsers = [], isLoading } = useQuery<User[]>({
    queryKey: ['pending-users'],
    queryFn: () => fetchApi('/users/pending')
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: 'approved' | 'rejected' }) => 
      fetchApi(`/users/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      }),
    onSuccess: (_, variables) => {
      toast.success(`User ${variables.status} successfully`);
      queryClient.invalidateQueries({ queryKey: ['pending-users'] });
    },
    onError: (err: any) => toast.error(err.message || 'Failed to update user status')
  });

  if (user?.role === 'student') {
    return (
      <div className="p-12 text-center text-red-500 font-bold">
        Unauthorized access
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            User Approvals
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {user?.role === 'admin' 
              ? 'Review and approve pending student and teacher registrations.' 
              : 'Review and approve pending student registrations.'}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : pendingUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4 text-green-500">
            <CheckCircle size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">All Caught Up!</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md">
            There are no pending users waiting for approval right now.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Name</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Email</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Role</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pendingUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-900 dark:text-slate-100 font-medium">{u.name}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      u.role === 'teacher' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-end gap-2">
                    <Button 
                      variant="primary"
                      className="bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25 !px-3"
                      disabled={updateStatusMutation.isPending}
                      onClick={() => updateStatusMutation.mutate({ id: u.id, status: 'approved' })}
                    >
                      <Check size={16} className="mr-1" /> Approve
                    </Button>
                    <Button 
                      variant="secondary"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 !px-3"
                      disabled={updateStatusMutation.isPending}
                      onClick={() => updateStatusMutation.mutate({ id: u.id, status: 'rejected' })}
                    >
                      <X size={16} className="mr-1" /> Reject
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
