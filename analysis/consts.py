SEASON = 'season-df-3'

CHARACTER_RUNS_URL = 'https://raider.io/api/characters/mythic-plus-runs'
RUN_DETAILS_URL = 'https://raider.io/api/v1/mythic-plus/run-details'
TITLE_RANGE_URL = 'https://raider.io/api/v1/mythic-plus/season-cutoffs'
TOP_RUNS_URL = 'https://raider.io/api/v1/mythic-plus/runs'

MYTHIC_RUN_LEVEL_LIMIT = 25

AFFIX_SETS = [
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
]


DUNGEON_ID_TO_NAME = {
    9028: "Atal'Dazar",
    7805: "Black Rook Hold",
    1000010: "Galakrond's Fall",
    1000011: "Murozond's Rise",
    7673: "Darkheart Thicket",
    7109: "Everbloom",
    4738: "Throne of the Tides",
    9424: "Waycrest Manor",
}

DUNGEON_IDS = [
  9028, # atal
  7805, # brh
  1000010, # doti fall
  1000011, # doti rise
  7673, # dht
  7109, # everbloom
  4738, # throne
  9424, # waycrest
]

CLASS_COLORS = {
  "Death Knight": "#C41F3B",
  "Demon Hunter": "#A330C9",
  "Druid": "#FF7D0A",
  "Evoker": "#33937F",
  "Hunter": "#ABD473",
  "Mage": "#40C7EB",
  "Monk": "#00FF96",
  "Paladin": "#F58CBA",
  # "Priest": "#FFFFFF",
  "Priest": "#808080",
  "Rogue": "#FFF569",
  "Shaman": "#0070DE",
  "Warlock": "#8787ED",
  "Warrior": "#C79C6E",
};