import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';
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

// ─── Teacher view: shows submission statistics for this material ───────────────
function TeacherWorkspace({ materialId }: { materialId: number }) {
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
        <CardTitle className="text-base sm:text-lg">Student Submissions</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-6 bg-muted/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-card rounded-2xl p-5 border border-border flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <Users size={22} className="text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <CheckSquare size={22} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border flex items-center gap-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <Clock size={22} className="text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <BarChart2 size={22} className="text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.average_score ?? 0}</p>
              <p className="text-sm text-muted-foreground">Avg Score</p>
            </div>
          </div>
        </div>

        {/* Completion bar */}
        {stats.total > 0 && (
          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
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
    return `http://localhost:8000/api/courses/${courseId}/materials/${id}/pdf`;
  };

  // Render purely based on PortalState
  if (state === 'INITIALIZING') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 mt-6 bg-muted/30 min-h-[300px] rounded-xl border border-border">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Checking submission status...</p>
      </div>
    );
  }

  if (state === 'ERROR') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 mt-6 bg-destructive/10 text-destructive min-h-[300px] rounded-xl border border-destructive/20">
        <p>Failed to load submission state.</p>
        <Button onClick={() => refetch()} variant="outline" className="mt-4">Retry</Button>
      </div>
    );
  }

  if (state === 'UNLOCKING') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 mt-6 bg-muted/30 min-h-[300px] rounded-xl border border-border">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Unlocking Crossword...</p>
      </div>
    );
  }

  if (state === 'READING') {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 mb-16 animate-in fade-in duration-500">
        {/* Clean Reading Workspace: No Card, No min-height, No Dashboard feel. 
            Height calculation is delegated entirely to PdfViewer's internal Canvas scale. */}
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
            No crossword puzzle available for this material.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="mt-6 flex justify-center w-full animate-in fade-in duration-500">
        <Card className="flex flex-col border-border shadow-md w-full max-w-5xl">
          <CardHeader className="py-4 border-b border-border/50 bg-muted/30 flex flex-row items-center justify-between">
            <CardTitle className="text-base sm:text-lg">Crossword Puzzle</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsReviewModalOpen(true)}
            >
              📄 View Material
            </Button>
          </CardHeader>
          <CrosswordProvider data={material.crossword_data}>
            <CardContent className="p-4 sm:p-6 bg-muted/30 flex flex-col gap-6">
              <CrosswordToolbar />
              <div className="flex justify-center w-full">
                <CrosswordBoard />
              </div>
              <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
                <CrosswordClues />
                <CrosswordSubmit materialId={Number(id)} />
              </div>
            </CardContent>
          </CrosswordProvider>
        </Card>
      </div>

      {/* Local UI State: Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-none sm:rounded-3xl w-full h-full sm:h-[90vh] sm:max-w-4xl shadow-2xl relative flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">Learning Material</h2>
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
    <div className="flex flex-col pb-12 xl:pb-24">
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
        <Button onClick={() => navigate(`/courses/${courseId}`)} variant="ghost" size="sm" className="gap-1 sm:gap-2 text-muted-foreground hover:text-foreground sm:mr-4 px-2 sm:px-3">
          <ArrowLeft size={16} /> <span className="hidden sm:inline">Back</span>
        </Button>
        <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigate('/')}>Dashboard</span>
        <span>/</span>
        <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigate(`/courses/${courseId}`)}>Course</span>
        <span>/</span>
        <span className="font-semibold text-foreground truncate max-w-[150px] sm:max-w-[300px]">{material.title}</span>
      </div>
      
      {/* Layered Architecture: Workflow branching */}
      {isTeacherOrAdmin ? (
        <TeacherWorkspace materialId={Number(id)} />
      ) : (
        <StudentWorkflow material={material} courseId={courseId!} />
      )}
    </div>
  );
}
