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

export interface Course {
  id: string
  source: string,
  title: string
  code: string // Ex: 6 caractères (11X001, 12X002, etc.)
  faculty: string // Faculté / Centre / Institut de rattachement
  teachers: string[] // Le ou les enseignants
  thumbnailSrc: string
  description: string,
  objectives: string[]
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
      "Comprendre les fondements des bases de données relationnelles",
      "Modéliser des données avec l'algèbre relationnelle",
      "Créer, modifier et interroger une base de données en SQL",
      "Gérer les transactions et la concurrence",
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
      "Analyser la complexité d'un algorithme",
      "Implémenter des structures de données classiques",
      "Choisir une solution adaptée à un problème algorithmique",
    ],
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
      "Maîtriser les concepts fondamentaux des probabilités",
      "Modéliser des phénomènes avec des variables aléatoires",
      "Appliquer les méthodes d'estimation statistique",
    ],
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
      "Comprendre l'architecture d'un système informatique",
      "Écrire et lire des programmes en assembleur",
      "Expliquer la gestion des processus et de la mémoire",
    ],
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
      "Concevoir un schéma relationnel normalisé",
      "Écrire des requêtes SQL avancées",
      "Optimiser l'accès aux données",
    ],
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
      "Appliquer les principes d'ergonomie et d'utilisabilité",
      "Concevoir des prototypes interactifs",
      "Évaluer une interface avec des tests utilisateurs",
    ],
  },
]
