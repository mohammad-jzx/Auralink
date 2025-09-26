import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function DailyLessonsPage() {
  const navigate = useNavigate()

  // Redirect to interactive lessons page immediately
  useEffect(() => {
    navigate("/interactive-lessons")
  }, [navigate])

  // Return empty div while redirecting
  return <div></div>
}