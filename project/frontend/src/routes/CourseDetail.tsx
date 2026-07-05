import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';
import { useAuth } from '../providers/AuthProvider';
import { FileText, ArrowLeft, PlayCircle, Clock, BarChart, Award } from 'lucide-react';
import { Button } from '../components/ui/Button';

type Material = {
  id: number;
  title: string;
  pdf_path: string | null;
  crossword_data: any;
};

type CourseDetail = {
  id: number;
  name: string;
  description: string;
  teacher_id: number;
  teacher_name?: string;
  materials: Material[];
};

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: course, isLoading, error } = useQuery<CourseDetail>({
    queryKey: ['course', id],
    queryFn: () => fetchApi(`/courses/${id}`)
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Course not found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">The course you are looking for does not exist or you don't have access to it.</p>
        <Link to="/"><Button>Return to Dashboard</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      {/* Hero Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 lg:p-12 shadow-sm flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10" />
        
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
            <span className="flex items-center gap-1"><Clock size={16} /> Self-Paced</span>
            <span>•</span>
            <span className="flex items-center gap-1"><BarChart size={16} /> All Levels</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Award size={16} /> Auto-Scored Crossword</span>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            {course.name}
          </h1>
          
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-2xl">
            {course.description || "No description available for this course."}
          </p>

          <div className="pt-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-sm">
              {(course.teacher_name || 'T').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {course.teacher_name || 'Instructor'}
              </p>
              <p className="text-xs text-slate-500">Course Instructor</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-full shadow-sm flex items-center justify-center mb-2">
            <div className="relative">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="226" strokeDashoffset="226" className="text-primary" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-700 dark:text-slate-300">0%</span>
            </div>
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Course Progress</p>
          <Button fullWidth>Resume Course</Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Course Syllabus
        </h2>
        {user?.role === 'teacher' && course.teacher_id === user?.id && (
          <Button variant="secondary" size="sm">Add Material</Button>
        )}
      </div>
      
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm divide-y divide-slate-100 dark:divide-slate-800/50 overflow-hidden">
        
        {course.materials.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-500 dark:text-slate-400">No materials have been added to this course yet.</p>
          </div>
        ) : (
          course.materials.map((material, index) => (
            <div key={material.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors mt-1 sm:mt-0">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                    Chapter {index + 1}: {material.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                    {material.pdf_path ? "Read the PDF guide" : "Review the material"} 
                    {material.crossword_data ? " and solve the interactive crossword puzzle to test your knowledge." : "."}
                  </p>
                </div>
              </div>
              
              <Link to={`/courses/${id}/materials/${material.id}`}>
                <Button variant="outline" className="w-full sm:w-auto gap-2 group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                  <PlayCircle size={18} />
                  Start Module
                </Button>
              </Link>
            </div>
          ))
        )}

      </div>
    </div>
  );
}
