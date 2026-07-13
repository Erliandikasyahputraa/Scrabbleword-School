import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchApi, API_URL } from '../lib/api';
import { useAuth } from '../providers/AuthProvider';
import PdfViewer from '../components/pdf/PdfViewer';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import ErrorPage from './ErrorPage';
import { ArrowLeft, Users, BarChart2, Clock, CheckSquare, X } from 'lucide-react';
import { CrosswordProvider } from '../components/crossword/CrosswordProvider';
import { CrosswordToolbar } from '../components/crossword/CrosswordToolbar';
import { CrosswordBoard } from '../components/crossword/CrosswordBoard';
import { CrosswordClues } from '../components/crossword/CrosswordClues';
import { CrosswordSubmit } from '../components/crossword/CrosswordSubmit';
import { useMaterial } from '../hooks/useMaterial';
import { useTranslation } from 'react-i18next';

// ─── Teacher view: shows submission statistics for this material ───────────────
function TeacherWorkspace({ materialId }: { materialId: number }) {
  const { t } = useTranslation('courses');
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['material-submissions', materialId],
    queryFn: () => fetchApi(`/materials/${materialId}/submission-stats`),
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const stats = submissions ?? { total: 0, completed: 0, average_score: 0, pending: 0 };

  return (
    <Card className="flex flex-col border-border shadow-md overflow-hidden min-h-0 min-w-0 w-full mt-6">
      <CardHeader className="py-4 border-b border-border/50 bg-muted/30">
        <CardTitle className="text-base sm:text-lg">{t('studentSubmissions')}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-6 bg-muted/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-card rounded-2xl p-5 border border-border flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <Users size={22} className="text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">{t('totalStudents')}</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <CheckSquare size={22} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">{t('completed')}</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border flex items-center gap-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <Clock size={22} className="text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">{t('pending')}</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <BarChart2 size={22} className="text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.average_score ?? 0}</p>
              <p className="text-sm text-muted-foreground">{t('avgScore')}</p>
            </div>
          </div>
        </div>

        {/* Completion bar */}
        {stats.total > 0 && (
          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-muted-foreground">{t('completionRate')}</p>
              <p className="text-sm font-bold text-foreground">
                {Math.round((stats.completed / stats.total) * 100)}%
              </p>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-700"
                style={{ width: `${Math.round((stats.completed / stats.total) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Student view: interactive crossword solver ────────────────────────────────
type PortalState = 'INITIALIZING' | 'ERROR' | 'READING' | 'UNLOCKING' | 'QUIZ';

function StudentWorkflow({ material, courseId }: { material: any, courseId: string }) {
  const { t } = useTranslation('courses');
  const id = material.id;

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false); // Local transient state for overlay
  const [state, setState] = useState<PortalState>('INITIALIZING'); // True State Machine

  const { data: submission, isLoading, error: submissionError, refetch } = useQuery({
    queryKey: ['my-submission', id],
    queryFn: async () => {
      try {
        return await fetchApi(`/materials/${id}/my-submission`);
      } catch (e: any) {
        if (e.message?.includes('Not found') || e.status === 404) return null;
        throw e;
      }
    },
    retry: false
  });

  // Trigger start reading exactly once on load
  useEffect(() => {
    if (material && !submission && !isLoading) {
       fetchApi(`/materials/${id}/start-read`, { method: 'POST' }).catch(() => {});
    }
  }, [material, id, submission, isLoading]);

  // Server Truth Sync
  useEffect(() => {
    if (isLoading) return;
    if (submissionError) {
      setState('ERROR');
      return;
    }

    const isServerReady = submission?.status === 'READY_FOR_CROSSWORD' || submission?.status === 'COMPLETED' || submission?.is_completed;
    
    if (state === 'UNLOCKING' && isServerReady) {
      setState('QUIZ');
    } else if (state === 'INITIALIZING') {
      setState(isServerReady ? 'QUIZ' : 'READING');
    } else if (state === 'READING' && isServerReady) {
      setState('QUIZ'); // Catch-all for if server updates unexpectedly
    }
  }, [isLoading, submission, submissionError, state]);

  const handlePdfComplete = async () => {
    setState('UNLOCKING');
    try {
      await fetchApi(`/materials/${id}/read`, { method: 'POST' });
      const result = await refetch();
      const isServerReady = result.data?.status === 'READY_FOR_CROSSWORD' || result.data?.status === 'COMPLETED' || result.data?.is_completed;
      if (!isServerReady) {
         setState('READING'); // Fallback only if the backend explicitly rejects the unlock
      }
    } catch (e) {
      setState('READING'); // Rollback on explicit error
    }
  };

  const getPdfUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_URL}/courses/${courseId}/materials/${id}/pdf`;
  };

  // Render purely based on PortalState
  if (state === 'INITIALIZING') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 mt-6 bg-muted/30 min-h-[300px] rounded-xl border border-border">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">{t('checkingSubmissionStatus')}</p>
      </div>
    );
  }

  if (state === 'ERROR') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 mt-6 bg-destructive/10 text-destructive min-h-[300px] rounded-xl border border-destructive/20">
        <p>{t('failedToLoadSubmissionState')}</p>
        <Button onClick={() => refetch()} variant="outline" className="mt-4">{t('retry')}</Button>
      </div>
    );
  }

  if (state === 'UNLOCKING') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 mt-6 bg-muted/30 min-h-[300px] rounded-xl border border-border">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">{t('unlockingCrossword')}</p>
      </div>
    );
  }

  if (state === 'READING') {
    return (
      <div className="flex-1 min-h-0 w-full animate-in fade-in duration-500 bg-muted/5 relative">
        <PdfViewer 
            url={getPdfUrl(material.pdf_path)} 
            onComplete={handlePdfComplete} 
        />
      </div>
    );
  }

  // QUIZ STATE
  if (!material.crossword_data) {
    return (
      <Card className="mt-6">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 min-h-[300px]">
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            {t('noCrosswordAvailable')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col w-full h-full animate-in fade-in duration-500 min-h-0 bg-background relative overflow-hidden">
        <CrosswordProvider data={material.crossword_data}>
          {/* Workspace Header */}
          <div className="shrink-0 py-2.5 px-4 sm:px-6 border-b border-border bg-card/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 z-10 shadow-sm relative">
             <div className="flex items-center gap-3 w-full sm:w-auto">
               <h2 className="text-sm sm:text-base font-bold text-foreground truncate max-w-[200px] sm:max-w-xs">{t('crosswordPuzzle')}</h2>
               <div className="h-4 w-px bg-border hidden sm:block"></div>
               <Button variant="outline" size="sm" onClick={() => setIsReviewModalOpen(true)} className="gap-2 h-8 text-xs shrink-0 bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary hover:text-primary">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                 {t('reviewMaterial')}
               </Button>
             </div>
             <CrosswordToolbar />
          </div>

          {/* Main Workspace Area */}
          <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden w-full bg-muted/5 relative">
            {/* Board Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-transparent border-b lg:border-b-0 lg:border-r border-border/50 min-h-[45vh] lg:min-h-0">
               <div className="flex-1 overflow-auto custom-scrollbar grid place-items-center relative w-full h-full p-4 md:p-8 lg:p-12 xl:p-16">
                  <CrosswordBoard />
               </div>
            </div>

            {/* Clues & Submit Area */}
            <div className="w-full lg:w-[320px] xl:w-[380px] flex flex-col bg-card shrink-0 relative z-10 h-[55vh] lg:h-auto shadow-[-4px_0_24px_-8px_rgba(0,0,0,0.05)] border-l border-border/50">
               <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5 lg:p-6 pb-24 relative">
                 <CrosswordClues />
               </div>
               <div className="absolute bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-md border-t border-border shadow-[0_-8px_24px_-8px_rgba(0,0,0,0.1)]">
                 <CrosswordSubmit materialId={Number(id)} />
               </div>
            </div>
          </div>
        </CrosswordProvider>
      </div>

      {/* Local UI State: Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-none sm:rounded-3xl w-full h-full sm:h-[90vh] sm:max-w-4xl shadow-2xl relative flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">{t('learningMaterial')}</h2>
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-muted/10">
              <PdfViewer url={getPdfUrl(material.pdf_path)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function LearnPortal() {
  const { t } = useTranslation('courses');
  const { courseId, id } = useParams<{ courseId: string, id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // LearnPortal is the root. It fetches the material.
  const { data: material, isLoading: materialLoading, error } = useMaterial(courseId, id);

  if (materialLoading) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (error || !material) {
    const errObj = error as any;
    const code = errObj?.status || 404;
    return <ErrorPage code={code} message={errObj?.message} />;
  }

  // Branch Early
  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin';

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden w-full max-w-none">
      <div className="shrink-0 p-3 sm:p-4 border-b border-border bg-card/50 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground z-10 shadow-sm w-full relative">
        <Button onClick={() => navigate(`/courses/${courseId}`)} variant="ghost" size="sm" className="gap-1 sm:gap-2 text-muted-foreground hover:text-foreground sm:mr-4 px-2 sm:px-3 h-8">
          <ArrowLeft size={16} /> <span className="hidden sm:inline">{t('back')}</span>
        </Button>
        <span className="cursor-pointer hover:text-primary transition-colors font-medium" onClick={() => navigate('/')}>{t('dashboardLabel')}</span>
        <span className="text-muted-foreground/50">/</span>
        <span className="cursor-pointer hover:text-primary transition-colors font-medium" onClick={() => navigate(`/courses/${courseId}`)}>{t('courseLabel')}</span>
        <span className="text-muted-foreground/50">/</span>
        <span className="font-semibold text-foreground truncate max-w-[150px] sm:max-w-[300px]">{material.title}</span>
      </div>
      
      {/* Layered Architecture: Workflow branching */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden w-full relative bg-muted/10">
        {isTeacherOrAdmin ? (
          <div className="p-4 sm:p-6 lg:p-8 max-w-screen-xl mx-auto w-full overflow-y-auto custom-scrollbar">
            <TeacherWorkspace materialId={Number(id)} />
          </div>
        ) : (
          <StudentWorkflow material={material} courseId={courseId!} />
        )}
      </div>
    </div>
  );
}
