import { Role } from "@prisma/client";
import { ValidationError } from "./utils";

export const SOCIAL_PLATFORMS = [
  "linkedin",
  "github",
  "twitter",
  "instagram",
  "portfolio",
  "other",
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export interface MemberLinkInput {
  platform: SocialPlatform;
  url: string;
}

export interface MemberFormInput {
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  year: string | null;
  designation: string | null;
  skills: string[];
  links: MemberLinkInput[];
  image: File | null;
}

const URL_PATTERN = /^https?:\/\/\S+$/i;

function isSocialPlatform(value: unknown): value is SocialPlatform {
  return (
    typeof value === "string" &&
    (SOCIAL_PLATFORMS as readonly string[]).includes(value)
  );
}

function parseSkills(raw: FormDataEntryValue | null): string[] {
  if (!raw || typeof raw !== "string") {
    return [];
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new ValidationError("Skills must be valid JSON");
  }

  if (!Array.isArray(parsed)) {
    throw new ValidationError("Skills must be an array");
  }

  return parsed
    .filter((skill): skill is string => typeof skill === "string")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function parseLinks(raw: FormDataEntryValue | null): MemberLinkInput[] {
  if (!raw || typeof raw !== "string") {
    return [];
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new ValidationError("Links must be valid JSON");
  }

  if (!Array.isArray(parsed)) {
    throw new ValidationError("Links must be an array");
  }

  return parsed.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new ValidationError(`Link ${index + 1} is invalid`);
    }

    const { platform, url } = item as Record<string, unknown>;

    if (typeof url !== "string" || !url.trim()) {
      throw new ValidationError(`Link ${index + 1} is missing a URL`);
    }

    const trimmedUrl = url.trim();

    if (!URL_PATTERN.test(trimmedUrl)) {
      throw new ValidationError(
        `Link ${index + 1} must be a valid http(s) URL`
      );
    }

    return {
      platform: isSocialPlatform(platform) ? platform : "other",
      url: trimmedUrl,
    };
  });
}

function parseRole(raw: FormDataEntryValue | null): Role {
  if (
    typeof raw === "string" &&
    (Object.values(Role) as string[]).includes(raw)
  ) {
    return raw as Role;
  }

  return Role.MEMBER;
}

function requiredString(
  formData: FormData,
  field: string,
  label: string
): string {
  const value = formData.get(field);
  const trimmed = typeof value === "string" ? value.trim() : "";

  if (!trimmed) {
    throw new ValidationError(`${label} is required`);
  }

  return trimmed;
}

function optionalString(formData: FormData, field: string): string | null {
  const value = formData.get(field);
  const trimmed = typeof value === "string" ? value.trim() : "";

  return trimmed || null;
}

function optionalImage(formData: FormData): File | null {
  const image = formData.get("image");

  return image instanceof File && image.size > 0 ? image : null;
}

function parseMemberForm(formData: FormData): MemberFormInput {
  const name = requiredString(formData, "name", "Name");
  const email = requiredString(formData, "email", "Email");
  const role = parseRole(formData.get("role"));
  const phone = optionalString(formData, "phone");
  const year = optionalString(formData, "year");
  const designation = optionalString(formData, "designation");
  const skills = parseSkills(formData.get("skills"));
  const links = parseLinks(formData.get("links"));
  const image = optionalImage(formData);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    throw new ValidationError("Enter a valid email address");
  }

  if (role !== Role.ADVISOR && skills.length === 0) {
    throw new ValidationError("At least one skill is required");
  }

  return {
    name,
    email,
    phone,
    role,
    year,
    designation,
    skills,
    links,
    image,
  };
}

export function createMemberSchema(formData: FormData): MemberFormInput {
  return parseMemberForm(formData);
}

export function updateMemberSchema(formData: FormData): MemberFormInput {
  return parseMemberForm(formData);
}

export interface TeamQueryInput {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  role: Role | "ALL";
}

const SORTABLE_FIELDS = ["name", "year", "designation", "createdAt"];

export function teamQuerySchema(searchParams: URLSearchParams): TeamQueryInput {
  const pageRaw = searchParams.get("page");
  const limitRaw = searchParams.get("limit");
  const sortByRaw = searchParams.get("sortBy");
  const sortOrderRaw = searchParams.get("sortOrder");
  const roleRaw = searchParams.get("role");

  const page = pageRaw ? parseInt(pageRaw, 10) : 1;
  const limit = limitRaw ? parseInt(limitRaw, 10) : 12;

  if (!Number.isFinite(page) || page < 1) {
    throw new ValidationError("Page must be a positive number");
  }

  if (!Number.isFinite(limit) || limit < 1 || limit > 100) {
    throw new ValidationError("Limit must be between 1 and 100");
  }

  const sortBy =
    sortByRaw && SORTABLE_FIELDS.includes(sortByRaw) ? sortByRaw : "createdAt";

  const sortOrder: "asc" | "desc" = sortOrderRaw === "asc" ? "asc" : "desc";

  const validRoles = [...(Object.values(Role) as string[]), "ALL"];
  const role: Role | "ALL" =
    roleRaw && validRoles.includes(roleRaw) ? (roleRaw as Role | "ALL") : "ALL";

  return { page, limit, sortBy, sortOrder, role };
}
