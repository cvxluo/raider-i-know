import datetime

class Character (object) :
    _id = 0
    id = 0
    name = ''
    region = {
        'name': '',
        'slug': '',
        'short_name': ''
    }
    realm = {
        'id': 0,
        'name': '',
        'slug': '',
        'locale': '',
    }
    class_type = {
        'id': 0,
        'name': '',
        'slug': '',
    }
    race = {
        'id': 0,
        'name': '',
        'slug': '',
        'faction': ''
    }
    faction = ''

    def __init__ (self, id, name, region, realm, class_type, race, faction, _id=0):
        self.id = id
        self.name = name
        self.region = region
        self.realm = realm
        self._id = _id
        self.class_type = class_type
        self.race = race
        self.faction = faction


    def from_json (json):
        return Character(json['id'], json['name'], json['region'], json['realm'], json['class'], json['race'], json['faction'], json['_id']['$oid'])
    
    def from_rio_json (json):
        region = {
            'name': json['region']['name'],
            'slug': json['region']['slug'],
            'short_name': json['region']['short_name']
        }
        realm = {
            'id': json['realm']['id'],
            'name': json['realm']['name'],
            'slug': json['realm']['slug'],
            'locale': json['realm']['locale']
        }
        class_type = {
            'id': json['class']['id'],
            'name': json['class']['name'],
            'slug': json['class']['slug']
        }
        race = {
            'id': json['race']['id'],
            'name': json['race']['name'],
            'slug': json['race']['slug'],
            'faction': json['race']['faction']
        }

        return Character(json['id'], json['name'], region, realm, class_type, race, json['faction'])
    

    def to_json (self):
        return {
            'region': self.region,
            'realm': self.realm,
            'name': self.name,
            'id': self.id,
            'class': self.class_type,
            'race' : self.race,
            'faction': self.faction
        }
    

class Run (object) :
    _id = 0
    keystone_run_id = 0
    completed_at = ''
    dungeon = {
        'id': 0,
        'name': ''
    }
    keystone_team_id = 0
    mythic_level = 0
    roster = []
    season = ''
    weekly_modifiers = []


    def __init__ (self, keystone_run_id, completed_at, dungeon, mythic_level, roster, season, weekly_modifiers, keystone_team_id, _id=0):
        self.keystone_run_id = keystone_run_id
        self.completed_at = completed_at
        self.dungeon = dungeon
        self.mythic_level = mythic_level
        self.roster = roster
        self.season = season
        self.weekly_modifiers = weekly_modifiers
        self.keystone_team_id = keystone_team_id
        self._id = _id

    def from_json (json):
        return Run(json['keystone_run_id'], json['completed_at'], json['dungeon'], json['mythic_level'], json['roster'], json['season'], json['weekly_modifiers'], json['keystone_team_id'], json['_id']['$oid'])
    
    def to_json (self):
        return {
            'keystone_run_id': self.keystone_run_id,
            'completed_at': self.completed_at,
            'dungeon': self.dungeon,
            'keystone_team_id': self.keystone_team_id,
            'mythic_level': self.mythic_level,
            'roster': self.roster,
            'season': self.season,
            'weekly_modifiers': self.weekly_modifiers,
        }

    # needs roster to be a list of object ids
    def from_unpop_json (json):
        dungeon = {
            'id': json['dungeon']['id'],
            'name': json['dungeon']['name']
        }
        completed_at = datetime.datetime.strptime(json['completed_at'], '%Y-%m-%dT%H:%M:%S.%fZ')
        return Run(json['keystone_run_id'], completed_at, dungeon, json['mythic_level'], json['roster'], json['season'], json['weekly_modifiers'], json['keystone_team_id'])
    

    def __str__ (self):
        return 'Run(keystone_run_id=' + str(self.keystone_run_id) + ', completed_at=' + str(self.completed_at) + ', dungeon=' + str(self.dungeon) + ', mythic_level=' + str(self.mythic_level) + ')'
    

class RunSummary (object) :
    season = ''
    dungeon = {
        'id': 0,
        'name': ''
    }
    keystone_run_id = 0
    mythic_level = 0


    def __init__ (self, season, dungeon, keystone_run_id, mythic_level):
        self.season = season
        self.dungeon = dungeon
        self.keystone_run_id = keystone_run_id
        self.mythic_level = mythic_level

    def from_json (json):
        return RunSummary(json['season'], json['dungeon'], json['keystone_run_id'], json['mythic_level'])
    

    def __str__ (self):
        return 'RunSummary(season=' + str(self.season) + ', dungeon=' + str(self.dungeon) + ', keystone_run_id=' + str(self.keystone_run_id) + ')'