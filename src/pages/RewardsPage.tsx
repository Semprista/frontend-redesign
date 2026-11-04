import {
  Flame,
  Coins,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function RewardsPage() {
  const profile = {
    level: 4,
    title: "Étudiant Assidu",
    xp: 1450,
    nextLevelXp: 2000,
    streak: 5,
    coins: 350,
  }

  const weeklyQuests = [
    { id: "q1", title: "Compléter 3 quiz d'entraînement", current: 2, total: 3, reward: 50, claimed: false },
    { id: "q2", title: "Consulter le Tuteur IA 2 jours d'affilée", current: 2, total: 2, reward: 75, claimed: true },
    { id: "q3", title: "Réviser 5 notions d'Analyse I", current: 3, total: 5, reward: 40, claimed: false },
  ]

  const badges = [
    { name: "Premier Pas", desc: "Première question posée au Tuteur", unlocked: true, icon: "🌱" },
    { name: "Série Ardente", desc: "Maintenir 5 jours de série consécutifs", unlocked: true, icon: "🔥" },
    { name: "Sans Faute", desc: "Obtenir 100% à un examen blanc", unlocked: false, icon: "🎯" },
    { name: "Organisateur Pro", desc: "Compléter l'emploi du temps de la semaine", unlocked: true, icon: "📅" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Récompenses & Gamification</h1>
            <Badge variant="outline" className="font-normal text-xs">Motivation</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Valorisez vos efforts : gagnez des points d'XP, des pièces et débloquez des badges.
          </p>
        </div>
      </div>

      {/* Résumé de progression */}
      <Card size="sm" className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-muted/20">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary text-xl font-bold">
            UN
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-base">Niveau {profile.level} • {profile.title}</h3>
            <p className="text-xs text-muted-foreground">
              {profile.xp} / {profile.nextLevelXp} XP pour atteindre le niveau {profile.level + 1}
            </p>
            <Progress value={(profile.xp / profile.nextLevelXp) * 100} className="h-1.5 w-52 md:w-64" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="border rounded-xl px-3 py-2 bg-background text-center min-w-[70px]">
            <p className="text-sm font-bold flex items-center justify-center gap-1">
              <Flame className="size-3.5 text-orange-500 fill-orange-500" /> {profile.streak}j
            </p>
            <p className="text-[10px] text-muted-foreground">Série</p>
          </div>
          <div className="border rounded-xl px-3 py-2 bg-background text-center min-w-[70px]">
            <p className="text-sm font-bold flex items-center justify-center gap-1">
              <Coins className="size-3.5 text-amber-500" /> {profile.coins}
            </p>
            <p className="text-[10px] text-muted-foreground">Pièces</p>
          </div>
        </div>
      </Card>

      {/* 2 Colonnes : Défis de la semaine + Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quêtes hebdomadaires */}
        <Card size="sm" className="p-4 space-y-3">
          <CardHeader className="p-0 pb-1">
            <CardTitle className="text-base font-semibold">Défis de la semaine</CardTitle>
            <CardDescription className="text-xs">Renouvellement chaque lundi</CardDescription>
          </CardHeader>
          <div className="space-y-2.5">
            {weeklyQuests.map((q) => (
              <div key={q.id} className="p-3 border rounded-xl bg-card/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{q.title}</span>
                  <span className="text-[11px] font-mono text-muted-foreground">{q.current}/{q.total}</span>
                </div>
                <Progress value={(q.current / q.total) * 100} className="h-1" />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-muted-foreground">+{q.reward} pièces</span>
                  <Button
                    size="sm"
                    variant={q.claimed ? "secondary" : q.current >= q.total ? "default" : "outline"}
                    disabled={q.claimed || q.current < q.total}
                    className="h-6 text-[11px] px-2"
                  >
                    {q.claimed ? "Récupéré" : q.current >= q.total ? "Récupérer" : "En cours"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Badges débloqués */}
        <Card size="sm" className="p-4 space-y-3">
          <CardHeader className="p-0 pb-1">
            <CardTitle className="text-base font-semibold">Badges académiques</CardTitle>
            <CardDescription className="text-xs">Vos accomplissements débloqués</CardDescription>
          </CardHeader>
          <div className="grid grid-cols-2 gap-2.5">
            {badges.map((b, idx) => (
              <div
                key={idx}
                className={`p-3 border rounded-xl flex items-center gap-3 text-xs ${
                  b.unlocked ? "bg-card/60" : "opacity-50 bg-muted/20"
                }`}
              >
                <div className="text-2xl">{b.icon}</div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground text-xs leading-none">{b.name}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
