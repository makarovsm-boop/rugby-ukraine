type EditorialArticleSeed = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  tags: string[];
  sourceName: string;
  sourceUrl: string;
};

const editorialArticlesSeed: EditorialArticleSeed[] = [
  {
    id: "editorial-article-northampton-bath-2026-04-26",
    slug: "northampton-bath-41-38-premiership-2026",
    title: "Нортгемптон вирвав перемогу над Батом 41:38 у головному матчі верхівки Premiership",
    excerpt:
      "Saints виграли один із найяскравіших матчів весни в Premiership: Нортгемптон кілька разів відпускав Бат назад у гру, але все ж забрав перемогу штрафним Фіна Сміта в самій кінцівці.",
    content:
      "Нортгемптон Сейнтс обіграв Бат 41:38 у матчі лідерів Premiership і втримав перше місце в таблиці. До стартового свистка команди підходили майже впритул: Saints мали 57 очок, а Bath — 56, тому гра у Franklin’s Gardens фактично стала прямим боєм за верхівку.\n\nГосподарі почали активніше й уже в першому таймі вийшли вперед 26:14. Нортгемптон краще використовував ширину поля, а один із найнебезпечніших відрізків припав на середину першої половини, коли Saints розганяли атаки через край і регулярно змушували Бат наздоганяти хід матчу.\n\nПісля перерви Бат не зник із гри. Гості кілька разів скорочували відставання, а в середині другого тайму навіть зуміли зрівняти рахунок. На 76-й хвилині Бат повернувся до 38:38 після реалізованої спроби, і матч перейшов у режим, де все мала вирішити одна помилка або один удар.\n\nКлючовий епізод стався вже наприкінці: після порушення з боку Bath Фін Сміт отримав шанс на штрафний і реалізував його. Саме цей удар приніс Northampton перемогу 41:38 у матчі, який за напругою та кількістю сюжетних поворотів цілком тягнув на репетицію плей-оф.\n\nДля Bath поразка не скасовує боротьбу за фініш у топі та не знімає великих завдань у Європі, але в контексті Premiership цей вечір був болючим: команда кілька разів поверталася в гру, проте так і не змогла забрати контроль у фінальні хвилини. Нортгемптон же отримав не лише чотири очки, а й сильний психологічний сигнал перед останнім відрізком сезону.\n\nМатеріал підготовлено редакцією Ukrainian Ruggers за мотивами публікації Ruck.",
    image:
      "https://www.ruck.co.uk/wp-content/uploads/2026/04/1ffbae35d432d0d71911ca2a0b209fbb_prsixVRNdpV6.webp",
    date: "2026-04-26T09:06:33.000Z",
    tags: ["Premiership Rugby", "Northampton Saints", "Bath Rugby"],
    sourceName: "Ruck",
    sourceUrl:
      "https://www.ruck.co.uk/prem-northampton-41-38-bath-saints-take-the-spoils-from-top-of-the-table-barnstormer/",
  },
];

export type EditorialArticle = ReturnType<typeof getEditorialArticles>[number];

function materializeArticle(article: EditorialArticleSeed) {
  const publishedAt = new Date(article.date);

  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    image: article.image,
    date: publishedAt,
    tags: article.tags,
    published: true,
    authorId: "editorial",
    createdAt: publishedAt,
    updatedAt: publishedAt,
    comments: [],
    sourceName: article.sourceName,
    sourceUrl: article.sourceUrl,
  };
}

export function getEditorialArticles() {
  return editorialArticlesSeed.map(materializeArticle);
}

export function getEditorialArticleBySlug(slug: string) {
  return getEditorialArticles().find((article) => article.slug === slug) ?? null;
}

export function mergeEditorialArticles<T extends { slug: string; date: Date }>(
  dbArticles: T[],
): Array<T | EditorialArticle> {
  const editorialArticles = getEditorialArticles();
  const merged: Array<T | EditorialArticle> = [...dbArticles];

  for (const article of editorialArticles) {
    if (!merged.some((item) => item.slug === article.slug)) {
      merged.push(article);
    }
  }

  return merged.sort((a, b) => b.date.getTime() - a.date.getTime());
}
