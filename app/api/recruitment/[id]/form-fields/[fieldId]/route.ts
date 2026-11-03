import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/authorize-admin";
import { revalidateTag } from "next/cache";

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string; fieldId: string }>;
  }
) {
  try {
    const auth = await requireAdminAuth();

    if (!auth.success) {
      return auth.response;
    }

    const { id, fieldId } = await params;

    const data = await request.json();

    const existingField = await prisma.recruitmentFormField.findFirst({
      where: { id: fieldId, recruitmentId: id },
    });

    if (!existingField) {
      return Response.json(
        { success: false, message: "Form field not found" },
        { status: 404 }
      );
    }

    const field = await prisma.recruitmentFormField.update({
      where: { id: fieldId },
      data: { ...data },
    });

    revalidateTag("recruitments", "max");

    return Response.json(
      {
        success: true,
        message: "Form field updated successfully",
        field,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update form field:", error);

    return Response.json(
      { success: false, message: "Failed to update form field" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string; fieldId: string }>;
  }
) {
  try {
    const auth = await requireAdminAuth();

    if (!auth.success) {
      return auth.response;
    }

    const { id, fieldId } = await params;

    const existingField = await prisma.recruitmentFormField.findFirst({
      where: { id: fieldId, recruitmentId: id },
    });

    if (!existingField) {
      return Response.json(
        { success: false, message: "Form field not found" },
        { status: 404 }
      );
    }

    await prisma.recruitmentFormField.delete({ where: { id: fieldId } });

    revalidateTag("recruitments", "max");

    return Response.json(
      { success: true, message: "Form field deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete form field:", error);

    return Response.json(
      { success: false, message: "Failed to delete form field" },
      { status: 500 }
    );
  }
}
