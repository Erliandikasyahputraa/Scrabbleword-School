import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../providers/AuthProvider';
import { fetchApi } from '../lib/api';
import { Users, BookOpen, FileText, Puzzle, Trophy, Target, GraduationCap, CheckCircle, ArrowRight, PlayCircle, PlusCircle, ShieldCheck, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Link, useNavigate } from 'react-router-dom';
import { Spinner } from '../components/ui/LoadingSystem';
import { TeacherIllustration, AchievementIllustration } from '../components/ui/Illustrations';
import { Button } from '../components/ui/Button';
import { useTranslation } from 'react-i18next';

type DashboardStats = {
  total_courses?: number;
  total_students?: number;
  total_teachers?: number;
  total_materials?: number;
  enrolled_courses?: number;
  completed_materials?: number;
  average_score?: number;
  completion_rate?: number;
  overall_progress?: number;
  completed_count?: number;
  estimated_remaining?: number;
  is_fully_completed?: boolean;
  continue_learning?: any;
  recent?: any[];
  in_progress?: any[];
  completed?: any[];
  not_started?: any[];
};

export default function Dashboard() {
  const { t } = useTranslation('dashboard');
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: () => fetchApi('/dashboard/stats')
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner className="w-10 h-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-screen-xl mx-auto w-full space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Welcome Hero Card */}
      <div className="bg-gradient-to-r from-primary to-blue-500 dark:from-primary/90 dark:to-primary/70 rounded-3xl p-6 sm:p-8 lg:p-10 text-primary-foreground shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl z-0" />
        <div className="relative z-10 flex-1">
          <p className="text-primary-foreground/80 font-medium mb-1 uppercase tracking-wider text-sm">{t('welcomeBack')}</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {user?.name}
          </h1>
          
          <p className="text-primary-foreground/90 text-base sm:text-lg max-w-xl leading-relaxed mb-8">
            {user?.role === 'admin' && t('adminDesc')}
            {user?.role === 'teacher' && t('teacherDesc')}
            {user?.role === 'student' && t('studentDesc')}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {user?.role === 'admin' && (
              <>
                <Button variant="secondary" className="bg-white text-blue-700 hover:bg-blue-50 shadow-md border-0" onClick={() => navigate('/users')}>{t('manageUsers')}</Button>
                <Button variant="ghost" className="text-white hover:bg-white/20 border border-white/30" onClick={() => navigate('/approvals')}>{t('reviewApprovals')}</Button>
              </>
            )}
            {user?.role === 'teacher' && (
              <>
                <Button variant="secondary" className="bg-white text-blue-700 hover:bg-blue-50 shadow-md border-0" onClick={() => navigate('/courses')}>{t('manageCourses')}</Button>
                <Button variant="ghost" className="text-white hover:bg-white/20 border border-white/30" onClick={() => navigate('/approvals')}>{t('reviewStudents')}</Button>
              </>
            )}
            {user?.role === 'student' && (
              <>
                {stats?.continue_learning ? (
                   <Button variant="secondary" className="bg-white text-blue-700 hover:bg-blue-50 shadow-md border-0" onClick={() => navigate(`/courses/${stats.continue_learning.course_id}/materials/${stats.continue_learning.id}`)}>
                     {t('resumeLearning')}
                   </Button>
                ) : (
                   <Button variant="secondary" className="bg-white text-blue-700 hover:bg-blue-50 shadow-md border-0" onClick={() => navigate('/courses')}>
                     {t('browseCourses')}
                   </Button>
                )}
                <Button variant="ghost" className="text-white hover:bg-white/20 border border-white/30" onClick={() => navigate('/history')}>{t('viewHistory')}</Button>
              </>
            )}
          </div>
        </div>
        <div className="relative z-10 hidden md:block shrink-0 opacity-90 drop-shadow-lg max-w-[35%]">
           {user?.role === 'student' ? (
             <AchievementIllustration size={180} className="text-white ml-auto" />
           ) : (
             <TeacherIllustration size={180} className="text-white ml-auto" />
           )}
        </div>
      </div>

      {/* 2. Quick Actions */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">{t('quickActions')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {user?.role === 'admin' && (
            <>
              <QuickActionCard icon={<Users />} label={t('manageUsers')} to="/users" />
              <QuickActionCard icon={<ShieldCheck />} label={t('reviewApprovals')} to="/approvals" />
              <QuickActionCard icon={<BookOpen />} label={t('manageCourses')} to="/courses" />
            </>
          )}
          {user?.role === 'teacher' && (
            <>
              <QuickActionCard icon={<PlusCircle />} label={t('createCourse')} to="/courses" highlight />
              <QuickActionCard icon={<BookOpen />} label={t('viewCourses')} to="/courses" />
              <QuickActionCard icon={<ShieldCheck />} label={t('reviewStudents')} to="/approvals" />
            </>
          )}
          {user?.role === 'student' && (
            <>
              {stats?.continue_learning ? (
                <QuickActionCard icon={<PlayCircle />} label={t('continueLearning')} to={`/courses/${stats.continue_learning.course_id}/materials/${stats.continue_learning.id}`} highlight />
              ) : (
                <QuickActionCard icon={<Puzzle />} label={t('browseCourses')} to="/courses" highlight />
              )}
              <QuickActionCard icon={<BookOpen />} label={t('myCourses')} to="/courses" />
              <QuickActionCard icon={<Clock />} label={t('viewHistory')} to="/history" />
            </>
          )}
        </div>
      </div>

      {/* 3. Recent Activity (Student) or Overview (Admin/Teacher) */}
      {(user?.role === 'admin' || user?.role === 'teacher') && (
        <>
          <div className="flex items-center justify-between mb-4 mt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">{t('platformOverview')}</h2>
          </div>
          
          {user?.role === 'admin' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <StatCard icon={<GraduationCap className="text-primary" />} label={t('totalTeachers')} value={stats?.total_teachers?.toString() || '0'} context={t('registeredOnPlatform')} />
              <StatCard icon={<Users className="text-indigo-500" />} label={t('totalStudents')} value={stats?.total_students?.toString() || '0'} context={t('activeLearners')} />
              <StatCard icon={<BookOpen className="text-purple-500" />} label={t('totalCourses')} value={stats?.total_courses?.toString() || '0'} context={t('publishedCourses')} />
              <StatCard icon={<FileText className="text-success" />} label={t('totalMaterials')} value={stats?.total_materials?.toString() || '0'} context={t('lessonsPuzzles')} />
            </div>
          )}
          
          {user?.role === 'teacher' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <StatCard icon={<BookOpen className="text-purple-500" />} label={t('activeCourses')} value={stats?.total_courses?.toString() || '0'} context={t('managedByYou')} />
              <StatCard icon={<Users className="text-primary" />} label={t('totalStudents')} value={stats?.total_students?.toString() || '0'} context={t('enrolledInYourCourses')} />
              <StatCard icon={<FileText className="text-success" />} label={t('learningMaterials')} value={stats?.total_materials?.toString() || '0'} context={t('pdfsAndDocuments')} />
              <StatCard icon={<Puzzle className="text-warning" />} label={t('crosswords')} value={stats?.total_materials?.toString() || '0'} context={t('interactivePuzzles')} />
            </div>
          )}

          {/* 4. Performance Statistics */}
          <div className="mt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">{t('performanceInsights')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <Card className="border-border overflow-hidden relative shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5 sm:p-6 relative z-10 flex flex-col justify-center h-full">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg text-primary flex items-center justify-center mb-4 shrink-0">
                    <Trophy size={20} className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{t('averageStudentScore')}</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-4xl sm:text-5xl font-bold text-foreground">{stats?.average_score}</h3>
                      <span className="text-base sm:text-lg font-semibold text-muted-foreground">/ 100</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{t('acrossAllActiveMaterials')}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border overflow-hidden relative shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5 sm:p-6 relative z-10 flex flex-col justify-center h-full">
                  <div className="w-10 h-10 bg-success/10 rounded-lg text-success flex items-center justify-center mb-4 shrink-0">
                    <TrendingUp size={20} className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{t('completionRate')}</p>
                    <h3 className="text-4xl sm:text-5xl font-bold text-foreground">{stats?.completion_rate}%</h3>
                    <div className="w-full bg-muted h-2 mt-3 rounded-full overflow-hidden">
                      <div className="bg-success h-full rounded-full transition-all duration-1000" style={{ width: `${stats?.completion_rate || 0}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{t('studentsWhoFinished')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* Student: Recent Activity & Progress */}
      {user?.role === 'student' && (
        <>
          <div className="mt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">{t('yourProgress')}</h2>
            {stats?.is_fully_completed && stats?.total_materials! > 0 && (
              <div className="bg-success/10 border border-success/20 text-success p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 mb-5">
                <Trophy size={48} className="text-success shrink-0 w-10 h-10 sm:w-12 sm:h-12" />
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">{t('congratulations')}</h2>
                  <p className="text-success/80 text-sm mt-1">{t('completedAllMaterials')}</p>
                </div>
              </div>
            )}

            <Card className="border-border overflow-hidden relative shadow-sm">
              <CardContent className="p-5 sm:p-6 relative z-10 flex flex-col justify-center h-full">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl text-primary flex items-center justify-center mb-4">
                  <Target size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{t('overallCompletion')}</p>
                  <h3 className="text-4xl sm:text-5xl font-bold text-primary mb-3">{stats?.overall_progress}%</h3>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden shadow-inner">
                    <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${stats?.overall_progress || 0}%` }} />
                  </div>
                  <div className="flex gap-6 mt-4 border-t border-border pt-4">
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">{t('completed')}</span>
                      <span className="font-bold text-foreground text-lg">{stats?.completed_count}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">{t('remaining')}</span>
                      <span className="font-bold text-foreground text-lg">{stats?.estimated_remaining}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mt-8">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <PlayCircle className="text-warning" size={20}/> {t('inProgress')}
              </h3>
              {stats?.in_progress && stats.in_progress.length > 0 ? (
                <div className="space-y-3">
                  {stats.in_progress.map((m: any) => (
                    <MaterialListCard key={m.id} material={m} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic text-sm p-4 bg-muted/30 rounded-xl border border-border border-dashed text-center">{t('noMaterialsInProgress')}</p>
              )}
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <FileText className="text-muted-foreground" size={20}/> {t('notStarted')}
              </h3>
              {stats?.not_started && stats.not_started.length > 0 ? (
                <div className="space-y-3">
                  {stats.not_started.map((m: any) => (
                    <MaterialListCard key={m.id} material={m} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic text-sm p-4 bg-muted/30 rounded-xl border border-border border-dashed text-center">{t('noNewMaterialsWaiting')}</p>
              )}
            </div>
            
            <div className="md:col-span-2 mt-4">
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="text-success" size={20}/> {t('recentlyCompleted')}
              </h3>
              {stats?.completed && stats.completed.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {stats.completed.map((m: any) => (
                    <MaterialListCard key={m.id} material={m} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic text-sm p-4 bg-muted/30 rounded-xl border border-border border-dashed text-center">{t('noMaterialsCompletedYet')}</p>
              )}
            </div>
          </div>
        </>
      )}

    </div>
  );
}

function StatCard({ icon, label, value, context }: { icon: React.ReactNode, label: string, value: string, context?: string }) {
  return (
    <Card hoverable className="border-border shadow-sm hover:-translate-y-1 transition-all duration-200 group">
      <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors mb-3">
          <div className="w-5 h-5 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
            {icon}
          </div>
        </div>
        <div>
          <p className="text-xs sm:text-sm font-medium text-muted-foreground line-clamp-1 mb-1">{label}</p>
          <h4 className="text-2xl lg:text-3xl font-bold text-foreground truncate">{value}</h4>
          {context && <p className="text-xs text-muted-foreground mt-1 opacity-80">{context}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

function QuickActionCard({ icon, label, to, highlight = false }: { icon: React.ReactNode, label: string, to: string, highlight?: boolean }) {
  return (
    <Link to={to} className="block h-full">
      <Card hoverable className={`h-full border-border shadow-sm hover:-translate-y-1 transition-all duration-200 group flex flex-col items-center justify-center text-center p-4 sm:p-5 ${highlight ? 'bg-primary/5 border-primary/20 hover:border-primary/40 hover:bg-primary/10' : 'bg-card'}`}>
        <div className={`p-3 rounded-2xl mb-3 transition-colors ${highlight ? 'bg-primary text-primary-foreground shadow-md group-hover:scale-110' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-110'}`}>
          {icon}
        </div>
        <span className={`text-sm font-semibold ${highlight ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>{label}</span>
      </Card>
    </Link>
  )
}

function MaterialListCard({ material }: { material: any }) {
  return (
    <Link to={`/courses/${material.course_id}/materials/${material.id}`} className="block">
      <div className="flex items-center justify-between p-3 sm:p-4 bg-card border border-border rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all group">
        <div className="min-w-0 flex-1 mr-4">
          <h4 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">{material.title}</h4>
          <p className="text-xs text-muted-foreground mt-1 truncate">{material.course?.name}</p>
        </div>
        <div className="p-2 bg-muted rounded-full group-hover:bg-primary/10 transition-colors shrink-0">
          <ArrowRight className="text-muted-foreground/50 group-hover:text-primary transition-colors w-4 h-4" />
        </div>
      </div>
    </Link>
  )
}
