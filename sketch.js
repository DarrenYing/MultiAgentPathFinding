/**
 * 多Agent路径规划演示demo
 * @author DarrenYing
 */


function setup() {

    // startTime();

    //用户输入
    carName = select('#agentName');
    addCarBtn = select('#addCar');
    delCarBtn = select('#delCar');
    selBox = select('#sel');

    inputRow = select('#row');
    inputCol = select('#col');
    wallPercent = select('#blockPercent');

    radioStart = select('#start');
    radioEnd = select('#end');
    radioBlock = select('#block');

    mapBtn = select('#gmap');
    mapBtn.mousePressed(initCanvas);

    inputSpeed = select('#speed');
    speedBtn = select('#speedBtn');

    addCarBtn.mousePressed(addAgent);
    delCarBtn.mousePressed(removeAgent);
    speedBtn.mousePressed(updateSpeed);

    //加载字体
    myFont = loadFont('assets/YaHei.Consolas.1.12.ttf'); //微软雅黑+Consolas混合

    // recordTime('Set Up');
}

function initCanvas() {
    var rows = inputRow.value();
    var cols = inputCol.value();
    var wallRatio = wallPercent.value();

    // var curAgent = selBox.elt.value;

    var canvasWidth = cellw * cols + 100;
    var canvasHeight = cellh * rows + 150;
    canvas = createCanvas(canvasWidth, canvasHeight);
    canvas2Left = screen.availWidth / 2 - canvasWidth / 2;
    canvas2Top = 150;
    canvas.position(canvas2Left, canvas2Top);

    var dimension = [cols, rows]; //col, row
    if (!agentObjs.length) {
        var agents = [{
            'start': [0, 0],
            'goal': [7, 2],
            'name': 'agent1',
            'color': [255, 0, 0]
        }, {
            'start': [2, 0],
            'goal': [0, 9],
            'name': 'agent2',
            'color': [0, 255, 0]
        }];

        for (var agent of agents) {
            var o = new Agent(agent['start'], agent['goal'], agent['name'], agent['color']);
            agentObjs.push(o);
        }
    }

    env = new Environment(dimension, agentObjs, wallRatio);
    env.showGrid();


    isMapChanged = true;
    paused = true;

    initSearch();

    runPauseButton = createButton('运行');
    runPauseButton.position(canvas2Left + env.w + 30, canvas2Top + 20);
    runPauseButton.class('btn1');
    runPauseButton.mouseClicked(runpause);

    stepButton = createButton('单步');
    stepButton.position(canvas2Left + env.w + 30, canvas2Top + 70);
    stepButton.class('btn1');
    stepButton.mouseClicked(step);

    resetButton = createButton('重置');
    resetButton.position(canvas2Left + env.w + 30, canvas2Top + 120);
    resetButton.class('btn1');
    resetButton.mouseClicked(restart);

    isMapReady = true;

    // calcPath();
    // isAlgReady = true;
}

//清空记录
//mode=0 全部清空 mode=1 只清空execute的记录
function clearTimings(mode = 0) {
    if (mode == 0) {
        timings = {};
    } else if (mode == 1) {
        var calcTime = timings['Calculate Plan'];
        timings = {};
        timings['Calculate Plan'] = calcTime;
    }

}

//开始记录
function startTime() {
    t = millis(); //精确到毫秒
}

//记录时间点
function recordTime(moment) {
    if (!timings[moment]) {
        timings[moment] = {
            sum: millis() - t,
            count: 1,
        }
    } else {
        timings[moment].sum += millis() - t;
        timings[moment].count += 1;
    }
}

//打印时间
function logTimings() {
    for (var moment in timings) {
        if (timings.hasOwnProperty(moment)) {
            if (timings[moment].sum > 1000) {
                var tmpSum = round(timings[moment].sum / 1000, 3);
                console.log(moment + ": " + tmpSum.toString() + "s"); //应该是每个agent一个时间
            } else {
                console.log(moment + ": " + (round(timings[moment].sum, 3)).toString() + "ms");
            }
        }
    }
}

