import { NextRequest } from "next/server";

export class ValidationError extends Error {}

export type ValidationResult<T> =
  { success: true; data: T } | { success: false; response: Response };

/**
 * Parses the request's multipart/urlencoded form data and runs it
 * through `parser`. `parser` should throw a `ValidationError` for
 * any bad input; anything it returns is treated as valid, parsed
 * data.
 */
export async function validateFormData<T>(
  request: NextRequest,
  parser: (formData: FormData) => T
): Promise<ValidationResult<T>> {
  try {
    const formData = await request.formData();
    const data = parser(formData);

    return { success: true, data };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        success: false,
        response: Response.json(
          { success: false, message: error.message },
          { status: 400 }
        ),
      };
    }

    console.error("Failed to parse form data:", error);

    return {
      success: false,
      response: Response.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      ),
    };
  }
}

/**
 * Parses the request's query string and runs it through `parser`.
 * `parser` should throw a `ValidationError` for any bad input;
 * anything it returns is treated as valid, parsed data.
 */
export function validateQuery<T>(
  request: NextRequest,
  parser: (searchParams: URLSearchParams) => T
): ValidationResult<T> {
  try {
    const data = parser(request.nextUrl.searchParams);

    return { success: true, data };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        success: false,
        response: Response.json(
          { success: false, message: error.message },
          { status: 400 }
        ),
      };
    }

    console.error("Failed to parse query params:", error);

    return {
      success: false,
      response: Response.json(
        { success: false, message: "Invalid query parameters" },
        { status: 400 }
      ),
    };
  }
}
