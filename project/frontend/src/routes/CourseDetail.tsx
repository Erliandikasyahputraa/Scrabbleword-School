import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';
import { useAuth } from '../providers/AuthProvider';
import { FileText, ArrowLeft, PlayCircle, Clock, BarChart, Award, Percent } from 'lucide-react';
import { Button } from '../components/ui/Button';
import ErrorPage from './ErrorPage';
import { MaterialFormModal } from '../components/ui/MaterialFormModal';
import { CourseFormModal } from '../components/ui/CourseFormModal';
import { StudentAssignmentModal } from '../components/ui/StudentAssignmentModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { toast } from 'react-hot-toast';

type Material = {
  id: number;
  title: string;
  pdf_path: string | null;
  crossword_data: any;
  status?: 'NOT_STARTED' | 'READING' | 'READY_FOR_CROSSWORD' | 'COMPLETED';
};

type CourseDetail = {
  id: number;
  name: string;
  description: string;
  teacher_id: number;
  teacher_name?: string;
  progress?: number;
  analytics?: {
    students_enrolled: number;
    students_completed: number;
    completion_rate: number;
    average_score: number;
    pending_students: number;
  };
  materials: Material[];
};

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

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

  const { data: course, isLoading, error } = useQuery<CourseDetail>({
    queryKey: ['course', id],
    queryFn: () => fetchApi(`/courses/${id}`)
  });

  const deleteMaterialMutation = useMutation({
    mutationFn: (materialId: number) => fetchApi(`/courses/${id}/materials/${materialId}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Material deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['course', id] });
    },
    onError: (err: any) => toast.error(err.message || 'Failed to delete material')
  });

  const deleteCourseMutation = useMutation({
    mutationFn: () => fetchApi(`/courses/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Course deleted successfully');
      navigate('/courses');
    },
    onError: (err: any) => toast.error(err.message || 'Failed to delete course')
  });

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setIsMaterialModalOpen(true);
  };

  const handleDeleteMaterial = (materialId: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Material',
      description: 'Are you sure you want to delete this material? This action cannot be undone.',
      onConfirm: () => deleteMaterialMutation.mutate(materialId)
    });
  };

  const handleDeleteCourse = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Course',
      description: 'Are you sure you want to delete this ENTIRE course? All materials and student progress will be lost forever.',
      onConfirm: () => deleteCourseMutation.mutate()
    });
  };

  const isOwnerOrAdmin = user?.role === 'admin' || (user?.role === 'teacher' && course?.teacher_id === user?.id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !course) {
    const errObj = error as any;
    const code = errObj?.status || 404;
    return <ErrorPage code={code} message={errObj?.message} />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <Link 
          to="/courses" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Courses
        </Link>
        {isOwnerOrAdmin && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsAssignmentModalOpen(true)}>Assign Students</Button>
            <Button variant="outline" size="sm" onClick={() => setIsCourseModalOpen(true)}>Edit Course</Button>
            <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={handleDeleteCourse}>Delete Course</Button>
          </div>
        )}
      </div>

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

        {isOwnerOrAdmin && course.analytics ? (
          <div className="w-full md:w-auto bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
            <div className="col-span-2 mb-2">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart size={18} className="text-primary" />
                Course Analytics
              </h3>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
              <span className="text-xs text-slate-500 font-medium mb-1">Enrolled</span>
              <span className="text-2xl font-bold text-blue-600">{course.analytics.students_enrolled}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
              <span className="text-xs text-slate-500 font-medium mb-1">Completed</span>
              <span className="text-2xl font-bold text-emerald-600">{course.analytics.students_completed}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
              <span className="text-xs text-slate-500 font-medium mb-1">Avg Score</span>
              <span className="text-2xl font-bold text-orange-600">{course.analytics.average_score}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5"><Percent size={40} /></div>
              <span className="text-xs text-slate-500 font-medium mb-1 relative z-10">Rate</span>
              <span className="text-2xl font-bold text-purple-600 relative z-10">{course.analytics.completion_rate}%</span>
            </div>
          </div>
        ) : (
          <div className="w-full md:w-auto bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-full shadow-sm flex items-center justify-center mb-2">
              <div className="relative">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="36" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray="226" 
                    strokeDashoffset={226 - (226 * (course.progress || 0)) / 100} 
                    className="text-primary transition-all duration-1000" 
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-700 dark:text-slate-300">{course.progress || 0}%</span>
              </div>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Course Progress</p>
            <Button fullWidth>Resume Course</Button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Course Syllabus
        </h2>
        {isOwnerOrAdmin && (
          <Button variant="secondary" size="sm" onClick={() => { setEditingMaterial(null); setIsMaterialModalOpen(true); }}>Add Material</Button>
        )}
      </div>
      
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm divide-y divide-slate-100 dark:divide-slate-800/50 overflow-hidden">
        
        {course.materials.length === 0 ? (
          <div className="p-16 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
              <FileText size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Materials Yet</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
              {isOwnerOrAdmin 
                ? "Get started by adding a PDF guide or an interactive crossword puzzle for your students." 
                : "The instructor hasn't added any learning materials to this course yet. Check back later!"}
            </p>
            {isOwnerOrAdmin && (
              <Button className="mt-6" onClick={() => { setEditingMaterial(null); setIsMaterialModalOpen(true); }}>
                Add First Material
              </Button>
            )}
          </div>
        ) : (
          course.materials.map((material, index) => {
            const isCompleted = material.status === 'COMPLETED';
            const isInProgress = material.status === 'READING' || material.status === 'READY_FOR_CROSSWORD';
            
            return (
            <div key={material.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl transition-colors mt-1 sm:mt-0 ${
                   isCompleted ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 group-hover:bg-green-500 group-hover:text-white' :
                   isInProgress ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 group-hover:bg-orange-500 group-hover:text-white' :
                   'bg-blue-50 text-primary dark:bg-blue-900/20 group-hover:bg-primary group-hover:text-white'
                }`}>
                  {isCompleted ? <Award size={24} /> :
                   isInProgress ? <Clock size={24} /> :
                   <FileText size={24} />}
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
              
              <div className="flex gap-2">
                {isOwnerOrAdmin && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => handleEditMaterial(material)}>Edit</Button>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200" onClick={() => handleDeleteMaterial(material.id)}>Delete</Button>
                  </>
                )}
                <Link to={`/courses/${id}/materials/${material.id}`}>
                  <Button variant="outline" className="w-full sm:w-auto gap-2 group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                    <PlayCircle size={18} />
                    Start Module
                  </Button>
                </Link>
              </div>
            </div>
          );
        })
        )}
      </div>
      
      {isOwnerOrAdmin && (
        <div className="mt-12">
          <CourseMonitoringDashboard courseId={Number(id)} />
        </div>
      )}

      
      {isOwnerOrAdmin && (
          <>
            <MaterialFormModal 
                isOpen={isMaterialModalOpen} 
                onClose={() => setIsMaterialModalOpen(false)} 
                courseId={id!} 
                initialData={editingMaterial} 
            />
            <CourseFormModal
                isOpen={isCourseModalOpen}
                onClose={() => setIsCourseModalOpen(false)}
                initialData={{ id: course.id, name: course.name, description: course.description }}
            />
            <StudentAssignmentModal
                isOpen={isAssignmentModalOpen}
                onClose={() => setIsAssignmentModalOpen(false)}
                courseId={Number(id)}
            />
          </>
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

function CourseMonitoringDashboard({ courseId }: { courseId: number }) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');

  const { data, isLoading } = useQuery({
    queryKey: ['course-monitoring', courseId, page, sort],
    queryFn: () => fetchApi(`/courses/${courseId}/monitoring?page=${page}&sort=${sort}`)
  });

  const formatTime = (seconds: number) => {
    if (seconds === 0) return "-";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Student Monitoring Dashboard</h2>
          <p className="text-sm text-slate-500 mt-1">Track student progress and submissions in real-time.</p>
        </div>
        <select 
          className="bg-slate-50 border border-slate-200 rounded-xl text-sm px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          value={sort}
          onChange={e => { setSort(e.target.value); setPage(1); }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="score_high">Highest Score</option>
          <option value="score_low">Lowest Score</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
          <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-6 py-4 font-semibold">Student</th>
              <th className="px-6 py-4 font-semibold">Material</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Submission Date</th>
              <th className="px-6 py-4 text-center font-semibold">Score</th>
              <th className="px-6 py-4 text-right font-semibold">Time Spent</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading data...</td></tr>
            ) : data?.data?.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No student progress recorded yet.</td></tr>
            ) : (
              data?.data?.map((sub: any) => (
                <tr key={sub.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{sub.student?.name}</div>
                    <div className="text-xs text-slate-500">{sub.student?.email}</div>
                  </td>
                  <td className="px-6 py-4">{sub.material?.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      sub.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      sub.status === 'READY_FOR_CROSSWORD' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {sub.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(sub.submitted_at)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{sub.score}</span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                    {formatTime(sub.time_spent_seconds)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.last_page > 1 && (
        <div className="flex justify-center items-center py-4 gap-2 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</Button>
          <span className="text-sm font-medium text-slate-600">Page {page} of {data.last_page}</span>
          <Button variant="secondary" size="sm" disabled={page === data.last_page} onClick={() => setPage(p => Math.min(data.last_page, p + 1))}>Next</Button>
        </div>
      )}
    </div>
  );
}
