import { cloudinary } from "./cloudinary";
export async function destroyCloudinaryImage(
  publicId: string | null | undefined
): Promise<void> {
  if (!publicId) return;

  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result?.result !== "ok" && result?.result !== "not found") {
      console.error(
        `Cloudinary destroy for "${publicId}" returned unexpected result:`,
        result
      );
    }
  } catch (error) {
    console.error(`Failed to destroy Cloudinary image "${publicId}":`, error);
  }
}

export async function destroyCloudinaryImages(
  publicIds: Array<string | null | undefined>
): Promise<void> {
  await Promise.allSettled(publicIds.map((id) => destroyCloudinaryImage(id)));
}
