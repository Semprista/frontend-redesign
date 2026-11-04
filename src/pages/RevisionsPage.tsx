import {
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function RevisionsPage() {
  const topicsToReview = [
    {
      id: "rev-1",
      course: "Analyse I",
      topic: "Théorème des Valeurs Intermédiaires",
      status: "urgent",
      retentionRate: 45,
      interval: "Aujourd'hui",
      difficulty: "Difficile",
    },
    {
      id: "rev-2",
      course: "Algorithmique",
      topic: "Complexité temporelle du Tri Fusion",
      status: "soon",
      retentionRate: 70,
      interval: "Demain",
      difficulty: "Moyen",
    },
    {
      id: "rev-3",
      course: "Bases de Données",
      topic: "Formes Normales & Dépendances Fonctionnelles",
      status: "normal",
      retentionRate: 85,
      interval: "Dans 3 jours",
      difficulty: "Moyen",
    },
    {
      id: "rev-4",
      course: "Probabilités",
      topic: "Formule de Bayes & Conditionnement",
      status: "urgent",
      retentionRate: 40,
      interval: "Aujourd'hui",
      difficulty: "Difficile",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Révisions Intelligentes</h1>
            <Badge variant="outline" className="font-normal text-xs">Répétition espacée</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Mémorisez durablement les concepts clés avant vos examens de session.
          </p>
        </div>

        <Button size="sm" className="gap-2 text-xs">
          <Sparkles className="size-3.5" />
          Session express (10 min)
        </Button>
      </div>

      {/* Liste des cartes de révision façon flashcards légères */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topicsToReview.map((item) => (
          <Card key={item.id} size="sm" className="p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-[10px] font-mono">
                  {item.course}
                </Badge>
                <Badge
                  variant={item.status === "urgent" ? "default" : "outline"}
                  className="text-[10px] font-normal"
                >
                  {item.interval}
                </Badge>
              </div>

              <h3 className="font-semibold text-sm leading-snug">
                <a href={`#${item.id}`} className="hover:text-primary transition-colors">
                  {item.topic}
                </a>
              </h3>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Rétention estimée</span>
                <span className="font-semibold text-foreground">{item.retentionRate}%</span>
              </div>
              <Progress value={item.retentionRate} className="h-1" />
            </div>

            <div className="pt-2 border-t flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Difficulté : {item.difficulty}</span>
              <Button size="sm" variant="outline" className="h-7 text-xs px-2.5">
                Réviser le concept
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
