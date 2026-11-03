import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export const requireAdminAuth = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return {
      success: false,
      response: Response.json(
        {
          success: false,
          message: "Unauthorized request",
        },
        {
          status: 401,
        }
      ),
    };
  }

  return {
    success: true,
    user: session.user,
  };
};
