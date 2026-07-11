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
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <Link 
          to="/courses" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Courses
        </Link>
        {isOwnerOrAdmin && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsAssignmentModalOpen(true)}>Assign Students</Button>
            <Button variant="outline" size="sm" onClick={() => setIsCourseModalOpen(true)}>Edit Course</Button>
            <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10" onClick={handleDeleteCourse}>Delete Course</Button>
          </div>
        )}
      </div>

      {/* Hero Banner */}
      <div className="bg-card border border-border rounded-3xl p-8 lg:p-12 shadow-sm flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground mb-2">
            <span className="flex items-center gap-1"><Clock size={16} /> Self-Paced</span>
            <span>•</span>
            <span className="flex items-center gap-1"><BarChart size={16} /> All Levels</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Award size={16} /> Auto-Scored Crossword</span>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {course.name}
          </h1>
          
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
            {course.description || "No description available for this course."}
          </p>

          <div className="pt-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center font-bold text-primary-foreground text-lg shadow-sm">
              {(course.teacher_name || 'T').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {course.teacher_name || 'Instructor'}
              </p>
              <p className="text-xs text-muted-foreground">Course Instructor</p>
            </div>
          </div>
        </div>

        {isOwnerOrAdmin && course.analytics ? (
          <div className="w-full md:w-auto bg-muted/50 p-6 rounded-2xl border border-border grid grid-cols-2 gap-4">
            <div className="col-span-2 mb-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <BarChart size={18} className="text-primary" />
                Course Analytics
              </h3>
            </div>
            <div className="bg-card p-4 rounded-xl shadow-sm border border-border flex flex-col">
              <span className="text-xs text-muted-foreground font-medium mb-1">Enrolled</span>
              <span className="text-2xl font-bold text-primary">{course.analytics.students_enrolled}</span>
            </div>
            <div className="bg-card p-4 rounded-xl shadow-sm border border-border flex flex-col">
              <span className="text-xs text-muted-foreground font-medium mb-1">Completed</span>
              <span className="text-2xl font-bold text-success">{course.analytics.students_completed}</span>
            </div>
            <div className="bg-card p-4 rounded-xl shadow-sm border border-border flex flex-col">
              <span className="text-xs text-muted-foreground font-medium mb-1">Avg Score</span>
              <span className="text-2xl font-bold text-warning">{course.analytics.average_score}</span>
            </div>
            <div className="bg-card p-4 rounded-xl shadow-sm border border-border flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5"><Percent size={40} /></div>
              <span className="text-xs text-muted-foreground font-medium mb-1 relative z-10">Rate</span>
              <span className="text-2xl font-bold text-secondary relative z-10">{course.analytics.completion_rate}%</span>
            </div>
          </div>
        ) : (
          <div className="w-full md:w-auto bg-muted/50 p-6 rounded-2xl border border-border flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 bg-card rounded-full shadow-sm flex items-center justify-center mb-2">
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
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-foreground">{course.progress || 0}%</span>
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Course Progress</p>
            <Button fullWidth>Resume Course</Button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Course Syllabus
        </h2>
        {isOwnerOrAdmin && (
          <Button variant="secondary" size="sm" onClick={() => { setEditingMaterial(null); setIsMaterialModalOpen(true); }}>Add Material</Button>
        )}
      </div>
      
      <div className="bg-card border border-border rounded-2xl shadow-sm divide-y divide-border overflow-hidden">
        
        {course.materials.length === 0 ? (
          <EmptyState
            icon={<FileText size={40} />}
            title="No Materials Yet"
            description={
              isOwnerOrAdmin 
                ? "Get started by adding a PDF guide or an interactive crossword puzzle for your students." 
                : "The instructor hasn't added any learning materials to this course yet. Check back later!"
            }
            action={
              isOwnerOrAdmin && (
                <Button onClick={() => { setEditingMaterial(null); setIsMaterialModalOpen(true); }}>
                  Add First Material
                </Button>
              )
            }
          />
        ) : (
          course.materials.map((material, index) => {
            const isCompleted = material.status === 'COMPLETED';
            const isInProgress = material.status === 'READING' || material.status === 'READY_FOR_CROSSWORD';
            
            return (
            <div key={material.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/50 transition-colors group">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl transition-colors mt-1 sm:mt-0 ${
                   isCompleted ? 'bg-success/10 text-success group-hover:bg-success group-hover:text-success-foreground' :
                   isInProgress ? 'bg-warning/10 text-warning group-hover:bg-warning group-hover:text-warning-foreground' :
                   'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                }`}>
                  {isCompleted ? <Award size={24} /> :
                   isInProgress ? <Clock size={24} /> :
                   <FileText size={24} />}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    Chapter {index + 1}: {material.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                    {material.pdf_path ? "Read the PDF guide" : "Review the material"} 
                    {material.crossword_data ? " and solve the interactive crossword puzzle to test your knowledge." : "."}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                {isOwnerOrAdmin && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => handleEditMaterial(material)}>Edit</Button>
                    <Button variant="outline" size="sm" className="text-destructive border-destructive" onClick={() => handleDeleteMaterial(material.id)}>Delete</Button>
                  </>
                )}
                <Link to={`/courses/${id}/materials/${material.id}`}>
                  <Button variant="outline" className="w-full sm:w-auto gap-2 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
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
      <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Student Monitoring Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">Track student progress and submissions in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium mb-1">Sort</span>
            <Select 
              className="h-10 text-sm py-1"
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
              className="h-10 text-sm py-1"
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

      {data && data.last_page > 1 && (
        <div className="flex justify-center items-center py-4 gap-2 border-t border-border">
          <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</Button>
          <span className="text-sm font-medium text-muted-foreground">Page {page} of {data.last_page}</span>
          <Button variant="secondary" size="sm" disabled={page === data.last_page} onClick={() => setPage(p => Math.min(data.last_page, p + 1))}>Next</Button>
        </div>
      )}
    </div>
  );
}
