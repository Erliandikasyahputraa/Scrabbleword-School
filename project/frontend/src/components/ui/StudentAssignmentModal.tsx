import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../../lib/api';
import { X, UserPlus, UserMinus, Search } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

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
      <div className="bg-card rounded-3xl p-6 sm:p-8 w-full max-w-[calc(100vw-2rem)] sm:max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 pr-8">Assign Students</h2>
        <p className="text-sm text-muted-foreground mb-6">Manage which students have access to this course.</p>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            type="text"
            placeholder="Search students by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar border border-border rounded-xl">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No students found.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredStudents.map(student => (
                <div key={student.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground truncate">{student.name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{student.email}</p>
                  </div>
                  <Button
                    variant={student.is_enrolled ? "outline" : "primary"}
                    size="sm"
                    className={`gap-2 shrink-0 ${student.is_enrolled ? "text-destructive border-destructive hover:bg-destructive/10" : ""}`}
                    onClick={() => toggleEnrollmentMutation.mutate({ studentId: student.id, isEnrolled: !student.is_enrolled })}
                    disabled={toggleEnrollmentMutation.isPending}
                  >
                    {student.is_enrolled ? (
                      <><UserMinus size={16} /> <span className="hidden sm:inline">Unenroll</span></>
                    ) : (
                      <><UserPlus size={16} /> <span className="hidden sm:inline">Enroll</span></>
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
