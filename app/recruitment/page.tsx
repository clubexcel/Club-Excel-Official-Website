import Recruitment from "@/components/Recruitment";
import RecruitmentClosed from "@/components/RecruitmentClosed";
import getRecruitmentDriveStatus from "@/lib/recruitment-status";

export const dynamic = "force-dynamic";

const Page = async () => {
  const status = await getRecruitmentDriveStatus();

  if (!status.isOpen || !status.driveId) {
    return <RecruitmentClosed opensAt={status.opensAt} />;
  }

  return <Recruitment driveId={status.driveId} />;
};

export default Page;
