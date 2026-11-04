import {
  Sparkles,
  Calendar,
  Trophy,
  Flame,
  ArrowRight,
  Brain,
} from "lucide-react"
import { Link } from "react-router"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function HomePage() {
  const user = {
    name: "Alexandre",
    streak: 5,
    xp: 1450,
    nextLevelXp: 2000,
    level: 4,
  }

  const todaySchedule = [
    { time: "08:15 - 10:00", title: "Analyse I — Cours magistral", room: "Auditoire A250" },
    { time: "10:15 - 12:00", title: "Probabilités & Statistiques — Exercices", room: "Salle 302" },
    { time: "14:15 - 16:00", title: "Algorithmique — TP Machine", room: "Labo Info 4" },
  ]

  const revisionsDue = [
    { course: "Analyse I", topic: "Théorème des valeurs intermédiaires", due: "Aujourd'hui", urgency: "high" },
    { course: "Algorithmique", topic: "Complexité du Tri Fusion O(n log n)", due: "Demain", urgency: "normal" },
    { course: "Bases de Données", topic: "3ème Forme Normale (3FN)", due: "Dans 2 jours", urgency: "normal" },
  ]

  return (
    <div className="space-y-6">
      {/* Salutation sobre et statut étudiant */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Bonjour, {user.name} 👋</h1>
            <Badge variant="outline" className="text-xs font-normal">
              Semestre d'Automne
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Voici un aperçu de vos priorités d'apprentissage aujourd'hui.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/tutor"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground h-8 px-3 text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            <Sparkles className="size-3.5" />
            Lancer le Tuteur IA
          </Link>
        </div>
      </div>

      {/* Bannière de progression / Gamification minimaliste */}
      <Card size="sm" className="overflow-hidden bg-muted/20">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
              Niv. {user.level}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Étudiant Assidu</span>
                <span className="text-xs text-muted-foreground">• {user.xp} / {user.nextLevelXp} XP</span>
              </div>
              <Progress value={(user.xp / user.nextLevelXp) * 100} className="h-1.5 w-48 md:w-64" />
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 border rounded-lg px-2.5 py-1.5 bg-background">
              <Flame className="size-3.5 text-orange-500 fill-orange-500" />
              <span>Série de <strong>{user.streak} jours</strong></span>
            </div>
            <div className="flex items-center gap-1.5 border rounded-lg px-2.5 py-1.5 bg-background">
              <Trophy className="size-3.5 text-amber-500" />
              <span><strong>350</strong> pièces</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid 2 colonnes équilibrée : Planning du jour + Révisions urgentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emploi du temps du jour */}
        <Card size="sm" className="flex flex-col justify-between">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <CardTitle className="text-base font-semibold">Programme du jour</CardTitle>
              </div>
              <Link
                to="/schedule"
                className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Voir tout <ArrowRight className="ml-1 size-3" />
              </Link>
            </div>
            <CardDescription className="text-xs">3 séances planifiées</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-1 space-y-2">
            {todaySchedule.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl border bg-card/60 hover:bg-muted/30 transition-colors text-xs"
              >
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground">{item.room}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-muted-foreground text-[11px]">{item.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Révisions à faire (Spaced repetition) */}
        <Card size="sm" className="flex flex-col justify-between">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="size-4 text-muted-foreground" />
                <CardTitle className="text-base font-semibold">Révisions recommandées</CardTitle>
              </div>
              <Link
                to="/revisions"
                className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Réviser <ArrowRight className="ml-1 size-3" />
              </Link>
            </div>
            <CardDescription className="text-xs">Basé sur la courbe de l'oubli</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-1 space-y-2">
            {revisionsDue.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl border bg-card/60 hover:bg-muted/30 transition-colors text-xs"
              >
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">{item.topic}</p>
                  <p className="text-[11px] text-muted-foreground">{item.course}</p>
                </div>
                <Badge
                  variant={item.urgency === "high" ? "default" : "secondary"}
                  className="text-[10px] font-normal"
                >
                  {item.due}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
