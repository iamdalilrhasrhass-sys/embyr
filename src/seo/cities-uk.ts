import { slugify, splitLines, uniqueBySlug } from "./utils";

const names = splitLines(`
London
Birmingham
Manchester
Leeds
Glasgow
Liverpool
Newcastle
Sheffield
Bristol
Nottingham
Leicester
Edinburgh
Cardiff
Belfast
Brighton
Southampton
Portsmouth
Oxford
Cambridge
Coventry
Bradford
Hull
Stoke-on-Trent
Wolverhampton
Plymouth
Derby
Swansea
Aberdeen
Norwich
York
Dundee
Exeter
Bath
Reading
Milton Keynes
Luton
Northampton
Peterborough
Ipswich
Blackpool
Middlesbrough
Sunderland
Preston
Bolton
Bournemouth
Poole
Southend-on-Sea
Swindon
Warrington
Maidstone
Canterbury
Chelmsford
Colchester
Hastings
Eastbourne
Crawley
Guildford
Woking
Slough
Watford
St Albans
Hemel Hempstead
High Wycombe
Maidstone
Mansfield
Doncaster
Rotherham
Barnsley
Wakefield
Huddersfield
Halifax
Wigan
Stockport
Oldham
Rochdale
Blackburn
Burnley
Chester
Wrexham
Newport
Salisbury
Winchester
Cheltenham
Gloucester
Worcester
Hereford
Shrewsbury
Lincoln
Grimsby
Scunthorpe
Carlisle
Lancaster
Durham
Inverness
Stirling
Perth
Paisley
Windsor
Harrogate
Croydon
Camden
Islington
Westminster
Kensington
Hammersmith
Wandsworth
Lambeth
Southwark
Hackney
Tower Hamlets
Greenwich
Ealing
Hounslow
Brent
Harrow
Bromley
Kingston upon Thames
Richmond
Sutton
Enfield
Barnet
Haringey
Waltham Forest
Redbridge
Romford
Barking
Dagenham
Solihull
Walsall
`);

export const ukCities = uniqueBySlug(names.map((name) => ({
  name,
  slug: slugify(name),
  market: "uk" as const,
})));
