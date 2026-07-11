import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../providers/AuthProvider';
import { fetchApi } from '../lib/api';
import { Users, BookOpen, FileText, Puzzle, Trophy, Target, Percent, GraduationCap, CheckCircle, ArrowRight, PlayCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Link } from 'react-router-dom';
import { Spinner } from '../components/ui/LoadingSystem';
import { TeacherIllustration, AchievementIllustration } from '../components/ui/Illustrations';

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
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: () => fetchApi('/dashboard/stats')
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-blue-500 dark:from-primary/90 dark:to-primary/70 rounded-3xl p-6 sm:p-8 lg:p-10 text-primary-foreground shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl z-0" />
        <div className="relative z-10 flex-1">
          <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold tracking-tight mb-3">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-primary-foreground/90 text-base sm:text-lg max-w-xl leading-relaxed">
            {user?.role === 'admin' && 'Here is the global platform overview. Monitor courses, users, and overall activity.'}
            {user?.role === 'teacher' && 'Here is your overall teaching performance and statistics. Ready to build new puzzles?'}
            {user?.role === 'student' && 'Ready to master new vocabularies today? Here is your learning progress.'}
          </p>
        </div>
        <div className="relative z-10 hidden sm:block shrink-0 opacity-90 drop-shadow-lg">
           {user?.role === 'student' ? (
             <AchievementIllustration size={160} className="text-white" />
           ) : (
             <TeacherIllustration size={160} className="text-white" />
           )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Spinner className="w-10 h-10 text-primary" />
        </div>
      ) : (
        <div className="space-y-5 sm:space-y-6">
          
          {/* Admin / Teacher UI */}
          {(user?.role === 'admin' || user?.role === 'teacher') && (
            <>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Overview & Statistics</h2>
              </div>
              
              {user?.role === 'admin' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <StatCard icon={<GraduationCap className="text-primary" />} label="Total Teachers" value={stats?.total_teachers?.toString() || '0'} />
                  <StatCard icon={<Users className="text-indigo-500" />} label="Total Students" value={stats?.total_students?.toString() || '0'} />
                  <StatCard icon={<BookOpen className="text-purple-500" />} label="Total Courses" value={stats?.total_courses?.toString() || '0'} />
                  <StatCard icon={<FileText className="text-success" />} label="Total Materials" value={stats?.total_materials?.toString() || '0'} />
                </div>
              )}
              
              {user?.role === 'teacher' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <StatCard icon={<BookOpen className="text-purple-500" />} label="Active Courses" value={stats?.total_courses?.toString() || '0'} />
                  <StatCard icon={<Users className="text-primary" />} label="Total Students" value={stats?.total_students?.toString() || '0'} />
                  <StatCard icon={<FileText className="text-success" />} label="Learning Materials" value={stats?.total_materials?.toString() || '0'} />
                  <StatCard icon={<Puzzle className="text-warning" />} label="Crosswords" value={stats?.total_materials?.toString() || '0'} />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-4 border-t border-border">
                <Card className="border-border overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 sm:p-5 opacity-5 flex items-center justify-center">
                    <Trophy className="w-[72px] h-[72px] sm:w-[96px] sm:h-[96px] lg:w-[120px] lg:h-[120px]" />
                  </div>
                  <CardContent className="p-5 sm:p-6 relative z-10">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Average Student Score</p>
                    <div className="flex items-end gap-2 sm:gap-3">
                      <h3 className="text-4xl sm:text-5xl font-bold text-foreground">{stats?.average_score}</h3>
                      <span className="text-base sm:text-lg font-semibold text-muted-foreground mb-1">/ 100</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 sm:p-5 opacity-5 flex items-center justify-center">
                    <Percent className="w-[72px] h-[72px] sm:w-[96px] sm:h-[96px] lg:w-[120px] lg:h-[120px]" />
                  </div>
                  <CardContent className="p-5 sm:p-6 relative z-10">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Completion Rate</p>
                    <div className="flex items-end gap-2 sm:gap-3">
                      <h3 className="text-4xl sm:text-5xl font-bold text-foreground">{stats?.completion_rate}%</h3>
                    </div>
                    <div className="w-full bg-muted h-2 mt-4 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${stats?.completion_rate || 0}%` }} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Student Specific UI */}
          {user?.role === 'student' && (
            <div className="space-y-5 sm:space-y-6">
              {stats?.is_fully_completed && stats?.total_materials! > 0 && (
                <div className="bg-success/10 border border-success/20 text-success p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
                  <Trophy size={48} className="text-success shrink-0 w-10 h-10 sm:w-12 sm:h-12" />
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">Congratulations!</h2>
                    <p className="text-foreground text-sm sm:text-base mt-1">You have successfully completed all your enrolled materials. Keep up the excellent work!</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                <Card className="md:col-span-2 border-border overflow-hidden relative shadow-md">
                  <div className="absolute top-0 right-0 p-4 sm:p-5 opacity-5 flex items-center justify-center">
                    <Target className="w-[72px] h-[72px] sm:w-[96px] sm:h-[96px] lg:w-[120px] lg:h-[120px]" />
                  </div>
                  <CardContent className="p-5 sm:p-6 relative z-10 flex flex-col justify-center h-full">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Overall Learning Progress</p>
                    <div className="flex items-end gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <h3 className="text-5xl sm:text-6xl font-extrabold text-primary">{stats?.overall_progress}%</h3>
                    </div>
                    <div className="w-full bg-muted h-3 sm:h-4 rounded-full overflow-hidden shadow-inner">
                      <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${stats?.overall_progress || 0}%` }} />
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-4 font-medium flex gap-4">
                      <span><span className="font-bold text-foreground">{stats?.completed_count}</span> Completed</span>
                      <span><span className="font-bold text-foreground">{stats?.estimated_remaining}</span> Remaining</span>
                    </p>
                  </CardContent>
                </Card>
                
                {stats?.continue_learning ? (
                  <Card className="bg-primary text-primary-foreground shadow-lg border-0 flex flex-col justify-between">
                    <CardContent className="p-5 sm:p-6 h-full flex flex-col">
                      <h3 className="text-primary-foreground/80 font-medium text-sm sm:text-base mb-1">Continue Learning</h3>
                      <h4 className="text-xl sm:text-2xl font-bold mb-1 leading-tight">{stats.continue_learning.course?.name}</h4>
                      <p className="text-primary-foreground/90 text-xs sm:text-sm mb-6 truncate">{stats.continue_learning.title}</p>
                      
                      <div className="mt-auto">
                        <Link to={`/courses/${stats.continue_learning.course_id}/materials/${stats.continue_learning.id}`} className="bg-background text-primary hover:bg-background/90 w-full py-2 sm:py-2.5 px-4 rounded-xl text-sm sm:text-base font-bold flex items-center justify-center gap-2 transition-colors">
                          <PlayCircle size={20} /> Resume Now
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-border shadow-sm flex flex-col justify-center items-center text-center p-5 sm:p-6 bg-muted/50">
                    <CheckCircle size={48} className="text-success mb-4 w-10 h-10 sm:w-12 sm:h-12" />
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">All Caught Up!</h3>
                    <p className="text-muted-foreground mt-2 text-xs sm:text-sm">You have no pending materials to continue right now.</p>
                  </Card>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {/* Lists Section */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <PlayCircle className="text-primary" size={20}/> In Progress
                  </h3>
                  {stats?.in_progress && stats.in_progress.length > 0 ? (
                    <div className="space-y-3">
                      {stats.in_progress.map((m: any) => (
                        <MaterialListCard key={m.id} material={m} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic text-xs sm:text-sm">No materials currently in progress.</p>
                  )}
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="text-muted-foreground" size={20}/> Not Started
                  </h3>
                  {stats?.not_started && stats.not_started.length > 0 ? (
                    <div className="space-y-3">
                      {stats.not_started.map((m: any) => (
                        <MaterialListCard key={m.id} material={m} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic text-xs sm:text-sm">No new materials waiting.</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <CheckCircle className="text-success" size={20}/> Recently Completed
                  </h3>
                  {stats?.completed && stats.completed.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {stats.completed.map((m: any) => (
                        <MaterialListCard key={m.id} material={m} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic text-xs sm:text-sm">You haven't completed any materials yet.</p>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <Card hoverable className="border-border">
      <CardContent className="p-4 lg:p-5 flex items-center gap-3 lg:gap-4">
        <div className="p-2 lg:p-3 bg-muted rounded-2xl flex items-center justify-center shrink-0">
          <div className="w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
            {icon}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{label}</p>
          <h4 className="text-2xl lg:text-3xl font-bold text-foreground mt-0.5 truncate">{value}</h4>
        </div>
      </CardContent>
    </Card>
  )
}

function MaterialListCard({ material }: { material: any }) {
  return (
    <Link to={`/courses/${material.course_id}/materials/${material.id}`} className="block">
      <div className="flex items-center justify-between p-3 sm:p-4 bg-card border border-border rounded-xl hover:shadow-md transition-shadow group">
        <div className="min-w-0 flex-1 mr-4">
          <h4 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">{material.title}</h4>
          <p className="text-xs text-muted-foreground mt-1 truncate">{material.course?.name}</p>
        </div>
        <ArrowRight className="text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
      </div>
    </Link>
  )
}
