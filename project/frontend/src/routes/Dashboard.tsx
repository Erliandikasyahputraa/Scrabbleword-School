import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../providers/AuthProvider';
import { fetchApi } from '../lib/api';
import { Users, BookOpen, FileText, Puzzle, Trophy, Target, Flame, Percent, GraduationCap, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

type DashboardStats = {
  total_courses?: number;
  total_students?: number;
  total_teachers?: number;
  total_materials?: number;
  enrolled_courses?: number;
  completed_materials?: number;
  average_score: number;
  completion_rate: number;
};

export default function Dashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: () => fetchApi('/dashboard/stats')
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
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

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Overview & Statistics
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
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

          {user?.role === 'student' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard icon={<Target className="text-blue-500" />} label="Enrolled Courses" value={stats?.enrolled_courses?.toString() || '0'} />
              <StatCard icon={<CheckCircle className="text-emerald-500" />} label="Completed Materials" value={stats?.completed_materials?.toString() || '0'} />
              <StatCard icon={<Flame className="text-orange-500" />} label="Learning Streak" value="5 Days" />
            </div>
          )}

          {/* Advanced Analytics Row */}
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
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-4 flex items-center gap-1 font-medium">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" /> Based on all completed crosswords
                </p>
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
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${stats?.completion_rate || 0}%` }}
                  />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 font-medium">
                  {user?.role === 'student' ? 'Percentage of materials you have completed.' : 'Percentage of students who completed materials.'}
                </p>
              </CardContent>
            </Card>
          </div>
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
