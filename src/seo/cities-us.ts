import { slugify, splitLines, uniqueBySlug } from "./utils";

const names = splitLines(`
New York
Los Angeles
Chicago
Houston
Phoenix
Philadelphia
San Antonio
San Diego
Dallas
San Jose
Austin
San Francisco
Seattle
Denver
Washington DC
Boston
Miami
Atlanta
Jacksonville
Fort Worth
Columbus
Charlotte
Indianapolis
El Paso
Memphis
Nashville
Louisville
Baltimore
Milwaukee
Albuquerque
Tucson
Fresno
Sacramento
Mesa
Kansas City
Colorado Springs
Omaha
Raleigh
Long Beach
Virginia Beach
Oakland
Minneapolis
Tampa
Tulsa
Arlington
New Orleans
Cleveland
Anaheim
Henderson
Lexington
Stockton
Corpus Christi
St. Paul
Cincinnati
St. Louis
Pittsburgh
Greensboro
Anchorage
Plano
Santa Ana
Riverside
Chandler
Irvine
Newark
Orlando
Durham
Scottsdale
Bakersfield
Toledo
Hialeah
Madison
Lubbock
Chesapeake
Garland
Glendale
Fremont
Winston-Salem
Norfolk
Laredo
Chula Vista
Boise
Spokane
Richmond
Baton Rouge
Modesto
Des Moines
Providence
Rochester
Grand Rapids
Akron
Springfield
Pasadena
Santa Clara
Waterbury
New Haven
Bridgeport
Stamford
Danbury
Norwalk
New London
Groton
Mystic
Hartford
Meriden
Bristol
New Britain
Middletown
Torrington
Providence
Warwick
Cranston
Pawtucket
Newport
Portland
Bangor
Augusta
Lewiston
Auburn
Burlington
Montpelier
Barre
St. Johnsbury
Newport VT
Manchester NH
Nashua
Concord
Portsmouth
Dover NH
Rochester NH
Berlin NH
Laconia
Keene
Lebanon NH
Springfield MA
Worcester MA
Lowell
Cambridge MA
Somerville
`);

export const usaCities = uniqueBySlug(names.map((name) => ({
  name,
  slug: slugify(name),
  market: "usa" as const,
})));
