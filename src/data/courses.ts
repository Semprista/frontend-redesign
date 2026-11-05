import imgUrl from '@/assets/mesh-gradient.webp'
import img1Url from '@/assets/mesh-gradient-1.webp'
import img2Url from '@/assets/mesh-gradient-2.webp'
import img3Url from '@/assets/mesh-gradient-3.webp'
import img4Url from '@/assets/mesh-gradient-4.webp'
import img5Url from '@/assets/mesh-gradient-5.webp'

export const courseSource = {
  MOODLE: "Moodle",
  PERSONAL: "Personnelle"
}

export interface CourseObjective {
  title: string
  completed: boolean
}

export interface CourseFile {
  name: string
  size: string
}

export interface ActivityNotion {
  title: string
  description: string
  mastered: boolean
}

export interface CourseActivity {
  id: string
  title: string
  description: string
  files: CourseFile[]
  notions: ActivityNotion[]
  analysisStatus: "analyzing" | "completed"
}

export interface CourseDeadline {
  id: string
  title: string
  dueDate: string
  type: string
}

export interface Course {
  id: string
  source: string,
  title: string
  code: string // Ex: 6 caractères (11X001, 12X002, etc.)
  faculty: string // Faculté / Centre / Institut de rattachement
  teachers: string[] // Le ou les enseignants
  thumbnailSrc: string
  description: string,
  objectives: CourseObjective[]
  files: CourseFile[]
  activities: CourseActivity[]
  deadlines: CourseDeadline[]
  source_url?: string,
  mediaserver_url?: string
}

