import { createSlug } from "@/lib/admin";

export type BathSquadPlayer = {
  name: string;
  position: string;
  image: string;
};

const bathFallbackPlayerImage =
  "https://media-cdn.incrowdsports.com/7fda7f0a-c80f-4ec7-81e3-9798596b2372.png";

export const bathMenSquad: BathSquadPlayer[] = [
  { name: "Henry Arundell", position: "Wing", image: bathFallbackPlayerImage },
  { name: "Alfie Barbeary", position: "Back row", image: bathFallbackPlayerImage },
  { name: "Josh Bayliss", position: "Back row", image: bathFallbackPlayerImage },
  { name: "Will Butt", position: "Centre", image: bathFallbackPlayerImage },
  { name: "Tom Carr-Smith", position: "Scrum-half", image: bathFallbackPlayerImage },
  { name: "Santi Carreras", position: "Full back", image: bathFallbackPlayerImage },
  { name: "Jaco Coetzee", position: "Back row", image: bathFallbackPlayerImage },
  { name: "Joe Cokanasiga", position: "Wing", image: bathFallbackPlayerImage },
  { name: "Thompson Cowan", position: "Back row", image: bathFallbackPlayerImage },
  { name: "Tom de Glanville", position: "Full back", image: bathFallbackPlayerImage },
  { name: "Ciaran Donoghue", position: "Fly-half", image: bathFallbackPlayerImage },
  { name: "Thomas du Toit", position: "Prop", image: bathFallbackPlayerImage },
  { name: "Tom Dunn", position: "Hooker", image: bathFallbackPlayerImage },
  { name: "Austin Emens", position: "Full back", image: bathFallbackPlayerImage },
  { name: "Charlie Ewels", position: "Second row", image: bathFallbackPlayerImage },
  { name: "Dan Frost", position: "Hooker", image: bathFallbackPlayerImage },
  { name: "Archie Griffin", position: "Prop", image: bathFallbackPlayerImage },
  { name: "Chris Harris", position: "Centre", image: bathFallbackPlayerImage },
  { name: "Sam Harris", position: "Fly-half", image: bathFallbackPlayerImage },
  { name: "Louie Hennessey", position: "Centre", image: bathFallbackPlayerImage },
  { name: "Ted Hill", position: "Back row", image: bathFallbackPlayerImage },
  { name: "Ollie Lawrence", position: "Centre", image: bathFallbackPlayerImage },
  { name: "Neil Le Roux", position: "Scrum-half", image: bathFallbackPlayerImage },
  { name: "Ross Molony", position: "Second row", image: bathFallbackPlayerImage },
  { name: "Will Muir", position: "Wing", image: bathFallbackPlayerImage },
  { name: "Beno Obano", position: "Prop", image: bathFallbackPlayerImage },
  { name: "Max Ojomoh", position: "Centre", image: bathFallbackPlayerImage },
  { name: "Guy Pepper", position: "Back row", image: bathFallbackPlayerImage },
  { name: "Cameron Redpath", position: "Centre", image: bathFallbackPlayerImage },
  { name: "Miles Reid", position: "Back row", image: bathFallbackPlayerImage },
  { name: "Ewan Richards", position: "Back row", image: bathFallbackPlayerImage },
  { name: "Quinn Roux", position: "Second row", image: bathFallbackPlayerImage },
  { name: "Finn Russell", position: "Fly-half", image: bathFallbackPlayerImage },
  { name: "Jasper Spandler", position: "Hooker", image: bathFallbackPlayerImage },
  { name: "Ben Spencer", position: "Scrum-half", image: bathFallbackPlayerImage },
  { name: "Ethan Staddon", position: "Back row", image: bathFallbackPlayerImage },
  { name: "Will Stuart", position: "Prop", image: bathFallbackPlayerImage },
  { name: "Mikey Summerfield", position: "Prop", image: bathFallbackPlayerImage },
  { name: "Sam Underhill", position: "Back row", image: bathFallbackPlayerImage },
  { name: "Bernard van der Linde", position: "Scrum-half", image: bathFallbackPlayerImage },
  { name: "Francois van Wyk", position: "Prop", image: bathFallbackPlayerImage },
  { name: "Kieran Verden", position: "Prop", image: bathFallbackPlayerImage },
];

export function getBathSquadWithSlug() {
  return bathMenSquad.map((player) => ({
    ...player,
    slug: createSlug(player.name),
  }));
}
