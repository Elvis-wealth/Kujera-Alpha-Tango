import { AuthView } from "./auth-view";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  return <AuthView initialView={view} />;
}
