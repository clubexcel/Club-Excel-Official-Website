import prisma from "@/lib/prisma";
import { RecruitmentDriveStatus } from "@prisma/client";
import { unstable_cache } from "next/cache";

export interface RecruitmentStatus {
  isOpen: boolean;
  opensAt: Date | null;
  driveId: string | null;
}

const getRecruitmentDriveStatus = unstable_cache(
  async (): Promise<RecruitmentStatus> => {
    const now = new Date();

    const drives = await prisma.recruitmentDrive.findMany({
      where: {
        status: { not: RecruitmentDriveStatus.CLOSED },
      },
      select: {
        id: true,
        status: true,
        registrationStart: true,
        registrationEnd: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const isActive = (d: (typeof drives)[number]) => {
      if (d.registrationStart) {
        const started = now >= d.registrationStart;
        const notEnded = !d.registrationEnd || now <= d.registrationEnd;
        return started && notEnded;
      }
      return d.status === RecruitmentDriveStatus.OPEN;
    };

    const activeCandidates = drives.filter(isActive);

    if (activeCandidates.length > 1) {
      console.warn(
        `[recruitment-status] ${activeCandidates.length} recruitment drives are simultaneously active (${activeCandidates
          .map((d) => d.id)
          .join(", ")}). Using the most recently created one — close or ` +
          `set an end date on the others to avoid ambiguity.`
      );
    }

    const active = activeCandidates[0];
    if (active) {
      return { isOpen: true, opensAt: null, driveId: active.id };
    }

    const next = drives
      .filter((d) => d.registrationStart && d.registrationStart > now)
      .sort(
        (a, b) =>
          a.registrationStart!.getTime() - b.registrationStart!.getTime()
      )[0];

    return {
      isOpen: false,
      opensAt: next?.registrationStart ?? null,
      driveId: next?.id ?? null,
    };
  },
  ["recruitment-drive-status"],
  { tags: ["recruitments"], revalidate: 60 }
);

export default getRecruitmentDriveStatus;
