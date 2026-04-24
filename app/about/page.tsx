import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Про проєкт | Ukrainian Ruggers",
  description: "Інформація про редакційний проєкт Ukrainian Ruggers та його основні розділи.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <PageIntro
        title="Про проєкт"
        description="Ukrainian Ruggers - це український редакційний проєкт про регбі. Ми збираємо новини, матчі, команди, гравців і базові пояснення так, щоб сайт був корисним і для тих, хто давно стежить за грою, і для тих, хто тільки входить у тему."
      />

      <section className="content-card mt-8 rounded-[1.5rem] p-6 text-sm leading-7 text-slate-600">
        <p>
          Проєкт не претендує на роль офіційного сайту федерації чи турнірного
          оператора. Наше завдання інше: дати читачеві зрозумілий український
          інтерфейс, редакційний контекст і зручну точку входу в тему регбі.
        </p>
      </section>

      <section className="content-card mt-6 rounded-[1.5rem] p-6 text-sm leading-7 text-slate-600">
        <p className="font-semibold text-slate-950">Як ми працюємо з контентом</p>
        <p className="mt-3">
          На сайті поєднуються факти, редакційний контекст і довідкові пояснення
          для читача. Ми окремо показуємо, де йдеться про саму подію, а де про
          пояснення її значення. Для офіційних підтверджень складів, календарів
          і підсумкових рахунків варто також звірятися з організаторами турніру
          або командами.
        </p>
      </section>
    </div>
  );
}
