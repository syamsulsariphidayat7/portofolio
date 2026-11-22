import type { Metadata } from "next";
import { ProjectsBody } from "@/components/ProjectsBody";

export const metadata: Metadata = {
  title: "Proyek — Syamsul",
};

export default function ProjectsPage() {
  return <ProjectsBody />;
}
