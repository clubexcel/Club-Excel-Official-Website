import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/authorize-admin";
import { revalidateTag } from "next/cache";
import { Gender, Locality } from "@prisma/client";

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const INSTITUTE_EMAIL_RE = /^[a-zA-Z0-9._%+-]+@nist\.edu$/i;
const URL_RE = /^https?:\/\/\S+/;
const NUMBER_RE = /^\d+$/;
const PHONE_RE = /^\+?[0-9\s-]{7,15}$/;
const REQUIRED_TEXT_FIELDS = [
  "name",
  "rollNumber",
  "registrationNo",
  "nistEmail",
  "personalEmail",
  "branch",
  "hackerrankId",
  "phoneNumber",
  "techStack",
] as const;

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
        { success: false, message: "Drive id is required" },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page")!) || 1;
    const limit = parseInt(searchParams.get("limit")!) || 15;
    const skip = (page - 1) * limit;

    const [responses, total] = await Promise.all([
      prisma.recruitmentResponse.findMany({
        where: { recruitmentId: id },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.recruitmentResponse.count({ where: { recruitmentId: id } }),
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
    console.error("Failed to fetch recruitment responses:", error);

    return Response.json(
      { success: false, message: "Failed to fetch responses" },
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
        { success: false, message: "Drive id is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    for (const field of REQUIRED_TEXT_FIELDS) {
      if (!body[field] || !String(body[field]).trim()) {
        return Response.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    if (!body.gender || !Object.values(Gender).includes(body.gender)) {
      return Response.json(
        { success: false, message: "A valid gender is required" },
        { status: 400 }
      );
    }

    if (!body.locality || !Object.values(Locality).includes(body.locality)) {
      return Response.json(
        { success: false, message: "A valid locality is required" },
        { status: 400 }
      );
    }

    if (!INSTITUTE_EMAIL_RE.test(body.nistEmail)) {
      return Response.json(
        {
          success: false,
          message: "NIST email must be a valid @nist.edu email",
        },
        { status: 400 }
      );
    }

    if (!EMAIL_RE.test(body.personalEmail)) {
      return Response.json(
        { success: false, message: "Personal email must be a valid email" },
        { status: 400 }
      );
    }

    if (INSTITUTE_EMAIL_RE.test(body.personalEmail)) {
      return Response.json(
        {
          success: false,
          message: "Personal email must not be an @nist.edu email",
        },
        { status: 400 }
      );
    }

    if (!PHONE_RE.test(body.phoneNumber)) {
      return Response.json(
        { success: false, message: "Phone number must be valid" },
        { status: 400 }
      );
    }

    const drive = await prisma.recruitmentDrive.findUnique({
      where: { id },
      include: { formFields: true },
    });

    if (!drive) {
      return Response.json(
        { success: false, message: "Recruitment drive not found" },
        { status: 404 }
      );
    }

    const now = new Date();

    if (drive.registrationStart && now < drive.registrationStart) {
      return Response.json(
        { success: false, message: "Applications have not opened yet." },
        { status: 400 }
      );
    }

    if (drive.registrationEnd && now > drive.registrationEnd) {
      return Response.json(
        { success: false, message: "Applications have closed." },
        { status: 400 }
      );
    }

    const answers = { ...(body.answers ?? {}) };

    for (const field of drive.formFields) {
      const value = answers[field.name];
      const normalized = typeof value === "string" ? value.trim() : value;

      if (field.required && (!normalized || normalized === "")) {
        return Response.json(
          { success: false, message: `${field.label} is required.` },
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

    const response = await prisma.recruitmentResponse.create({
      data: {
        recruitmentId: id,
        name: body.name.trim(),
        rollNumber: body.rollNumber.trim(),
        registrationNo: body.registrationNo.trim(),
        gender: body.gender,
        nistEmail: body.nistEmail.trim(),
        personalEmail: body.personalEmail.trim(),
        branch: body.branch.trim(),
        hackerrankId: body.hackerrankId.trim(),
        phoneNumber: body.phoneNumber.trim(),
        locality: body.locality,
        techStack: body.techStack.trim(),
        answers,
      },
    });

    revalidateTag("recruitments", "max");

    return Response.json(
      {
        success: true,
        message: "Application submitted successfully",
        response,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.code === "P2002") {
      return Response.json(
        {
          success: false,
          message: "You've already applied to this drive with this email.",
        },
        { status: 409 }
      );
    }

    console.error("Failed to submit recruitment application:", error);

    return Response.json(
      { success: false, message: "Failed to submit application" },
      { status: 500 }
    );
  }
}
