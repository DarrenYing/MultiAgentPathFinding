"""
将yaml格式的地图文件转换为Map Obj
"""

'''
yaml格式:
agents:
-   goal: [7, 6]
    name: agent0
    start: [2, 6]
map:
    dimensions: [8, 8]
    obstacles:
    - !!python/tuple [5, 3]
    - !!python/tuple [4, 3]
    - !!python/tuple [7, 1]
    - !!python/tuple [4, 4]
    - !!python/tuple [3, 7]
    - !!python/tuple [5, 4]
    - !!python/tuple [4, 6]
    - !!python/tuple [7, 3]
    - !!python/tuple [1, 2]
    - !!python/tuple [1, 7]
    - !!python/tuple [2, 1]
    - !!python/tuple [3, 2]

'''

'''
Obj格式:
var map_test = {
    "dimension":["20","20"],
    "agents":[
        {"start":[0,0],"goal":[7,2],"name":"agent1","color":[255,0,0]},
        {"start":[2,0],"goal":[0,9],"name":"agent2","color":[0,255,0]}
    ],
    "obstacles":[
        [15,19],[16,3],[16,4],[17,19],
        [18,2],[18,3],[19,1],[19,10]
    ],
    "wallRatio":-1};
'''

import argparse
import yaml
import json
import os

colors = [[231, 76, 60], [46, 204, 113], [241, 196, 15], [52, 152, 219],
              [155, 89, 182], [211, 84, 0], [26, 188, 156], [104, 109, 224]]

# parser = argparse.ArgumentParser()
# parser.add_argument("param", default="./map_yaml/map_8by8_obst12_agents1_ex0.yaml" , help="input file containing map and obstacles")
# parser.add_argument("output", help="output file with the schedule")
# args = parser.parse_args()

input_file = './map_yaml/map_8by8_obst12_agents1_ex0.yaml'


def readFromYamlFile(filename):
    # Read from input file
    with open(filename, 'r') as param_file:
        try:
            param = yaml.load(param_file, Loader=yaml.FullLoader)
        except yaml.YAMLError as err:
            print(err)
    return param

def generateMapObj(param):
    # 提取数据
    dimension = param["map"]["dimensions"]
    obstacles = param["map"]["obstacles"]
    agents = param["agents"]
    # 给agents加上color属性
    for idx, agent in enumerate(agents):
        agent['color'] = colors[idx]

    # 将obstacles从元组转换为列表
    new_obs = []
    for obstacle in obstacles:
        new_obs.append(list(obstacle))

    map_dict = {}
    map_dict["dimension"] = dimension
    map_dict["agents"] = agents
    map_dict["obstacles"] = new_obs
    map_dict["wallRatio"] = -1

    return map_dict

def generateMapName(filename):
    arr = filename.split('_')
    return '_'.join(['map', arr[2], arr[3][4:], arr[4][6:], arr[5].split('.')[0]])

def writeToFile(outputFile, map_name, map_dict):
    map_str = json.dumps(map_dict)
    map_str = map_name + ' = ' + map_str + '\n'
    with open(outputFile, "a+") as f:
        f.write(map_str)
        f.close()


def process(filename):
    param = readFromYamlFile(filename)
    map_dict = generateMapObj(param)
    map_name = generateMapName(filename)
    outputFile = './map_output/maps.js'
    writeToFile(outputFile, map_name, map_dict)


# main()

def batchProcess(dir_path):
    files = [dir_path + file for file in os.listdir(dir_path)]

    for file in files:
        # print(file)
        process(file)

dir_path = './map_yaml/'

batchProcess(dir_path)