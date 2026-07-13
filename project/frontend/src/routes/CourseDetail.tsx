import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';
import { useAuth } from '../providers/AuthProvider';
import { FileText, ArrowLeft, PlayCircle, Clock, BarChart, Award } from 'lucide-react';
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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('courses');
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
      toast.success(t('materialDeleted'));
      queryClient.invalidateQueries({ queryKey: ['course', id] });
    },
    onError: (err: any) => toast.error(err.message || t('failedToDeleteMaterial'))
  });

  const deleteCourseMutation = useMutation({
    mutationFn: () => fetchApi(`/courses/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success(t('courseDeleted'));
      navigate('/courses');
    },
    onError: (err: any) => toast.error(err.message || t('failedToDeleteCourse'))
  });

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setIsMaterialModalOpen(true);
  };

  const handleDeleteMaterial = (materialId: number) => {
    setConfirmDialog({
      isOpen: true,
      title: t('deleteMaterial'),
      description: t('deleteMaterialDesc'),
      onConfirm: () => deleteMaterialMutation.mutate(materialId)
    });
  };

  const handleDeleteCourse = () => {
    setConfirmDialog({
      isOpen: true,
      title: t('deleteCourse'),
      description: t('deleteCourseDesc'),
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-screen-xl mx-auto w-full space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link 
          to="/courses" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          {t('backToCourses')}
        </Link>
        {isOwnerOrAdmin && (
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={() => setIsAssignmentModalOpen(true)} className="w-full sm:w-auto">{t('assignStudents')}</Button>
            <Button variant="outline" size="sm" onClick={() => setIsCourseModalOpen(true)} className="w-full sm:w-auto">{t('editCourse')}</Button>
            <Button variant="outline" size="sm" className="w-full sm:w-auto text-destructive border-destructive hover:bg-destructive/10" onClick={handleDeleteCourse}>{t('deleteCourse')}</Button>
          </div>
        )}
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-primary to-blue-500 dark:from-primary/90 dark:to-primary/70 text-primary-foreground rounded-3xl p-6 lg:p-8 shadow-lg flex flex-col md:flex-row gap-6 md:gap-6 items-start relative overflow-hidden border-0">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl z-0" />
        
        <div className="flex-1 space-y-4 w-full relative z-10">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-primary-foreground/80 mb-2">
            <span className="flex items-center gap-1"><Clock size={16} /> {t('selfPaced')}</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1"><BarChart size={16} /> {t('allLevels')}</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1"><Award size={16} /> {t('autoScored')}</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {course.name}
          </h1>
          
          <p className="text-primary-foreground/90 text-base sm:text-lg leading-relaxed max-w-2xl">
            {course.description || t('noDescriptionCourse')}
          </p>

          <div className="pt-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              {(course.teacher_name || 'T').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold">
                {course.teacher_name || t('instructor')}
              </p>
              <p className="text-xs text-primary-foreground/80">{t('courseInstructor')}</p>
            </div>
          </div>
        </div>

        {isOwnerOrAdmin && course.analytics ? (
          <div className="w-full md:w-auto bg-white/10 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-white/20 grid grid-cols-2 lg:grid-cols-4 gap-3 flex-shrink-0 relative z-10 text-primary-foreground">
            <div className="col-span-2 lg:col-span-4 mb-1">
              <h3 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                <BarChart size={18} />
                {t('courseAnalytics')}
              </h3>
            </div>
            <div className="bg-white/20 p-3 rounded-xl shadow-sm border border-white/10 flex flex-col justify-center">
              <span className="text-xs font-medium mb-1 opacity-90">{t('enrolled')}</span>
              <span className="text-xl sm:text-2xl font-bold">{course.analytics.students_enrolled}</span>
            </div>
            <div className="bg-white/20 p-3 rounded-xl shadow-sm border border-white/10 flex flex-col justify-center">
              <span className="text-xs font-medium mb-1 opacity-90">{t('completed')}</span>
              <span className="text-xl sm:text-2xl font-bold">{course.analytics.students_completed}</span>
            </div>
            <div className="bg-white/20 p-3 rounded-xl shadow-sm border border-white/10 flex flex-col justify-center">
              <span className="text-xs font-medium mb-1 opacity-90">{t('avgScore')}</span>
              <span className="text-xl sm:text-2xl font-bold">{course.analytics.average_score}</span>
            </div>
            <div className="bg-white/20 p-3 rounded-xl shadow-sm border border-white/10 flex flex-col justify-center">
              <span className="text-xs font-medium mb-1 opacity-90">{t('rate')}</span>
              <span className="text-xl sm:text-2xl font-bold">{course.analytics.completion_rate}%</span>
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
            <p className="text-sm font-medium opacity-90">{t('courseProgress')}</p>
            <Button fullWidth className="bg-white text-primary hover:bg-white/90">{t('resumeCourse')}</Button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6 mt-8 sm:mt-12">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          {t('courseSyllabus')}
        </h2>
        {isOwnerOrAdmin && (
          <Button variant="secondary" size="sm" onClick={() => { setEditingMaterial(null); setIsMaterialModalOpen(true); }} className="w-full sm:w-auto">
            {t('addMaterial')}
          </Button>
        )}
      </div>
      
      <div className="bg-card border border-border rounded-2xl shadow-sm divide-y divide-border overflow-hidden">
        
        {course.materials.length === 0 ? (
          <EmptyState
            icon={<DocumentIllustration size={100} />}
            title={t('noMaterialsYet')}
            description={
              isOwnerOrAdmin 
                ? t('noMaterialsTeacherDesc') 
                : t('noMaterialsStudentDesc')
            }
            action={
              isOwnerOrAdmin && (
                <Button variant="primary" onClick={() => { setEditingMaterial(null); setIsMaterialModalOpen(true); }}>
                  {t('addFirstMaterial')}
                </Button>
              )
            }
            secondaryHelp={
              isOwnerOrAdmin 
                ? t('teacherMaterialHelp')
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
                    {t('chapterTitle', { index: index + 1, title: material.title })}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
                    {material.pdf_path ? t('readPdfGuide') : t('reviewMaterial')} 
                    {material.crossword_data ? t('andSolveCrossword') : t('dot')}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0 w-full sm:w-auto shrink-0">
                {isOwnerOrAdmin && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="secondary" size="sm" onClick={() => handleEditMaterial(material)} className="flex-1 sm:flex-none">{t('edit')}</Button>
                    <Button variant="ghost" size="sm" className="flex-1 sm:flex-none text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteMaterial(material.id)}>{t('delete')}</Button>
                  </div>
                )}
                <Link to={`/courses/${id}/materials/${material.id}`} className="block w-full sm:w-auto">
                  <Button variant="primary" className="w-full sm:w-auto gap-2">
                    <PlayCircle size={18} />
                    {t('startModule')}
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
  const { t } = useTranslation('courses');
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
          <h2 className="text-xl font-bold text-foreground">{t('studentMonitoringDashboard')}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t('trackStudentProgress')}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium mb-1">{t('sort')}</span>
            <Select 
              className="h-10 text-sm py-1 w-full sm:w-auto"
              value={sort}
              onChange={e => { setSort(e.target.value); setPage(1); }}
            >
              <option value="newest">{t('newestFirst')}</option>
              <option value="oldest">{t('oldestFirst')}</option>
              <option value="score_high">{t('highestScore')}</option>
              <option value="score_low">{t('lowestScore')}</option>
            </Select>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium mb-1">{t('material')}</span>
            <Select 
              className="h-10 text-sm py-1 w-full sm:w-auto"
              value={materialFilter}
              onChange={e => { setMaterialFilter(e.target.value); setPage(1); }}
            >
              <option value="all">{t('allMaterials')}</option>
              {materials.map((mat, idx) => (
                <option key={mat.id} value={mat.id}>
                  {t('chapterOptionTitle', { index: idx + 1, title: mat.title })}
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
              <TableHead>{t('student')}</TableHead>
              <TableHead>{t('material')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead>{t('submissionDate')}</TableHead>
              <TableHead className="text-center">{t('score')}</TableHead>
              <TableHead className="text-right">{t('timeSpent')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">{t('loadingData')}</TableCell></TableRow>
            ) : data?.data?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">{t('noStudentProgress')}</TableCell></TableRow>
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
          <div className="text-center text-muted-foreground py-8">{t('loadingData')}</div>
        ) : data?.data?.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">{t('noStudentProgress')}</div>
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
                  <span className="text-muted-foreground block mb-1">{t('score')}</span>
                  <span className="font-bold text-foreground text-sm">{sub.score}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">{t('timeSpent')}</span>
                  <span className="font-semibold text-foreground">{formatTime(sub.time_spent_seconds)}</span>
                </div>
                <div className="col-span-2 mt-1">
                  <span className="text-muted-foreground">{t('dateLabel')}</span>
                  <span className="font-medium text-foreground">{formatDate(sub.submitted_at)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {data && data.last_page > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center p-4 gap-4 border-t border-border">
          <Button variant="secondary" size="sm" className="w-full sm:w-auto" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>{t('previous')}</Button>
          <span className="text-sm font-medium text-muted-foreground">{t('page', { current: page, total: data.last_page })}</span>
          <Button variant="secondary" size="sm" className="w-full sm:w-auto" disabled={page === data.last_page} onClick={() => setPage(p => Math.min(data.last_page, p + 1))}>{t('next')}</Button>
        </div>
      )}
    </div>
  );
}
