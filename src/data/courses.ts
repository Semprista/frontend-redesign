import imgUrl from '@/assets/mesh-gradient.webp'
import img1Url from '@/assets/mesh-gradient-1.webp'
import img2Url from '@/assets/mesh-gradient-2.webp'
import img3Url from '@/assets/mesh-gradient-3.webp'
import img4Url from '@/assets/mesh-gradient-4.webp'
import img5Url from '@/assets/mesh-gradient-5.webp'

const source = {
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
  description: string
}

export const mockCourses: Course[] = [
  {
    id: "course-1",
    source: source.MOODLE,
    code: "D200025-2026",
    title: "Base de données - 2026",
    faculty: "Centre Universitaire d'Informatique",
    teachers: ["Jolita Ralyte"],
    thumbnailSrc: imgUrl,
    description: "L'objectifs du cours - savoir créer, modifier et interroger des bases de données relationnelles.\nLe cours présentera les fondements des bases de données relationnelles:\nModèle de données rationnel: concepts de base, dépendances fonctionnelles, formes normales et normalisation\n- Algèbre relationnelle\n- SQL: création, modification et interrogation des bases de données\n - Transactions et la gestion de la concurrence ",
  },
  {
    id: "course-2",
    source: source.MOODLE,
    code: "12X002",
    title: "Algorithmique et structures de données",
    faculty: "Centre Universitaire d'Informatique",
    teachers: ["Dr. Rossi"],
    thumbnailSrc: img1Url,
    description: "Complexité temporelle, tris, récursivité, arbres, graphes et tables de hachage.",
  },
  {
    id: "course-3",
    source: source.MOODLE,
    code: "11X010",
    title: "Probabilités et statistiques",
    faculty: "Faculté des sciences",
    teachers: ["Prof. Keller"],
    thumbnailSrc: img2Url,
    description: "Espaces probabilisés, variables aléatoires discrètes et continues, lois usuelles et estimation.",
  },
  {
    id: "course-4",
    source: source.MOODLE,
    code: "14X004",
    title: "Systèmes informatiques & architecture",
    faculty: "Centre Universitaire d'Informatique",
    teachers: ["Prof. Benali", "Dr. Meyer"],
    thumbnailSrc: img3Url,
    description: "Architecture matérielle de von Neumann, assembleur, processus et gestion de la mémoire virtuelle.",
  },
  {
    id: "course-5",
    source: source.MOODLE,
    code: "13X005",
    title: "Bases de données relationnelles",
    faculty: "Faculté d'économie et de management (GSEM)",
    teachers: ["Dr. Laurent"],
    thumbnailSrc: img4Url,
    description: "Modèle relationnel, normalisation, algèbre relationnelle et requêtes SQL avancées.",
  },
  {
    id: "course-6",
    source: source.MOODLE,
    code: "15X008",
    title: "Interaction homme-machine",
    faculty: "Centre Universitaire d'Informatique",
    teachers: ["Prof. Dubois"],
    thumbnailSrc: img5Url,
    description: "Principes heuristiques de Nielsen, ergonomie cognitive, prototypage et tests utilisateurs.",
  },
]
