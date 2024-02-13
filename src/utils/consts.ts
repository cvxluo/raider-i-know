import { Realm, Region } from "./types";

export const Regions: Region[] = [
  {
    name: "United States & Oceania",
    slug: "us",
    short_name: "US",
  },
];

// TODO: change this to slugs eventually
export const RealmNames: string[] = [
  "Area 52",
  "Illidan",
  "Stormrage",
  "Frostmourne",
  "Tichondrius",
  "Zul'jin",
  "Mal'Ganis",
  "Azralon",
  "Ragnaros",
  "Sargeras",
  "Thrall",
  "Proudmoore",
  "Barthilas",
  "Bleeding Hollow",
  "Quel'Thalas",
  "Dalaran",
  "Moon Guard",
  "Hyjal",
  "Emerald Dream",
  "Kel'Thuzad",
  "Wyrmrest Accord",
  "Kil'jaeden",
  "Whisperwind",
  "Khaz'goroth",
  "Lightbringer",
  "Drakkari",
  "Anonymous",
  "Thaurissan",
  "Nagrand",
  "Saurfang",
  "Burning Blade",
  "Aman'Thul",
  "Caelestrasz",
  "Nemesis",
  "Aerie Peak",
  "Icecrown",
  "Turalyon",
  "Dath'Remar",
  "Jubei'Thos",
  "Bonechewer",
  "Malfurion",
  "Deathwing",
  "Burning Legion",
  "Skullcrusher",
  "Firetree",
  "Aggramar",
  "Korgath",
  "Blackrock",
  "Frostmane",
  "Aegwynn",
  "Dragonmaw",
  "Khadgar",
  "Stormreaver",
  "Mug'thol",
  "Magtheridon",
  "Alleria",
  "Arthas",
  "Kargath",
  "Ner'zhul",
  "Spirestone",
  "Suramar",
  "Destromath",
  "Nordrassil",
  "Ghostlands",
  "Thunderlord",
  "Earthen Ring",
  "Blade's Edge",
  "Trollbane",
  "Akama",
  "Shadow Council",
  "Moonrunner",
  "Stormscale",
  "Black Dragonflight",
  "Dreadmaul",
  "Silvermoon",
  "Cho'gall",
  "Dawnbringer",
  "Gorefiend",
  "Garrosh",
  "Laughing Skull",
  "Elune",
  "Garona",
  "Hellscream",
  "Frostwolf",
  "Skywall",
  "Sen'jin",
  "Mannoroth",
  "Lightning's Blade",
  "Uther",
  "Lothar",
  "Kilrogg",
  "Korialstrasz",
  "Ysera",
  "Madoran",
  "Wildhammer",
  "Stonemaul",
  "Zuluhed",
  "Azjol-Nerub",
  "Thunderhorn",
  "Grizzly Hills",
  "Eredar",
  "Exodar",
  "Kael'thas",
  "Norgannon",
  "Daggerspine",
  "Blackhand",
  "Malygos",
  "Shandris",
  "Velen",
  "Quel'dorei",
  "Bloodscalp",
  "Blackwater Raiders",
  "Windrunner",
  "Anvilmar",
  "Uldum",
  "Eonar",
  "Boulderfist",
  "Arathor",
  "Bloodhoof",
  "Cenarion Circle",
  "Darkspear",
  "Cenarius",
  "Alterac Mountains",
  "Antonidas",
  "Gurubashi",
  "Staghelm",
  "Undermine",
  "Terenas",
  "Gilneas",
  "Draenor",
  "Azshara",
  "Azgalor",
  "Crushridge",
  "Llane",
  "Shadowsong",
  "Executus",
  "Argent Dawn",
  "The Underbog",
  "Archimonde",
  "Zangarmarsh",
  "Mok'Nathal",
  "Duskwood",
  "Dethecus",
  "Malorne",
  "Silver Hand",
  "Borean Tundra",
  "Eldre'Thalas",
  "Fizzcrank",
  "Rivendare",
  "Spinebreaker",
  "Baelgun",
  "Echo Isles",
  "Shadowmoon",
  "Medivh",
  "Dentarg",
  "Shattered Hand",
  "Greymane",
  "Gallywix",
  "Durotan",
  "Hakkar",
  "Gundrak",
  "Muradin",
  "Kul Tiras",
  "Nazjatar",
  "Goldrinn",
  "Scilla",
  "Andorhal",
  "Perenolde",
  "Jaedenar",
  "Agamaggan",
  "Altar of Storms",
  "Azuremyst",
  "Ravenholdt",
  "Tanaris",
  "Nathrezim",
  "Lethon",
  "Maelstrom",
  "Demon Soul",
  "Khaz Modan",
  "Alexstrasza",
  "Draka",
  "Doomhammer",
  "Bronzebeard",
  "Maiev",
  "Nazgrel",
  "Steamwheedle Cartel",
  "Dark Iron",
  "Smolderthorn",
  "Shattered Halls",
  "Onyxia",
  "Hydraxis",
  "Warsong",
  "Blood Furnace",
  "Vek'nilash",
  "Dunemaul",
  "The Forgotten Coast",
  "Drak'thul",
  "Lightninghoof",
  "Drenden",
  "Coilfang",
  "Bladefist",
  "Drak'Tharon",
  "Misha",
  "Feathermoon",
  "Sisters of Elune",
  "Rexxar",
  "Vashj",
  "Scarlet Crusade",
  "Kirin Tor",
  "Galakrond",
  "Gul'dan",
  "The Venture Co",
  "Arygos",
  "Tol Barad",
  "Gnomeregan",
  "Ravencrest",
  "Terokkar",
  "Nesingwary",
  "Runetotem",
  "Haomarush",
  "Twisting Nether",
  "Gorgonnash",
  "Anub'arak",
  "Detheroc",
  "Anetheron",
  "Darrowmere",
  "Ursin",
  "Shu'halo",
  "Farstriders",
  "The Scryers",
  "Sentinels",
  "Cairne",
  "Uldaman",
  "Dalvengyr",
  "Ysondre",
  "Auchindoun",
  "Winterhoof",
  "Balnazzar",
  "Chromaggus",
  "Fenris",
  "Kalecgos",
  "Eitrigg",
  "Thorium Brotherhood",
  "Dragonblight",
  "Blackwing Lair",
  "Tortheldrin",
  "Garithos",
];

// need to eventually insert all the actual realm data to use this
export const Realms: Realm[] = RealmNames.map((realm) => {
  return {
    id: 0,
    connected_realm_id: 0,
    name: realm,
    slug: realm.toLowerCase().replace(/ /g, "-"),
    locale: "en_US",
  };
});

// consider using rio's static data to get dungeon data per-season
export const Dungeons: string[] = [
  "ataldazar",
  "black-rook-hold",
  "doti-galakronds-fall",
  "doti-murozonds-rise",
  "darkheart-thicket",
  "everbloom",
  "throne-of-the-tides",
  "waycrest-manor",
];

export const AffixSets: string[][] = [
  ["Fortified", "Incorporeal", "Sanguine"],
  ["Tyrannical", "Entangling", "Bursting"],
  ["Fortified", "Spiteful", "Volcanic"],
  ["Tyrannical", "Storming", "Raging"],
  ["Fortified", "Entangling", "Bolstering"],
  ["Tyrannical", "Spiteful", "Incorporeal"],
  ["Fortified", "Afflicted", "Raging"],
  ["Tyrannical", "Volcanic", "Sanguine"],
  ["Fortified", "Storming", "Bursting"],
  ["Tyrannical", "Afflicted", "Bolstering"],
];
