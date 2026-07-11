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
    <Card hoverable className="group border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-primary rounded-xl group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <BookOpen size={24} />
            </div>
            <div>
              <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{title}</CardTitle>
              {teacherName && (
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 text-[10px] font-bold text-slate-600">
                    {teacherAvatarInitial}
                  </span>
                  Created by {teacherName}
                </p>
              )}
            </div>
          </div>
        </div>
        <CardDescription className="text-slate-600 dark:text-slate-400 line-clamp-2 mt-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {progress !== undefined && (
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Your Progress</span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full transition-all duration-1000" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>
        )}
        {completionRate !== undefined && (
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Class Completion Rate</span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{completionRate}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-1000" 
                style={{ width: `${completionRate}%` }} 
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800/50 mt-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {materialCount} Material{materialCount !== 1 ? 's' : ''}
          </span>
          {studentCount !== undefined && (
            <span className="text-xs text-slate-400">
              {studentCount} Student{studentCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <Link 
          to={`/courses/${id}`} 
          className="text-sm font-semibold text-primary flex items-center gap-1 group/link hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
        >
          View Details 
          <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </CardFooter>
    </Card>
  )
}
