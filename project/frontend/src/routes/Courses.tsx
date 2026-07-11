import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../providers/AuthProvider';
import { fetchApi } from '../lib/api';
import { PlusCircle, X, BookOpen, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { CourseCard } from '../components/ui/CourseCard';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonCard } from '../components/ui/LoadingSystem';
import { Input, Select } from '../components/ui/Input';
import { toast } from 'react-hot-toast';

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
      toast.success('Course created successfully!');
      navigate(`/courses/${res.id}`);
    },
    onError: (err: any) => toast.error(err.message || 'Failed to create course')
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName) return;
    createCourseMutation.mutate({ name: newCourseName, description: newCourseDesc });
  };

  const courses = data?.data || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {user?.role === 'admin' ? 'All Courses' : user?.role === 'teacher' ? 'Your Courses' : 'Available Courses'}
          </h2>
          <p className="text-muted-foreground mt-1">
            {user?.role === 'admin' ? 'Manage all platform courses.' : user?.role === 'teacher' ? 'Manage the courses you teach.' : 'Explore and continue your learning.'}
          </p>
        </div>
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <Button 
            variant="primary" 
            className="gap-2 font-semibold"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircle size={20} />
            Create Course
          </Button>
        )}
      </div>

      {/* Toolbar: Search, Filters, Sort */}
      <div className="bg-card p-4 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-muted-foreground" />
          </div>
          <Input 
            type="text"
            className="pl-10 h-11"
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex w-full md:w-auto items-center gap-3">
          {user?.role === 'student' && (
            <Select 
              className="h-11 w-full md:w-auto min-w-[140px]"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </Select>
          )}
          <Select 
            className="h-11 w-full md:w-auto min-w-[140px]"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
             <div key={i} className="h-64"><SkeletonCard /></div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState 
          icon={<BookOpen size={40} />}
          title="No Courses Found"
          description={
            search || statusFilter ? "Try adjusting your search or filters." :
            (user?.role === 'teacher' || user?.role === 'admin' 
            ? "You haven't created any courses yet. Get started by creating your first course!" 
            : "You are not enrolled in any courses yet. Please wait for your instructor to assign you to a course.")
          }
          action={
            (user?.role === 'teacher' || user?.role === 'admin') && !search && (
              <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
                <PlusCircle size={20} />
                Create First Course
              </Button>
            )
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard 
                key={course.id}
                id={course.id}
                title={course.name}
                description={course.description || "No description provided."}
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
            <div className="flex justify-center items-center mt-8 gap-2">
               <Button 
                 variant="secondary" 
                 disabled={page === 1}
                 onClick={() => setPage(p => Math.max(1, p - 1))}
               >
                 Previous
               </Button>
               <span className="text-sm font-medium text-muted-foreground px-4">
                 Page {page} of {data.last_page}
               </span>
               <Button 
                 variant="secondary" 
                 disabled={page === data.last_page}
                 onClick={() => setPage(p => Math.min(data.last_page, p + 1))}
               >
                 Next
               </Button>
            </div>
          )}
        </>
      )}

      {/* Create Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-3xl p-8 w-full max-w-md shadow-2xl relative border border-border">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-foreground mb-6">Create New Course</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Course Name</label>
                <Input
                  type="text"
                  required
                  value={newCourseName}
                  onChange={e => setNewCourseName(e.target.value)}
                  placeholder="e.g. Advanced English Grammar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea
                  value={newCourseDesc}
                  onChange={e => setNewCourseDesc(e.target.value)}
                  className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none min-h-[100px]"
                  rows={4}
                  placeholder="What will students learn in this course?"
                />
              </div>
              <Button type="submit" fullWidth disabled={createCourseMutation.isPending} className="h-12 mt-4">
                {createCourseMutation.isPending ? 'Creating...' : 'Create Course'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
