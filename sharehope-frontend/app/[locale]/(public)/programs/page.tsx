import ProgramsContent from "@/components/public/ProgramsContent";
import type { PublicProgram } from "@/types/program";
import { fetchBackend } from "@/lib/server/backend-fetch";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8080";

export default async function ProgramsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let programs: PublicProgram[] | undefined;
  try {
    const response = await fetchBackend(`${backendUrl}/api/public/programs?locale=${encodeURIComponent(locale)}`, { cache: "no-store" });
    if (response.ok) programs = await response.json() as PublicProgram[];
  } catch {
    // Keep the built-in program content available while the API is offline.
  }

  return <ProgramsContent locale={locale} programs={programs} />;
}
