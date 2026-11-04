import { useState } from "react"
import {
  MapPin,
  Plus,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState("Lundi")

  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]

  const events = [
    {
      day: "Lundi",
      time: "08:15 - 10:00",
      title: "Analyse I",
      type: "Cours Magistral",
      location: "Uni Mail — MS150",
      category: "unige",
    },
    {
      day: "Lundi",
      time: "10:15 - 12:00",
      title: "Probabilités et Statistiques",
      type: "Exercices dirigés",
      location: "Sciences II — A300",
      category: "unige",
    },
    {
      day: "Lundi",
      time: "14:15 - 16:00",
      title: "Algorithmique",
      type: "Travaux Pratiques",
      location: "Battelle — Bâtiment A",
      category: "unige",
    },
    {
      day: "Lundi",
      time: "17:30 - 19:00",
      title: "Entraînement Football Universitaire",
      type: "Sport & Santé",
      location: "Centre sportif Bout-du-Monde",
      category: "sport",
    },
    {
      day: "Mardi",
      time: "09:15 - 11:00",
      title: "Bases de Données",
      type: "Cours Magistral",
      location: "Uni Mail — R060",
      category: "unige",
    },
    {
      day: "Mardi",
      time: "13:00 - 17:00",
      title: "Job étudiant — Bibliothèque Uni Mail",
      type: "Travail",
      location: "Accueil principal",
      category: "work",
    },
  ]

  const dayEvents = events.filter((e) => e.day === selectedDay)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Emploi du Temps</h1>
            <Badge variant="outline" className="font-normal text-xs">Semaine 42</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Planning unifié : cours universitaires, sessions de travail et loisirs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Plus className="size-3.5" />
            Ajouter un créneau
          </Button>
        </div>
      </div>

      {/* Onglets des jours */}
      <div className="flex items-center gap-2 border-b pb-2">
        {days.map((d) => (
          <Button
            key={d}
            variant={selectedDay === d ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSelectedDay(d)}
            className="text-xs h-8 font-normal"
          >
            {d}
          </Button>
        ))}
      </div>

      {/* Timeline liste propre et aérée */}
      <div className="space-y-3">
        {dayEvents.map((evt, idx) => (
          <Card key={idx} size="sm" className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-4">
              <div className="font-mono text-xs text-muted-foreground bg-muted/50 rounded-lg px-2.5 py-1.5 shrink-0">
                {evt.time}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{evt.title}</h3>
                  <Badge variant="secondary" className="text-[10px] font-normal">
                    {evt.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3" />
                  <span>{evt.location}</span>
                </div>
              </div>
            </div>

            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground self-end sm:self-center">
              Détails
            </Button>
          </Card>
        ))}

        {dayEvents.length === 0 && (
          <div className="p-8 text-center border border-dashed rounded-xl text-xs text-muted-foreground">
            Aucun événement prévu pour le {selectedDay}.
          </div>
        )}
      </div>
    </div>
  )
}
