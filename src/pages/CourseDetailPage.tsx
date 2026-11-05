import { useParams, Link } from "react-router"
import {
  ArrowLeft,
  ArrowUpRightIcon,
  Building2,
  GraduationCap,
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

      {
        course.source === courseSource.MOODLE && (
          <div className="space-x-2 flex justify-end w-full">
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

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        {/* Descriptif & zone prête à accueillir le contenu détaillé */}
        <div className="space-y-4">
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

        <Card className="border bg-background shadow-none ring-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Objectifs du cours</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {course.objectives.map((objective) => (
                <li key={objective} className="flex gap-2.5 leading-relaxed">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        </div>
    </div >
  )
}
