import TodayClient from "./today-client";

type TodayPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TodayPage({ searchParams }: TodayPageProps) {
  const resolvedParams = (await searchParams) ?? {};
  const rawDay = resolvedParams.day;
  const day = Array.isArray(rawDay) ? rawDay[0] ?? "" : rawDay ?? "";

  return <TodayClient initialDay={day} />;
}
