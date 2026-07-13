import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../providers/AuthProvider';
import { fetchApi } from '../lib/api';
import { Check, X, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
};

export default function Approvals() {
  const { t } = useTranslation('dashboard');
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
      // If the status string needs translating we can pass variables.status
      // For ID we will use 'disetujui' / 'ditolak' logic later or simply pass the status if it's acceptable in English.
      // Wait, in Indonesian it would be "Pengguna berhasil di" + "setujui/tolak".
      // Let's assume the backend status is 'approved' or 'rejected'.
      const statusText = variables.status === 'approved' 
        ? (t('userStatusUpdateSuccess', { status: 'approved' }).includes('diapproved') ? 'setujui' : variables.status) 
        : (t('userStatusUpdateSuccess', { status: 'rejected' }).includes('direjected') ? 'tolak' : variables.status);
      toast.success(t('userStatusUpdateSuccess', { status: statusText }));
      queryClient.invalidateQueries({ queryKey: ['pending-users'] });
    },
    onError: (err: any) => toast.error(err.message || t('failedToUpdateUserStatus'))
  });

  if (user?.role === 'student') {
    return (
      <div className="flex justify-center p-12">
        <div className="text-center text-destructive font-bold">
          {t('unauthorizedAccess')}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-screen-xl mx-auto w-full space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            {t('userApprovals')}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {user?.role === 'admin' 
              ? t('adminApprovalDesc') 
              : t('teacherApprovalDesc')}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : pendingUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-16 bg-card rounded-3xl border border-border shadow-sm">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-4 text-success">
            <CheckCircle size={40} />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">{t('allCaughtUp')}</h3>
          <p className="text-muted-foreground max-w-md">
            {t('noPendingUsers')}
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead>{t('email')}</TableHead>
                  <TableHead>{t('role')}</TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingUsers.map(u => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium whitespace-nowrap">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={
                        u.role === 'teacher' ? 'default' : 'secondary'
                      } className="capitalize">
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="primary"
                          className="bg-success hover:bg-success/90 shadow-success/25 !px-3"
                          disabled={updateStatusMutation.isPending}
                          onClick={() => updateStatusMutation.mutate({ id: u.id, status: 'approved' })}
                        >
                          <Check size={16} className="sm:mr-1" /> <span className="hidden sm:inline">{t('approve')}</span>
                        </Button>
                        <Button 
                          variant="secondary"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 !px-3"
                          disabled={updateStatusMutation.isPending}
                          onClick={() => updateStatusMutation.mutate({ id: u.id, status: 'rejected' })}
                        >
                          <X size={16} className="sm:mr-1" /> <span className="hidden sm:inline">{t('reject')}</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
