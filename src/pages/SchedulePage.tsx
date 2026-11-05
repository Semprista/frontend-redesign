import { useMemo, useState } from "react"
import { ArrowDown, ArrowUp, CheckCheck, Plus, Settings2, Trash2, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  defaultPlanningPreferences,
  demoPlanningSlots,
  importIcs,
  mergePlanning,
  planningDays,
  planningSources,
  toMinutes,
  type PlannedSlot,
  type PlanningPreferences,
  type PlanningSlot,
  type PlanningSource,
} from "@/data/planning"
import { useLocalStorage } from "@/hooks/use-local-storage"

const hourHeight = 44

export default function SchedulePage() {
  const [slots, setSlots] = useLocalStorage<PlanningSlot[]>("frontend-redesign:planning:slots", demoPlanningSlots)
  const [preferences, setPreferences] = useLocalStorage<PlanningPreferences>("frontend-redesign:planning:preferences", defaultPlanningPreferences)
  const planned = useMemo(() => mergePlanning(slots, preferences), [slots, preferences])
  const moved = planned.filter((slot) => slot.status === "moved")
  const conflicts = planned.filter((slot) => slot.status === "conflict")

  function applyMoves() {
    const positions = new Map(planned.map((slot) => [slot.id, slot]))
    setSlots((current) => current.map((slot) => {
      const plannedSlot = positions.get(slot.id)
      return plannedSlot?.status === "moved"
        ? { ...slot, day: plannedSlot.day, start: plannedSlot.start, end: plannedSlot.end }
        : slot
    }))
  }

  return (
    <div className="grid gap-6 pt-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Emploi du temps</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">Cours UNIGE, travail, sport et vie personnelle réunis dans un seul planning.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AddSlot onAdd={(slot) => setSlots((current) => [...current, slot])} />
          <ImportCalendar onImport={(imported) => setSlots((current) => [...current, ...imported])} />
          <PreferencesDialog preferences={preferences} onChange={setPreferences} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        {(Object.keys(planningSources) as PlanningSource[]).map((source) => (
          <span key={source} className={`rounded-full border px-2.5 py-0.5 ${planningSources[source].className}`}>
            {planningSources[source].emoji} {planningSources[source].label}
          </span>
        ))}
      </div>

      {(moved.length > 0 || conflicts.length > 0) && (
        <Card size="sm">
          <CardHeader>
            <CardTitle>🧩 Ajustements proposés</CardTitle>
            <CardDescription>Les créneaux sont réorganisés selon tes priorités.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            {moved.map((slot) => <p key={slot.id}><Badge variant="outline">Déplacé</Badge> <strong>{slot.title}</strong> <span className="text-muted-foreground">{planningDays[slot.day]} {slot.start}–{slot.end}</span></p>)}
            {conflicts.map((slot) => (
              <p key={slot.id} className="flex flex-wrap items-center gap-2">
                <Badge variant="destructive">Conflit</Badge><strong>{slot.title}</strong><span className="text-muted-foreground">{planningDays[slot.day]} {slot.start}–{slot.end}</span>
                <Button size="xs" variant="ghost" onClick={() => setSlots((current) => current.filter((item) => item.id !== slot.id))}>Retirer</Button>
              </p>
            ))}
            {moved.length > 0 && <Button onClick={applyMoves} className="justify-self-start"><CheckCheck /> Valider les déplacements</Button>}
          </CardContent>
        </Card>
      )}

      <WeekView slots={planned} onDelete={(id) => setSlots((current) => current.filter((slot) => slot.id !== id))} preferences={preferences} />
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => setSlots(demoPlanningSlots)}>Recharger l’exemple</Button>
        <Button variant="ghost" size="sm" onClick={() => setSlots([])}>Tout effacer</Button>
      </div>
    </div>
  )
}

