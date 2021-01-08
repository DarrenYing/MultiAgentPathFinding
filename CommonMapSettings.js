// 一次性引入全部地图配置文件
// document.write('<script src="maps/test01.js" charset="utf-8"></script>');
// document.write('<script src="maps/test02.js" charset="utf-8"></script>');


/*
 * 测试地图20*20系列
 */

// 1号
var map_20_20_01 = {
    dimension: [20, 20],
    agents: [
        {
            'start': [0, 0],
            'goal': [7, 2],
            'name': 'agent1',
            'color': [255, 0, 0]
        }, {
            'start': [2, 0],
            'goal': [0, 9],
            'name': 'agent2',
            'color': [0, 255, 0]
        }
    ],
    wallRatio: 0.1,
};

// 2号
var map_20_20_02 = {
    dimension: [20, 20],
    agents: [
        {
            'start': [0, 0],
            'goal': [15, 2],
            'name': 'agent1',
            'color': [255, 0, 0]
        }, {
            'start': [7, 0],
            'goal': [0, 14],
            'name': 'agent2',
            'color': [0, 255, 0]
        }
    ],
    wallRatio: 0.1,
};


/*==================================================================*/

/*
 * 测试地图30*30系列
 */

// 1号
var map_30_30_01 = {
    dimension: [30, 30],
    agents: [
        {
            'start': [0, 20],
            'goal': [7, 25],
            'name': 'agent1',
            'color': [255, 0, 0]
        }, {
            'start': [20, 0],
            'goal': [10, 9],
            'name': 'agent2',
            'color': [0, 255, 0]
        }
    ],
    wallRatio: 0.1,
};
