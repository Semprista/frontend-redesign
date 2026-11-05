import { useParams, Link } from "react-router"
import {
  ArrowLeft,
  Building2,
  GraduationCap,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { mockCourses } from "@/data/courses"

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
    <div className="space-y-6">
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
    </div>
  )
}
