import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { importLatestRuckNews, importRuckArticleByUrl } from "@/lib/ruck-auto-news";

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return true;
  }

  const authHeader = request.headers.get("authorization") ?? "";
  return authHeader === `Bearer ${secret}`;
}

function isKyivEightNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Kyiv",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const hourValue = parts.find((part) => part.type === "hour")?.value ?? "";
  return hourValue === "08";
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const forceUrl = searchParams.get("url")?.trim();

  if (forceUrl) {
    try {
      const result = await importRuckArticleByUrl(forceUrl);
      if (result.status === "created") {
        revalidatePath("/");
        revalidatePath("/news");
        revalidatePath("/admin/articles");
        revalidatePath(`/news/${result.slug}`);
        revalidatePath(`/admin/articles/${result.slug}`);
      }

      return NextResponse.json({ ok: true, result, forced: true });
    } catch (error) {
      console.error("Manual RUCK import failed:", error);
      return NextResponse.json({ ok: false, error: "Manual import failed" }, { status: 500 });
    }
  }

  if (!isKyivEightNow()) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "Not 08:00 in Europe/Kyiv",
    });
  }

  try {
    const result = await importLatestRuckNews();

    if (result.status === "created") {
      revalidatePath("/");
      revalidatePath("/news");
      revalidatePath("/admin/articles");
      revalidatePath(`/news/${result.slug}`);
      revalidatePath(`/admin/articles/${result.slug}`);
    }

    return NextResponse.json({
      ok: true,
      result,
    });
  } catch (error) {
    console.error("Auto RUCK news import failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Auto news import failed",
      },
      { status: 500 },
    );
  }
}
