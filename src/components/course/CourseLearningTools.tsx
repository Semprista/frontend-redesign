import { useMemo, useState, type ReactNode } from "react"
import { CheckCircle2, GraduationCap, MessageCircle, NotebookPen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CourseActivity } from "@/data/courses"
import { Separator } from "@base-ui/react"

type LearningTool = "questions" | "validation"

export function ActivityLearningTools({
  activity,
  courseId,
  exercisePanel,
  onNotionValidated,
}: {
  activity: CourseActivity
  courseId: string
  exercisePanel?: ReactNode
  onNotionValidated?: (notionTitle: string) => void
}) {
  const [activeTool, setActiveTool] = useState<LearningTool>("questions")
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [validatedNotions, setValidatedNotions] = useState<string[]>([])
  const [notionIndex, setNotionIndex] = useState(0)

  const notions = useMemo(
    () => activity.notions.filter((notion) => notion.quiz),
    [activity],
  )
  const currentNotion = notions[notionIndex % Math.max(notions.length, 1)]

  const selectTool = (tool: LearningTool) => {
    setActiveTool(tool)
    setSelectedOption(null)
  }

  const validateAnswer = (option: number) => {
    setSelectedOption(option)
  }

  const validateNotion = () => {
    if (!currentNotion || validatedNotions.includes(currentNotion.title)) return
    setValidatedNotions((notions) => [...notions, currentNotion.title])
    onNotionValidated?.(currentNotion.title)
  }

  const nextNotion = () => {
    setNotionIndex((index) => index + 1)
    setSelectedOption(null)
  }

  return (
    <section className="space-y-5">

      <Separator />
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap />
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Tuteur</h2>
          </div>
        </div>
        <a href={`/courses/${courseId}/tutor`}>
          <Button variant="outline" size="sm">
            <MessageCircle /> Parler avec le Tuteur
          </Button>
        </a>
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="flex gap-2 lg:flex-col">
          <Button
            variant={activeTool === "questions" ? "secondary" : "ghost"}
            className="justify-start"
            onClick={() => selectTool("questions")}
          >
            <NotebookPen /> Générer un exercice
          </Button>
          <Button
            variant={activeTool === "validation" ? "secondary" : "ghost"}
            className="justify-start"
            onClick={() => selectTool("validation")}
          >
            <CheckCircle2 /> Valider mes notions
          </Button>
        </div>

        <Card size="sm">
          {activeTool === "questions" ? (
            exercisePanel ?? <EmptyToolState text="La génération d'exercice n'est pas disponible pour cette activité." />
          ) : (
            <NotionValidation
              notion={currentNotion}
              selectedOption={selectedOption}
              validated={Boolean(currentNotion && validatedNotions.includes(currentNotion.title))}
              onSelect={validateAnswer}
              onValidate={validateNotion}
              onNext={nextNotion}
              validatedCount={validatedNotions.length}
              total={notions.length}
            />
          )}
        </Card>
      </div>
    </section>
  )
}

function NotionValidation({
  notion,
  selectedOption,
  validated,
  onSelect,
  onValidate,
  onNext,
  validatedCount,
  total,
}: {
  notion?: CourseActivity["notions"][number]
  selectedOption: number | null
  validated: boolean
  onSelect: (option: number) => void
  onValidate: () => void
  onNext: () => void
  validatedCount: number
  total: number
}) {
  if (!notion?.quiz) return <EmptyToolState text="Aucune notion avec questionnaire n'est disponible dans ce cours." />
  const answered = selectedOption !== null
  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Validation de notion</CardTitle>
            <CardDescription>{notion.title} · {validatedCount}/{total} notion{total === 1 ? "" : "s"} validée{validatedCount === 1 ? "" : "s"}</CardDescription>
          </div>
          {validated && <Badge>Validée</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-medium">{notion.quiz.question}</p>
        <div className="grid gap-2">
          {notion.quiz.options.map((option, index) => (
            <button
              type="button"
              key={option}
              onClick={() => onSelect(index)}
              className={`rounded-xl border px-3 py-2 text-left text-sm transition-colors ${answered && index === notion.quiz?.correctOption ? "border-primary bg-primary/10" : answered && selectedOption === index ? "border-destructive bg-destructive/10" : "hover:bg-muted"
                }`}
            >
              {option}
            </button>
          ))}
        </div>
        {answered && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/50 p-3 text-sm">
            <span>{selectedOption === notion.quiz.correctOption ? "Réponse correcte. Vous pouvez valider cette notion." : "Cette réponse est à revoir avant de valider la notion."}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={onNext}>Autre notion</Button>
              <Button size="sm" onClick={onValidate} disabled={selectedOption !== notion.quiz.correctOption || validated}>Valider la notion</Button>
            </div>
          </div>
        )}
      </CardContent>
    </>
  )
}

function EmptyToolState({ text }: { text: string }) {
  return <CardContent><p className="text-sm text-muted-foreground">{text}</p></CardContent>
}
