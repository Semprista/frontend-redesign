import { useState } from "react"
import { useNavigate, useParams, Link } from "react-router"
import {
  ArrowLeft,
  ArrowUpRightIcon,
  Building2,
  FileText,
  GraduationCap,
  KanbanSquare,
  Plus,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { courseSource, mockCourses, type CourseActivity } from "@/data/courses"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CourseDetailPage() {
  const { courseId } = useParams()
  const course = mockCourses.find((c) => c.id === courseId)
  const navigate = useNavigate()
  const [activityTitle, setActivityTitle] = useState("")
  const [activities, setActivities] = useState<CourseActivity[]>(course?.activities ?? [])
  const isObjectiveCompleted = (objectiveId: string) => {
    const notions = activities.flatMap((activity) =>
      activity.notions.filter((notion) => notion.objectiveId === objectiveId)
    )
    return notions.length > 0 && notions.every((notion) => notion.mastered)
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-2xl border-dashed">
        <h2 className="text-lg font-semibold">Cours non trouvé</h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          Le cours demandé n'existe pas ou n'est plus accessible.
        </p>
        <Link
          to="/courses"
          className="mt-4 inline-flex items-center justify-center rounded-xl border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
        >
          <ArrowLeft className="mr-1.5 size-3.5" /> Retour aux cours
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Bouton de retour */}
      <div>
        <Link
          to="/courses"
          className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-1.5 size-3.5" /> Retour à la liste des cours
        </Link>
      </div>

      {/* Bannière du cours */}
      <div className="relative overflow-hidden rounded-2xl border bg-muted">
        <div className="relative aspect-[21/9] sm:aspect-[24/8] w-full overflow-hidden">
          <img
            src={course.thumbnailSrc}
            alt={course.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Code du cours */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-black/60 backdrop-blur-md text-white font-mono border-white/20 text-xs">
              {course.code}
            </Badge>
          </div>

          {/* Titre & métadonnées en bas de bannière */}
          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
              {course.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/80 pt-1">
              <span className="flex items-center gap-1.5">
                <Building2 className="size-3.5" />
                {course.faculty}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="size-3.5" />
                {course.teachers.join(", ")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {
        course.source === courseSource.MOODLE && (
          <div className="space-x-3 flex justify-end w-full">
            <a href={course.source_url}>
              <Button>
                <span>Moodle</span>
                <ArrowUpRightIcon />
              </Button>
            </a>
            {
              course.mediaserver_url && (
                <a href={course.mediaserver_url}>
                  <Button>
                    <span>Mediaserver</span>
                    <ArrowUpRightIcon />
                  </Button>
                </a>
              )
            }
          </div>
        )
      }

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <KanbanSquare className="size-4 text-muted-foreground" />
          <h2 className="text-base font-semibold">Vue d’ensemble</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="min-w-0 bg-muted/20 shadow-none">
            <CardHeader className="border-b pb-3">
              <CardTitle className="text-sm font-semibold">À revoir</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-4">
              {activities.flatMap((activity) =>
                activity.notions.filter((notion) => !notion.mastered).map((notion) => (
                  <Link
                    key={`${activity.id}-${notion.title}`}
                    to={`/courses/${course.id}/activities/${activity.id}`}
                    className="block rounded-xl border bg-background p-3 transition-colors hover:bg-muted/50"
                  >
                    <p className="text-sm font-medium">{notion.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{activity.title}</p>
                  </Link>
                ))
              )}
              {activities.every((activity) => activity.notions.every((notion) => notion.mastered)) && (
                <p className="text-xs text-muted-foreground">Aucune notion à revoir.</p>
              )}
            </CardContent>
          </Card>

          <Card className="min-w-0 bg-muted/20 shadow-none">
            <CardHeader className="border-b pb-3">
              <CardTitle className="text-sm font-semibold">À rendre</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-4">
              {course.deadlines.length > 0 ? (
                course.deadlines.map((deadline) => (
                  <div key={deadline.id} className="rounded-xl border bg-background p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{deadline.title}</p>
                      <Badge variant="outline" className="shrink-0 text-[10px] font-normal">{deadline.type}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{deadline.dueDate}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">Aucune échéance à venir.</p>
              )}
            </CardContent>
          </Card>

          <Card className="min-w-0 bg-muted/20 shadow-none">
            <CardHeader className="border-b pb-3">
              <CardTitle className="text-sm font-semibold">En cours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-4">
              {activities.filter((activity) => activity.notions.some((notion) => !notion.mastered) || activity.analysisStatus === "analyzing").length > 0 ? (
                activities
                  .filter((activity) => activity.notions.some((notion) => !notion.mastered) || activity.analysisStatus === "analyzing")
                  .map((activity) => (
                    <Link
                      key={activity.id}
                      to={`/courses/${course.id}/activities/${activity.id}`}
                      className="block rounded-xl border bg-background p-3 transition-colors hover:bg-muted/50"
                    >
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {activity.analysisStatus === "analyzing" ? "Analyse en cours" : "Notions à travailler"}
                      </p>
                    </Link>
                  ))
              ) : (
                <p className="text-xs text-muted-foreground">Aucune activité incomplète.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="flex flex-col gap-3 md:flex-row md:items-start">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Activités</h2>
              <span className="text-xs text-muted-foreground">{activities.length} activité{activities.length === 1 ? "" : "s"}</span>
            </div>

            <form
              className="flex flex-col gap-2 rounded-2xl border border-dashed p-4 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault()
                const title = activityTitle.trim()
                if (!title || !course) return
                const activity: CourseActivity = {
                  id: `activity-${Date.now()}`,
                  title,
                  description: "Cette activité sera analysée à partir des fichiers sélectionnés.",
                  files: [],
                  notions: [],
                  analysisStatus: "analyzing",
                }
                course.activities.push(activity)
                setActivities((current) => [...current, activity])
                setActivityTitle("")
                navigate(`/courses/${course.id}/activities/${activity.id}`)
              }}
            >
              <input
                value={activityTitle}
                onChange={(event) => setActivityTitle(event.target.value)}
                placeholder="Nom de la séance ou de la semaine"
                aria-label="Nom de la nouvelle activité"
                className="min-w-0 flex-1 rounded-xl border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button type="submit" className="shrink-0">
                <Plus /> Nouvelle activité
              </Button>
            </form>

            {activities.length > 0 ? (
              <div className="space-y-2">
                {activities.map((activity) => (
                  <details key={activity.id} className="group rounded-2xl border">
                    <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
                      <Sparkles className="size-4 shrink-0 text-muted-foreground" />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">{activity.title}</span>
                      <span className="text-xs text-muted-foreground">{activity.files.length} fichier{activity.files.length === 1 ? "" : "s"}</span>
                    </summary>
                    <div className="border-t px-4 pb-4 pt-3">
                      <p className="text-xs leading-relaxed text-muted-foreground">{activity.description}</p>
                      <Link
                        to={`/courses/${course.id}/activities/${activity.id}`}
                        className="mt-3 inline-flex text-xs font-medium text-primary hover:underline"
                      >
                        Ouvrir l’activité
                      </Link>
                    </div>
                  </details>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground">
                Aucune activité créée pour le moment.
              </div>
            )}
          </div>
        </div>
        <div className="w-full md:w-80 md:shrink-0 space-y-2">
          <Card className="border bg-background shadow-none ring-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Objectifs du cours</CardTitle>
              <Button
                type="button"
                variant="default"
                size="icon-sm"
                aria-label="Ajouter un fichier"
                title="Ajouter un fichier"
              >
                <Plus />
              </Button>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {course.objectives.map((objective) => (
                  <li key={objective.title} className="flex gap-2.5 leading-relaxed items-center">
                    <input
                      type="checkbox"
                      checked={isObjectiveCompleted(objective.id)}
                      readOnly
                      aria-label={objective.title}
                      className="mt-1 size-4 shrink-0 accent-primary"
                    />
                    <span>{objective.title}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border bg-background shadow-none ring-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Fichiers du cours</CardTitle>
              <Button
                type="button"
                variant="default"
                size="icon-sm"
                aria-label="Ajouter un fichier"
                title="Ajouter un fichier"
              >
                <Plus />
              </Button>
            </CardHeader>
            <CardContent>
              {course.files.length > 0 ? (
                <ul className="space-y-2">
                  {course.files.map((file) => (
                    <li key={file.name} className="flex items-center gap-2.5 text-sm">
                      <FileText className="size-4 shrink-0 text-muted-foreground" />
                      <span className="min-w-0 flex-1 truncate">{file.name}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{file.size}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Aucun fichier ajouté.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