function addAgent() {

    if (isMapReady) {
        var flag = 1;
        var newAgentName = carName.value();
        if (newAgentName == "") {
            alert("小车名字不能为空!");
        } else {
            for (var i = 0; i < selBox.elt.options.length; i++) {
                if (selBox.elt.options[i].value == newAgentName) {
                    flag = 0;
                    break;
                }
            }
            if (flag) {
                isMapChanged = true;
                var option = new Option(newAgentName);
                option.className = 'agentOption';
                selBox.elt.options[selBox.elt.options.length] = option;
                var newAgent = new Agent(pickPos(2), pickPos(3), newAgentName, pickColor());
                agentObjs.push(newAgent);
                env.makeAgentDict();
            } else {
                alert('名字重复，请换一个吧!');
                // console.log('名字重复，请换一个吧!');
            }
        }
    } else {
        alert('请先生成地图!');
    }
}

function removeAgent() {
    if (isMapReady) {
        var name = carName.value();
        var todel = -1;
        for (var i = selBox.elt.options.length - 1; i >= 0; i--) {
            if (selBox.elt.options[i].value == name) {
                todel = i;
                // selBox.elt.options.remove(i);
                break;
            }
        }

        if (todel != -1) {
            isMapChanged = true;
            var todelAgent = agentObjs[todel];
            //清除其起点和终点
            env.grid[todelAgent.start[0]][todelAgent.start[1]].type = 0;
            env.showOneGrid(todelAgent.start[0], todelAgent.start[1]);
            env.grid[todelAgent.goal[0]][todelAgent.goal[1]].type = 0;
            env.showOneGrid(todelAgent.goal[0], todelAgent.goal[1]);
            //从Agent数组中删除
            _.pull(agentObjs, todelAgent);
            env.makeAgentDict();
            //从界面选项中删除
            selBox.elt.options.remove(i);
        } else {
            alert('该小车不存在!');
            // console.log('该小车不存在!');
        }

        //清空输入框
        carName.elt.value = "";
    } else {
        alert('请先生成地图!');
    }

}

function pickPos(flag) {
    var col = floor(random(0, env.dimension[0]));
    var row = floor(random(0, env.dimension[1]));
    while (env.grid[col][row].type == 2 || env.grid[col][row].type == 3) {
        col = floor(random(0, env.dimension[0]));
        row = floor(random(0, env.dimension[1]));
    }
    if (env.grid[col][row].type == 1) {
        env.removeObstacle(col, row);
        //清除原来的障碍物图像
        env.grid[col][row].type = 0;
        env.showOneGrid(col, row);
    }
    env.grid[col][row].type = flag;
    var pos = [col, row];
    return pos;
}

function pickColor() {
    var newColor = [floor(random(40, 240)), floor(random(40, 240)), floor(random(40, 240))];
    return newColor;
}

function updateSpeed() {
    var val = inputSpeed.value();
    if (val <= 100 && val >= 1) {
        agentSpeed = floor(map(val, 1, 100, 80, 2));
    } else {
        alert('请输入1-100之间的数字');
    }

}

function initSearch() {
    mapGraph = null;
    mapEdit = true;
    status = "Parameter Tuning";
}

function pauseCheck(isPause) {
    paused = isPause;
    // runPauseButton.label = paused ? "运行" : "暂停";
    runPauseButton.elt.innerText = paused ? "运行" : "暂停";
    if (!paused) {
        if (isMapChanged) {
            clearTimings();
            calcPath();
        }
        startTime(); //开始记录在地图上运行的时间
        // isAlgReady = true;
    }
}

function runpause(button) {
    mapEdit = false;
    pauseCheck(!paused);
}

function step(button) {
    mapEdit = false;
    pauseCheck(true); //暂停
    stepsAllowed = 1;
}

function stepSearch() {
    if (!paused || stepsAllowed > 0) {

        if (frameCount % agentSpeed == 0) {
            stepsAllowed--;
            for (var agent of agentObjs) {
                agent.stepOff(curT - 1);
            }
            for (var agent of agentObjs) {
                agent.stepShow(curT);
            }

            if (curT < maxT - 1) {
                curT += 1;
                status = 'still Searching';
            } else {
                recordTime('Execution On Map');
                status = 'all Reached';
                runpause(true);
                logTimings();
            }
        }

    }
}

function restart(button) {
    //重置状态
    // logTimings();
    clearTimings(1);
    initSearch();
    pauseCheck(true);
    console.log(curT);
    for (var agent of agentObjs) {
        agent.stepOff(curT - 1);
        agent.stepOff(curT);
        agent.isReached = false;
    }
    curT = 0;
    isMapChanged = false;
}

