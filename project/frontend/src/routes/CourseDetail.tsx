import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';
import { useAuth } from '../providers/AuthProvider';
import { FileText, ArrowLeft, PlayCircle, Clock, BarChart, Award, Percent } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/LoadingSystem';
import { EmptyState } from '../components/ui/EmptyState';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Input';
import ErrorPage from './ErrorPage';
import { DocumentIllustration } from '../components/ui/Illustrations';
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
        <Spinner className="w-12 h-12 text-primary" />
      </div>
    );
  }

  if (error || !course) {
    const errObj = error as any;
    const code = errObj?.status || 404;
    return <ErrorPage code={code} message={errObj?.message} />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link 
          to="/courses" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Courses
        </Link>
        {isOwnerOrAdmin && (
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={() => setIsAssignmentModalOpen(true)} className="w-full sm:w-auto">Assign Students</Button>
            <Button variant="outline" size="sm" onClick={() => setIsCourseModalOpen(true)} className="w-full sm:w-auto">Edit Course</Button>
            <Button variant="outline" size="sm" className="w-full sm:w-auto text-destructive border-destructive hover:bg-destructive/10" onClick={handleDeleteCourse}>Delete Course</Button>
          </div>
        )}
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-primary to-blue-500 dark:from-primary/90 dark:to-primary/70 text-primary-foreground rounded-3xl p-6 lg:p-8 shadow-lg flex flex-col md:flex-row gap-6 md:gap-6 items-start relative overflow-hidden border-0">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl z-0" />
        
        <div className="flex-1 space-y-4 w-full relative z-10">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-primary-foreground/80 mb-2">
            <span className="flex items-center gap-1"><Clock size={16} /> Self-Paced</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1"><BarChart size={16} /> All Levels</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1"><Award size={16} /> Auto-Scored</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {course.name}
          </h1>
          
          <p className="text-primary-foreground/90 text-base sm:text-lg leading-relaxed max-w-2xl">
            {course.description || "No description available for this course."}
          </p>

          <div className="pt-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              {(course.teacher_name || 'T').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold">
                {course.teacher_name || 'Instructor'}
              </p>
              <p className="text-xs text-primary-foreground/80">Course Instructor</p>
            </div>
          </div>
        </div>

        {isOwnerOrAdmin && course.analytics ? (
          <div className="w-full md:w-auto bg-white/10 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-white/20 grid grid-cols-2 lg:grid-cols-4 gap-3 flex-shrink-0 relative z-10 text-primary-foreground">
            <div className="col-span-2 lg:col-span-4 mb-1">
              <h3 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                <BarChart size={18} />
                Course Analytics
              </h3>
            </div>
            <div className="bg-white/20 p-3 rounded-xl shadow-sm border border-white/10 flex flex-col justify-center">
              <span className="text-xs font-medium mb-1 opacity-90">Enrolled</span>
              <span className="text-xl sm:text-2xl font-bold">{course.analytics.students_enrolled}</span>
            </div>
            <div className="bg-white/20 p-3 rounded-xl shadow-sm border border-white/10 flex flex-col justify-center">
              <span className="text-xs font-medium mb-1 opacity-90">Completed</span>
              <span className="text-xl sm:text-2xl font-bold">{course.analytics.students_completed}</span>
            </div>
            <div className="bg-white/20 p-3 rounded-xl shadow-sm border border-white/10 flex flex-col justify-center">
              <span className="text-xs font-medium mb-1 opacity-90">Avg Score</span>
              <span className="text-xl sm:text-2xl font-bold">{course.analytics.average_score}</span>
            </div>
            <div className="bg-white/20 p-3 rounded-xl shadow-sm border border-white/10 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10 flex items-center justify-center">
                <Percent className="w-[72px] h-[72px] sm:w-[96px] sm:h-[96px] lg:w-[120px] lg:h-[120px]" />
              </div>
              <span className="text-xs font-medium mb-1 relative z-10 opacity-90">Rate</span>
              <span className="text-xl sm:text-2xl font-bold relative z-10">{course.analytics.completion_rate}%</span>
            </div>
          </div>
        ) : (
          <div className="w-full md:w-auto bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 flex flex-col items-center text-center space-y-4 relative z-10 text-primary-foreground">
            <div className="w-24 h-24 bg-white/20 rounded-full shadow-sm flex items-center justify-center mb-2">
              <div className="relative">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted" />
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
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">{course.progress || 0}%</span>
              </div>
            </div>
            <p className="text-sm font-medium opacity-90">Course Progress</p>
            <Button fullWidth className="bg-white text-primary hover:bg-white/90">Resume Course</Button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6 mt-8 sm:mt-12">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Course Syllabus
        </h2>
        {isOwnerOrAdmin && (
          <Button variant="secondary" size="sm" onClick={() => { setEditingMaterial(null); setIsMaterialModalOpen(true); }} className="w-full sm:w-auto">
            Add Material
          </Button>
        )}
      </div>
      
      <div className="bg-card border border-border rounded-2xl shadow-sm divide-y divide-border overflow-hidden">
        
        {course.materials.length === 0 ? (
          <EmptyState
            icon={<DocumentIllustration size={100} />}
            title="No Materials Yet"
            description={
              isOwnerOrAdmin 
                ? "Get started by adding a PDF guide or an interactive crossword puzzle for your students." 
                : "The instructor hasn't added any learning materials to this course yet. Check back later!"
            }
            action={
              isOwnerOrAdmin && (
                <Button variant="primary" onClick={() => { setEditingMaterial(null); setIsMaterialModalOpen(true); }}>
                  Add First Material
                </Button>
              )
            }
            secondaryHelp={
              isOwnerOrAdmin 
                ? "Students will be notified when you publish new materials."
                : undefined
            }
          />
        ) : (
          course.materials.map((material, index) => {
            const isCompleted = material.status === 'COMPLETED';
            const isInProgress = material.status === 'READING' || material.status === 'READY_FOR_CROSSWORD';
            
            return (
            <div key={material.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/50 transition-colors group">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl transition-colors shrink-0 mt-1 sm:mt-0 ${
                   isCompleted ? 'bg-success/10 text-success group-hover:bg-success group-hover:text-success-foreground' :
                   isInProgress ? 'bg-warning/10 text-warning group-hover:bg-warning group-hover:text-warning-foreground' :
                   'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                }`}>
                  {isCompleted ? <Award size={24} /> :
                   isInProgress ? <Clock size={24} /> :
                   <FileText size={24} />}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 break-words">
                    Chapter {index + 1} &bull; {material.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
                    {material.pdf_path ? "Read the PDF guide" : "Review the material"} 
                    {material.crossword_data ? " and solve the interactive crossword puzzle to test your knowledge." : "."}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0 w-full sm:w-auto shrink-0">
                {isOwnerOrAdmin && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="secondary" size="sm" onClick={() => handleEditMaterial(material)} className="flex-1 sm:flex-none">Edit</Button>
                    <Button variant="ghost" size="sm" className="flex-1 sm:flex-none text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteMaterial(material.id)}>Delete</Button>
                  </div>
                )}
                <Link to={`/courses/${id}/materials/${material.id}`} className="block w-full sm:w-auto">
                  <Button variant="primary" className="w-full sm:w-auto gap-2">
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
        <div className="mt-8 sm:mt-12">
          <CourseMonitoringDashboard courseId={Number(id)} materials={course.materials} />
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

function CourseMonitoringDashboard({ courseId, materials }: { courseId: number, materials: Material[] }) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');
  const [materialFilter, setMaterialFilter] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['course-monitoring', courseId, page, sort, materialFilter],
    queryFn: () => fetchApi(`/courses/${courseId}/monitoring?page=${page}&sort=${sort}&material_id=${materialFilter}`)
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
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-border flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Student Monitoring Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">Track student progress and submissions in real-time.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium mb-1">Sort</span>
            <Select 
              className="h-10 text-sm py-1 w-full sm:w-auto"
              value={sort}
              onChange={e => { setSort(e.target.value); setPage(1); }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="score_high">Highest Score</option>
              <option value="score_low">Lowest Score</option>
            </Select>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium mb-1">Material</span>
            <Select 
              className="h-10 text-sm py-1 w-full sm:w-auto"
              value={materialFilter}
              onChange={e => { setMaterialFilter(e.target.value); setPage(1); }}
            >
              <option value="all">All Materials</option>
              {materials.map((mat, idx) => (
                <option key={mat.id} value={mat.id}>
                  Chapter {idx + 1}: {mat.title}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead className="text-center">Score</TableHead>
              <TableHead className="text-right">Time Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Loading data...</TableCell></TableRow>
            ) : data?.data?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No student progress recorded yet.</TableCell></TableRow>
            ) : (
              data?.data?.map((sub: any) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <div className="font-semibold text-foreground">{sub.student?.name}</div>
                    <div className="text-xs text-muted-foreground">{sub.student?.email}</div>
                  </TableCell>
                  <TableCell>{sub.material?.title}</TableCell>
                  <TableCell>
                    <Badge variant={
                      sub.status === 'COMPLETED' ? 'success' :
                      sub.status === 'READY_FOR_CROSSWORD' ? 'default' :
                      'warning'
                    }>
                      {sub.status.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(sub.submitted_at)}</TableCell>
                  <TableCell className="text-center">
                    <span className="font-bold text-foreground">{sub.score}</span>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap font-medium text-foreground">
                    {formatTime(sub.time_spent_seconds)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card List View */}
      <div className="block md:hidden divide-y divide-border">
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">Loading data...</div>
        ) : data?.data?.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">No student progress recorded yet.</div>
        ) : (
          data?.data?.map((sub: any) => (
            <div key={sub.id} className="p-4 space-y-3 hover:bg-muted/30 transition-colors">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-foreground truncate">{sub.student?.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{sub.student?.email}</div>
                </div>
                <Badge variant={
                  sub.status === 'COMPLETED' ? 'success' :
                  sub.status === 'READY_FOR_CROSSWORD' ? 'default' :
                  'warning'
                } className="shrink-0">
                  {sub.status.replace(/_/g, ' ')}
                </Badge>
              </div>
              <div className="text-sm font-medium text-foreground truncate">{sub.material?.title}</div>
              <div className="bg-muted rounded-lg p-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground block mb-1">Score</span>
                  <span className="font-bold text-foreground text-sm">{sub.score}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Time Spent</span>
                  <span className="font-semibold text-foreground">{formatTime(sub.time_spent_seconds)}</span>
                </div>
                <div className="col-span-2 mt-1">
                  <span className="text-muted-foreground">Date: </span>
                  <span className="font-medium text-foreground">{formatDate(sub.submitted_at)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {data && data.last_page > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center p-4 gap-4 border-t border-border">
          <Button variant="secondary" size="sm" className="w-full sm:w-auto" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</Button>
          <span className="text-sm font-medium text-muted-foreground">Page {page} of {data.last_page}</span>
          <Button variant="secondary" size="sm" className="w-full sm:w-auto" disabled={page === data.last_page} onClick={() => setPage(p => Math.min(data.last_page, p + 1))}>Next</Button>
        </div>
      )}
    </div>
  );
}
