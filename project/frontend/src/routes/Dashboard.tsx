import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../providers/AuthProvider';
import { fetchApi } from '../lib/api';
import { Users, BookOpen, FileText, Puzzle, Trophy, Target, Percent, GraduationCap, CheckCircle, ArrowRight, PlayCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Link } from 'react-router-dom';

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
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-900 dark:to-blue-700 rounded-3xl p-10 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-blue-100 text-lg max-w-xl">
            {user?.role === 'admin' && 'Here is the global platform overview.'}
            {user?.role === 'teacher' && 'Here is your overall teaching performance and statistics.'}
            {user?.role === 'student' && 'Ready to master new vocabularies today? Here is your progress.'}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Admin / Teacher UI unchanged for stats */}
          {(user?.role === 'admin' || user?.role === 'teacher') && (
            <>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Overview & Statistics</h2>
              </div>
              
              {user?.role === 'admin' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard icon={<GraduationCap className="text-blue-500" />} label="Total Teachers" value={stats?.total_teachers?.toString() || '0'} />
                  <StatCard icon={<Users className="text-indigo-500" />} label="Total Students" value={stats?.total_students?.toString() || '0'} />
                  <StatCard icon={<BookOpen className="text-purple-500" />} label="Total Courses" value={stats?.total_courses?.toString() || '0'} />
                  <StatCard icon={<FileText className="text-emerald-500" />} label="Total Materials" value={stats?.total_materials?.toString() || '0'} />
                </div>
              )}
              
              {user?.role === 'teacher' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard icon={<BookOpen className="text-purple-500" />} label="Active Courses" value={stats?.total_courses?.toString() || '0'} />
                  <StatCard icon={<Users className="text-blue-500" />} label="Total Students" value={stats?.total_students?.toString() || '0'} />
                  <StatCard icon={<FileText className="text-emerald-500" />} label="Learning Materials" value={stats?.total_materials?.toString() || '0'} />
                  <StatCard icon={<Puzzle className="text-orange-500" />} label="Crosswords" value={stats?.total_materials?.toString() || '0'} />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Card className="border-slate-100 dark:border-slate-800 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Trophy size={120} />
                  </div>
                  <CardContent className="p-8 relative z-10">
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Average Student Score</p>
                    <div className="flex items-end gap-3">
                      <h3 className="text-5xl font-bold text-slate-900 dark:text-white">{stats?.average_score}</h3>
                      <span className="text-lg font-semibold text-slate-400 mb-1">/ 100</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-100 dark:border-slate-800 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Percent size={120} />
                  </div>
                  <CardContent className="p-8 relative z-10">
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Completion Rate</p>
                    <div className="flex items-end gap-3">
                      <h3 className="text-5xl font-bold text-slate-900 dark:text-white">{stats?.completion_rate}%</h3>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 mt-4 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${stats?.completion_rate || 0}%` }} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Student Specific UI */}
          {user?.role === 'student' && (
            <div className="space-y-8">
              {stats?.is_fully_completed && stats?.total_materials! > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl flex items-center gap-4">
                  <Trophy size={48} className="text-emerald-500" />
                  <div>
                    <h2 className="text-2xl font-bold">Congratulations!</h2>
                    <p>You have successfully completed all your enrolled materials. Keep up the excellent work!</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 border-slate-100 dark:border-slate-800 overflow-hidden relative shadow-md">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Target size={180} />
                  </div>
                  <CardContent className="p-8 relative z-10 flex flex-col justify-center h-full">
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Overall Learning Progress</p>
                    <div className="flex items-end gap-3 mb-6">
                      <h3 className="text-6xl font-extrabold text-blue-600 dark:text-blue-400">{stats?.overall_progress}%</h3>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden shadow-inner">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all duration-1000" style={{ width: `${stats?.overall_progress || 0}%` }} />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 font-medium flex gap-4">
                      <span><span className="font-bold text-slate-700">{stats?.completed_count}</span> Completed</span>
                      <span><span className="font-bold text-slate-700">{stats?.estimated_remaining}</span> Remaining</span>
                    </p>
                  </CardContent>
                </Card>
                
                {stats?.continue_learning ? (
                  <Card className="bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-lg border-0 flex flex-col justify-between">
                    <CardContent className="p-8 h-full flex flex-col">
                      <h3 className="text-indigo-100 font-medium mb-1">Continue Learning</h3>
                      <h4 className="text-2xl font-bold mb-1 leading-tight">{stats.continue_learning.course?.name}</h4>
                      <p className="text-indigo-200 text-sm mb-6 truncate">{stats.continue_learning.title}</p>
                      
                      <div className="mt-auto">
                        <Link to={`/courses/${stats.continue_learning.course_id}/materials/${stats.continue_learning.id}`} className="bg-white text-indigo-600 hover:bg-indigo-50 w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                          <PlayCircle size={20} /> Resume Now
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-slate-100 shadow-sm flex flex-col justify-center items-center text-center p-8 bg-slate-50">
                    <CheckCircle size={48} className="text-emerald-400 mb-4" />
                    <h3 className="text-xl font-bold text-slate-800">All Caught Up!</h3>
                    <p className="text-slate-500 mt-2 text-sm">You have no pending materials to continue right now.</p>
                  </Card>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Lists Section */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <PlayCircle className="text-blue-500" size={20}/> In Progress
                  </h3>
                  {stats?.in_progress && stats.in_progress.length > 0 ? (
                    <div className="space-y-3">
                      {stats.in_progress.map((m: any) => (
                        <MaterialListCard key={m.id} material={m} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic text-sm">No materials currently in progress.</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText className="text-gray-500" size={20}/> Not Started
                  </h3>
                  {stats?.not_started && stats.not_started.length > 0 ? (
                    <div className="space-y-3">
                      {stats.not_started.map((m: any) => (
                        <MaterialListCard key={m.id} material={m} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic text-sm">No new materials waiting.</p>
                  )}
                </div>
                
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="text-emerald-500" size={20}/> Recently Completed
                  </h3>
                  {stats?.completed && stats.completed.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {stats.completed.map((m: any) => (
                        <MaterialListCard key={m.id} material={m} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic text-sm">You haven't completed any materials yet.</p>
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
    <Card hoverable className="border-slate-100 dark:border-slate-800">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h4>
        </div>
      </CardContent>
    </Card>
  )
}

function MaterialListCard({ material }: { material: any }) {
  return (
    <Link to={`/courses/${material.course_id}/materials/${material.id}`}>
      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow group">
        <div>
          <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{material.title}</h4>
          <p className="text-xs text-gray-500 mt-1">{material.course?.name}</p>
        </div>
        <ArrowRight className="text-gray-300 group-hover:text-blue-500 transition-colors" size={20} />
      </div>
    </Link>
  )
}
