import { useState } from "react"
import {
  Sparkles,
  Send,
  Bot,
  User,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function TutorPage() {
  const [selectedCourse, setSelectedCourse] = useState("11X001")
  const [inputMessage, setInputMessage] = useState("")

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Bonjour Alexandre ! Je suis ton tuteur IA pour l'UNIGE. Sur quel cours ou notion as-tu besoin d'explications aujourd'hui ?",
    },
    {
      role: "user",
      content: "Peux-tu m'expliquer simplement le Théorème des Valeurs Intermédiaires en Analyse I ?",
    },
    {
      role: "assistant",
      content:
        "Avec plaisir ! 🎯 Le Théorème des Valeurs Intermédiaires (TVI) dit que si une fonction f est continue sur un intervalle [a, b], elle prend toutes les valeurs comprises entre f(a) et f(b). En clair : si tu traces la courbe sans lever ton crayon d'un point A à un point B, tu es certain de couper toutes les lignes horizontales intermédiaires.",
    },
  ])

  const courses = [
    { code: "11X001", name: "Analyse I" },
    { code: "12X002", name: "Algorithmique" },
    { code: "11X010", name: "Probabilités & Stats" },
    { code: "13X005", name: "Bases de Données" },
  ]

  const handleSend = () => {
    if (!inputMessage.trim()) return
    setMessages((prev) => [
      ...prev,
      { role: "user", content: inputMessage },
      {
        role: "assistant",
        content: `Excellente question sur ${courses.find((c) => c.code === selectedCourse)?.name}. Voici une piste pour t'aider à débloquer ce point...`,
      },
    ])
    setInputMessage("")
  }

  return (
    <div className="space-y-6">
      {/* Header épuré */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Tuteur IA</h1>
            <Badge variant="secondary" className="gap-1 font-normal text-xs">
              <Sparkles className="size-3 text-primary" /> IA Connectée
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Posez vos questions sur vos cours Moodle et obtenez des explications adaptées.
          </p>
        </div>

        {/* Sélecteur de cours sobre */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {courses.map((c) => (
            <Button
              key={c.code}
              variant={selectedCourse === c.code ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedCourse(c.code)}
              className="h-8 text-xs font-normal"
            >
              {c.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Fenêtre de discussion épurée */}
      <Card size="sm" className="flex flex-col h-[520px] overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 text-xs leading-relaxed max-w-2xl ${
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-xl font-medium ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground border"
                }`}
              >
                {msg.role === "user" ? <User className="size-4" /> : <Bot className="size-4 text-primary" />}
              </div>
              <div
                className={`rounded-2xl p-3.5 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-muted/40 border text-foreground rounded-tl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div className="p-3 border-t bg-card flex items-center gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Posez votre question sur ce cours..."
            className="text-xs h-9 bg-muted/30"
          />
          <Button size="sm" onClick={handleSend} className="h-9 gap-1.5 text-xs px-3">
            <span>Envoyer</span>
            <Send className="size-3" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
