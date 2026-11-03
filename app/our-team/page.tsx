import OurTeam from "@/features/our-team/components/OurTeam";
import { getAdvisors } from "@/features/our-team/actions/advisors";
import { getAlumni } from "@/features/our-team/actions/alumni";
import { getMembers } from "@/features/our-team/actions/members";

export const revalidate = 86400;

const page = async () => {
  const [advisors, members, alumni] = await Promise.all([
    getAdvisors(),
    getMembers(),
    getAlumni(),
  ]);
  return (
    <>
      <OurTeam advisors={advisors} members={members} alumni={alumni} />
    </>
  );
};

export default page;
