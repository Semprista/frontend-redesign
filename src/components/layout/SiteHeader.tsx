import { useLocation } from "react-router"
import { Search, Flame, Coins, Bell } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/tutor": "Tuteur IA",
  "/courses": "Mes Cours",
  "/evaluations": "Évaluations",
  "/revisions": "Révisions",
  "/schedule": "Planning",
  "/rewards": "Récompenses",
}

export function SiteHeader() {
  const location = useLocation()
  const currentTitle = routeTitles[location.pathname] || "Page"

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/">Espace Étudiant</BreadcrumbLink>
            </BreadcrumbItem>
            {location.pathname !== "/" && (
              <>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
            {location.pathname === "/" && (
              <>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Aperçu</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-3">
        {/* Raccourci recherche */}
        <div className="relative hidden w-64 md:block">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un cours, quiz..."
            className="w-full bg-muted/40 pl-8 pr-4 text-sm"
          />
        </div>

        {/* Badges statut gamification */}
        <div className="flex items-center gap-1.5 rounded-full border bg-muted/30 px-2.5 py-1 text-xs font-medium">
          <Flame className="size-3.5 fill-orange-500 text-orange-500" />
          <span>5j</span>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border bg-muted/30 px-2.5 py-1 text-xs font-medium">
          <Coins className="size-3.5 fill-amber-500 text-amber-500" />
          <span>350</span>
        </div>

        {/* Notification button */}
        <Button variant="ghost" size="icon" className="relative size-8">
          <Bell className="size-4" />
          <span className="absolute right-1 top-1 flex size-2 rounded-full bg-primary" />
        </Button>
      </div>
    </header>
  )
}
