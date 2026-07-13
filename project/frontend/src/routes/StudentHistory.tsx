import { useState, useEffect } from "react"
import { fetchApi } from "../lib/api"
import { useAuth } from '../providers/AuthProvider';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import toast from "react-hot-toast"

interface Submission {
  id: number
  material_id: number
  material: {
    id: number
    title: string
    course_id: number
    course: {
      id: number
      name: string
    }
  }
  started_at: string | null
  reading_finished_at: string | null
  submitted_at: string | null
  correct_answers: number
  wrong_answers: number
  score: number
  status: string
  time_spent_seconds: number
}

interface PaginatedResponse {
  current_page: number
  data: Submission[]
  last_page: number
  total: number
}

export default function StudentHistory() {
  const { user } = useAuth()
  const [data, setData] = useState<PaginatedResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState("newest")
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (user?.role !== "student") return
    loadHistory()
  }, [sort, page, user])

  const loadHistory = async () => {
    setLoading(true)
    try {
      const res = await fetchApi(`/submissions/history?sort=${sort}&page=${page}`)
      setData(res)
    } catch (err: any) {
      toast.error(err.message || "Failed to load history")
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    if (seconds === 0) return "-"
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}m ${s}s`
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleString()
  }

  if (user?.role !== "student") {
    return (
      <div className="flex justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-foreground">Access Denied</h2>
          <p className="text-muted-foreground">This page is only available to students.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-screen-xl mx-auto w-full space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Learning History</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Review your completed courses and activities.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-sm font-medium text-muted-foreground shrink-0">Sort by:</span>
          <Select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value)
              setPage(1)
            }}
            className="h-10 w-full sm:w-auto min-w-[140px]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest_score">Highest Score</option>
            <option value="lowest_score">Lowest Score</option>
            <option value="course">Course Name</option>
          </Select>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course & Material</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Reading Finished</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-center">Correct/Wrong</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Time Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Loading data...</TableCell></TableRow>
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <p className="text-lg font-medium text-foreground">No history found</p>
                    <p className="text-sm text-muted-foreground">You haven't interacted with any materials yet.</p>
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <div className="font-semibold text-foreground whitespace-nowrap">{sub.material?.course?.name || "Unknown Course"}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 whitespace-nowrap">{sub.material?.title || "Unknown Material"}</div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(sub.started_at)}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(sub.reading_finished_at)}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(sub.submitted_at)}</TableCell>
                    <TableCell className="text-center whitespace-nowrap">
                      <span className="text-success font-medium">{sub.correct_answers}</span>
                      <span className="text-muted-foreground mx-1">/</span>
                      <span className="text-destructive font-medium">{sub.wrong_answers}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={
                        sub.score >= 80 ? 'success' :
                        sub.score >= 50 ? 'warning' :
                        'danger'
                      }>
                        {sub.score}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        sub.status === 'COMPLETED' ? 'success' :
                        sub.status === 'READY_FOR_CROSSWORD' ? 'default' :
                        'danger'
                      } className="whitespace-nowrap">
                        {sub.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium whitespace-nowrap">
                      {formatTime(sub.time_spent_seconds)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {data && data.last_page > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-border gap-4">
            <span className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{(data.current_page - 1) * 10 + 1}</span> to <span className="font-semibold text-foreground">{Math.min(data.current_page * 10, data.total)}</span> of <span className="font-semibold text-foreground">{data.total}</span> Entries
            </span>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="secondary"
                className="w-full sm:w-auto"
                disabled={data.current_page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                className="w-full sm:w-auto"
                disabled={data.current_page === data.last_page}
                onClick={() => setPage((p) => Math.min(data.last_page, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
