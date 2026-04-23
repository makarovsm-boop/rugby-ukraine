"use client";

import { useEffect, useMemo, useState } from "react";
import {
  adminFileClass,
  adminInputClass,
} from "@/components/admin-form-field";
import {
  getFallbackImagePath,
  normalizeImagePath,
  type MediaFolder,
} from "@/lib/media-config";

type AdminImageFieldProps = {
  folder: MediaFolder;
  imageValue?: string;
  imagePlaceholder?: string;
};

export function AdminImageField({
  folder,
  imageValue = "",
  imagePlaceholder = "/image.svg",
}: AdminImageFieldProps) {
  const [manualPath, setManualPath] = useState(imageValue);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const normalizedPath = useMemo(
    () => normalizeImagePath(manualPath, folder),
    [folder, manualPath],
  );
  const fallbackPath = getFallbackImagePath(folder);
  const effectivePreview = previewUrl ?? normalizedPath;
  const previewLabel = previewUrl
    ? "Нове локальне прев'ю"
    : manualPath.trim()
      ? "Прев'ю вказаного шляху"
      : "Fallback-зображення";
  const previewHint = previewUrl
    ? "Після збереження файл буде завантажено в public/uploads."
    : manualPath.trim()
      ? "Якщо такого файлу немає у public, на сайті автоматично спрацює fallback."
      : "Якщо шлях або файл не вказані, буде використано стандартне fallback-зображення.";

  return (
    <div className="grid gap-4 md:col-span-2">
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-900">
          Шлях до зображення
        </span>
        <input
          type="text"
          name="image"
          defaultValue={imageValue}
          placeholder={imagePlaceholder}
          className={adminInputClass}
          onChange={(event) => {
            setManualPath(event.currentTarget.value);
            if (previewUrl) {
              URL.revokeObjectURL(previewUrl);
              setPreviewUrl(null);
            }
          }}
        />
        <span className="text-xs leading-6 text-slate-500">
          Можна вказати шлях у `public` або залишити поле порожнім і вибрати файл нижче.
        </span>
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-900">
          Файл зображення
        </span>
        <input
          type="file"
          name="imageFile"
          accept="image/*"
          className={adminFileClass}
          onChange={(event) => {
            const nextFile = event.currentTarget.files?.[0];

            if (previewUrl) {
              URL.revokeObjectURL(previewUrl);
            }

            if (nextFile) {
              setPreviewUrl(URL.createObjectURL(nextFile));
              return;
            }

            setPreviewUrl(null);
          }}
        />
        <span className="text-xs leading-6 text-slate-500">
          Підійде `jpg`, `png`, `webp` або `svg`.
        </span>
      </label>

      <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-950">{previewLabel}</p>
            <p className="mt-1 text-xs leading-6 text-slate-500">{previewHint}</p>
          </div>
          <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
            {effectivePreview === fallbackPath ? "Fallback" : "Image"}
          </span>
        </div>

        <div className="mt-4 overflow-hidden rounded-[1rem] border border-slate-200 bg-white">
          <div
            className="aspect-[16/9] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url("${effectivePreview}")` }}
          />
        </div>

        <p className="mt-3 break-all text-xs leading-6 text-slate-500">
          Активне джерело: <span className="font-medium text-slate-700">{effectivePreview}</span>
        </p>
      </div>
    </div>
  );
}
