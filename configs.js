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

var agentObjs = [];
var maxT = 0;
var curT = 0;

var isAlgReady = false;
var isMapReady = false;

// 接收html变量
var inputRow;
var inputCol;
var wallPercent;
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
var testButton;


// 计时相关变量
var t;
var timings = {};

// 小车相关监测变量
var monitorTable;
// var turnCounts = [];
// var waitCounts = [];

//重置后如果没改变地图，就不用重新计算
var isMapChanged;
