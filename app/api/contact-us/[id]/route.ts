import { NextRequest } from "next/server";
import { ContactInquiryStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/authorize-admin";
import { revalidateTag } from "next/cache";

export async function GET(
  _request: NextRequest,
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
          message: "Contact inquiry id is required",
        },
        { status: 400 }
      );
    }
    const inquiry = await prisma.contactInquiry.findUnique({
      where: {
        id,
      },
    });

    if (!inquiry) {
      return Response.json(
        {
          success: false,
          message: "Contact inquiry not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Contact inquiry fetched successfully",
        inquiry,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed in fetching contact inquiry", error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetch contact inquiry",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
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
          message: "Contact inquiry id is required",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, name, email, phoneNo, message } = body;

    const data: {
      status?: ContactInquiryStatus;
      name?: string;
      email?: string;
      phoneNo?: string;
      message?: string;
    } = {};

    if (status !== undefined) {
      if (!Object.values(ContactInquiryStatus).includes(status)) {
        return Response.json(
          { success: false, message: "Invalid status value" },
          { status: 400 }
        );
      }
      data.status = status;
    }

    if (name !== undefined) {
      const trimmed = String(name).trim();
      if (!trimmed) {
        return Response.json(
          { success: false, message: "Name cannot be empty" },
          { status: 400 }
        );
      }
      data.name = trimmed;
    }

    if (email !== undefined) {
      const trimmed = String(email).trim();
      if (!trimmed || !/^\S+@\S+\.\S+$/.test(trimmed)) {
        return Response.json(
          { success: false, message: "Email must be a valid email" },
          { status: 400 }
        );
      }
      data.email = trimmed;
    }

    if (phoneNo !== undefined) {
      data.phoneNo = String(phoneNo).trim();
    }

    if (message !== undefined) {
      const trimmed = String(message).trim();
      if (!trimmed) {
        return Response.json(
          { success: false, message: "Message cannot be empty" },
          { status: 400 }
        );
      }
      data.message = trimmed;
    }

    if (Object.keys(data).length === 0) {
      return Response.json(
        {
          success: false,
          message: "No fields to update",
        },
        { status: 400 }
      );
    }

    const updatedInquiry = await prisma.contactInquiry.update({
      where: {
        id,
      },
      data,
    });

    revalidateTag("contact-us", "max");

    return Response.json(
      {
        success: true,
        message: "Contact inquiry updated successfully",
        inquiry: updatedInquiry,
        status: updatedInquiry.status,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed in updating contact inquiry", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update contact inquiry",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
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
          message: "Contact inquiry id is required",
        },
        { status: 400 }
      );
    }

    const inquiry = await prisma.contactInquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      return Response.json(
        {
          success: false,
          message: "Contact inquiry not found",
        },
        { status: 404 }
      );
    }

    await prisma.contactInquiry.delete({
      where: { id },
    });

    revalidateTag("contact-us", "max");

    return Response.json(
      {
        success: true,
        message: "Contact inquiry deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed in deleting contact inquiry", error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete contact inquiry",
      },
      { status: 500 }
    );
  }
}
