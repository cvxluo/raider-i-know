import json
from dotenv import load_dotenv
import os
import time
from tqdm import tqdm

import pymongo
import bson

import consts
from schema import Character, Run, RunSummary

from rio_requests import character_run_summaries, get_run_from_id


load_dotenv()
DB_URL = os.getenv('DB_URL')
client = pymongo.MongoClient(DB_URL)


"""
remember to redownload the database each time this is run!
"""



database_runs = open('data/raideriknow.runs.json', 'r')
database_runs = json.load(database_runs)
# small error here - run rosters end in form { "oid" : string } instead of just string
database_runs = [Run.from_json(run) for run in database_runs]
database_run_ids = { run.keystone_run_id: run for run in database_runs }

database_characters = open('data/raideriknow.characters.json', 'r')
database_characters = json.load(database_characters)
database_characters = [Character.from_json(character) for character in database_characters]
database_characters = sorted(database_characters, key=lambda character: character.name)
database_character_ids = { character.id: character for character in database_characters }


def save_runs_from_rio (runs) :
    for run in runs :
        roster = run['roster']
        roster_oids = []
        for character in roster :
            character = character['character']
            char = Character.from_rio_json(character)
            if char.id not in database_character_ids :

                char_object_id = bson.ObjectId(client.raideriknow.characters.insert_one(char.to_json()).inserted_id)
                # char_object_id = bson.ObjectId(client.raideriknow.characters.find_one({'id': char.id})['_id'])
                print('Adding ' + char.name + ' to the database with id ' + str(char.id) + ' and object id ' + str(char_object_id))
                roster_oids.append(char_object_id)

                char._id = char_object_id
                database_characters.append(char)
                database_character_ids[char.id] = char
            
            else :
                roster_oids.append(bson.ObjectId(database_character_ids[char.id]._id))

        run['roster'] = roster_oids

        run['weekly_modifiers'] = list(map(lambda modifier: modifier['name'], run['weekly_modifiers']))
        

        r = Run.from_unpop_json(run)
        r_object_id = client.raideriknow.runs.insert_one(r.to_json()).inserted_id
        r._id = r_object_id
        print('Adding run ' + str(r.keystone_run_id) + ' to the database with object id ' + str(r_object_id))

        database_runs.append(r)
        database_run_ids[r.keystone_run_id] = r


        # further optimization is possible - we can save all the runs at once
        # however, we note that typically, we add runs very infrequently and in small batches
        # so this is not a priority








def save_character_runs (character) :
    summaries = []
    print("Retrieving runs for " + character.name)
    for dungeonId in tqdm(consts.DUNGEON_IDS) :
        char_summaries = character_run_summaries(character, dungeonId)

        summaries.extend([RunSummary.from_json(summary) for summary in char_summaries])

        time.sleep(0.2)

    unique_summaries = filter(lambda summary: summary.keystone_run_id not in database_run_ids and summary.mythic_level >= consts.MYTHIC_RUN_LEVEL_LIMIT, summaries)
    unique_summary_ids = list(map(lambda summary: summary.keystone_run_id, unique_summaries))
    
    print("Retrieving " + str(len(unique_summary_ids)) + " unique runs for " + character.name)
    # these are unique - we always upload these runs and their rosters
    retrieved_runs = []
    for id in tqdm(unique_summary_ids) :
        run = get_run_from_id(id)
        
        if run is not None :
            retrieved_runs.append(run)

    # 5 requests per second limit, we do lower
    time.sleep(0.3)

    print("Retrieved the " + str(len(retrieved_runs)) + " unique runs for " + character.name)

    save_runs_from_rio(retrieved_runs)


def save_all_character_runs () :
    i = 0
    if (client.raideriknow.runs.count_documents({}) != len(database_runs)) :
        print("Database runs do not match the actual number of runs in the database")
        print("Please redownload the database")
        return
    
    if (client.raideriknow.characters.count_documents({}) != len(database_characters)) :
        print("Database characters do not match the actual number of characters in the database")
        print("Please redownload the database")
        return
    
    for character in database_characters :
        save_character_runs(character)

        if (i % 10 == 0) :
            print("Saved runs for " + str(i) + " characters")


save_all_character_runs()