function calcPath() {
    startTime();
    cbs = new CBS(env);
    solution = cbs.search();
    recordTime('Calculate Plan');

    console.log(solution);
    console.log('done out!');

    if (!Object.keys(solution).length || solution == -1) {
        status = "No Solution!"
        // console.log(status);
        // logTimings();
        runpause();
        noLoop();
        return;
    } else {
        // TODO:补全路径，需要修改!
        for (var agent of agentObjs) {
            agent.path = solution[agent.name];
            if (agent.path.length > maxT) {
                maxT = agent.path.length;
            }
        }

        for (var agent of agentObjs) {
            if (agent.path.length < maxT) {
                agent.fullFillPath(maxT);
            }
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



function isBoundSatisfied(x, y) {
    return x < env.dimension[0] && y < env.dimension[1] && x >= 0 && y >= 0;
}

function getAgentByName(agentName) {
    for (var i = 0; i < agentObjs.length; i++) {
        if (agentObjs[i].name == agentName) {
            return agentObjs[i];
        }
    }
}

function mouseClicked() {

    if (mapEdit) {
        let x = int((mouseX - left_pos) / cellw);
        let y = int((mouseY - top_pos) / cellh);
        // console.log(x, y);
        checkRadio();
        if (isBoundSatisfied(x, y)) {
            isMapChanged = true;
            if (flagStart) {
                var agentName = selBox.elt.value; //agentName
                curAgent = getAgentByName(agentName);
                if (env.grid[x][y].type != 1) {
                    //清除原来的start
                    env.grid[curAgent.start[0]][curAgent.start[1]].type = 0;
                    env.showOneGrid(curAgent.start[0], curAgent.start[1]);
                    //设定新的start
                    env.grid[x][y].type = 2;
                    curAgent.start = [x, y];
                    env.makeAgentDict();
                }
            } else if (flagEnd) {
                var agentName = selBox.elt.value; //agentName
                curAgent = getAgentByName(agentName);
                if (env.grid[x][y].type != 1) {
                    //清除原来的start
                    env.grid[curAgent.goal[0]][curAgent.goal[1]].type = 0;
                    env.showOneGrid(curAgent.goal[0], curAgent.goal[1]);
                    //设定新的start
                    env.grid[x][y].type = 3;
                    curAgent.goal = [x, y];
                    env.makeAgentDict();
                }
            } else {
                var tmpFlag = true;
                for (var agent of agentObjs) {
                    if ((x == agent.start[0] && y == agent.start[1]) ||
                        (x == agent.goal[0] && y == agent.goal[1])) {
                        tmpFlag = false;
                    }
                }
                if (tmpFlag) {
                    // console.log(env.grid[x][y].type);
                    if (env.grid[x][y].type == 1) {
                        env.removeObstacle(x, y);
                    } else {
                        env.obstacles.push([x, y]);
                    }
                    env.grid[x][y].toggleWall();
                    env.showOneGrid(x, y);
                    // console.log(env.grid[x][y].type);
                }

            }
        }
    }
}

function drawMap() {
    env.showBlock();
    env.showImg();
}

function drawButtons() {
    for (var i = 0; i < components.length; i++) {
        components[i].show();
    }
}

function drawStatus() {
    textSize(16);
    textFont(myFont);
    //清除原来的状态
    fill(255);
    noStroke();
    rectMode(CORNER);
    rect(left_pos, env.h + 30, 300, 300);
    //写上新的状态
    stroke(0);
    strokeWeight(0);
    fill(0);
    text("当前状态:" + status, left_pos, env.h + 50);
}

function drawTimings() {
    textSize(16);
    textFont(myFont);
    //清除原来的时间画布
    fill(255);
    stroke(255);
    rectMode(CORNER);
    rect(left_pos + env.w / 2, env.h + 30, 300, 300);
    stroke(0);
    fill(0);
    for (var moment in timings) {
        if (timings.hasOwnProperty(moment)) {
            switch (moment) {
                // case "Set Up":
                //     text(moment + ": " + (round(timings[moment].sum, 3)).toString() + "ms", left_pos + env.w / 2, env.h + 50);
                //     break;
                case "Calculate Plan":
                    text(moment + ": " + (round(timings[moment].sum, 3)).toString() + "ms", left_pos + env.w / 2, env.h + 50);
                    break;
                case "Execution On Map":
                    var tmpSum = round(timings[moment].sum / 1000, 3);
                    text(moment + ": " + tmpSum.toString() + "s", left_pos + env.w / 2, env.h + 80);
                    break;
                default:
                    break;
            }

        }
    }
}

function draw() {

    if (isMapReady) {
        drawMap();
        drawStatus();
        drawTimings();
    }

    stepSearch();
}
