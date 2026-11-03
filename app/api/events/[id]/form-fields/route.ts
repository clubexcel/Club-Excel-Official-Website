import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/authorize-admin";

export async function POST(
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

    const {
      name,
      label,
      type,
      required = false,
      placeholder,
      order,
    } = await request.json();

    const event = await prisma.eventFormField.create({
      data: {
        eventId: id,
        name,
        label,
        type,
        required,
        placeholder,
        order,
      },
    });

    return Response.json(
      {
        success: true,
        message: "Form field created successfully",
        event,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed in creating form field", error);

    return Response.json(
      {
        success: false,
        message: "Failed to create form field",
      },
      {
        status: 500,
      }
    );
  }
}
