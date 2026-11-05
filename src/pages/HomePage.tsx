import {
  Calendar,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Building2,
  Clock,
  AlertCircle,
  FileText,
} from "lucide-react"
import { Link } from "react-router"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockCourses } from "@/data/courses"

export default function HomePage() {
  const user = {
    name: "Alexandre",
  }

  // Aperçu des 3 premiers cours (ou cours récents)
  const recentCourses = mockCourses.slice(0, 3)

  // Prochaines échéances (rendus de TP, examens, devoirs Moodle)
  const upcomingDeadlines = [
    {
      id: "d1",
      title: "Rendu Série d'exercices 4 — Continuité & TVI",
      course: "Analyse I",
      code: "11X001",
      dueDate: "Aujourd'hui, 23h59",
      urgency: "urgent",
      type: "Devoir",
    },
    {
      id: "d2",
      title: "TP noté — Arbres binaires de recherche",
      course: "Algorithmique",
      code: "12X002",
      dueDate: "Demain, 14h00",
      urgency: "soon",
      type: "TP Machine",
    },
    {
      id: "d3",
      title: "Quiz hebdomadaire — Dépendances fonctionnelles",
      course: "Bases de données",
      code: "13X005",
      dueDate: "Vendredi 7 nov., 18h00",
      urgency: "normal",
      type: "Quiz",
    },
    {
      id: "d4",
      title: "Examen blanc mi-semestre",
      course: "Probabilités et statistiques",
      code: "11X010",
      dueDate: "Lundi 10 nov., 09h00",
      urgency: "normal",
      type: "Examen",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Salutation sobre */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bonjour, {user.name} 👋</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Retrouvez vos cours suivis et le suivi de vos prochaines échéances.
        </p>
      </div>

      {/* 1er Container : Aperçu des cours (Grid 3 colonnes) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold tracking-tight">Mes Cours</h2>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Tous les cours <ArrowRight className="ml-1 size-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentCourses.map((course) => (
            <Card
              key={course.id}
              size="sm"
              className="group relative flex flex-col justify-between overflow-hidden pt-0 gap-0 transition-all duration-200 hover:shadow-lg hover:ring-foreground/20 hover:-translate-y-0.5"
            >
              {/* Vignette de cours collée tout en haut */}
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <img
                  src={course.thumbnailSrc}
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Code du cours */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <Badge className="bg-black/60 backdrop-blur-md text-white font-mono border-white/20 text-xs">
                    {course.code}
                  </Badge>
                </div>

                {/* Faculté / Institution et Enseignants */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs gap-2">
                  <span className="flex items-center gap-1 text-white/90 truncate font-medium text-[11px]">
                    <Building2 className="size-3.5 shrink-0" />
                    <span className="truncate">{course.faculty}</span>
                  </span>
                  <span className="flex items-center gap-1 text-white/80 shrink-0 text-[11px]">
                    <GraduationCap className="size-3.5 shrink-0" />
                    <span>{course.teachers[0]}</span>
                  </span>
                </div>
              </div>

              {/* Titre et description */}
              <CardHeader className="pt-3 pb-4 px-4 gap-1">
                <CardTitle className="text-base font-semibold leading-snug line-clamp-1">
                  <Link
                    to={`/courses/${course.id}`}
                    className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
                  >
                    {course.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2 text-xs leading-relaxed">
                  {course.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* 2ème Container en dessous : Prochaines échéances (Column) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold tracking-tight">Prochaines échéances</h2>
          </div>
          <span className="text-xs text-muted-foreground">
            {upcomingDeadlines.length} échéances à venir
          </span>
        </div>

        {/* Liste sous forme de colonne verticale aérée et propre */}
        <div className="space-y-2.5">
          {upcomingDeadlines.map((item) => (
            <Card
              key={item.id}
              size="sm"
              className="p-3.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:bg-muted/30"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-xl border text-xs ${
                    item.urgency === "urgent"
                      ? "border-destructive/30 bg-destructive/10 text-destructive"
                      : "border-border bg-muted/40 text-muted-foreground"
                  }`}
                >
                  {item.urgency === "urgent" ? (
                    <AlertCircle className="size-4" />
                  ) : (
                    <FileText className="size-4" />
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm text-foreground">
                      {item.title}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-normal">
                      {item.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.course} • <span className="font-mono text-[11px]">{item.code}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center sm:self-center self-end gap-2 shrink-0">
                <span
                  className={`text-xs flex items-center gap-1.5 ${
                    item.urgency === "urgent"
                      ? "font-semibold text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  <Clock className="size-3.5" />
                  {item.dueDate}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
