import { createBrowserRouter } from "react-router"
import RootLayout from "@/layouts/RootLayout"
import HomePage from "@/pages/HomePage"
import TutorPage from "@/pages/TutorPage"
import CoursesPage from "@/pages/CoursesPage"
import EvaluationsPage from "@/pages/EvaluationsPage"
import RevisionsPage from "@/pages/RevisionsPage"
import SchedulePage from "@/pages/SchedulePage"
import RewardsPage from "@/pages/RewardsPage"
import NotFoundPage from "@/pages/NotFoundPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "tutor", element: <TutorPage /> },
      { path: "courses", element: <CoursesPage /> },
      { path: "evaluations", element: <EvaluationsPage /> },
      { path: "revisions", element: <RevisionsPage /> },
      { path: "schedule", element: <SchedulePage /> },
      { path: "rewards", element: <RewardsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
])
