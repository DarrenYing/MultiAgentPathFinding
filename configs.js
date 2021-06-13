var env;
var cbs;
var solution;

var canvas;
var canvas2Left;
var canvas2Top;
var left_pos = 10;
var top_pos = 10;

// 地图相关变量
var cellw = 30;
var cellh = 30;
var gameMap;
var mapGraph; //将地图存储为图片，节约每次刷新的绘制时间
var mapEdit; //标记是否能编辑地图
var mode = "userMode";   // 地图生成模式
var autoTest = false;   // 是否开启自动测试
var inputAgentNum = 2;   // 生成地图时的小车数量(位置随机分配)

var agentObjs = [];
var maxT = 0;
var curT = 0;

var isAlgReady = false;
var isMapReady = false;

// 接收html变量
var inputRow;
var inputCol;
var wallPercent;
var mapName;
var mapMode;
var autoTestBtn;    // 自动测试checkbox
var userModeInput;
var testModeInput;
var mapBtn;

var btnBox; // 蓝框
var radioStart;
var radioEnd;
var radioBlock;

var flagStart;
var flagEnd;
var flagBlock;

var carName;
var addCarBtn;
var delCarBtn;
var selBox;
var curAgent;

var algBox;
var algName = "alg1";

var inputSpeed;
var speedBtn;

// 控制类变量
var myFont;
var status;
var paused = true;
var stepsAllowed = 0;
var agentSpeed = 15;

// 按钮
// var components = [];
var runPauseButton;
var stepButton;
var resetButton;
var saveMapButton;
var saveDataButton;


// 计时相关变量
var t;
var timings = {};
var timeStats = []; //记录统计每个地图小车运行的时间数据
var idxLimit = 4;
var agentNumLimit = 8;
var agentNumStep = 1;
var agentAvgTime = {
    "map_8by8_1_2_ex": 309.921,
    "map_8by8_1_3_ex": 319.296,
    "map_8by8_1_4_ex": 326.293,
    "map_8by8_1_5_ex": 327.675,
    "map_8by8_1_6_ex": 344.38,
    "map_8by8_1_7_ex": 315.871,
    "map_8by8_6_2_ex": 309.921,
    "map_8by8_6_3_ex": 319.296,
    "map_8by8_6_4_ex": 326.293,
    "map_8by8_6_5_ex": 327.675,
    "map_8by8_6_6_ex": 344.38,
    "map_8by8_6_7_ex": 315.871,
    "map_20by20_4_12_ex": 404.091,
    "map_20by20_4_16_ex": 553.267,
    "map_20by20_4_20_ex": 663.151,
    "map_20by20_4_4_ex": 295.564,
    "map_20by20_4_8_ex": 284.203,
    "map_50by50_25_10_ex": 336.545,
    "map_50by50_25_15_ex": 480.991,
    "map_50by50_25_20_ex": 622.03,
    "map_50by50_25_25_ex": 774.773,
    "map_50by50_25_30_ex": 932.688
}

// 小车相关监测变量
var monitorTable;
// var turnCounts = [];
// var waitCounts = [];

//重置后如果没改变地图，就不用重新计算
var isMapChanged;

//记录上一个复选框选中的Agent下标
var lastIndex = 0;

// Astar寻找neighbor的顺序
var dirs1 = [[0, -1], [1, 0], [0, 1], [-1, 0]]; //顺时针 上右下左
var dirs2 = [[0, -1], [-1, 0], [0, 1], [1, 0]]; //逆时针
// var dirs3 = [[0, -1], [1, 0], [0, -1], [-1, 0]];
// var dirs4 = [[0, -1], [1, 0], [0, -1], [-1, 0]];

// 小车颜色数组
// 超过8个则循环
var colors = [[231, 76, 60], [46, 204, 113], [241, 196, 15], [52, 152, 219],
              [155, 89, 182], [211, 84, 0], [26, 188, 156], [104, 109, 224]];
