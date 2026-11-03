import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/authorize-admin";
import { revalidateTag, unstable_cache } from "next/cache";
import { RecruitmentDriveStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminAuth();

    if (!auth.success) {
      return auth.response;
    }

    const user = auth.user;

    if (!user) {
      return Response.json(
        { success: false, message: "User not authorized" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      title,
      description,
      year,
      status,
      registrationStart,
      registrationEnd,
      whatsappLink,
    } = body;

    if (!title) {
      return Response.json(
        { success: false, message: "Title is required" },
        { status: 400 }
      );
    }

    if (!year) {
      return Response.json(
        { success: false, message: "Year is required" },
        { status: 400 }
      );
    }

    if (whatsappLink && !/^https:\/\/\S+/.test(whatsappLink)) {
      return Response.json(
        { success: false, message: "WhatsApp link must be a valid https URL" },
        { status: 400 }
      );
    }

    const drive = await prisma.recruitmentDrive.create({
      data: {
        title,
        description,
        year: Number(year),
        status: status || undefined,
        registrationStart: registrationStart
          ? new Date(registrationStart)
          : null,
        registrationEnd: registrationEnd ? new Date(registrationEnd) : null,
        whatsappLink: whatsappLink || null,
        createdBy: user.id,
      },
    });

    revalidateTag("recruitments", "max");

    return Response.json(
      {
        success: true,
        message: `Recruitment drive "${drive.title}" created successfully`,
        drive,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create recruitment drive:", error);

    return Response.json(
      { success: false, message: "Failed to create recruitment drive" },
      { status: 500 }
    );
  }
}

const getCachedDrives = unstable_cache(
  async (
    where: Record<string, unknown>,
    skip: number,
    limit: number,
    sortBy: string,
    sortOrder: string
  ) => {
    const [drives, total] = await Promise.all([
      prisma.recruitmentDrive.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder as "asc" | "desc" },
        include: {
          _count: {
            select: { responses: true },
          },
        },
      }),
      prisma.recruitmentDrive.count({ where }),
    ]);

    return { drives, total };
  },
  ["recruitments-admin-list"],
  { tags: ["recruitments"], revalidate: 86400 }
);

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminAuth();

    if (!auth.success) {
      return auth.response;
    }

    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page")!) || 1;
    const limit = parseInt(searchParams.get("limit")!) || 10;
    const sortBy = searchParams.get("sortBy") || "year";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    const where = {
      ...(status ? { status: status as RecruitmentDriveStatus } : {}),
    };

    const { drives, total } = await getCachedDrives(
      where,
      skip,
      limit,
      sortBy,
      sortOrder
    );

    return Response.json(
      {
        success: true,
        message: "Recruitment drives fetched successfully",
        drives,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch recruitment drives:", error);

    return Response.json(
      { success: false, message: "Failed to fetch recruitment drives" },
      { status: 500 }
    );
  }
}
