var env;
var cbs;
var solution;

var canvas;
var left_pos = 10;
var top_pos = 10;

// 地图相关变量
var cellw = 30;
var cellh = 30;
var rows;
var cols;
var mapw;
var maph;
var gameMap;
var mapGraph; //将地图存储为图片，节约每次刷新的绘制时间
var mapEdit; //标记是否能编辑地图

var agentObjs = [];
var maxT = 0;
var curT = 0;

var isReady = false;

// 接收html变量
var curAgent;
var inputRow;
var inputCol;
var wallPercent;

var radioStart;
var radioEnd;
var radioBlock;

var flagStart;
var flagEnd;
var flagBlock;


function setup() {

    //输入
    var dimension = [20, 20];
    var obstacles = [
        [0, 1],
        [2, 1]
    ];
    var agents = [{
        'start': [0, 0],
        'goal': [17, 2],
        'name': 'agent0',
        'color': [255, 0, 0]
    }, {
        'start': [2, 0],
        'goal': [0, 12],
        'name': 'agent1',
        'color': [0, 255, 0]
    }];

    mapw = dimension[0] * cellw;
    maph = dimension[1] * cellh;

    var canvasWidth = mapw + 100;
    canvas = createCanvas(canvasWidth, canvasWidth);
    canvas.position(screen.availWidth / 2 - canvasWidth / 2, 100);

    env = new Environment(dimension, agents, obstacles);

    cbs = new CBS(env);
    solution = cbs.search();

    console.log(solution);
    console.log('done out!');

    //初始化作图
    env.show();

    for (var agent of agents) {
        var path = solution[agent['name']];
        var o = new Agent(agent['start'], agent['goal'], agent['name'], agent['color'], path);
        if (path.length > maxT) {
            maxT = path.length;
        }
        agentObjs.push(o);
    }

    for (var agent of agentObjs) {
        if (agent.path.length < maxT) {
            agent.fullFillPath(maxT);
        }
    }

}

function draw() {
    // env.show();

    if (frameCount % 30 == 0) {
        env.showImg();

        for (var agent of agentObjs) {
            agent.stepShow(curT);
        }

        if (curT < maxT - 1) {
            curT += 1;
        }

    }




}

function test() {
    p1 = new Location(1, 2);
    p2 = new Location(2, 1);

    // console.log(p1.isEqualTo(p2));
    // console.log(p1.toString());

    s1 = new State(1, p1);
    s2 = new State(1, p2);
    // console.log(s1.isEqualTo(s2));
    // console.log(s1.isEqualExceptTime(s2));
    // console.log(s1.toString());

    vc1 = new VertexConstraint(1, p1);
    vc2 = new VertexConstraint(2, p2);

    ec1 = new EdgeConstraint(1, p1, p1);
    ec2 = new EdgeConstraint(2, p2, p2);

    c1 = new Constraints();
    c1.vertex_constraints.add(vc1);
    c1.edge_constraints.add(ec1);
    c2 = new Constraints();
    c2.vertex_constraints.add(vc2);
    c2.edge_constraints.add(ec2);

    // console.log(c1.toString());
    // console.log(c2.toString());
    // c1.addConstraint(c2);
    // console.log(c1.toString());

    test = [];
    test.push(p1);
    test.push(p2);
    p3 = new Location(1, 2);
    console.log(test.includes(p3));
}

function inputTest() {
    // var dimension = [8, 8];
    // var obstacles = [
    //   [6, 7],
    //   [1, 4],
    //   [7, 7],
    //   [2, 4],
    //   [7, 5],
    //   [3, 5],
    //   [0, 0],
    //   [5, 5],
    //   [6, 5],
    //   [3, 3],
    //   [0, 7],
    //   [6, 4]
    // ];
    // var agents = [{
    //   'start': [7, 1],
    //   'goal': [4, 0],
    //   'name': 'agent0'
    // }, {
    //   'start': [2, 2],
    //   'goal': [6, 0],
    //   'name': 'agent1'
    // }];
}
