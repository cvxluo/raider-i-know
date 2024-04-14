import consts
import requests


def character_run_summaries (character, dungeonId):
    payload = {
        'season': consts.SEASON,
        'characterId': character.id,
        'dungeonId': dungeonId,
        'affixes': 'all',
        'date': 'all',
    }

    try :
        r = requests.get(consts.CHARACTER_RUNS_URL, params=payload)

        if r.status_code == 200 :
            # return [RunSummary.from_json(run['summary']) for run in r.json()['runs']]
            return [run['summary'] for run in r.json()['runs']]

        else :
            raise Exception('Request failed with status code: ' + str(r.status_code))
    
    except Exception as e :
        print('Error: Request failed for character ' + character.name + ' in dungeon ' + consts.DUNGEON_ID_TO_NAME[dungeonId] + ' with error: ' + str(e))
        return []
    

def get_run_from_id (run_id) :
    payload = {
        'season': consts.SEASON,
        'id': run_id,
    }

    try :
        r = requests.get(consts.RUN_DETAILS_URL, params=payload)

        if r.status_code == 200 :
            return r.json()

        else :
            raise Exception('Request failed with status code: ' + str(r.status_code))
        
    except Exception as e :
        print('Error: Request failed for run_id ' + str(run_id) + ' with error: ' + str(e))
        return None
    

def get_title_range () :
    payload = {
        'season': consts.SEASON,
        'region': 'us',
    }

    try :
        r = requests.get(consts.TITLE_RANGE_URL, params=payload)

        if r.status_code == 200 :
            return r.json()

        else :
            raise Exception('Request failed with status code: ' + str(r.status_code))
        
    except Exception as e :
        print('Error: Request failed for title range with error: ' + str(e))
        return None


