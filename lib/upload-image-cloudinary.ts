import { randomUUID } from "crypto";
import { cloudinary } from "./cloudinary";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

const uploadImageToCloudinary = async (
  image: File,
  folder: string
): Promise<CloudinaryUploadResult> => {
  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const originalFileName =
    image.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image";

  const publicId = `${originalFileName}-${randomUUID().slice(0, 8)}`;

  const uploadResult = await new Promise<{
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
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
  };
};

export default uploadImageToCloudinary;
