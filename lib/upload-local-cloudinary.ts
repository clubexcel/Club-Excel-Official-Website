import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { cloudinary } from "@/lib/cloudinary";
import type { CloudinaryUploadResult } from "@/lib/upload-image-cloudinary";

export async function uploadLocalImageToCloudinary(
  imagePath: string,
  folder: string
): Promise<CloudinaryUploadResult> {
  const absolutePath = path.join(process.cwd(), "public", imagePath);

  const buffer = await fs.readFile(absolutePath);

  const originalFileName =
    path
      .basename(imagePath, path.extname(imagePath))
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image";

  const publicId = `${originalFileName}-${randomUUID().slice(0, 8)}`;

  const result = await new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          public_id: publicId,
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);

          if (!result?.secure_url || !result?.public_id) {
            return reject(new Error("Cloudinary upload failed."));
          }

          resolve(result);
        }
      )
      .end(buffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}