export const mockCourses: Course[] = [
  {
    id: "course-1",
    source: courseSource.MOODLE,
    code: "D200025-2026",
    title: "Base de données - 2026",
    faculty: "Centre Universitaire d'Informatique",
    teachers: ["Jolita Ralyte"],
    thumbnailSrc: imgUrl,
    description: "L'objectifs du cours - savoir créer, modifier et interroger des bases de données relationnelles.\nLe cours présentera les fondements des bases de données relationnelles:\nModèle de données rationnel: concepts de base, dépendances fonctionnelles, formes normales et normalisation\n- Algèbre relationnelle\n- SQL: création, modification et interrogation des bases de données\n - Transactions et la gestion de la concurrence ",
    objectives: [
      { title: "Comprendre les fondements des bases de données relationnelles", completed: true },
      { title: "Modéliser des données avec l'algèbre relationnelle", completed: false },
      { title: "Créer, modifier et interroger une base de données en SQL", completed: false },
      { title: "Gérer les transactions et la concurrence", completed: false },
    ],
    files: [
      { name: "Support de cours - Introduction.pdf", size: "2,4 Mo" },
      { name: "Exercices SQL.zip", size: "1,8 Mo" },
      { name: "Schéma relationnel.png", size: "640 Ko" },
    ],
    activities: [
      {
        id: "activity-1",
        title: "Semaine 1 — Introduction aux bases de données",
        description: "Première séance consacrée aux concepts fondamentaux et au modèle relationnel.",
        files: [
          { name: "Support de cours - Introduction.pdf", size: "2,4 Mo" },
          { name: "Schéma relationnel.png", size: "640 Ko" },
        ],
        notions: [
          {
            title: "Modèle relationnel",
            description: "Représentation des données sous forme de relations et de tables.",
            mastered: true,
          },
          {
            title: "Dépendances fonctionnelles",
            description: "Relations entre les attributs permettant de structurer un schéma.",
            mastered: false,
          },
        ],
        analysisStatus: "completed",
      },
      {
        id: "activity-2",
        title: "Semaine 2 — Premières requêtes SQL",
        description: "Travail pratique sur la création et l'interrogation de bases de données.",
        files: [
          { name: "Exercices SQL.zip", size: "1,8 Mo" },
        ],
        notions: [
          {
            title: "Requêtes SELECT",
            description: "Interrogation de tables pour extraire les données recherchées.",
            mastered: false,
          },
          {
            title: "Filtrage avec WHERE",
            description: "Restriction des résultats selon des conditions.",
            mastered: false,
          },
        ],
        analysisStatus: "completed",
      },
    ],
    deadlines: [
      { id: "deadline-1", title: "Rendu des exercices SQL", dueDate: "Vendredi 7 novembre", type: "Devoir" },
      { id: "deadline-2", title: "Quiz sur le modèle relationnel", dueDate: "Lundi 10 novembre", type: "Quiz" },
    ],
    source_url: "https://moodle.unige.ch/enrol/index.php?id=20624",
    mediaserver_url: "https://mediaserver.unige.ch/play/294112"
  },
  {
    id: "course-2",
    source: courseSource.MOODLE,
    code: "12X002",
    title: "Algorithmique et structures de données",
    faculty: "Centre Universitaire d'Informatique",
    teachers: ["Dr. Rossi"],
    thumbnailSrc: img1Url,
    description: "Complexité temporelle, tris, récursivité, arbres, graphes et tables de hachage.",
    objectives: [
      { title: "Analyser la complexité d'un algorithme", completed: false },
      { title: "Implémenter des structures de données classiques", completed: false },
      { title: "Choisir une solution adaptée à un problème algorithmique", completed: false },
    ],
    files: [],
    activities: [],
    deadlines: [],
  },
  {
    id: "course-3",
    source: courseSource.MOODLE,
    code: "11X010",
    title: "Probabilités et statistiques",
    faculty: "Faculté des sciences",
    teachers: ["Prof. Keller"],
    thumbnailSrc: img2Url,
    description: "Espaces probabilisés, variables aléatoires discrètes et continues, lois usuelles et estimation.",
    objectives: [
      { title: "Maîtriser les concepts fondamentaux des probabilités", completed: false },
      { title: "Modéliser des phénomènes avec des variables aléatoires", completed: false },
      { title: "Appliquer les méthodes d'estimation statistique", completed: false },
    ],
    files: [],
    activities: [],
    deadlines: [],
  },
  {
    id: "course-4",
    source: courseSource.MOODLE,
    code: "14X004",
    title: "Systèmes informatiques & architecture",
    faculty: "Centre Universitaire d'Informatique",
    teachers: ["Prof. Benali", "Dr. Meyer"],
    thumbnailSrc: img3Url,
    description: "Architecture matérielle de von Neumann, assembleur, processus et gestion de la mémoire virtuelle.",
    objectives: [
      { title: "Comprendre l'architecture d'un système informatique", completed: false },
      { title: "Écrire et lire des programmes en assembleur", completed: false },
      { title: "Expliquer la gestion des processus et de la mémoire", completed: false },
    ],
    files: [],
    activities: [],
    deadlines: [],
  },
  {
    id: "course-5",
    source: courseSource.MOODLE,
    code: "13X005",
    title: "Bases de données relationnelles",
    faculty: "Faculté d'économie et de management (GSEM)",
    teachers: ["Dr. Laurent"],
    thumbnailSrc: img4Url,
    description: "Modèle relationnel, normalisation, algèbre relationnelle et requêtes SQL avancées.",
    objectives: [
      { title: "Concevoir un schéma relationnel normalisé", completed: false },
      { title: "Écrire des requêtes SQL avancées", completed: false },
      { title: "Optimiser l'accès aux données", completed: false },
    ],
    files: [],
    activities: [],
    deadlines: [],
  },
  {
    id: "course-6",
    source: courseSource.MOODLE,
    code: "15X008",
    title: "Interaction homme-machine",
    faculty: "Centre Universitaire d'Informatique",
    teachers: ["Prof. Dubois"],
    thumbnailSrc: img5Url,
    description: "Principes heuristiques de Nielsen, ergonomie cognitive, prototypage et tests utilisateurs.",
    objectives: [
      { title: "Appliquer les principes d'ergonomie et d'utilisabilité", completed: false },
      { title: "Concevoir des prototypes interactifs", completed: false },
      { title: "Évaluer une interface avec des tests utilisateurs", completed: false },
    ],
    files: [],
    activities: [],
    deadlines: [],
  },
]
