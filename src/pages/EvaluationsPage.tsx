import {
  Clock,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function EvaluationsPage() {
  const evaluations = [
    {
      id: "eval-1",
      title: "Quiz Rapide — Limites et Continuité",
      course: "Analyse I",
      questionsCount: 5,
      duration: "10 min",
      bestScore: 80,
      status: "completed",
    },
    {
      id: "eval-2",
      title: "Examen Blanc — Session d'Hiver",
      course: "Algorithmique",
      questionsCount: 15,
      duration: "45 min",
      bestScore: null,
      status: "pending",
    },
    {
      id: "eval-3",
      title: "Test de Connaissances — SQL & Jointures",
      course: "Bases de Données",
      questionsCount: 8,
      duration: "15 min",
      bestScore: 100,
      status: "completed",
    },
    {
      id: "eval-4",
      title: "Quiz Flash — Variables Aléatoires",
      course: "Probabilités",
      questionsCount: 6,
      duration: "12 min",
      bestScore: null,
      status: "pending",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Quiz & Examens</h1>
            <Badge variant="outline" className="font-normal text-xs">Auto-évaluation</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Testez vos acquis avec des quiz générés et des examens passés corrigés.
          </p>
        </div>

        <Button size="sm" className="gap-2 text-xs">
          <Sparkles className="size-3.5" />
          Générer un quiz d'entraînement
        </Button>
      </div>

      {/* Grid 2 colonnes des évaluations disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {evaluations.map((item) => (
          <Card key={item.id} size="sm" className="flex flex-col justify-between p-4 space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-[10px] font-mono">
                  {item.course}
                </Badge>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" />
                  {item.duration}
                </span>
              </div>
              <h3 className="font-semibold text-sm leading-snug">
                <a href={`#${item.id}`} className="hover:text-primary transition-colors">
                  {item.title}
                </a>
              </h3>
              <p className="text-xs text-muted-foreground">
                {item.questionsCount} questions basées sur les annales de cours.
              </p>
            </div>

            <div className="pt-2 border-t flex items-center justify-between text-xs">
              <span className="text-muted-foreground text-[11px]">
                {item.bestScore !== null ? `Meilleur score : ${item.bestScore}%` : "Pas encore tenté"}
              </span>
              <Button size="sm" variant={item.status === "completed" ? "outline" : "default"} className="h-7 text-xs px-2.5">
                {item.status === "completed" ? "Refaire" : "Commencer"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
