import { slugify, splitLines, uniqueBySlug } from "./utils";

const names = splitLines(`
Paris
Marseille
Lyon
Toulouse
Nice
Nantes
Montpellier
Strasbourg
Bordeaux
Lille
Rennes
Reims
Toulon
Grenoble
Dijon
Angers
Nimes
Villeurbanne
Saint-Etienne
Le Havre
Aix-en-Provence
Brest
Tours
Amiens
Limoges
Clermont-Ferrand
Besancon
Orleans
Metz
Rouen
Mulhouse
Perpignan
Caen
Nancy
Argenteuil
Montreuil
Roubaix
Tourcoing
Nanterre
Vitry-sur-Seine
Creteil
Avignon
Poitiers
Dunkerque
Aubervilliers
Versailles
Colombes
Asnieres-sur-Seine
Aulnay-sous-Bois
Rueil-Malmaison
Pau
La Rochelle
Antibes
Cannes
Saint-Maur-des-Fosses
Calais
Beziers
Colmar
Bourges
Valence
Quimper
Drancy
Noisy-le-Grand
Levallois-Perret
Issy-les-Moulineaux
Neuilly-sur-Seine
Troyes
Antony
La Seyne-sur-Mer
Lorient
Saint-Quentin
Chambery
Niort
Sarcelles
Pessac
Vannes
Cergy
Cholet
Meaux
Saint-Brieuc
Bayonne
Ajaccio
Narbonne
Blois
Annecy
Melun
Sens
Fontainebleau
Montereau-Fault-Yonne
Courbevoie
Champigny-sur-Marne
Evry-Courcouronnes
Massy
Chalon-sur-Saone
Auxerre
Compiegne
Saint-Nazaire
Valenciennes
`);

export const franceCities = uniqueBySlug(names.map((name) => ({
  name,
  slug: slugify(name),
  market: "france" as const,
})));
