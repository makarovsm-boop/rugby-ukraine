import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { normalizeImagePath } from "@/lib/media-config";

export class UploadStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadStorageError";
  }
}

function getUploadExtension(file: File) {
  const originalName = file.name.trim();
  const parsedExtension = path.extname(originalName).toLowerCase();

  if (parsedExtension) {
    return parsedExtension;
  }

  if (file.type === "image/png") {
    return ".png";
  }

  if (file.type === "image/webp") {
    return ".webp";
  }

  if (file.type === "image/svg+xml") {
    return ".svg";
  }

  return ".jpg";
}

export async function resolveImageUpload({
  formData,
  folder,
  fallbackImage = "",
}: {
  formData: FormData;
  folder: "articles" | "teams" | "players" | "championships";
  fallbackImage?: string;
}) {
  const imagePath = normalizeImagePath(String(formData.get("image") ?? ""), folder);
  const file = formData.get("imageFile");

  if (file instanceof File && file.size > 0) {
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();

    if (blobToken) {
      const extension = getUploadExtension(file);
      const pathname = `${folder}/${randomUUID()}${extension}`;
      const blob = await put(pathname, file, {
        access: "public",
        token: blobToken,
      });

      return blob.url;
    }

    if (process.env.VERCEL) {
      throw new UploadStorageError(
        "Для завантаження нового файлу в production потрібно підключити Vercel Blob і додати BLOB_READ_WRITE_TOKEN у змінні середовища проєкту.",
      );
    }

    const extension = getUploadExtension(file);
    const fileName = `${randomUUID()}${extension}`;
    const relativeDir = path.posix.join("uploads", folder);
    const relativePath = path.posix.join("/", relativeDir, fileName);
    const absoluteDir = path.join(process.cwd(), "public", relativeDir);
    const absolutePath = path.join(absoluteDir, fileName);
    const bytes = Buffer.from(await file.arrayBuffer());

    await mkdir(absoluteDir, { recursive: true });
    await writeFile(absolutePath, bytes);

    return relativePath;
  }

  if (String(formData.get("image") ?? "").trim()) {
    return imagePath;
  }

  return normalizeImagePath(fallbackImage, folder);
}
