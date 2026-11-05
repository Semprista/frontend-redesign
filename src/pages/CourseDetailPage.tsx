import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { ArrowLeft, ArrowUpRightIcon, Building2, GraduationCap, Plus, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { courseSource, mockCourses, type CourseActivity } from "@/data/courses"
import { Separator } from "@/components/ui/separator"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { ActivityList, EmptyState, FilesCard, KanbanBoard, ObjectivesSection, SectionHeading } from "@/components/course/CourseSections"

export default function CourseDetailPage() {
  const { courseId } = useParams()
  const course = mockCourses.find((item) => item.id === courseId)
  const navigate = useNavigate()
  const [activityTitle, setActivityTitle] = useState("")
  const [activities, setActivities] = useLocalStorage<CourseActivity[]>(
    `frontend-redesign:course:${courseId ?? "unknown"}:activities`,
    course?.activities ?? []
  )

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
        <h2 className="text-lg font-semibold">Cours non trouvé</h2>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          Le cours demandé n'existe pas ou n'est plus accessible.
        </p>
        <Link
          to="/courses"
          className="mt-4 inline-flex items-center justify-center rounded-xl border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
        >
          <ArrowLeft className="mr-1.5 size-3.5" /> Retour aux cours
        </Link>
      </div>
    )
  }

  const isObjectiveCompleted = (objectiveId: string) => {
    const notions = activities.flatMap((activity) =>
      activity.notions.filter((notion) => notion.objectiveId === objectiveId)
    )
    return notions.length > 0 && notions.every((notion) => notion.mastered)
  }

  const createActivity = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const title = activityTitle.trim()
    if (!title) return

    const activity: CourseActivity = {
      id: `activity-${Date.now()}`,
      title,
      description: "Cette activité sera analysée à partir des fichiers sélectionnés.",
      files: [],
      notions: [],
      analysisStatus: "analyzing",
    }

    setActivities((current) => [...current, activity])
    setActivityTitle("")
    navigate(`/courses/${course.id}/activities/${activity.id}`)
  }

  return (
    <div className="space-y-8">
      <Link
        to="/courses"
        className="inline-flex items-center text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="mr-1.5 size-3.5" /> Retour à la liste des cours
      </Link>

      <header className="relative overflow-hidden rounded-2xl border bg-muted">
        <div className="relative aspect-[21/9] min-h-56 w-full overflow-hidden sm:aspect-[24/8]">
          <img src={course.thumbnailSrc} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          <Badge className="absolute left-4 top-4 border-white/20 bg-black/60 font-mono text-xs text-white backdrop-blur-md">
            {course.code}
          </Badge>
          <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-6 sm:left-6">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{course.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/80">
              <span className="flex items-center gap-1.5">
                <Building2 className="size-3.5" /> {course.faculty}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="size-3.5" /> {course.teachers.join(", ")}
              </span>
            </div>
          </div>
        </div>
      </header>

      {course.source === courseSource.MOODLE && (
        <div className="flex flex-wrap justify-end gap-2">
          <a href={course.source_url}>
            <Button variant="outline">
              Moodle <ArrowUpRightIcon />
            </Button>
          </a>
          {course.mediaserver_url && (
            <a href={course.mediaserver_url}>
              <Button variant="outline">
                Mediaserver <ArrowUpRightIcon />
              </Button>
            </a>
          )}
        </div>
      )}

      <KanbanBoard activities={activities} courseId={course.id} deadlines={course.deadlines} />

      <Separator className="my-2" />

      <main className="space-y-8">
        <ObjectivesSection
          objectives={course.objectives}
          isCompleted={isObjectiveCompleted}
        />
        <Separator />
        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading title="Activités" icon={<Sparkles className="size-4 text-muted-foreground" />} />
            <span className="text-xs text-muted-foreground">
              {activities.length} activité{activities.length === 1 ? "" : "s"}
            </span>
          </div>

          <form onSubmit={createActivity} className="rounded-2xl border border-dashed bg-muted/20 p-4">
            <label htmlFor="activity-title" className="mb-2 block text-xs font-medium">
              Créer une activité
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="activity-title"
                value={activityTitle}
                onChange={(event) => setActivityTitle(event.target.value)}
                placeholder="Ex. Semaine 3 — Normalisation"
                className="min-w-0 flex-1 rounded-xl border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button type="submit" className="shrink-0">
                <Plus /> Nouvelle activité
              </Button>
            </div>
          </form>

          {activities.length > 0 ? <ActivityList activities={activities} courseId={course.id} onAdd={() => document.getElementById("activity-title")?.focus()} /> : (
            <div className="flex gap-3 overflow-x-auto pb-2">
              <EmptyState text="Aucune activité créée pour le moment." />
              <button type="button" onClick={() => document.getElementById("activity-title")?.focus()} className="flex min-h-24 w-72 shrink-0 items-center justify-center rounded-2xl border border-dashed bg-muted/20 p-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/40 hover:text-foreground">
                <Plus className="mr-2 size-4" /> Ajouter une activité
              </button>
            </div>
          )}
        </section>

        <Separator />

        <section className="space-y-5">
          <FilesCard files={course.files} />
        </section>
      </main>
    </div>
  )
}
