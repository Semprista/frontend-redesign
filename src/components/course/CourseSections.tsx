import type { ReactNode } from "react"
import { ArrowRight, CheckCircle2, Circle, FileText, Plus } from "lucide-react"
import { Link } from "react-router"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { CourseActivity, CourseDeadline, CourseFile, CourseObjective } from "@/data/courses"

export function SectionHeading({ title, icon }: { title: string; icon?: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>
    </div>
  )
}

export function ActivityList({
  activities,
  courseId,
  onAdd,
}: {
  activities: CourseActivity[]
  courseId: string
  onAdd: () => void
}) {
  return (
    <div className="flex snap-x gap-3 overflow-x-auto px-1 pb-2">
      {activities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} courseId={courseId} />
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="flex w-72 shrink-0 snap-start items-center justify-center rounded-2xl border border-dashed bg-muted/20 p-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/40 hover:text-foreground"
      >
        <Plus className="mr-2 size-4" /> Ajouter une activité
      </button>
    </div>
  )
}

function ActivityCard({ activity, courseId }: { activity: CourseActivity; courseId: string }) {
  const mastered = activity.notions.filter((notion) => notion.mastered).length
  const total = activity.notions.length
  const progress = total > 0 ? Math.round((mastered / total) * 100) : 0
  const status = activity.analysisStatus === "analyzing"
    ? "Analyse en cours"
    : total === 0
      ? "Notions en attente"
      : progress < 100
        ? `${total - mastered} à revoir`
        : "Terminée"

  return (
    <div className="w-72 shrink-0 snap-start rounded-2xl border border-border bg-card text-sm text-card-foreground transition-colors hover:border-primary/40 hover:bg-muted/20">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold">{activity.title}</h3>
              </div>
              <Badge variant={activity.analysisStatus === "analyzing" ? "secondary" : "outline"} className="shrink-0 text-[10px] font-normal">
                {status}
              </Badge>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Progress value={progress} className="h-1.5 flex-1" />
              <span className="min-w-9 text-right text-xs font-medium tabular-nums text-muted-foreground">{progress}%</span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>{mastered}/{total} notion{total === 1 ? "" : "s"} maîtrisée{mastered === 1 ? "" : "s"} · {activity.files.length} fichier{activity.files.length === 1 ? "" : "s"}</span>
              <Link to={`/courses/${courseId}/activities/${activity.id}`} className="inline-flex shrink-0 items-center gap-1 font-medium text-primary hover:underline">
                Ouvrir <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ObjectivesSection({
  objectives,
  isCompleted,
}: {
  objectives: CourseObjective[]
  isCompleted: (objectiveId: string) => boolean
}) {
  const completed = objectives.filter((objective) => isCompleted(objective.id)).length
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionHeading title="Objectifs du cours" />
        <Badge variant="secondary">{completed}/{objectives.length} complétés</Badge>
      </div>
      <p className="text-sm text-muted-foreground">Chaque objectif se valide lorsque toutes ses notions sont maîtrisées.</p>
      <ul className="grid gap-x-10 gap-y-4 pt-1 md:grid-cols-2">
        {objectives.map((objective) => {
          const done = isCompleted(objective.id)
          return (
            <li key={objective.id} className={`flex gap-2.5 text-sm leading-relaxed ${done ? "text-foreground" : "text-muted-foreground"}`}>
              {done ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" /> : <Circle className="mt-0.5 size-4 shrink-0" />}
              <span>{objective.title}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export function FilesCard({ files }: { files: CourseFile[] }) {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <SectionHeading title="Fichiers du cours" />
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Ajouter un fichier" title="Ajouter un fichier"><Plus /></Button>
      </div>
      {files.length > 0 ? (
        <ul className="divide-y">
          {files.map((file) => (
            <li key={file.name} className="flex items-center gap-2.5 py-3 text-sm">
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate">{file.name}</span>
              <span className="shrink-0 text-xs text-muted-foreground">{file.size}</span>
            </li>
          ))}
        </ul>
      ) : <EmptyState text="Aucun fichier ajouté." />}
    </section>
  )
}

export function KanbanBoard({
  activities,
  courseId,
  deadlines,
}: {
  activities: CourseActivity[]
  courseId: string
  deadlines: CourseDeadline[]
}) {
  const reviewItems = activities.flatMap((activity) => activity.notions.filter((notion) => !notion.mastered).map((notion) => ({ activity, notion })))
  const ongoing = activities.filter((activity) => activity.analysisStatus === "analyzing" || activity.notions.some((notion) => !notion.mastered))

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Vue d’ensemble</h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <KanbanColumn title="À revoir" count={reviewItems.length}>
          {reviewItems.length > 0 ? reviewItems.map(({ activity, notion }) => (
            <Link key={`${activity.id}-${notion.title}`} to={`/courses/${courseId}/activities/${activity.id}`} className="block rounded-xl border bg-background p-2 transition-colors hover:bg-muted/50">
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
        <KanbanColumn title="En cours" count={ongoing.length}>
          {ongoing.length > 0 ? ongoing.map((activity) => (
            <Link key={activity.id} to={`/courses/${courseId}/activities/${activity.id}`} className="block rounded-xl border bg-background p-3 transition-colors hover:bg-muted/50">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{activity.analysisStatus === "analyzing" ? "Analyse en cours" : "Notions à travailler"}</p>
            </Link>
          )) : <EmptyState text="Aucune activité incomplète." />}
        </KanbanColumn>
      </div>
    </section>
  )
}

function KanbanColumn({ title, count, children }: { title: string; count: number; children: ReactNode }) {
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

export function EmptyState({ text }: { text: string }) {
  return <p className="rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground">{text}</p>
}
