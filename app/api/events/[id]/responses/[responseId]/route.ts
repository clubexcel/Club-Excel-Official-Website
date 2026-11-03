import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/authorize-admin";
import { revalidateTag } from "next/cache";

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const URL_RE = /^https?:\/\/\S+/;
const NUMBER_RE = /^\d+$/;
const PHONE_RE = /^\+?[0-9\s-]{7,15}$/;

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string; responseId: string }>;
  }
) {
  try {
    const auth = await requireAdminAuth();

    if (!auth.success) {
      return auth.response;
    }

    const { id, responseId } = await params;

    const existing = await prisma.eventResponse.findFirst({
      where: { id: responseId, eventId: id },
    });

    if (!existing) {
      return Response.json(
        {
          success: false,
          message: "Response not found",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    const data: {
      name?: string;
      email?: string;
      phone?: string | null;
      college?: string | null;
      attendance?: boolean;
      answers?: Prisma.InputJsonValue;
    } = {};

    if (body.attendance !== undefined) {
      data.attendance = Boolean(body.attendance);
    }

    if (body.name !== undefined) {
      const name = String(body.name).trim();

      if (!name) {
        return Response.json(
          { success: false, message: "Name cannot be empty" },
          { status: 400 }
        );
      }

      data.name = name;
    }

    if (body.email !== undefined) {
      const email = String(body.email).trim();

      if (!email || !EMAIL_RE.test(email)) {
        return Response.json(
          { success: false, message: "Email must be a valid email" },
          { status: 400 }
        );
      }

      data.email = email;
    }

    if (body.phone !== undefined) {
      const phone = body.phone === null ? null : String(body.phone).trim();

      if (phone && !PHONE_RE.test(phone)) {
        return Response.json(
          { success: false, message: "Phone number must be valid" },
          { status: 400 }
        );
      }

      data.phone = phone || null;
    }

    if (body.college !== undefined) {
      const college =
        body.college === null ? null : String(body.college).trim();
      data.college = college || null;
    }

    if (body.answers !== undefined) {
      const event = await prisma.event.findUnique({
        where: { id },
        include: { formFields: true },
      });

      const answers = { ...body.answers } as Prisma.JsonObject;

      for (const field of event?.formFields ?? []) {
        if (field.type === "FILE") {
          const existingAnswers =
            (existing.answers as Record<
              string,
              Prisma.JsonValue | undefined
            >) ?? {};
          const existingValue = existingAnswers[field.name];
          if (existingValue !== undefined) {
            answers[field.name] = existingValue;
          }
          continue;
        }

        const value = answers[field.name];
        const normalized = typeof value === "string" ? value.trim() : value;

        if (field.required && (!normalized || normalized === "")) {
          return Response.json(
            {
              success: false,
              message: `${field.label} is required.`,
            },
            { status: 400 }
          );
        }

        if (!normalized) continue;

        switch (field.type) {
          case "EMAIL":
            if (!EMAIL_RE.test(String(normalized))) {
              return Response.json(
                {
                  success: false,
                  message: `${field.label} must be a valid email.`,
                },
                { status: 400 }
              );
            }
            break;
          case "NUMBER":
            if (!NUMBER_RE.test(String(normalized))) {
              return Response.json(
                { success: false, message: `${field.label} must be numeric.` },
                { status: 400 }
              );
            }
            break;
          case "PHONE":
            if (!PHONE_RE.test(String(normalized))) {
              return Response.json(
                {
                  success: false,
                  message: `${field.label} must be a valid phone number.`,
                },
                { status: 400 }
              );
            }
            break;
          case "URL":
            if (!URL_RE.test(String(normalized))) {
              return Response.json(
                {
                  success: false,
                  message: `${field.label} must be a valid URL.`,
                },
                { status: 400 }
              );
            }
            break;
          default:
            break;
        }
      }

      data.answers = answers;
    }

    const response = await prisma.eventResponse.update({
      where: { id: responseId },
      data,
    });

    revalidateTag("events", "max");

    return Response.json(
      {
        success: true,
        message: "Response updated successfully",
        response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update response:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update response",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string; responseId: string }>;
  }
) {
  try {
    const auth = await requireAdminAuth();

    if (!auth.success) {
      return auth.response;
    }

    const { id, responseId } = await params;

    const existing = await prisma.eventResponse.findFirst({
      where: { id: responseId, eventId: id },
    });

    if (!existing) {
      return Response.json(
        {
          success: false,
          message: "Response not found",
        },
        { status: 404 }
      );
    }

    await prisma.eventResponse.delete({
      where: { id: responseId },
    });

    revalidateTag("events", "max");

    return Response.json(
      {
        success: true,
        message: "Response deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete response:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete response",
      },
      { status: 500 }
    );
  }
}
