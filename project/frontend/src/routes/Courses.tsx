import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../providers/AuthProvider';
import { fetchApi } from '../lib/api';
import { PlusCircle, X, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { CourseCard } from '../components/ui/CourseCard';
import { EmptyState } from '../components/ui/EmptyState';
import { SearchIllustration, DocumentIllustration } from '../components/ui/Illustrations';
import { SkeletonCard } from '../components/ui/LoadingSystem';
import { Input, Select } from '../components/ui/Input';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

type Course = {
  id: number;
  name: string;
  description: string;
  materials_count?: number;
  students_count?: number;
  progress?: number;
  completion_rate?: number;
  teacher_name?: string;
  teacher_avatar_initial?: string;
};

type PaginatedCourses = {
  current_page: number;
  data: Course[];
  last_page: number;
  total: number;
};

export default function Courses() {
  const { t } = useTranslation('courses');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, sort]);

  const { data, isLoading } = useQuery<PaginatedCourses>({
    queryKey: ['courses', page, debouncedSearch, statusFilter, sort],
    queryFn: () => {
      const params = new URLSearchParams({ page: page.toString(), sort });
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (statusFilter) params.append('status', statusFilter);
      return fetchApi(`/courses?${params.toString()}`);
    }
  });

  const createCourseMutation = useMutation({
    mutationFn: (newCourse: { name: string, description: string }) => 
      fetchApi('/courses', {
        method: 'POST',
        body: JSON.stringify(newCourse)
      }),
    onSuccess: (res: Course) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setIsModalOpen(false);
      setNewCourseName('');
      setNewCourseDesc('');
      toast.success(t('courseCreated'));
      navigate(`/courses/${res.id}`);
    },
    onError: (err: any) => toast.error(err.message || t('failedToCreate'))
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName) return;
    createCourseMutation.mutate({ name: newCourseName, description: newCourseDesc });
  };

  const courses = data?.data || [];

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-blue-500 dark:from-primary/90 dark:to-primary/70 rounded-3xl p-6 sm:p-8 text-primary-foreground shadow-lg relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl z-0" />
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
            {user?.role === 'admin' ? t('allCourses') : user?.role === 'teacher' ? t('yourCourses') : t('availableCourses')}
          </h2>
          <p className="text-primary-foreground/90 text-sm sm:text-base max-w-xl">
            {user?.role === 'admin' ? t('adminDesc') : user?.role === 'teacher' ? t('teacherDesc') : t('studentDesc')}
          </p>
        </div>
        
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <div className="relative z-10 w-full sm:w-auto">
            <Button 
              className="w-full sm:w-auto gap-2 bg-white text-blue-700 hover:bg-slate-50 border-0 font-bold shadow-md hover:shadow-lg transition-all"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircle size={20} />
              {t('createCourse')}
            </Button>
          </div>
        )}
      </div>

      {/* Toolbar: Search, Filters, Sort */}
      <div className="bg-card p-4 rounded-2xl shadow-sm border border-border flex flex-col lg:flex-row gap-3 sm:gap-4 items-center justify-between">
        <div className="relative w-full lg:flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-muted-foreground" />
          </div>
          <Input 
            type="text"
            className="pl-10 h-11 w-full"
            placeholder={t('searchCourses')}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row w-full lg:w-auto items-center gap-3">
          {user?.role === 'student' && (
            <Select 
              className="h-11 w-full lg:min-w-[160px]"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">{t('allStatuses')}</option>
              <option value="not_started">{t('notStarted')}</option>
              <option value="in_progress">{t('inProgress')}</option>
              <option value="completed">{t('completed')}</option>
            </Select>
          )}
          <Select 
            className="h-11 w-full lg:min-w-[160px]"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="newest">{t('newestFirst')}</option>
            <option value="oldest">{t('oldestFirst')}</option>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
             <div key={i} className="h-64"><SkeletonCard /></div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState 
          icon={search || statusFilter ? <SearchIllustration size={100} /> : <DocumentIllustration size={100} />}
          title={search || statusFilter ? t('noResultsFound') : t('noCoursesAvailable')}
          description={
            search || statusFilter ? t('noResultsDesc') :
            (user?.role === 'teacher' || user?.role === 'admin' 
            ? t('noCoursesTeacherDesc') 
            : t('noCoursesStudentDesc'))
          }
          action={
            (user?.role === 'teacher' || user?.role === 'admin') && !search && !statusFilter && (
              <Button variant="primary" className="gap-2" onClick={() => setIsModalOpen(true)}>
                <PlusCircle size={20} />
                {t('createCourse')}
              </Button>
            )
          }
          secondaryHelp={
             (user?.role === 'teacher' || user?.role === 'admin') && !search && !statusFilter 
             ? t('teacherHelp') 
             : undefined
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {courses.map(course => (
              <CourseCard 
                key={course.id}
                id={course.id}
                title={course.name}
                description={course.description || t('noDescription')}
                materialCount={course.materials_count || 0}
                progress={course.progress}
                completionRate={course.completion_rate}
                studentCount={course.students_count}
                teacherName={course.teacher_name}
                teacherAvatarInitial={course.teacher_avatar_initial}
              />
            ))}
          </div>

          {data && data.last_page > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center mt-8 gap-4">
               <Button 
                 variant="secondary" 
                 className="w-full sm:w-auto"
                 disabled={page === 1}
                 onClick={() => setPage(p => Math.max(1, p - 1))}
               >
                 {t('previous')}
               </Button>
               <span className="text-sm font-medium text-muted-foreground px-4">
                 {t('page', { current: page, total: data.last_page })}
               </span>
               <Button 
                 variant="secondary" 
                 className="w-full sm:w-auto"
                 disabled={page === data.last_page}
                 onClick={() => setPage(p => Math.min(data.last_page, p + 1))}
               >
                 {t('next')}
               </Button>
            </div>
          )}
        </>
      )}

      {/* Create Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-3xl p-6 sm:p-8 w-full max-w-[calc(100vw-2rem)] md:max-w-md shadow-2xl relative border border-border">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">{t('createNewCourse')}</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{t('courseName')}</label>
                <Input
                  type="text"
                  required
                  value={newCourseName}
                  onChange={e => setNewCourseName(e.target.value)}
                  placeholder={t('courseNamePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{t('description')}</label>
                <textarea
                  value={newCourseDesc}
                  onChange={e => setNewCourseDesc(e.target.value)}
                  className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none min-h-[100px]"
                  rows={4}
                  placeholder={t('descriptionPlaceholder')}
                />
              </div>
              <Button type="submit" fullWidth disabled={createCourseMutation.isPending} className="h-12 mt-4">
                {createCourseMutation.isPending ? t('creating') : t('createCourse')}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
