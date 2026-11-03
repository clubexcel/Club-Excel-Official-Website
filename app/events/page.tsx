import Events from "@/features/events/components/Events";
import { getEvents } from "@/features/events/actions/events";

export const revalidate = 84600;

export default async function Page() {
  const events = await getEvents();

  return (
    <>
      <Events events={events} />
    </>
  );
}
