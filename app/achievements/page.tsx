import { getAchievements } from "@/features/achievements/actions/achievements";
import Achievements from "@/features/achievements/components/Achievements";

export const revalidate = 86400;

export default async function Page() {
  const achievements = await getAchievements();

  return <Achievements achievements={achievements} />;
}
