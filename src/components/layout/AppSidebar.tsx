import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  History,
  LayoutDashboard,
  Trophy,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "./NavMain"
import { NavUser } from "./NavUser"

// Données mockées de navigation
const navigationGroups = [
  {
    label: "Apprentissage",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Tuteur IA", url: "/tutor", icon: GraduationCap, badge: "IA" },
      { title: "Mes Cours", url: "/courses", icon: BookOpen },
      { title: "Évaluations", url: "/evaluations", icon: ClipboardCheck },
      { title: "Révisions", url: "/revisions", icon: History },
    ],
  },
  {
    label: "Gestion & Motivation",
    items: [
      { title: "Planning", url: "/schedule", icon: CalendarDays },
      { title: "Récompenses", url: "/rewards", icon: Trophy, badge: "Niv. 4" },
    ],
  },
]

// Mock de l'étudiant
const mockUser = {
  name: "Alexandre Dupont",
  email: "alexandre.dupont@etu.unige.ch",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  level: 4,
  xp: 1450,
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <a href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                    UN
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Tuteur UNIGE</span>
                    <span className="truncate text-xs text-muted-foreground">
                      Assistant d'études
                    </span>
                  </div>
                </a>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain groups={navigationGroups} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={mockUser} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
