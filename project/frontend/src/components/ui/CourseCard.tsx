import { Link } from "react-router-dom"
import { BookOpen } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "./Card"

interface CourseCardProps {
  id: number
  title: string
  description: string
  materialCount: number
  progress?: number
  completionRate?: number
  studentCount?: number
  teacherName?: string
  teacherAvatarInitial?: string
}

export function CourseCard({ id, title, description, materialCount, progress, completionRate, studentCount, teacherName, teacherAvatarInitial }: CourseCardProps) {
  return (
    <Card hoverable className="group border-border bg-card transition-all duration-200 flex flex-col h-full hover:-translate-y-1 hover:shadow-lg shadow-sm">
      <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4 flex-none">
        <div className="flex items-start justify-between mb-2 gap-2">
          <div className="flex items-start gap-3 w-full">
            <div className="p-2 sm:p-2.5 bg-primary/10 text-primary rounded-xl group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200 shrink-0 shadow-sm">
              <BookOpen size={20} strokeWidth={2} className="sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{title}</CardTitle>
              {teacherName && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-[10px] font-bold text-primary shrink-0">
                    {teacherAvatarInitial}
                  </span>
                  <span className="truncate">{teacherName}</span>
                </p>
              )}
            </div>
          </div>
        </div>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2 mt-2 sm:mt-3">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-5 pt-0 sm:pt-0 flex-1">
        {progress !== undefined && (
          <div className="mt-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Progress</span>
              <span className="text-xs font-bold text-primary">{progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-1000" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>
        )}
        {completionRate !== undefined && (
          <div className="mt-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Completion</span>
              <span className="text-xs font-bold text-success">{completionRate}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-success h-full rounded-full transition-all duration-1000" 
                style={{ width: `${completionRate}%` }} 
              />
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 sm:p-5 flex flex-wrap justify-between items-center gap-3 border-t border-border/50 mt-auto bg-muted/10">
        <div className="flex items-center gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-foreground truncate">
              {materialCount} Material{materialCount !== 1 ? 's' : ''}
            </span>
            {studentCount !== undefined && (
              <span className="text-[11px] text-muted-foreground truncate mt-0.5">
                {studentCount} Student{studentCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        <Link 
          to={`/courses/${id}`} 
          className="text-xs font-bold text-primary flex items-center gap-1 hover:text-primary/80 transition-colors whitespace-nowrap ml-auto bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg"
        >
          View Course
        </Link>
      </CardFooter>
    </Card>
  )
}
