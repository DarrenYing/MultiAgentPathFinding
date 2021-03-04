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
var idxLimit = 99;
var agentNumLimit = 11;


// 小车相关监测变量
var monitorTable;
// var turnCounts = [];
// var waitCounts = [];

//重置后如果没改变地图，就不用重新计算
var isMapChanged;

// Astar寻找neighbor的顺序
var dirs1 = [[0, -1], [1, 0], [0, 1], [-1, 0]]; //顺时针
var dirs2 = [[0, -1], [-1, 0], [0, 1], [1, 0]]; //逆时针
// var dirs3 = [[0, -1], [1, 0], [0, -1], [-1, 0]];
// var dirs4 = [[0, -1], [1, 0], [0, -1], [-1, 0]];

// 小车颜色数组
// 超过8个则循环
var colors = [[231, 76, 60], [46, 204, 113], [241, 196, 15], [52, 152, 219],
              [155, 89, 182], [211, 84, 0], [26, 188, 156], [104, 109, 224]];
