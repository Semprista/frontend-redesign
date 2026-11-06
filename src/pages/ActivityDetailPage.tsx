import { useState } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Link, useParams } from "react-router"
import { ArrowLeft, CheckCircle2, Circle, FileText, Lightbulb, LoaderCircle, NotebookPen, WandSparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockCourses } from "@/data/courses"
import { ActivityLearningTools } from "@/components/course/CourseLearningTools"

export default function ActivityDetailPage() {
  const { courseId, activityId } = useParams()
  const course = mockCourses.find((item) => item.id === courseId)
  const [activities, setActivities] = useLocalStorage(
    `frontend-redesign:course:${courseId ?? "unknown"}:activities`,
    course?.activities ?? []
  )
  const storedActivity = activities.find((item) => item.id === activityId)
  const sourceActivity = course?.activities.find((item) => item.id === activityId)
  const activity = storedActivity
    ? {
      ...storedActivity,
      notions: storedActivity.notions.map((notion) => ({
        ...sourceActivity?.notions.find((sourceNotion) => sourceNotion.title === notion.title),
        ...notion,
      })),
    }
    : undefined
  const [generatedExercise, setGeneratedExercise] = useState<{
    title: string
    statement: string
    expected_skills: string[]
    hint: string | null
    solution: string | null
    sources: string[]
  } | null>(null)
  const [exercisePreferences, setExercisePreferences] = useState("")
  const [exerciseDifficulty, setExerciseDifficulty] = useState("Intermédiaire")
  const [exerciseFormat, setExerciseFormat] = useState("Problème guidé")
  const [exerciseSupport, setExerciseSupport] = useState("Avec une piste")
  const [isGeneratingExercise, setIsGeneratingExercise] = useState(false)
  const [exerciseError, setExerciseError] = useState<string | null>(null)

  const toggleNotion = (notionTitle: string) => {
    setActivities((current) =>
      current.map((item) =>
        item.id === activityId
          ? {
            ...item,
            notions: item.notions.map((notion) =>
              notion.title === notionTitle
                ? { ...notion, mastered: !notion.mastered }
                : notion
            ),
          }
          : item
      )
    )
  }

  if (!course || !activity) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
        <h2 className="text-lg font-semibold">Activité non trouvée</h2>
        <Link to={course ? `/courses/${course.id}` : "/courses"} className="mt-4 text-xs text-muted-foreground hover:text-foreground">
          Retour au cours
        </Link>
      </div>
    )
  }

  const generateExercise = async () => {
    const notionTitles = activity.notions.map((notion) => notion.title)
    setIsGeneratingExercise(true)
    setExerciseError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 700))
      const mainNotion = notionTitles[0] ?? "les notions de cette activité"
      const preference = exercisePreferences.trim()
      setGeneratedExercise({
        title: `${exerciseFormat} — ${mainNotion}`,
        statement: `À partir de la notion « ${mainNotion} », proposez une solution de niveau ${exerciseDifficulty.toLowerCase()}. Expliquez votre raisonnement étape par étape et justifiez vos choix.${preference ? ` Consigne ajoutée : ${preference}` : ""}`,
        expected_skills: notionTitles.length > 0 ? notionTitles : ["Compréhension du cours", "Raisonnement"],
        hint: exerciseSupport === "Sans aide"
          ? null
          : `Commencez par identifier la notion mobilisée et rappelez sa définition avant de résoudre le problème.`,
        solution: exerciseSupport === "Correction détaillée"
          ? `Une réponse attendue mobilise ${mainNotion}, explicite les étapes du raisonnement et vérifie le résultat obtenu.`
          : null,
        sources: notionTitles,
      })
    } catch (error) {
      setExerciseError(error instanceof Error ? error.message : "Une erreur inconnue est survenue.")
    } finally {
      setIsGeneratingExercise(false)
    }
  }

  return (
    <div className="space-y-5">
      <Link
        to={`/courses/${course.id}`}
        className="inline-flex items-center text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="mr-1.5 size-3.5" /> Retour au cours
      </Link>

      <div className="rounded-2xl border bg-muted p-6 sm:p-8">
        <Badge variant="outline" className="mb-3 bg-background">{course.code}</Badge>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{activity.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{activity.description}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <aside className="order-2 space-y-6 lg:sticky lg:top-6">
          <Card className="border bg-background shadow-none ring-0">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Notions abordées</CardTitle>
            </CardHeader>
            <CardContent>
              {activity.analysisStatus === "analyzing" ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <LoaderCircle className="size-4 animate-spin" /> Analyse en cours...
                </div>
              ) : (
                <ul className="space-y-1">
                  {activity.notions.map((notion) => (
                    <li key={notion.title}>
                      <a
                        href={`#notion-${notion.title}`}
                        className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted"
                      >
                        {notion.mastered ? (
                          <CheckCircle2 className="size-4 shrink-0 text-primary" />
                        ) : (
                          <Circle className="size-4 shrink-0 text-muted-foreground" />
                        )}
                        <span className="min-w-0 flex-1 truncate">{notion.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="border bg-background shadow-none ring-0">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Fichiers utilisés</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {activity.files.map((file) => (
                  <li key={file.name} className="flex items-center gap-2.5 text-sm">
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate">{file.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{file.size}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>

        <section className="order-1 min-w-0">
          {activity.analysisStatus === "analyzing" ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle className="size-4 animate-spin" /> Analyse des fichiers en cours...
            </div>
          ) : (
            <div className="divide-y border-y">
              {activity.notions.map((notion) => (
                <details key={notion.title} id={`notion-${notion.title}`} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center gap-3 text-base font-medium marker:hidden">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault()
                        toggleNotion(notion.title)
                      }}
                      aria-pressed={notion.mastered}
                      aria-label={notion.mastered ? `Marquer ${notion.title} comme à revoir` : `Marquer ${notion.title} comme maîtrisée`}
                      className="shrink-0 rounded-full transition-colors hover:text-primary"
                    >
                      {notion.mastered ? (
                        <CheckCircle2 className="size-5 text-primary" />
                      ) : (
                        <Circle className="size-5 text-muted-foreground" />
                      )}
                    </button>
                    <span className="flex-1">{notion.title}</span>
                    <span className="text-muted-foreground transition-transform group-open:rotate-180">⌄</span>
                  </summary>
                  <div className="space-y-5 pl-8 pt-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Résumé</p>
                      <p className="text-sm leading-7 text-muted-foreground">
                        {notion.summary ?? notion.description}
                      </p>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          )}
        </section>
      </div>

      <ActivityLearningTools
        activity={activity}
        courseId={course.id}
        onNotionValidated={(notionTitle) => {
          setActivities((current) =>
            current.map((item) =>
              item.id === activityId
                ? {
                  ...item,
                  notions: item.notions.map((notion) =>
                    notion.title === notionTitle ? { ...notion, mastered: true } : notion
                  ),
                }
                : item
            )
          )
        }}
        exercisePanel={
          <>
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <NotebookPen className="size-4" />
                </div>
                <div>
                  <CardTitle>Générer un exercice personnalisé</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Niveau</p>
                  <div className="flex flex-wrap gap-2">
                    {["Découverte", "Intermédiaire", "Défi"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setExerciseDifficulty(option)}
                        className={`rounded-xl border px-3 py-2 text-xs transition-colors ${exerciseDifficulty === option ? "border-primary bg-primary text-primary-foreground shadow-sm" : "bg-background hover:bg-muted"}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Type d’exercice</p>
                  <div className="flex flex-wrap gap-2">
                    {["Problème guidé", "Cas concret", "Question d’examen"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setExerciseFormat(option)}
                        className={`rounded-xl border px-3 py-2 text-xs transition-colors ${exerciseFormat === option ? "border-primary bg-primary text-primary-foreground shadow-sm" : "bg-background hover:bg-muted"}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Aide</p>
                  <div className="flex flex-wrap gap-2">
                    {["Avec une piste", "Correction détaillée", "Sans aide"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setExerciseSupport(option)}
                        className={`rounded-xl border px-3 py-2 text-xs transition-colors ${exerciseSupport === option ? "border-primary bg-primary text-primary-foreground shadow-sm" : "bg-background hover:bg-muted"}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="exercise-preferences" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Consigne personnalisée <span className="normal-case font-normal">(facultatif)</span>
                </label>
                <textarea
                  id="exercise-preferences"
                  value={exercisePreferences}
                  onChange={(event) => setExercisePreferences(event.target.value)}
                  placeholder="Ex. Utiliser un contexte de bibliothèque et demander une correction guidée..."
                  rows={3}
                  className="mt-2 w-full resize-y rounded-xl border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                <p className="text-xs text-muted-foreground">Les paramètres seront pris en compte par le tuteur IA.</p>
                <button
                  type="button"
                  onClick={generateExercise}
                  disabled={isGeneratingExercise}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  <WandSparkles className="size-3.5" /> {isGeneratingExercise ? "Génération en cours..." : generatedExercise ? "Régénérer l'exercice" : "Générer l'exercice"}
                </button>
              </div>
              {exerciseError && <p className="text-sm text-destructive">{exerciseError}</p>}
              {generatedExercise && (
                <div className="space-y-4 rounded-2xl border bg-muted/30 p-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Exercice généré</p>
                    <h3 className="mt-1 font-medium">{generatedExercise.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {generatedExercise.sources.map((source) => (
                      <Badge key={source} variant="secondary" className="font-normal">{source}</Badge>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed">{generatedExercise.statement}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {generatedExercise.expected_skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="font-normal">{skill}</Badge>
                    ))}
                  </div>
                  <details>
                    <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                      <Lightbulb className="size-4 text-primary" /> Afficher une piste
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{generatedExercise.hint ?? "Aucune piste demandée."}</p>
                  </details>
                  {generatedExercise.solution && (
                    <details>
                      <summary className="cursor-pointer text-sm font-medium">Afficher la correction</summary>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{generatedExercise.solution}</p>
                    </details>
                  )}
                </div>
              )}
            </CardContent>
          </>
        }
      />
    </div>
  )
}
