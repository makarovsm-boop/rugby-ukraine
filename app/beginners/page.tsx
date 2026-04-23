import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Для новачків | Rugby Ukraine",
  description:
    "Базові правила регбі, позиції на полі та поради, як дивитися матч уперше.",
  alternates: {
    canonical: "/beginners",
  },
};

const rules = [
  {
    title: "Мета гри",
    text: "Завдання команди - просунути м'яч у залікову зону суперника, занести спробу або добрати очки ударами по воротах, коли епізод це дозволяє.",
  },
  {
    title: "Пас тільки назад",
    text: "Руками м'яч передають лише назад або в площину назад. Саме тому удари ногою настільки важливі: вони допомагають вигравати територію.",
  },
  {
    title: "Контакт і захист",
    text: "Після захоплення гра не зупиняється надовго: команди одразу борються за швидкий вихід м'яча з точки контакту, і саме тут часто вирішується темп атаки.",
  },
];

const positions = [
  {
    group: "Форварди",
    description:
      "Працюють у контакті, сутичках і коридорах. Вони виграють важкі метри, стабілізують м'яч і створюють платформу для продовження атаки.",
  },
  {
    group: "Півзахисники",
    description:
      "Керують темпом гри, вибирають напрямок атаки і зв'язують форвардів із задньою лінією. Саме вони найчастіше задають ритм усьому матчу.",
  },
  {
    group: "Задня лінія",
    description:
      "Працює з простором, швидкістю та завершенням. Якщо м'яч швидко дійшов на край, саме тут народжуються найефектніші прориви.",
  },
];

const watchTips = [
  "Спочатку не намагайтеся охопити все поле. Достатньо стежити за м'ячем і найближчими гравцями, які формують наступний епізод.",
  "Дивіться, хто виграє територію: у регбі це часто важливіше за красиве володіння без просування вперед.",
  "Після кожного захоплення звертайте увагу, наскільки швидко команда дістає м'яч із раку. Це один із головних індикаторів якості атаки.",
  "Не лякайтеся деталей. Для першого перегляду достатньо зрозуміти логіку території, контакту і того, хто контролює темп.",
];

export default function BeginnersPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageIntro
        title="Для новачків"
        description="Спокійний вхід у гру для тих, хто лише починає дивитися регбі. Тут зібрані базові правила, ролі на полі та підказки, які допоможуть не загубитися під час трансляції."
      />

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-600 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
        <p>
          Цей розділ не замінює повний офіційний звід правил. Його мета простіша:
          допомогти швидко зрозуміти логіку гри, щоб перший перегляд матчу не
          відчувався хаотичним або занадто складним.
        </p>
      </section>

      <section className="rounded-[2rem] bg-slate-950 px-6 py-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)] sm:px-8">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-emerald-200">
          Швидкий старт
        </p>
        <h2 className="mt-3 text-3xl font-semibold">
          Регбі простіше, ніж здається на перший погляд
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
          Якщо зовсім коротко: команди борються за територію, темп і право
          нав&apos;язати свій сценарій матчу. Коли ця логіка стає зрозумілою,
          регбі починає читатися набагато легше.
        </p>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
            Правила
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            Що важливо знати спочатку
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Це не повний перелік нюансів, а три базові опори, без яких важко
            зрозуміти, що саме відбувається на полі.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {rules.map((rule) => (
            <article
              key={rule.title}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]"
            >
              <h3 className="text-xl font-semibold text-slate-950">
                {rule.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {rule.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
            Позиції
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            Хто за що відповідає на полі
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Ми спеціально пояснюємо позиції широкими групами, щоб не перевантажувати
            новачка вузькими термінами вже на першому знайомстві з грою.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {positions.map((position) => (
            <article
              key={position.group}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]"
            >
              <h3 className="text-xl font-semibold text-slate-950">
                {position.group}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {position.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-emerald-200 bg-[linear-gradient(135deg,#ecfdf5_0%,#f8fffc_100%)] px-6 py-8 shadow-[0_16px_40px_rgba(11,31,58,0.05)] sm:px-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-emerald-700">
            Як дивитися матч
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            Куди дивитися під час трансляції
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Ці підказки допомагають дивитися матч уперше без відчуття, що треба
            миттєво вивчити всі правила й ролі на полі.
          </p>
        </div>

        <div className="mt-6 grid gap-3">
          {watchTips.map((tip) => (
            <div
              key={tip}
              className="rounded-[1.25rem] bg-white/80 px-4 py-4 text-sm leading-7 text-slate-700"
            >
              {tip}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
