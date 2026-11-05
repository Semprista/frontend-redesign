import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRightIcon,
  Building2,
  CheckCircle2,
  Circle,
  FileText,
  GraduationCap,
  KanbanSquare,
  Plus,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { courseSource, mockCourses, type CourseActivity } from "@/data/courses"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useLocalStorage } from "@/hooks/use-local-storage"

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

          {activities.length > 0 ? (
            <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
              {activities.map((activity) => (
                <ActivityRow key={activity.id} activity={activity} courseId={course.id} />
              ))}
              <button
                type="button"
                onClick={() => document.getElementById("activity-title")?.focus()}
                className="flex min-h-48 w-72 shrink-0 snap-start items-center justify-center rounded-2xl border border-dashed bg-muted/20 p-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/40 hover:text-foreground"
              >
                <Plus className="mr-2 size-4" /> Ajouter une activité
              </button>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2">
              <EmptyState text="Aucune activité créée pour le moment." />
              <button
                type="button"
                onClick={() => document.getElementById("activity-title")?.focus()}
                className="flex min-h-24 w-72 shrink-0 items-center justify-center rounded-2xl border border-dashed bg-muted/20 p-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/40 hover:text-foreground"
              >
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

function SectionHeading({ title, icon }: { title: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>
    </div>
  )
}

function ActivityRow({ activity, courseId }: { activity: CourseActivity; courseId: string }) {
  const masteredNotions = activity.notions.filter((notion) => notion.mastered).length
  const totalNotions = activity.notions.length
  const progress = totalNotions > 0 ? Math.round((masteredNotions / totalNotions) * 100) : 0
  const status = activity.analysisStatus === "analyzing"
    ? "Analyse en cours"
    : totalNotions === 0
      ? "Notions en attente"
      : progress < 100
        ? `${totalNotions - masteredNotions} à revoir`
        : "Terminée"

  return (
    <Card className="min-h-48 w-72 shrink-0 snap-start transition-colors hover:border-primary/40 hover:bg-muted/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold">{activity.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {activity.description}
                </p>
              </div>
              <Badge variant={activity.analysisStatus === "analyzing" ? "secondary" : "outline"} className="shrink-0 text-[10px] font-normal">
                {status}
              </Badge>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Progress value={progress} className="h-1.5 flex-1" />
              <span className="min-w-9 text-right text-xs font-medium tabular-nums text-muted-foreground">
                {progress}%
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>
                {masteredNotions}/{totalNotions} notion{totalNotions === 1 ? "" : "s"} maîtrisée{masteredNotions === 1 ? "" : "s"} · {activity.files.length} fichier{activity.files.length === 1 ? "" : "s"}
              </span>
              <Link
                to={`/courses/${courseId}/activities/${activity.id}`}
                className="inline-flex shrink-0 items-center gap-1 font-medium text-primary hover:underline"
              >
                Ouvrir <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ObjectivesSection({
  objectives,
  isCompleted,
}: {
  objectives: { id: string; title: string }[]
  isCompleted: (objectiveId: string) => boolean
}) {
  const completedCount = objectives.filter((objective) => isCompleted(objective.id)).length

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionHeading title="Objectifs du cours" />
        <Badge variant="secondary">{completedCount}/{objectives.length} complétés</Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        Chaque objectif se valide lorsque toutes ses notions sont maîtrisées.
      </p>
      <ul className="grid gap-x-10 gap-y-4 pt-1 md:grid-cols-2">
        {objectives.map((objective) => {
          const completed = isCompleted(objective.id)
          return (
            <li
              key={objective.id}
              className={`flex gap-2.5 text-sm leading-relaxed ${
                completed ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {completed ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
              ) : (
                <Circle className="mt-0.5 size-4 shrink-0" />
              )}
              <span>{objective.title}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function FilesCard({ files }: { files: { name: string; size: string }[] }) {
  return (
    <Card>
      <CardHeader className="border-b pb-5">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-xl">Fichiers du cours</CardTitle>
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Ajouter un fichier" title="Ajouter un fichier">
            <Plus />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {files.length > 0 ? (
          <ul className="space-y-3">
            {files.map((file) => (
              <li key={file.name} className="flex items-center gap-2.5 text-sm">
                <FileText className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate">{file.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{file.size}</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState text="Aucun fichier ajouté." />
        )}
      </CardContent>
    </Card>
  )
}

function KanbanBoard({
  activities,
  courseId,
  deadlines,
}: {
  activities: CourseActivity[]
  courseId: string
  deadlines: { id: string; title: string; dueDate: string; type: string }[]
}) {
  const reviewItems = activities.flatMap((activity) =>
    activity.notions
      .filter((notion) => !notion.mastered)
      .map((notion) => ({ activity, notion }))
  )
  const ongoingActivities = activities.filter(
    (activity) =>
      activity.analysisStatus === "analyzing" ||
      activity.notions.some((notion) => !notion.mastered)
  )

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <KanbanSquare className="size-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Vue d’ensemble</h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <KanbanColumn title="À revoir" count={reviewItems.length}>
          {reviewItems.length > 0 ? reviewItems.map(({ activity, notion }) => (
            <Link
              key={`${activity.id}-${notion.title}`}
              to={`/courses/${courseId}/activities/${activity.id}`}
              className="block rounded-xl border bg-background p-2 transition-colors hover:bg-muted/50"
            >
              <p className="text-sm font-medium">{notion.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{activity.title}</p>
            </Link>
          )) : <EmptyState text="Aucune notion à revoir." />}
        </KanbanColumn>

        <KanbanColumn title="À rendre" count={deadlines.length}>
          {deadlines.length > 0 ? deadlines.map((deadline) => (
            <div key={deadline.id} className="rounded-xl border bg-background p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium">{deadline.title}</p>
                <Badge variant="outline" className="shrink-0 text-[10px] font-normal">{deadline.type}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{deadline.dueDate}</p>
            </div>
          )) : <EmptyState text="Aucune échéance à venir." />}
        </KanbanColumn>

        <KanbanColumn title="En cours" count={ongoingActivities.length}>
          {ongoingActivities.length > 0 ? ongoingActivities.map((activity) => (
            <Link
              key={activity.id}
              to={`/courses/${courseId}/activities/${activity.id}`}
              className="block rounded-xl border bg-background p-3 transition-colors hover:bg-muted/50"
            >
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {activity.analysisStatus === "analyzing" ? "Analyse en cours" : "Notions à travailler"}
              </p>
            </Link>
          )) : <EmptyState text="Aucune activité incomplète." />}
        </KanbanColumn>
      </div>
    </section>
  )
}

function KanbanColumn({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <Card className="min-w-0 bg-muted/20 shadow-none">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="secondary">{count}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  )
}

function EmptyState({ text }: { text: string }) {
  return <p className="rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground">{text}</p>
}
