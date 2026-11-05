export type PlanningSource = "unige" | "travail" | "revision" | "sport" | "personnel"

export type PlanningSlot = {
  id: string
  title: string
  source: PlanningSource
  day: number
  start: string
  end: string
  fixed: boolean
}

export type PlannedSlot = PlanningSlot & {
  status: "ok" | "moved" | "conflict"
  reason?: string
}

export type PlanningPreferences = {
  priorities: PlanningSource[]
  startHour: string
  endHour: string
  breakMinutes: number
}

export const planningDays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

export const planningSources: Record<PlanningSource, { label: string; emoji: string; className: string }> = {
  unige: { label: "Cours UNIGE", emoji: "🎓", className: "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-100 dark:border-blue-800" },
  travail: { label: "Travail", emoji: "💼", className: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-100 dark:border-amber-800" },
  revision: { label: "Révision", emoji: "📚", className: "bg-violet-100 text-violet-900 border-violet-300 dark:bg-violet-950 dark:text-violet-100 dark:border-violet-800" },
  sport: { label: "Sport", emoji: "⚽", className: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-100 dark:border-emerald-800" },
  personnel: { label: "Personnel", emoji: "🏠", className: "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-100 dark:border-rose-800" },
}

export const defaultPlanningPreferences: PlanningPreferences = {
  priorities: ["unige", "travail", "revision", "sport", "personnel"],
  startHour: "07:00",
  endHour: "22:00",
  breakMinutes: 15,
}

export const demoPlanningSlots: PlanningSlot[] = [
  { id: "p1", title: "Analyse I (cours)", source: "unige", day: 0, start: "08:15", end: "10:00", fixed: true },
  { id: "p2", title: "Algorithmique (TP)", source: "unige", day: 0, start: "14:15", end: "16:00", fixed: true },
  { id: "p3", title: "Football", source: "sport", day: 0, start: "15:30", end: "17:00", fixed: false },
  { id: "p4", title: "Probabilités (cours)", source: "unige", day: 1, start: "10:15", end: "12:00", fixed: true },
  { id: "p5", title: "Job étudiant — bibliothèque", source: "travail", day: 1, start: "13:00", end: "17:00", fixed: true },
  { id: "p6", title: "Révision Analyse", source: "revision", day: 1, start: "16:00", end: "17:30", fixed: false },
  { id: "p7", title: "Algorithmique (cours)", source: "unige", day: 2, start: "08:15", end: "10:00", fixed: true },
  { id: "p8", title: "Salle de sport", source: "sport", day: 2, start: "18:00", end: "19:30", fixed: false },
  { id: "p9", title: "Dîner en famille", source: "personnel", day: 3, start: "19:00", end: "21:00", fixed: false },
  { id: "p10", title: "Analyse I (exercices)", source: "unige", day: 3, start: "10:15", end: "12:00", fixed: true },
  { id: "p11", title: "Rendez-vous médecin", source: "personnel", day: 3, start: "11:00", end: "11:45", fixed: true },
  { id: "p12", title: "Job étudiant — bibliothèque", source: "travail", day: 4, start: "09:00", end: "13:00", fixed: true },
  { id: "p13", title: "Natation", source: "sport", day: 5, start: "10:00", end: "11:30", fixed: false },
]

export function toMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number)
  return hours * 60 + minutes
}

export function toTime(value: number) {
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`
}

function overlaps(a: { start: number; end: number }, b: { start: number; end: number }, margin = 0) {
  return a.start < b.end + margin && b.start < a.end + margin
}

export function mergePlanning(slots: PlanningSlot[], preferences: PlanningPreferences): PlannedSlot[] {
  const rank = (source: PlanningSource) => preferences.priorities.indexOf(source)
  const ordered = [...slots].sort((a, b) => Number(b.fixed) - Number(a.fixed) || rank(a.source) - rank(b.source))
  const occupied: { start: number; end: number }[][] = Array.from({ length: 7 }, () => [])
  const start = toMinutes(preferences.startHour)
  const end = toMinutes(preferences.endHour)
  const result: PlannedSlot[] = []

  const free = (day: number, interval: { start: number; end: number }, withBreak = false) =>
    occupied[day].every((item) => !overlaps(item, interval, withBreak ? preferences.breakMinutes : 0))

  for (const slot of ordered) {
    const interval = { start: toMinutes(slot.start), end: toMinutes(slot.end) }
    if (free(slot.day, interval)) {
      occupied[slot.day].push(interval)
      result.push({ ...slot, status: "ok" })
      continue
    }

    const blocking = result.find((item) => item.day === slot.day && overlaps({ start: toMinutes(item.start), end: toMinutes(item.end) }, interval))
    if (!slot.fixed) {
      const duration = interval.end - interval.start
      for (let offset = 0; offset < 7; offset += 1) {
        const day = (slot.day + offset) % 7
        const candidates = Array.from({ length: Math.floor((end - start - duration) / 15) + 1 }, (_, index) => start + index * 15)
          .sort((a, b) => Math.abs(a - interval.start) - Math.abs(b - interval.start))
        const candidate = candidates.find((candidateStart) => free(day, { start: candidateStart, end: candidateStart + duration }, true))
        if (candidate !== undefined) {
          const moved = { start: candidate, end: candidate + duration }
          occupied[day].push(moved)
          result.push({ ...slot, day, start: toTime(moved.start), end: toTime(moved.end), status: "moved", reason: blocking ? `Chevauche « ${blocking.title} ».` : "Chevauchement résolu automatiquement." })
          break
        }
      }
      if (result.some((item) => item.id === slot.id)) continue
    }
    result.push({ ...slot, status: "conflict", reason: blocking ? `En conflit avec « ${blocking.title} ».` : "Aucune place libre trouvée." })
  }
  return result.sort((a, b) => a.day - b.day || toMinutes(a.start) - toMinutes(b.start))
}

export function importIcs(text: string, source: PlanningSource): PlanningSlot[] {
  const unfolded = text.replace(/\r?\n[ \t]/g, "")
  const events = unfolded.split("BEGIN:VEVENT").slice(1)
  const seen = new Set<string>()
  return events.flatMap((event) => {
    const field = (name: string) => event.match(new RegExp(`^${name}(?:;[^:]*)?:(.*)$`, "m"))?.[1]?.trim()
    const start = parseIcsDate(field("DTSTART"))
    const end = parseIcsDate(field("DTEND"))
    if (!start || !end) return []
    const title = (field("SUMMARY") ?? "Sans titre").replace(/\\,/g, ",")
    const day = (start.getDay() + 6) % 7
    const slot = { id: crypto.randomUUID(), title, source, day, start: toTime(start.getHours() * 60 + start.getMinutes()), end: toTime(end.getHours() * 60 + end.getMinutes()), fixed: source === "unige" || source === "travail" }
    const key = `${slot.title}|${slot.day}|${slot.start}`
    if (seen.has(key)) return []
    seen.add(key)
    return [slot]
  })
}

function parseIcsDate(value?: string) {
  if (!value) return null
  const match = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?(Z)?/)
  if (!match) return null
  const [, year, month, day, hours, minutes, seconds = "00", utc] = match
  return utc
    ? new Date(Date.UTC(+year, +month - 1, +day, +hours, +minutes, +seconds))
    : new Date(+year, +month - 1, +day, +hours, +minutes, +seconds)
}
