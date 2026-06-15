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
Jacksonville
Fort Worth
Columbus
Charlotte
San Francisco
Indianapolis
Seattle
Denver
Washington DC
Boston
El Paso
Nashville
Detroit
Oklahoma City
Portland
Las Vegas
Memphis
Louisville
Baltimore
Milwaukee
Albuquerque
Tucson
Fresno
Sacramento
Mesa
Kansas City
Atlanta
Omaha
Colorado Springs
Raleigh
Miami
Virginia Beach
Long Beach
Oakland
Minneapolis
Tulsa
Bakersfield
Tampa
Arlington
Aurora
Wichita
Cleveland
New Orleans
Henderson
Honolulu
Anaheim
Orlando
Lexington
Stockton
Riverside
Irvine
Corpus Christi
Newark
Santa Ana
Cincinnati
Pittsburgh
Saint Paul
Greensboro
Jersey City
Durham
Lincoln
North Las Vegas
Plano
Anchorage
Gilbert
Madison
Reno
Chandler
St Louis
Chula Vista
Buffalo
Fort Wayne
Lubbock
St Petersburg
Toledo
Laredo
Port St Lucie
Glendale
Irving
Winston Salem
Chesapeake
Garland
Scottsdale
Boise
Norfolk
Spokane
Richmond
Fremont
Huntsville
Frisco
Cape Coral
Santa Clarita
San Bernardino
Tacoma
Hialeah
Modesto
McKinney
Fontana
Des Moines
Rochester
Yonkers
Fayetteville
Moreno Valley
Columbus Georgia
Oxnard
Aurora Illinois
Glendale California
Huntington Beach
Salt Lake City
Grand Rapids
Amarillo
Tallahassee
Worcester
Newport News
Little Rock
Knoxville
Charleston
Providence
Fort Lauderdale
West Hollywood
Palm Springs
Santa Monica
Pasadena
Berkeley
Palo Alto
Santa Clara
Sunnyvale
Mountain View
Brooklyn
Queens
Bronx
Manhattan
Staten Island
Long Island
White Plains
New Haven
Hartford
Cambridge MA
Somerville
Salem
Jersey Shore
Asbury Park
Hoboken
Alexandria
Arlington VA
Arlington TX
Silver Spring
Bethesda
Tempe
Fort Myers
Naples
Sarasota
Clearwater
Sugar Land
The Woodlands
San Marcos
Boulder
Bellevue
Eugene
Salem OR
`);

export const usaCities = uniqueBySlug(names.map((name) => ({
  name,
  slug: slugify(name),
  market: "usa" as const,
})));
