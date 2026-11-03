import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { requireAdminAuth } from "@/lib/authorize-admin";
import { revalidateTag, unstable_cache } from "next/cache";

const getCachedInquiries = unstable_cache(
  async (skip: number, limit: number, sortBy: string, sortOrder: string) => {
    const [inquiries, total] = await Promise.all([
      prisma.contactInquiry.findMany({
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder as "asc" | "desc",
        },
      }),
      prisma.contactInquiry.count(),
    ]);

    return { inquiries, total };
  },
  ["contact-us-list"],
  { tags: ["contact-us"], revalidate: 86400 }
);

export async function POST(request: NextRequest) {
  try {
    const { name, email, phoneNo, message } = await request.json();

    if (!name || !email || !phoneNo || !message) {
      return Response.json(
        {
          success: false,
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name,
        email,
        phoneNo,
        message,
      },
    });

    revalidateTag("contact-us", "max");

    return Response.json(
      {
        success: true,
        message: "Your inquiry has been submitted successfully.",
        inquiry,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Failed to submit contact inquiry", error);

    return Response.json(
      {
        success: false,
        message: "Failed to submit contact inquiry",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminAuth();

    if (!auth.success) {
      return auth.response;
    }

    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page")!) || 1;
    const limit = parseInt(searchParams.get("limit")!) || 5;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const skip = (page - 1) * limit;

    const { inquiries, total } = await getCachedInquiries(
      skip,
      limit,
      sortBy,
      sortOrder
    );

    return Response.json(
      {
        success: true,
        message: "Contact Inquiries fetched successfully",
        data: inquiries,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed in fetching contact inquiries", error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetch contact inquiries",
      },
      {
        status: 500,
      }
    );
  }
}
