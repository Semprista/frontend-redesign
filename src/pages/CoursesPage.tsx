import { useState, useMemo } from "react"
import { Link } from "react-router"
import {
  Search,
  BookOpen,
  GraduationCap,
  Sparkles,
  Building2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { mockCourses } from "@/data/courses"

export default function CoursesPage() {
  const [search, setSearch] = useState("")
  const [selectedFaculty, setSelectedFaculty] = useState("Toutes")

  // Liste unique des facultés / institutions à partir des données réelles
  const faculties = useMemo(() => {
    const list = Array.from(new Set(mockCourses.map((c) => c.faculty)))
    return ["Toutes", ...list]
  }, [])

  const filteredCourses = mockCourses.filter((course) => {
    const term = search.toLowerCase()
    const matchSearch =
      course.title.toLowerCase().includes(term) ||
      course.code.toLowerCase().includes(term) ||
      course.faculty.toLowerCase().includes(term) ||
      course.teachers.some((t) => t.toLowerCase().includes(term))

    const matchFaculty = selectedFaculty === "Toutes" || course.faculty === selectedFaculty

    return matchSearch && matchFaculty
  })

  return (
    <div className="space-y-6">
      {/* En-tête de section style Moodle moderne */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Mes cours</h1>
            <Badge variant="outline" className="font-normal text-muted-foreground">
              {mockCourses.length} cours disponibles
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Sparkles className="size-4 text-primary" />
            Synchroniser Moodle
          </Button>
        </div>
      </div>

      {/* Barre de recherche et filtres par Faculté / Institution */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre, code, enseignant..."
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {faculties.map((fac) => (
            <Button
              key={fac}
              variant={selectedFaculty === fac ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedFaculty(fac)}
              className="text-xs h-8 font-normal"
            >
              {fac}
            </Button>
          ))}
        </div>
      </div>

      {/* Grille responsive : 1 col mobile, 2 col tablette, 3 col desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
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

              {/* Code du cours (6 caractères) en badge supérieur */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <Badge className="bg-black/60 backdrop-blur-md text-white font-mono border-white/20 text-xs">
                  {course.code}
                </Badge>
              </div>

              {/* Faculté / Institution et Enseignants en bas de vignette */}
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs gap-2">
                <span className="flex items-center gap-1 text-white/90 truncate font-medium text-[11px]">
                  <Building2 className="size-3.5 shrink-0" />
                  <span className="truncate">{course.faculty}</span>
                </span>
                <span className="flex items-center gap-1 text-white/80 shrink-0 text-[11px]">
                  <GraduationCap className="size-3.5 shrink-0" />
                  <span>{course.teachers.join(", ")}</span>
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

      {filteredCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-2xl border-dashed">
          <BookOpen className="size-10 text-muted-foreground mb-3 opacity-60" />
          <h3 className="font-semibold text-base">Aucun cours trouvé</h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            Aucun résultat pour "{search}". Essayez avec un autre mot-clé ou réinitialisez les filtres.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSearch("")
              setSelectedFaculty("Toutes")
            }}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  )
}
