import { useState } from "react"
import {
  Search,
  BookOpen,
  GraduationCap,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export interface Course {
  id: string
  code: string
  title: string
  instructor: string
  term: string
  category: string
  description: string
  progress: number
  totalResources: number
  completedResources: number
  thumbnailSrc: string
}

const mockCourses: Course[] = [
  {
    id: "course-1",
    code: "11X001",
    title: "Analyse I",
    instructor: "Prof. Martin",
    term: "Automne 2026",
    category: "Mathématiques",
    description: "Suites, limites, continuité, dérivées et intégrales d'une variable réelle.",
    progress: 68,
    totalResources: 18,
    completedResources: 12,
    thumbnailSrc: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "course-2",
    code: "12X002",
    title: "Algorithmique et Structures de Données",
    instructor: "Dr. Rossi",
    term: "Automne 2026",
    category: "Informatique",
    description: "Complexité, tris, récursivité, arbres, graphes et tables de hachage.",
    progress: 85,
    totalResources: 24,
    completedResources: 20,
    thumbnailSrc: "https://images.unsplash.com/photo-1516116211227-bbc04294b05a?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "course-3",
    code: "11X010",
    title: "Probabilités et Statistiques",
    instructor: "Prof. Keller",
    term: "Automne 2026",
    category: "Mathématiques",
    description: "Espaces probabilisés, variables aléatoires discrètes et continues, lois usuelles.",
    progress: 42,
    totalResources: 14,
    completedResources: 6,
    thumbnailSrc: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "course-4",
    code: "14X004",
    title: "Systèmes Informatiques & Architecture",
    instructor: "Prof. Benali",
    term: "Automne 2026",
    category: "Systèmes",
    description: "Architecture matérielle de von Neumann, assembleur, processus et mémoire virtuelle.",
    progress: 30,
    totalResources: 16,
    completedResources: 5,
    thumbnailSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "course-5",
    code: "13X005",
    title: "Bases de Données Relationnelles",
    instructor: "Dr. Laurent",
    term: "Automne 2026",
    category: "Informatique",
    description: "Modèle relationnel, formes normales, algèbre relationnelle et requêtes SQL avancées.",
    progress: 92,
    totalResources: 12,
    completedResources: 11,
    thumbnailSrc: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "course-6",
    code: "15X008",
    title: "Interaction Homme-Machine",
    instructor: "Prof. Dubois",
    term: "Automne 2026",
    category: "Design & UX",
    description: "Principes heuristiques de Nielsen, ergonomie cognitive, prototypage et tests utilisateurs.",
    progress: 55,
    totalResources: 15,
    completedResources: 8,
    thumbnailSrc: "https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=800&auto=format&fit=crop&q=80",
  },
]

export default function CoursesPage() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")

  const categories = ["Tous", "Informatique", "Mathématiques", "Systèmes", "Design & UX"]

  const filteredCourses = mockCourses.filter((course) => {
    const matchSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.code.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(search.toLowerCase())
    const matchCat = selectedCategory === "Tous" || course.category === selectedCategory
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-6">
      {/* En-tête de section style Moodle moderne */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Vue d'ensemble des cours</h1>
            <Badge variant="outline" className="font-normal text-muted-foreground">
              Automne 2026
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Consultez vos cours UNIGE synchronisés, suivez votre avancement et accédez directement aux ressources.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Sparkles className="size-4 text-primary" />
            Synchroniser Moodle
          </Button>
        </div>
      </div>

      {/* Barre de recherche et filtres par catégorie */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, code, enseignant..."
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="text-xs h-8"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Grille responsive : 1 col sur mobile, 2 col sur tablette, 3 col sur desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="group relative flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-lg hover:ring-foreground/20 hover:-translate-y-0.5"
          >
            {/* Vignette couverture Moodle */}
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              <img
                src={course.thumbnailSrc}
                alt={course.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Code et Catégorie en superposition */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <Badge className="bg-black/60 backdrop-blur-md text-white font-mono border-white/20 text-xs">
                  {course.code}
                </Badge>
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-md text-xs font-normal">
                  {course.category}
                </Badge>
              </div>

              {/* Semestre & Enseignant en bas de vignette */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                <span className="font-medium text-white/90">{course.term}</span>
                <span className="flex items-center gap-1 text-white/80">
                  <GraduationCap className="size-3.5" />
                  {course.instructor}
                </span>
              </div>
            </div>

            {/* Titre et description */}
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base font-semibold leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                {course.title}
              </CardTitle>
              <CardDescription className="line-clamp-2 text-xs leading-relaxed mt-1">
                {course.description}
              </CardDescription>
            </CardHeader>

            {/* Progression & Métriques */}
            <div className="px-5 py-2 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-primary" />
                  Progression
                </span>
                <span className="font-semibold text-foreground">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-1.5" />

              <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Layers className="size-3" />
                  {course.completedResources} / {course.totalResources} ressources
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  Mis à jour hier
                </span>
              </div>
            </div>

            {/* Pied de carte avec actions */}
            <CardFooter className="p-5 pt-3 border-t bg-muted/20 flex items-center gap-2">
              <Button size="sm" className="w-full gap-2 text-xs font-medium">
                <BookOpen className="size-3.5" />
                Accéder au cours
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
                title="Ouvrir sur Moodle UNIGE"
              >
                <ExternalLink className="size-3.5" />
              </Button>
            </CardFooter>
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
              setSelectedCategory("Tous")
            }}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  )
}
