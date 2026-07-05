import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../../lib/api';
import { X, UserPlus, UserMinus, Search } from 'lucide-react';
import { Button } from './Button';

interface StudentAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
}

type Student = {
  id: number;
  name: string;
  email: string;
  is_enrolled: boolean;
};

export function StudentAssignmentModal({ isOpen, onClose, courseId }: StudentAssignmentModalProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: students = [], isLoading } = useQuery<Student[]>({
    queryKey: ['course-enrollments', courseId],
    queryFn: () => fetchApi(`/courses/${courseId}/enrollments`),
    enabled: isOpen
  });

  const toggleEnrollmentMutation = useMutation({
    mutationFn: ({ studentId, isEnrolled }: { studentId: number, isEnrolled: boolean }) => 
      fetchApi(`/courses/${courseId}/enrollments`, {
        method: 'POST',
        body: JSON.stringify({ student_id: studentId, is_enrolled: isEnrolled })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-enrollments', courseId] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] }); // Refresh course student count if used
    }
  });

  if (!isOpen) return null;

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Assign Students</h2>
        <p className="text-slate-500 mb-6">Manage which students have access to this course.</p>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar border border-slate-100 dark:border-slate-800 rounded-xl">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No students found.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredStudents.map(student => (
                <div key={student.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{student.name}</p>
                    <p className="text-sm text-slate-500">{student.email}</p>
                  </div>
                  <Button
                    variant={student.is_enrolled ? "outline" : "primary"}
                    size="sm"
                    className={`gap-2 ${student.is_enrolled ? "text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:hover:bg-red-900/20" : ""}`}
                    onClick={() => toggleEnrollmentMutation.mutate({ studentId: student.id, isEnrolled: !student.is_enrolled })}
                    disabled={toggleEnrollmentMutation.isPending}
                  >
                    {student.is_enrolled ? (
                      <><UserMinus size={16} /> Unenroll</>
                    ) : (
                      <><UserPlus size={16} /> Enroll</>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
