import type { MetadataRoute } from "next";
import {
  getAllPublicMatches,
  getChampionships,
  getNewsList,
  getPlayers,
  getTeams,
} from "@/lib/db";
import { siteConfig } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, championships, teams, players, matches] = await Promise.all([
    getNewsList(),
    getChampionships(),
    getTeams(),
    getPlayers(),
    getAllPublicMatches(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/news",
    "/matches",
    "/championships",
    "/teams",
    "/players",
    "/beginners",
    "/about",
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
  }));

  const articlePages = articles.map((article) => ({
      url: `${siteConfig.url}/news/${encodeURIComponent(article.slug)}`,
    lastModified: article.updatedAt,
  }));

  const championshipPages = championships.map((championship) => ({
    url: `${siteConfig.url}/championships/${championship.slug}`,
    lastModified: championship.updatedAt,
  }));

  const teamPages = teams.map((team) => ({
    url: `${siteConfig.url}/teams/${team.slug}`,
    lastModified: team.updatedAt,
  }));

  const playerPages = players.map((player) => ({
    url: `${siteConfig.url}/players/${player.slug}`,
    lastModified: player.updatedAt,
  }));

  const matchPages = matches.map((match) => ({
    url: `${siteConfig.url}/matches/${match.id}`,
    lastModified: match.updatedAt,
  }));

  return [
    ...staticPages,
    ...articlePages,
    ...matchPages,
    ...championshipPages,
    ...teamPages,
    ...playerPages,
  ];
}

