import { Routes, Route } from "react-router-dom"
import { AppProviders } from "./components/providers/AppProviders"
import { GuestLayout } from "./components/layout/GuestLayout"
import { AuthenticatedLayout } from "./components/layout/AuthenticatedLayout"
import Login from "./routes/Login"
import Register from "./routes/Register"
import Dashboard from "./routes/Dashboard"
import CourseDetail from "./routes/CourseDetail"
import LearnPortal from "./routes/LearnPortal"

import Approvals from "./routes/Approvals"
import Courses from "./routes/Courses"
import Users from "./routes/Users"

function App() {
  return (
    <AppProviders>
      <Routes>
        {/* Guest auth routes */}
        <Route element={<GuestLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Authenticated dashboard routes */}
        <Route element={<AuthenticatedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/users" element={<Users />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/courses/:courseId/materials/:id" element={<LearnPortal />} />
        </Route>
      </Routes>
    </AppProviders>
  )
}

export default App
