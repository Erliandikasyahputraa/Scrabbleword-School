import { useState, useEffect } from "react"
import { fetchApi } from "../lib/api"
import { useAuth } from '../providers/AuthProvider';
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
      <div className="p-8 text-center text-gray-500 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Access Denied</h2>
        <p>This page is only available to students.</p>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Learning History</h1>
            <p className="text-gray-500 mt-1">Review your completed courses and activities.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value)
                setPage(1)
              }}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest_score">Highest Score</option>
              <option value="lowest_score">Lowest Score</option>
              <option value="course">Course Name</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Course & Material</th>
                  <th className="px-6 py-4 font-semibold">Started</th>
                  <th className="px-6 py-4 font-semibold">Reading Finished</th>
                  <th className="px-6 py-4 font-semibold">Submitted</th>
                  <th className="px-6 py-4 text-center font-semibold">Correct/Wrong</th>
                  <th className="px-6 py-4 text-center font-semibold">Score</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-right font-semibold">Time Spent</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-100 animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2 ml-auto"></div></td>
                    </tr>
                  ))
                ) : data?.data.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        <p className="text-lg font-medium">No history found</p>
                        <p className="text-sm">You haven't interacted with any materials yet.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data?.data.map((sub) => (
                    <tr key={sub.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{sub.material?.course?.name || "Unknown Course"}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{sub.material?.title || "Unknown Material"}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatDate(sub.started_at)}</td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatDate(sub.reading_finished_at)}</td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatDate(sub.submitted_at)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-green-600 font-medium">{sub.correct_answers}</span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className="text-red-500 font-medium">{sub.wrong_answers}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded-full ${
                          sub.score >= 80 ? 'bg-green-100 text-green-800' :
                          sub.score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {sub.score}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          sub.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          sub.status === 'READY_FOR_CROSSWORD' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {sub.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-700 whitespace-nowrap">
                        {formatTime(sub.time_spent_seconds)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.last_page > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
              <span className="text-sm text-gray-700">
                Showing <span className="font-semibold">{(data.current_page - 1) * 10 + 1}</span> to <span className="font-semibold">{Math.min(data.current_page * 10, data.total)}</span> of <span className="font-semibold">{data.total}</span> Entries
              </span>
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  disabled={data.current_page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  disabled={data.current_page === data.last_page}
                  onClick={() => setPage((p) => Math.min(data.last_page, p + 1))}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-t border-b border-r border-gray-300 rounded-r-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
