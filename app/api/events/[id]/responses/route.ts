import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/authorize-admin";
import { revalidateTag } from "next/cache";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminAuth();

    if (!auth.success) {
      return auth.response;
    }

    const { id } = await params;

    if (!id) {
      return Response.json(
        {
          success: false,
          message: "Event id is required",
        },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page")!) || 1;
    const limit = parseInt(searchParams.get("limit")!) || 15;
    const skip = (page - 1) * limit;

    const [responses, total] = await Promise.all([
      prisma.eventResponse.findMany({
        where: { eventId: id },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.eventResponse.count({ where: { eventId: id } }),
    ]);

    return Response.json(
      {
        success: true,
        message: "Responses fetched successfully",
        data: responses,
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
    console.error("Failed to fetch responses:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch responses",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        {
          success: false,
          message: "Event id is required",
        },
        { status: 400 }
      );
    }

    const { name, email, phone, college, answers } = await request.json();

    if (!name || !email) {
      return Response.json(
        {
          success: false,
          message: "Name and email are required",
        },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        formFields: true,
      },
    });

    if (!event) {
      return Response.json(
        {
          success: false,
          message: "Event not found",
        },
        { status: 404 }
      );
    }

    const now = new Date();

    if (event.registrationStart && now < event.registrationStart) {
      return Response.json(
        {
          success: false,
          message: "Registration has not started yet.",
        },
        { status: 400 }
      );
    }

    if (event.registrationEnd && now > event.registrationEnd) {
      return Response.json(
        {
          success: false,
          message: "Registration has ended.",
        },
        { status: 400 }
      );
    }

    for (const field of event.formFields) {
      if (
        field.required &&
        (!answers ||
          answers[field.name] === undefined ||
          answers[field.name] === "")
      ) {
        return Response.json(
          {
            success: false,
            message: `${field.label} is required.`,
          },
          { status: 400 }
        );
      }
    }

    const response = await prisma.eventResponse.create({
      data: {
        eventId: id,
        name,
        email,
        phone,
        college,
        answers: answers ?? {},
      },
    });

    revalidateTag("events", "max");

    return Response.json(
      {
        success: true,
        message: "Registration successful",
        response,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to submit response:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to submit response",
      },
      { status: 500 }
    );
  }
}
