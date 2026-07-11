import { Link } from "react-router-dom"
import { BookOpen, ArrowRight } from "lucide-react"
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
    <Card hoverable className="group border-border bg-card transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <BookOpen size={24} />
            </div>
            <div>
              <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{title}</CardTitle>
              {teacherName && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                    {teacherAvatarInitial}
                  </span>
                  Created by {teacherName}
                </p>
              )}
            </div>
          </div>
        </div>
        <CardDescription className="text-muted-foreground line-clamp-2 mt-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {progress !== undefined && (
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-muted-foreground">Your Progress</span>
              <span className="text-xs font-bold text-foreground">{progress}%</span>
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
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-muted-foreground">Class Completion Rate</span>
              <span className="text-xs font-bold text-foreground">{completionRate}%</span>
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
      <CardFooter className="flex justify-between items-center pt-2 border-t border-border/50 mt-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-muted-foreground">
            {materialCount} Material{materialCount !== 1 ? 's' : ''}
          </span>
          {studentCount !== undefined && (
            <span className="text-xs text-muted-foreground/70">
              {studentCount} Student{studentCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <Link 
          to={`/courses/${id}`} 
          className="text-sm font-semibold text-primary flex items-center gap-1 group/link hover:text-primary/80 transition-colors"
        >
          View Details 
          <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </CardFooter>
    </Card>
  )
}
