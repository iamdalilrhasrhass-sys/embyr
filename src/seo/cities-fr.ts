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
Saint-Etienne
Le Havre
Toulon
Grenoble
Dijon
Angers
Nimes
Villeurbanne
Clermont-Ferrand
Le Mans
Aix-en-Provence
Brest
Tours
Amiens
Limoges
Metz
Perpignan
Besancon
Orleans
Rouen
Mulhouse
Caen
Nancy
Argenteuil
Saint-Denis
Avignon
Poitiers
Pau
Calais
La Rochelle
Colmar
Ajaccio
Bastia
Annecy
Chambery
Bourges
Chartres
Dunkerque
Valence
Troyes
Montauban
Nevers
Auxerre
Laval
Albi
Carcassonne
Beziers

Rennes
Reims
Saint-Etienne
Le Havre
Toulon
Grenoble
Dijon
Angers
Nimes
Villeurbanne
Clermont-Ferrand
Le Mans
Aix-en-Provence
Brest
Tours
Amiens
Limoges
Metz
Perpignan
Besancon
Orleans
Rouen
Mulhouse
Caen
Nancy
Argenteuil
Saint-Denis
Avignon
Poitiers
Pau
Calais
La Rochelle
Colmar
Ajaccio
Bastia
Annecy
Chambery
Bourges
Chartres
Dunkerque
Valence
Troyes
Montauban
Nevers
Auxerre
Laval
Albi
Carcassonne
Beziers
Brive-la-Gaillarde
Frejus
Brive-la-Gaillarde
Saint-Malo
Bayonne
Bourg-en-Bresse
Roanne
Macon
Rodez
Castres
Agen
Montlucon
Vichy
Moulins
Aurillac
Tarbes
Alencon
Evreux
Cherbourg
Saint-Lo
Coutances
Perigueux
Bergerac
Sarlat
Mont-de-Marsan
Dax
Auch
Foix
Pamiers
Carcassonne
Narbonne
Beziers
Setes
Lodeve
Mende
Le Puy-en-Velay
Privas
Aubenas
Nyons
Valence
Die
Gap
Briancon
Digne-les-Bains
Manosque
Forcalquier
Draguignan
Brignoles
Toulon
La Seyne-sur-Mer
Hyères
Ajaccio
Bastia
Calvi
Porto-Vecchio
Sartene
`);

export const franceCities = uniqueBySlug(names.map((name) => ({
  name,
  slug: slugify(name),
  market: "france" as const,
})));
