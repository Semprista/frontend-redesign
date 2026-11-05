import { Link, useParams } from "react-router"
import { ArrowLeft, CheckCircle2, Circle, FileText, LoaderCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockCourses } from "@/data/courses"

export default function ActivityDetailPage() {
  const { courseId, activityId } = useParams()
  const course = mockCourses.find((item) => item.id === courseId)
  const activity = course?.activities.find((item) => item.id === activityId)

  if (!course || !activity) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
        <h2 className="text-lg font-semibold">Activité non trouvée</h2>
        <Link to={course ? `/courses/${course.id}` : "/courses"} className="mt-4 text-xs text-muted-foreground hover:text-foreground">
          Retour au cours
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <Link
        to={`/courses/${course.id}`}
        className="inline-flex items-center text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="mr-1.5 size-3.5" /> Retour au cours
      </Link>

      <div className="rounded-2xl border bg-muted p-6 sm:p-8">
        <Badge variant="outline" className="mb-3 bg-background">{course.code}</Badge>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{activity.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{activity.description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <Card className="border bg-background shadow-none ring-0">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Notions abordées</CardTitle>
          </CardHeader>
          <CardContent>
            {activity.analysisStatus === "analyzing" ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LoaderCircle className="size-4 animate-spin" /> Analyse des fichiers en cours...
              </div>
            ) : (
              <div className="space-y-2">
                {activity.notions.map((notion) => (
                  <details key={notion.title} className="group rounded-xl border">
                    <summary className="flex cursor-pointer list-none items-center gap-3 p-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
                      {notion.mastered ? (
                        <CheckCircle2 className="size-4 shrink-0 text-primary" />
                      ) : (
                        <Circle className="size-4 shrink-0 text-muted-foreground" />
                      )}
                      <span className="flex-1">{notion.title}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {notion.mastered ? "Maîtrisée" : "À revoir"}
                      </span>
                    </summary>
                    <p className="px-10 pb-3 text-xs leading-relaxed text-muted-foreground">{notion.description}</p>
                  </details>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border bg-background shadow-none ring-0">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Fichiers utilisés</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {activity.files.map((file) => (
                <li key={file.name} className="flex items-center gap-2.5 text-sm">
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate">{file.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{file.size}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
