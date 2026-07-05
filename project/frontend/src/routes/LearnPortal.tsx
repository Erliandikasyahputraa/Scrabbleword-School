import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';
import { useAuth } from '../providers/AuthProvider';
import PdfViewer from '../components/pdf/PdfViewer';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import ErrorPage from './ErrorPage';
import { ArrowLeft, Users, BarChart2, Clock, CheckSquare } from 'lucide-react';
import { CrosswordProvider } from '../components/crossword/CrosswordProvider';
import { CrosswordToolbar } from '../components/crossword/CrosswordToolbar';
import { CrosswordBoard } from '../components/crossword/CrosswordBoard';
import { CrosswordClues } from '../components/crossword/CrosswordClues';
import { CrosswordSubmit } from '../components/crossword/CrosswordSubmit';

// ─── Teacher view: shows submission statistics for this material ───────────────
function TeacherCrosswordView({ materialId }: { materialId: number }) {
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['material-submissions', materialId],
    queryFn: () => fetchApi(`/materials/${materialId}/submission-stats`),
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const stats = submissions ?? { total: 0, completed: 0, average_score: 0, pending: 0 };

  return (
    <CardContent className="flex-1 overflow-auto p-6 bg-slate-50/50 dark:bg-slate-900/50">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Submission Summary</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <Users size={22} className="text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
            <p className="text-sm text-slate-500">Total Students</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
            <CheckSquare size={22} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.completed}</p>
            <p className="text-sm text-slate-500">Completed</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 flex items-center gap-4">
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
            <Clock size={22} className="text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.pending}</p>
            <p className="text-sm text-slate-500">Pending</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <BarChart2 size={22} className="text-purple-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.average_score ?? 0}</p>
            <p className="text-sm text-slate-500">Avg Score</p>
          </div>
        </div>
      </div>

      {/* Completion bar */}
      {stats.total > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completion Rate</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {Math.round((stats.completed / stats.total) * 100)}%
            </p>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
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
      <CardContent className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-slate-500">Checking submission status...</p>
      </CardContent>
    );
  }

  if (submission && submission.is_completed) {
    return (
      <CardContent className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 dark:bg-slate-900/50">
        <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-center w-full max-w-md animate-in zoom-in duration-300">
          <div className="mx-auto flex justify-center text-green-500 mb-3">
            <CheckSquare size={48} />
          </div>
          <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Already Submitted</h3>
          <p className="text-green-600 dark:text-green-400 mb-4">
            Submitted on {new Date(submission.updated_at || submission.created_at).toLocaleDateString()}
          </p>
          <div className="text-4xl font-black text-green-600 dark:text-green-400 mb-6">
            {submission.score} <span className="text-xl text-green-600/70">pts</span>
          </div>
        </div>
      </CardContent>
    );
  }

  if (!material.crossword_data) {
    return (
      <CardContent className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 dark:bg-slate-900/50">
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
          No crossword puzzle available for this material.
        </p>
      </CardContent>
    );
  }

  return (
    <CrosswordProvider data={material.crossword_data}>
      <CrosswordToolbar />
      <CardContent className="flex-1 overflow-auto custom-scrollbar p-6 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex flex-col items-center">
          <CrosswordBoard />
        </div>
        <CrosswordClues />
        <CrosswordSubmit materialId={Number(id)} />
      </CardContent>
    </CrosswordProvider>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function LearnPortal() {
  const { courseId, id } = useParams<{ courseId: string, id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: material, isLoading: materialLoading, error } = useQuery({
    queryKey: ['material', id],
    queryFn: () => fetchApi(`/courses/${courseId}/materials/${id}`)
  });

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
  const isPdfCompleted = mySubmission !== null || isPdfCompletedLocal;

  const handlePdfComplete = async () => {
      if (!isPdfCompleted && user?.role === 'student') {
          try {
              await fetchApi(`/materials/${id}/read`, { method: 'POST' });
              setIsPdfCompletedLocal(true);
              refetchSubmission();
          } catch (e) {
              console.error("Failed to mark PDF as read", e);
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
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4 flex items-center gap-4">
        <Button onClick={() => navigate(`/courses/${courseId}`)} variant="ghost" size="sm" className="gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white">
          <ArrowLeft size={16} /> Back to Course
        </Button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{material.title}</h1>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 flex-1 min-h-0 animate-in fade-in duration-500">
        
        {/* Left Column: PDF Viewer */}
        <Card className="flex flex-col h-full border-slate-200 dark:border-slate-800 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
            <CardTitle className="text-lg">Learning Material</CardTitle>
            <div className="flex gap-2">
              {isPdfCompleted && (
                 <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded-md font-medium border border-green-200">
                    <CheckSquare size={14} /> Completed
                 </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden bg-slate-100 dark:bg-slate-950/50 relative">
            <div className="absolute inset-0 p-4 overflow-auto custom-scrollbar">
              <PdfViewer 
                 url={getPdfUrl(material.pdf_path)} 
                 onComplete={handlePdfComplete} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Crossword — role-gated */}
        <Card className="flex flex-col h-full border-slate-200 dark:border-slate-800 shadow-md overflow-hidden relative">
          <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
            <CardTitle className="text-lg">
              {isTeacherOrAdmin ? 'Student Submissions' : 'Crossword Puzzle'}
            </CardTitle>
          </CardHeader>

          {isTeacherOrAdmin ? (
            <TeacherCrosswordView materialId={Number(id)} />
          ) : (
            !isPdfCompleted ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 dark:bg-slate-900/50 relative">
                  <div className="absolute inset-0 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6">
                      <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
                          <CheckSquare size={32} className="text-slate-400" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Finish Reading First</h3>
                      <p className="text-slate-500 dark:text-slate-400 max-w-sm">
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
  );
}
