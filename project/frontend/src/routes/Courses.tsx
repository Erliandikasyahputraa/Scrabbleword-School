import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../providers/AuthProvider';
import { fetchApi } from '../lib/api';
import { PlusCircle, X, BookOpen, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { CourseCard } from '../components/ui/CourseCard';
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

  // Debounce search (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset page when filters change
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
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            {user?.role === 'admin' ? 'All Courses' : user?.role === 'teacher' ? 'Your Courses' : 'Available Courses'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
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
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input 
            type="text"
            className="pl-10 w-full h-11 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none"
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex w-full md:w-auto items-center gap-3">
          {user?.role === 'student' && (
            <select 
              className="h-11 bg-slate-50 border border-slate-200 rounded-xl text-sm px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full md:w-auto"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          )}
          <select 
            className="h-11 bg-slate-50 border border-slate-200 rounded-xl text-sm px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full md:w-auto"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
             <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-pulse h-64">
                <div className="flex gap-3 mb-4">
                   <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                   <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                   </div>
                </div>
                <div className="space-y-2 mt-4">
                   <div className="h-3 bg-slate-200 rounded w-full"></div>
                   <div className="h-3 bg-slate-200 rounded w-full"></div>
                </div>
             </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
            <BookOpen size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Courses Found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md">
            {search || statusFilter ? "Try adjusting your search or filters." :
              (user?.role === 'teacher' || user?.role === 'admin' 
              ? "You haven't created any courses yet. Get started by creating your first course!" 
              : "You are not enrolled in any courses yet. Please wait for your instructor to assign you to a course.")
            }
          </p>
          {(user?.role === 'teacher' || user?.role === 'admin') && !search && (
             <Button className="mt-6 gap-2" onClick={() => setIsModalOpen(true)}>
               <PlusCircle size={20} />
               Create First Course
             </Button>
          )}
        </div>
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
               <span className="text-sm font-medium text-slate-600 px-4">
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
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Create New Course</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  value={newCourseName}
                  onChange={e => setNewCourseName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white"
                  placeholder="e.g. Advanced English Grammar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  value={newCourseDesc}
                  onChange={e => setNewCourseDesc(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white resize-none"
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
