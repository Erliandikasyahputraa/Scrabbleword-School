import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../providers/AuthProvider';
import { fetchApi } from '../lib/api';
import { PlusCircle, Edit, Trash2, X, Users as UsersIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Select, Input } from '../components/ui/Input';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export default function Users() {
  const { t } = useTranslation('dashboard');
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
      toast.success(isEditMode ? t('userUpdated') : t('userCreated'));
      closeModal();
    },
    onError: (error: any) => toast.error(error.message || t('failedToSaveUser'))
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => 
      fetchApi(`/users/${id}`, {
        method: 'DELETE'
      }),
    onSuccess: () => {
      toast.success(t('userDeleted'));
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => toast.error(error.message || t('failedToDeleteUser'))
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
      title: t('deleteUser'),
      description: t('deleteUserDesc'),
      onConfirm: () => deleteMutation.mutate(id)
    });
  };

  if (user?.role !== 'admin') {
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
            {t('userManagement')}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {t('userManagementDesc')}
          </p>
        </div>
        <Button 
          variant="primary" 
          className="gap-2 font-semibold w-full sm:w-auto"
          onClick={() => openModal()}
        >
          <PlusCircle size={20} />
          {t('createUserBtn')}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-16 bg-card rounded-3xl border border-border shadow-sm">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
            <UsersIcon size={40} />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">{t('noUsersFound')}</h3>
          <p className="text-muted-foreground max-w-md">
            {t('noUsersDesc')}
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
                  <TableHead>{t('status')}</TableHead>
                  <TableHead>{t('createdAt')}</TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(u => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={
                        u.role === 'admin' ? 'danger' :
                        u.role === 'teacher' ? 'default' :
                        'secondary'
                      } className="capitalize">
                        {u.role === 'admin' ? t('adminOption') : u.role === 'teacher' ? t('teacherOption') : t('studentOption')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        u.status === 'approved' ? 'success' :
                        u.status === 'rejected' ? 'danger' :
                        'warning'
                      } className="capitalize">
                        {u.status === 'approved' ? t('approvedOption') : u.status === 'rejected' ? t('rejectedOption') : t('pendingOption')}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => openModal(u)}
                          className="text-primary hover:text-primary hover:bg-primary/10"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost"
                          size="sm"
                          disabled={u.id === user.id || deleteMutation.isPending}
                          onClick={() => handleDelete(u.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 size={16} />
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

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-3xl p-6 sm:p-8 w-full max-w-[calc(100vw-2rem)] sm:max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 pr-8">
              {isEditMode ? t('editUser') : t('createNewUser')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{t('name')}</label>
                <Input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{t('email')}</label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {isEditMode ? t('passwordDesc', { desc: t('leaveEmptyToKeep') }) : t('passwordDesc', { desc: '' })}
                </label>
                <Input
                  type="password"
                  required={!isEditMode}
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">{t('role')}</label>
                  <Select
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value as 'admin' | 'teacher' | 'student'})}
                    className="w-full"
                  >
                    <option value="student">{t('studentOption')}</option>
                    <option value="teacher">{t('teacherOption')}</option>
                    <option value="admin">{t('adminOption')}</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">{t('status')}</label>
                  <Select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as 'pending' | 'approved' | 'rejected'})}
                    className="w-full"
                  >
                    <option value="pending">{t('pendingOption')}</option>
                    <option value="approved">{t('approvedOption')}</option>
                    <option value="rejected">{t('rejectedOption')}</option>
                  </Select>
                </div>
              </div>
              <Button type="submit" fullWidth disabled={saveMutation.isPending} className="h-12 mt-6">
                {saveMutation.isPending ? t('saving') : t('saveUser')}
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
