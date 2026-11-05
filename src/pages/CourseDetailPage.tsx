import { useParams, Link } from "react-router"
import {
  ArrowLeft,
  ArrowUpRightIcon,
  Building2,
  FileText,
  GraduationCap,
  Plus,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { courseSource, mockCourses } from "@/data/courses"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CourseDetailPage() {
  const { courseId } = useParams()
  const course = mockCourses.find((c) => c.id === courseId)

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

      <div className="flex flex-col gap-3 md:flex-row md:items-start">
        <div className="min-w-0 flex-1 space-y-3">
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

          <div>
            <h2 className="text-base font-semibold">Présentation du cours</h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Espace prêt à être enrichi selon tes instructions */}
          <div className="p-8 border border-dashed rounded-2xl text-center text-xs text-muted-foreground bg-muted/10">
            <Sparkles className="size-5 mx-auto mb-2 text-muted-foreground/60" />
            En attente de tes instructions pour le contenu détaillé de ce cours (chapitres, ressources, devoirs, etc.).
          </div>
        </div>
        <div className="w-full md:w-80 md:shrink-0 space-y-2">
          <Card className="border bg-background shadow-none ring-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Objectifs du cours</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {course.objectives.map((objective) => (
                  <li key={objective.title} className="flex gap-2.5 leading-relaxed items-center">
                    <input
                      type="checkbox"
                      checked={objective.completed}
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
            <CardHeader className="flex flex-row items-center justify-between space-y-3 pb-3">
              <CardTitle className="text-base font-semibold">Fichiers du cours</CardTitle>
              <Button
                type="button"
                variant="ghost"
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
