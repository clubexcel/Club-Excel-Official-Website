import getRecruitmentDriveStatus from "@/lib/recruitment-status";

export async function GET() {
  try {
    const status = await getRecruitmentDriveStatus();

    return Response.json(
      {
        success: true,
        isOpen: status.isOpen,
        opensAt: status.opensAt,
        driveId: status.driveId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch recruitment drive status:", error);

    return Response.json(
      { success: false, isOpen: false, opensAt: null, driveId: null },
      { status: 500 }
    );
  }
}
