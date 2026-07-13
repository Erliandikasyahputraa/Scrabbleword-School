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
function TeacherCrosswordView({ materialId }: { materialId: number }) {
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
    <CardContent className="flex-1 overflow-auto p-6 bg-muted/30">
      <h3 className="text-lg font-bold text-foreground mb-6">Submission Summary</h3>
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
  );
}

// ─── Student view: interactive crossword solver ────────────────────────────────
function StudentCrosswordView({ material }: { material: any }) {
  const id = material.id;

  const { data: submission, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <CardContent className="flex-1 flex flex-col items-center justify-center p-8 bg-muted/30 min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Checking submission status...</p>
      </CardContent>
    );
  }

  if (submission && submission.is_completed) {
    return (
      <CardContent className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted/30 min-h-[300px]">
        <div className="mt-8 p-6 bg-success/10 border border-success/20 rounded-xl text-center w-full max-w-md animate-in zoom-in duration-300">
          <div className="mx-auto flex justify-center text-success mb-3">
            <CheckSquare size={48} />
          </div>
          <h3 className="text-xl font-bold text-success mb-2">Already Submitted</h3>
          <p className="text-success/80 mb-4">
            Submitted on {new Date(submission.updated_at || submission.created_at).toLocaleDateString()}
          </p>
          <div className="text-4xl font-black text-success mb-6">
            {submission.score} <span className="text-xl text-success/70">pts</span>
          </div>
        </div>
      </CardContent>
    );
  }

  if (!material.crossword_data) {
    return (
      <CardContent className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted/30 min-h-[300px]">
        <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
          No crossword puzzle available for this material.
        </p>
      </CardContent>
    );
  }

  return (
    <CrosswordProvider data={material.crossword_data}>
      <CardContent className="p-4 sm:p-6 bg-muted/30 flex flex-col gap-6">
        {/* Top: Toolbar */}
        <CrosswordToolbar />
        
        {/* Middle: Board */}
        <div className="flex justify-center w-full">
          <CrosswordBoard />
        </div>
        
        {/* Bottom: Clues & Submit tightly coupled */}
        <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
          <CrosswordClues />
          <CrosswordSubmit materialId={Number(id)} />
        </div>
      </CardContent>
    </CrosswordProvider>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function LearnPortal() {
  const { courseId, id } = useParams<{ courseId: string, id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: material, isLoading: materialLoading, error } = useMaterial(courseId, id);

  const { data: mySubmission, isLoading: submissionLoading, refetch: refetchSubmission } = useQuery({
    queryKey: ['my-submission', id],
    queryFn: async () => {
      try {
        return await fetchApi(`/materials/${id}/my-submission`);
      } catch (e: any) {
        if (e.message?.includes('Not found') || e.status === 404) return null;
        throw e;
      }
    },
    retry: false,
    enabled: user?.role === 'student'
  });

  const [isPdfCompletedLocal, setIsPdfCompletedLocal] = useState(false);
  const [isMobilePdfOpen, setIsMobilePdfOpen] = useState(false);
  const isPdfCompleted = (mySubmission?.status === 'READY_FOR_CROSSWORD' || mySubmission?.status === 'COMPLETED') || isPdfCompletedLocal;

  // Trigger start reading exactly once on load
  useEffect(() => {
    if (user?.role === 'student' && material && !mySubmission && !submissionLoading) {
       fetchApi(`/materials/${id}/start-read`, { method: 'POST' }).catch(() => {});
    }
  }, [user, material, id, mySubmission, submissionLoading]);

  const handlePdfComplete = async () => {
      if (!isPdfCompleted && user?.role === 'student') {
          try {
              await fetchApi(`/materials/${id}/read`, { method: 'POST' });
              setIsPdfCompletedLocal(true);
              refetchSubmission();
          } catch (e) {
              // Silent catch
          }
      }
  };

  if (materialLoading || (user?.role === 'student' && submissionLoading)) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (error || !material) {
    const errObj = error as any;
    const code = errObj?.status || 404;
    return <ErrorPage code={code} message={errObj?.message} />;
  }

  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin';
  const getPdfUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:8000/api/courses/${courseId}/materials/${id}/pdf`;
  };

  return (
    <div className="flex flex-col pb-12 xl:pb-24">
      <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
        <Button onClick={() => navigate(`/courses/${courseId}`)} variant="ghost" size="sm" className="gap-1 sm:gap-2 text-muted-foreground hover:text-foreground sm:mr-4 px-2 sm:px-3">
          <ArrowLeft size={16} /> <span className="hidden sm:inline">Back</span>
        </Button>
        <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigate('/')}>Dashboard</span>
        <span>/</span>
        <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigate(`/courses/${courseId}`)}>Course</span>
        <span>/</span>
        <span className="font-semibold text-foreground truncate max-w-[150px] sm:max-w-[300px]">{material.title}</span>
      </div>
      
      {/* Layout Ownership: Flex layout, PDF gets fixed width, Board gets remaining space */}
      <div className="flex flex-col xl:flex-row gap-6 sm:gap-8 flex-1 min-h-0 min-w-0 animate-in fade-in duration-500">
        
        {/* Left Column: PDF Viewer (Fixed Width on Desktop) */}
        <Card className={`flex flex-col border-border shadow-md min-h-0 min-w-0 shrink-0 xl:w-[450px] ${isPdfCompleted && !isTeacherOrAdmin ? 'hidden xl:flex' : 'flex'}`}>
          <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-border/50 bg-muted/30">
            <CardTitle className="text-base sm:text-lg">Learning Material</CardTitle>
            <div className="flex gap-2">
              {isPdfCompleted && (
                 <span className="flex items-center gap-1 text-xs sm:text-sm text-success bg-success/10 px-2 py-1 rounded-md font-medium border border-success/20">
                    <CheckSquare size={14} /> <span className="hidden sm:inline">Ready for Crossword</span>
                 </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0 bg-muted/10">
            <div className="p-2 sm:p-4 w-full">
              <PdfViewer 
                 url={getPdfUrl(material.pdf_path)} 
                 onComplete={handlePdfComplete} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Crossword — role-gated (Flex-1 takes remaining space) */}
        <div className="xl:sticky xl:top-6 self-start flex-1 min-w-0 min-h-0 w-full">
          <Card className="flex flex-col border-border shadow-md overflow-hidden min-h-0 min-w-0 w-full">
            <CardHeader className="py-4 border-b border-border/50 bg-muted/30 flex flex-row items-center justify-between">
              <CardTitle className="text-base sm:text-lg">
                {isTeacherOrAdmin ? 'Student Submissions' : 'Crossword Puzzle'}
              </CardTitle>
              {/* Mobile Only: Button to view PDF when inline PDF is hidden */}
              {isPdfCompleted && !isTeacherOrAdmin && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="xl:hidden"
                  onClick={() => setIsMobilePdfOpen(true)}
                >
                  📄 View Material
                </Button>
              )}
            </CardHeader>

          {isTeacherOrAdmin ? (
            <TeacherCrosswordView materialId={Number(id)} />
          ) : (
            !isPdfCompleted ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted/30 relative min-h-[300px]">
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 shadow-inner">
                          <CheckSquare size={32} className="text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Finish Reading First</h3>
                      <p className="text-muted-foreground max-w-sm">
                          Please read through all pages of the PDF document to unlock the crossword puzzle.
                      </p>
                  </div>
              </div>
            ) : (
              <StudentCrosswordView material={material} />
            )
          )}
          </Card>
        </div>
      </div>

      {/* Mobile PDF Modal */}
      {isMobilePdfOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 xl:hidden">
          <div className="bg-card rounded-none sm:rounded-3xl w-full h-full sm:h-[90vh] shadow-2xl relative flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">Learning Material</h2>
              <button 
                onClick={() => setIsMobilePdfOpen(false)}
                className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-muted/10">
              <PdfViewer 
                 url={getPdfUrl(material.pdf_path)} 
                 onComplete={handlePdfComplete} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
