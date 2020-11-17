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
var mapBtn;

var radioStart;
var radioEnd;
var radioBlock;

var flagStart;
var flagEnd;
var flagBlock;

// 控制类变量
var status;
var paused;
var stepsAllowed = 0;
var components = [];
var runPauseButton;
var stepButton;
var resetButton;


function setup() {

    //用户输入
    inputRow = select('#row');
    inputCol = select('#col');
    wallPercent = select('#blockPercent');

    radioStart = select('#start');
    radioEnd = select('#end');
    radioBlock = select('#block');

    mapBtn = select('#gmap');
    mapBtn.mousePressed(initCanvas);

}

function initCanvas() {
    var rows = inputRow.value();
    var cols = inputCol.value();
    var wallRatio = wallPercent.value();

    var canvasWidth = cellw * cols + 100;
    canvas = createCanvas(canvasWidth, canvasWidth);
    canvas.position(screen.availWidth / 2 - canvasWidth / 2, 100);

    var dimension = [cols, rows]; //col, row
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
    env = new Environment(dimension, agents, wallRatio);
    env.showGrid();

    // for (var agent of agents) {
    //     var path = solution[agent['name']];
    //     var o = new Agent(agent['start'], agent['goal'], agent['name'], agent['color'], path);
    //     if (path.length > maxT) {
    //         maxT = path.length;
    //     }
    //     agentObjs.push(o);
    // }

    paused = true;

    initSearch();

    // removeOrgButton(runPauseButton);
    runPauseButton = new Button("运行", env.w + 30, 20, 50, 30, runpause);
    components.push(runPauseButton);

    // // removeOrgButton(stepButton);
    // stepButton = new Button("单步", env.w+30, 70, 50, 30, step)
    // components.push(stepButton);
    //
    // // removeOrgButton(resetButton);
    // resetButton = new Button("重置", env.w+30, 120, 50, 30, restart)
    // components.push(resetButton);

}

function initSearch() {
    mapGraph = null;
    mapEdit = true;
    status = "Parameter Tuning";

}

function pauseCheck(isPause) {
    paused = isPause;
    runPauseButton.label = paused ? "运行" : "暂停";
    if (!paused) {
        calcPath();
        isReady = true;
    }
}

function runpause(button) {
    mapEdit = false;
    pauseCheck(!paused);
}

function calcPath() {
    cbs = new CBS(env);
    solution = cbs.search();

    console.log(solution);
    console.log('done out!');

    for (var agent of agentObjs) {
        if (agent.path.length < maxT) {
            agent.fullFillPath(maxT);
        }
    }
}

function checkRadio() {
    if (radioStart.elt.checked) {
        flagStart = true;
        flagEnd = false;
        flagBlock = false;
    } else if (radioEnd.elt.checked) {
        flagEnd = true;
        flagStart = false;
        flagBlock = false;
    } else {
        flagBlock = true;
        flagStart = false;
        flagEnd = false;
    }
}

function mouseClicked() {
    for (var i = 0; i < components.length; i++) {
        components[i].mouseClick(mouseX, mouseY);
    }
}

function isBoundSatisfied(x, y) {
    return x < cols && y < rows && x >= 0 && y >= 0;
}

function checkAgent() {
    return 1;
}

function mousePressed() {
    if (mapEdit) {
        let x = int((mouseX - left_pos) / cellw);
        let y = int((mouseY - top_pos) / cellh);
        // console.log(x, y);
        checkRadio();
        if (isBoundSatisfied(x, y)) {
            if (flagStart) {
                var curAgent = checkAgent();
                if (env.grid[x][y].type != 1) {
                    //清除原来的start
                    env.grid[curAgent.start[0]][curAgent.start[1]].type = 0;
                    //设定新的start
                    env.grid[x][y].type = 2;
                    curAgent.start = [x, y];
                }
            } else if (flagEnd) {
                var curAgent = checkAgent();
                if (env.grid[x][y].type != 1) {
                    //清除原来的start
                    env.grid[curAgent.end[0]][curAgent.end[1]].type = 0;
                    //设定新的start
                    env.grid[x][y].type = 3;
                    curAgent.start = [x, y];
                }
            } else {
                var tmpFlag = true;
                for (var agent of agentObjs) {
                    if ((x == agent.start[0] && y == agent1.start[1]) ||
                        (x == agent1.end[0] && y == agent1.end[1])) {
                        tmpFlag = false;
                    }
                }
                if (tmpFlag) {
                    if (env.grid[x][y].type == 1) {
                        env.removeObstacle(x, y);
                    } else {
                        env.obstacles.push([x, y]);
                    }
                    env.grid[x][y].toggleWall();
                }

            }
        }
    }
}

function drawMap() {
    if (mapEdit) {
        for (var i = 0; i < cols; i++) {
            for (var j = 0; j < rows; j++) {
                env.grid[i][j].show();
            }
        }
        mapGraph = get(left_pos, top_pos, env.w + 1, env.h + 1);
    } else {
        image(mapGraph, left_pos, top_pos);
    }
}

function draw() {
    // env.show();
    if (isReady) {

        drawMap();

        if (frameCount % 30 == 0) {
            env.showImg();

            for (var agent of agentObjs) {
                agent.stepOff(curT - 1);
            }

            for (var agent of agentObjs) {
                agent.stepShow(curT);
            }

            if (curT < maxT - 1) {
                curT += 1;
            }

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
