import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../providers/AuthProvider';
import { fetchApi } from '../lib/api';
import { PlusCircle, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { CourseCard } from '../components/ui/CourseCard';

type Course = {
  id: number;
  name: string;
  description: string;
  materials_count?: number;
  students_count?: number;
  progress?: number;
};

export default function Courses() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () => fetchApi('/courses')
  });

  const navigate = useNavigate();

  const createCourseMutation = useMutation({
    mutationFn: (newCourse: { name: string, description: string }) => 
      fetchApi('/courses', {
        method: 'POST',
        body: JSON.stringify(newCourse)
      }),
    onSuccess: (data: Course) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setIsModalOpen(false);
      setNewCourseName('');
      setNewCourseDesc('');
      alert('Course created successfully!'); // MVP Toast
      navigate(`/courses/${data.id}`);
    }
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName) return;
    createCourseMutation.mutate({ name: newCourseName, description: newCourseDesc });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
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
      
      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400">No courses found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard 
              key={course.id}
              id={course.id}
              title={course.name}
              description={course.description || "No description provided."}
              materialCount={course.materials_count || 0}
              progress={course.progress}
            />
          ))}
        </div>
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
