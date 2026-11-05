import { useState } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Link, useParams } from "react-router"
import { ArrowLeft, CheckCircle2, Circle, FileText, Lightbulb, LoaderCircle, WandSparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockCourses } from "@/data/courses"

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
  const [generalQuizAnswers, setGeneralQuizAnswers] = useState<Record<string, number>>({})
  const [generalQuizScore, setGeneralQuizScore] = useState<number | null>(null)
  const [generatedExercise, setGeneratedExercise] = useState<{
    title: string
    instruction: string
    hint: string
    sources: string[]
  } | null>(null)
  const [exercisePreferences, setExercisePreferences] = useState("")
  const [exerciseDifficulty, setExerciseDifficulty] = useState("Intermédiaire")
  const [exerciseFormat, setExerciseFormat] = useState("Problème guidé")
  const [exerciseSupport, setExerciseSupport] = useState("Avec une piste")

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

  const generateExercise = () => {
    const notionTitles = activity.notions.map((notion) => notion.title)
    const focus = notionTitles.join(" et ") || "les notions de l'activité"
    const preferences = exercisePreferences.trim()
    const support = exerciseSupport === "Sans aide"
      ? "sans aide intermédiaire"
      : exerciseSupport === "Correction détaillée"
        ? "avec une correction détaillée à consulter après votre tentative"
        : "avec une piste progressive à consulter si nécessaire"
    setGeneratedExercise({
      title: `${exerciseFormat} · ${exerciseDifficulty}`,
      instruction: `En vous appuyant uniquement sur « ${focus} », réalisez un ${exerciseFormat.toLowerCase()} de niveau ${exerciseDifficulty.toLowerCase()}. ${preferences || "Construisez un exemple concret et expliquez vos choix."} Travaillez ${support}.`,
      hint: `Commencez par isoler le rôle de chaque notion dans votre exemple. Vérifiez ensuite que votre réponse mobilise bien ${notionTitles.slice(1).join(" et ") || "la notion étudiée"} et justifiez chaque étape avec le vocabulaire du cours.`,
      sources: notionTitles,
    })
  }

  const generalQuiz = activity.analysisStatus !== "analyzing" && activity.notions.some((notion) => notion.quiz) ? (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const quizNotions = activity.notions.filter((notion) => notion.quiz)
        const score = quizNotions.reduce(
          (total, notion) =>
            total + (generalQuizAnswers[notion.title] === notion.quiz?.correctOption ? 1 : 0),
          0
        )
        setGeneralQuizScore(score)
        setActivities((current) =>
          current.map((item) =>
            item.id === activityId
              ? {
                  ...item,
                  notions: item.notions.map((notion) => {
                    const quiz = notion.quiz
                    const isCorrect = quiz
                      ? generalQuizAnswers[notion.title] === quiz.correctOption
                      : false
                    return isCorrect ? { ...notion, mastered: true } : notion
                  }),
                }
              : item
          )
        )
      }}
      className="space-y-5 rounded-2xl border bg-muted/20 p-5"
    >
      <div>
        <h2 className="text-lg font-semibold">Quiz général</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Répondez à une question sur chaque notion pour valider l’ensemble de l’activité.
        </p>
      </div>
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl border bg-background px-4 py-3 text-sm font-medium marker:hidden">
          <span>{generalQuizScore === null ? "Commencer le quiz" : "Revoir le quiz"}</span>
          <span className="text-muted-foreground transition-transform group-open:rotate-180">⌄</span>
        </summary>
        <div className="mt-5 space-y-5">
          {activity.notions.filter((notion) => notion.quiz).map((notion, notionIndex) => (
            <fieldset key={notion.title} className="space-y-3">
              <legend className="text-sm font-medium">
                {notionIndex + 1}. {notion.quiz?.question}
              </legend>
              <div className="space-y-2">
                {notion.quiz?.options.map((option, optionIndex) => (
                  <label key={option} className="flex cursor-pointer items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted">
                    <input
                      type="radio"
                      name={`general-quiz-${notion.title}`}
                      value={optionIndex}
                      checked={generalQuizAnswers[notion.title] === optionIndex}
                      onChange={() => setGeneralQuizAnswers((current) => ({ ...current, [notion.title]: optionIndex }))}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              Valider le quiz général
            </button>
            {generalQuizScore !== null && (
              <span className="text-sm font-medium text-muted-foreground">
                Score : {generalQuizScore}/{activity.notions.filter((notion) => notion.quiz).length}
              </span>
            )}
          </div>
        </div>
      </details>
    </form>
  ) : null

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
          {generalQuiz}
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
          <section className="mt-10 rounded-2xl border bg-muted/20 p-5">
            <div className="flex items-center gap-2">
              <WandSparkles className="size-4 text-primary" />
              <h2 className="text-lg font-semibold">S'entraîner</h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Créez un exercice ancré dans les notions de cette activité, comme dans un espace d’étude guidé.
            </p>
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Niveau</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Découverte", "Intermédiaire", "Défi"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setExerciseDifficulty(option)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${exerciseDifficulty === option ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Format</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Problème guidé", "Cas concret", "Question d’examen"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setExerciseFormat(option)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${exerciseFormat === option ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Accompagnement</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Avec une piste", "Correction détaillée", "Sans aide"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setExerciseSupport(option)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${exerciseSupport === option ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="exercise-preferences" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Consigne personnalisée <span className="normal-case">(facultatif)</span>
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
            </div>
            <button
              type="button"
              onClick={generateExercise}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <WandSparkles className="size-3.5" /> {generatedExercise ? "Régénérer l'exercice" : "Générer l'exercice"}
            </button>
            {generatedExercise && (
              <div className="mt-5 space-y-4 rounded-xl border bg-background p-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Exercice généré</p>
                  <h3 className="mt-1 font-medium">{generatedExercise.title}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {generatedExercise.sources.map((source) => (
                    <Badge key={source} variant="secondary" className="font-normal">{source}</Badge>
                  ))}
                </div>
                <p className="text-sm leading-relaxed">{generatedExercise.instruction}</p>
                <details>
                  <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                    <Lightbulb className="size-4 text-primary" /> Afficher une piste
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{generatedExercise.hint}</p>
                </details>
              </div>
            )}
          </section>
        </section>
      </div>
    </div>
  )
}