function WeekView({ slots, onDelete, preferences }: { slots: PlannedSlot[]; onDelete: (id: string) => void; preferences: PlanningPreferences }) {
  const firstHour = Math.floor(toMinutes(preferences.startHour) / 60)
  const lastHour = Math.ceil(toMinutes(preferences.endHour) / 60)
  const hours = Array.from({ length: lastHour - firstHour }, (_, index) => firstHour + index)

  return (
    <>
      <div className="grid gap-4 md:hidden">
        {planningDays.map((day, index) => (
          <div key={day} className="grid gap-2">
            <h3 className="text-sm font-semibold">{day}</h3>
            {slots.filter((slot) => slot.day === index).map((slot) => <SlotBlock key={slot.id} slot={slot} onDelete={onDelete} />)}
            {slots.every((slot) => slot.day !== index) && <p className="text-xs text-muted-foreground">Libre</p>}
          </div>
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-xl border md:block">
        <div className="grid min-w-[760px]" style={{ gridTemplateColumns: "48px repeat(7, 1fr)" }}>
          <div />
          {planningDays.map((day) => <div key={day} className="border-b border-l p-2 text-center text-xs font-semibold">{day}</div>)}
          <div className="relative" style={{ height: hours.length * hourHeight }}>
            {hours.map((hour, index) => <span key={hour} className="absolute right-1 text-[10px] text-muted-foreground" style={{ top: index * hourHeight - 6 }}>{hour}h</span>)}
          </div>
          {planningDays.map((day, index) => (
            <div key={day} className="relative border-l" style={{ height: hours.length * hourHeight }}>
              {hours.map((hour, row) => <div key={hour} className="absolute inset-x-0 border-t border-dashed border-border/60" style={{ top: row * hourHeight }} />)}
              {slots.filter((slot) => slot.day === index).map((slot) => {
                const top = ((toMinutes(slot.start) - firstHour * 60) / 60) * hourHeight
                const height = ((toMinutes(slot.end) - toMinutes(slot.start)) / 60) * hourHeight
                return <div key={slot.id} className="absolute inset-x-1" style={{ top, height: Math.max(height, 22) }}><SlotBlock slot={slot} compact onDelete={onDelete} /></div>
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function SlotBlock({ slot, compact, onDelete }: { slot: PlannedSlot; compact?: boolean; onDelete: (id: string) => void }) {
  const source = planningSources[slot.source]
  return (
    <div title={slot.reason} className={`group relative flex h-full flex-col overflow-hidden rounded-md border p-1.5 text-xs ${source.className} ${slot.status === "conflict" ? "ring-2 ring-destructive" : ""} ${slot.status === "moved" ? "border-dashed" : ""}`}>
      <span className="truncate font-semibold">{source.emoji} {slot.title}</span>
      <span className="opacity-80">{slot.start}–{slot.end}{slot.fixed ? " · fixe" : ""}{slot.status === "moved" ? " · déplacé" : ""}{slot.status === "conflict" ? " · conflit" : ""}</span>
      <button onClick={() => onDelete(slot.id)} className={`absolute right-1 top-1 rounded p-0.5 hover:bg-black/10 ${compact ? "opacity-0 group-hover:opacity-100" : ""}`} aria-label={`Supprimer ${slot.title}`}><Trash2 className="size-3" /></button>
    </div>
  )
}

function AddSlot({ onAdd }: { onAdd: (slot: PlanningSlot) => void }) {
  return (
    <Dialog>
      <DialogTrigger render={<Button />}><Plus /> Ajouter</DialogTrigger>
      <DialogContent>
        <form className="grid gap-5" onSubmit={(event) => {
          event.preventDefault()
          const form = new FormData(event.currentTarget)
          onAdd({ id: crypto.randomUUID(), title: String(form.get("title")), source: form.get("source") as PlanningSource, day: Number(form.get("day")), start: String(form.get("start")), end: String(form.get("end")), fixed: form.get("fixed") === "on" })
        }}>
          <DialogHeader><DialogTitle>Nouvelle activité</DialogTitle><DialogDescription>Un cours, un shift, un entraînement ou un rendez-vous.</DialogDescription></DialogHeader>
          <div className="grid gap-3">
            <input name="title" required placeholder="Titre" className="h-9 rounded-md border bg-background px-2 text-sm" />
            <select name="source" className="h-9 rounded-md border bg-background px-2 text-sm" defaultValue="personnel">{(Object.keys(planningSources) as PlanningSource[]).map((source) => <option key={source} value={source}>{planningSources[source].emoji} {planningSources[source].label}</option>)}</select>
            <select name="day" className="h-9 rounded-md border bg-background px-2 text-sm">{planningDays.map((day, index) => <option key={day} value={index}>{day}</option>)}</select>
            <div className="grid grid-cols-2 gap-3"><input name="start" type="time" required defaultValue="18:00" className="h-9 rounded-md border bg-background px-2 text-sm" /><input name="end" type="time" required defaultValue="19:00" className="h-9 rounded-md border bg-background px-2 text-sm" /></div>
            <label className="flex items-center gap-2 text-sm"><input name="fixed" type="checkbox" className="size-4" /> Horaire fixe</label>
          </div>
          <DialogFooter><DialogClose render={<Button variant="outline" type="button" />}>Annuler</DialogClose><DialogClose render={<Button type="submit" />}>Ajouter</DialogClose></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function ImportCalendar({ onImport }: { onImport: (slots: PlanningSlot[]) => void }) {
  const [source, setSource] = useState<PlanningSource>("unige")
  const [message, setMessage] = useState<string | null>(null)
  return (
    <Dialog onOpenChange={() => setMessage(null)}>
      <DialogTrigger render={<Button variant="outline" />}><Upload /> Importer</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Importer un calendrier (.ics)</DialogTitle><DialogDescription>Importe un horaire UNIGE ou un agenda Google/Outlook.</DialogDescription></DialogHeader>
        <div className="grid gap-3">
          <select value={source} onChange={(event) => setSource(event.target.value as PlanningSource)} className="h-9 rounded-md border bg-background px-2 text-sm">{(Object.keys(planningSources) as PlanningSource[]).map((item) => <option key={item} value={item}>{planningSources[item].emoji} {planningSources[item].label}</option>)}</select>
          <input type="file" accept=".ics,text/calendar" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; const imported = importIcs(await file.text(), source); if (imported.length === 0) return setMessage("Aucun événement trouvé dans ce fichier."); onImport(imported); setMessage(`${imported.length} activité(s) importée(s) ✅`) }} className="text-sm" />
          {message && <p className="text-sm">{message}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function PreferencesDialog({ preferences, onChange }: { preferences: PlanningPreferences; onChange: (value: PlanningPreferences) => void }) {
  const move = (index: number, direction: -1 | 1) => {
    const priorities = [...preferences.priorities]
    const target = index + direction
    if (target < 0 || target >= priorities.length) return
    ;[priorities[index], priorities[target]] = [priorities[target], priorities[index]]
    onChange({ ...preferences, priorities })
  }
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}><Settings2 /> Priorités</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Mes priorités</DialogTitle><DialogDescription>La catégorie la plus haute garde son créneau en cas de chevauchement.</DialogDescription></DialogHeader>
        <ol className="grid gap-1.5">{preferences.priorities.map((source, index) => <li key={source} className={`flex items-center gap-2 rounded-lg border p-2 text-sm ${planningSources[source].className}`}><span className="w-5 font-semibold">{index + 1}.</span><span className="flex-1">{planningSources[source].emoji} {planningSources[source].label}</span><Button size="icon-xs" variant="ghost" onClick={() => move(index, -1)} aria-label="Monter"><ArrowUp /></Button><Button size="icon-xs" variant="ghost" onClick={() => move(index, 1)} aria-label="Descendre"><ArrowDown /></Button></li>)}</ol>
        <div className="grid grid-cols-3 gap-3">
          <label className="grid gap-1 text-xs">Début<input type="time" value={preferences.startHour} onChange={(event) => onChange({ ...preferences, startHour: event.target.value })} className="h-9 rounded-md border bg-background px-2 text-sm" /></label>
          <label className="grid gap-1 text-xs">Fin<input type="time" value={preferences.endHour} onChange={(event) => onChange({ ...preferences, endHour: event.target.value })} className="h-9 rounded-md border bg-background px-2 text-sm" /></label>
          <label className="grid gap-1 text-xs">Pause<input type="number" min={0} max={60} step={5} value={preferences.breakMinutes} onChange={(event) => onChange({ ...preferences, breakMinutes: Number(event.target.value) })} className="h-9 rounded-md border bg-background px-2 text-sm" /></label>
        </div>
        <DialogFooter><DialogClose render={<Button />}>Terminé</DialogClose></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
