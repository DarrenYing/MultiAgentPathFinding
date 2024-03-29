/**
 * 多Agent路径规划演示demo
 * @author DarrenYing
 */


function setup() {

    // startTime();

    //用户输入、
    //小车
    carName = select('#agentName');
    addCarBtn = select('#addCar');
    delCarBtn = select('#delCar');
    selBox = select('#sel');

    //算法
    algBox = select('#alg');
    algBox.mouseClicked(switchAlg);

    //地图
    mapMode = select('#mapMode');
    mapMode.mouseClicked(switchMapMode);
    userModeInput = select('#userModeInput');
    testModeInput = select('#testModeInput');
    inputRow = select('#row');
    inputCol = select('#col');
    wallPercent = select('#blockPercent');
    inputAgentNum = select('#agentNum');
    mapName = select('#mapName');
    autoTestBtn = select('#autotest');
    autoTestBtn.mouseClicked(switchAutoTest);

    btnBox = select('#btnBox');
    btnBox.mouseClicked(checkRadio);
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

function switchAlg() {
    algName = algBox.elt.options[algBox.elt.selectedIndex].value;   //alg1 or alg2
    if (algName == "alg1") {
        cbs = new CBS(env);
        console.log(env.alg);
    }
    else if (algName == "alg2") {
        cbs = new CBS_v2(env);
        console.log(env.alg);
    }
    isMapChanged = true;    //触发算法重新计算
}

function switchMapMode() {
    mode = mapMode.elt.options[mapMode.elt.selectedIndex].value; //userMode or testMode
    if (mode == "testMode") {
        userModeInput.elt.style.display = 'none';
        testModeInput.elt.style.display = 'inline-block';
    } else if (mode == "userMode") {
        userModeInput.elt.style.display = 'inline-block';
        testModeInput.elt.style.display = 'none';
        autoTest = false; //关闭自动测试
    }
    // clearTimings();
}

function switchAutoTest() {
    autoTest = autoTestBtn.elt.checked;
}

function initCanvas() {

    if (mode == "testMode") {

        // Test Mode, 用于测试自己设计的地图
        // var testMap = map_8by8_12_6_ex2;
        try {
            var testMap = eval(mapName.elt.value);
        } catch(e) {
            alert("该地图场景不存在！");
        }
        var dimension = testMap.dimension;
        var agents = testMap.agents;
        agentObjs.splice(0, agentObjs.length);
        selBox.elt.options.length = 0;  //先清空
        for (var agent of agents) {
            var o = new Agent(agent['start'], agent['goal'], agent['name'], agent['color']);
            agentObjs.push(o);
            //添加到选项框
            var option = new Option(agent['name']);
            option.className = 'selectOption';
            selBox.elt.options[selBox.elt.options.length] = option;
        }
        var rows = dimension[0];
        var cols = dimension[1];
        adjustCellWidth(rows, cols);
        var obstacles = testMap.obstacles;
        var wallRatio = testMap.wallRatio;

    } else if (mode == "userMode") {
        // User Input Mode
        var rows = inputRow.value();
        var cols = inputCol.value();
        adjustCellWidth(rows, cols);
        var wallRatio = wallPercent.value();
        var agentNum = inputAgentNum.value();
        var obstacles = [];
        var dimension = [cols, rows]; //col, row
        // var agents = [
        //     {
        //         'start': [0, 0],
        //         'goal': [4, 4],
        //         'name': 'agent1',
        //         'color': [255, 0, 0]
        //     },
        //     {
        //         'start': [1, 0],
        //         'goal': [4, 5],
        //         'name': 'agent2',
        //         'color': [0, 255, 0]
        //     }
        // ];
        var agents = generateAgents(agentNum, rows, cols);

        agentObjs.splice(0, agentObjs.length);
        selBox.elt.options.length = 0;  //先清空
        for (var agent of agents) {
            var o = new Agent(agent['start'], agent['goal'], agent['name'], agent['color']);
            agentObjs.push(o);
            //添加到选项框
            var option = new Option(agent['name']);
            option.className = 'selectOption';
            selBox.elt.options[selBox.elt.options.length] = option;
        }
    }


    // var curAgent = selBox.elt.value;

    var canvasWidth = cellw * cols + 100;
    var canvasHeight = cellh * rows + 200;
    canvas = createCanvas(canvasWidth, canvasHeight);
    canvas2Left = screen.availWidth / 2 - canvasWidth / 2;
    canvas2Top = 150;
    canvas.position(canvas2Left, canvas2Top);


    env = new Environment(dimension, agentObjs, wallRatio, obstacles);
    env.showGrid();

    cbs = new CBS(env); //默认原始算法
    switchAlg();    //主动触发，检查当前所选算法

    isMapChanged = true;
    paused = true;
    flagBlock = true;

    initSearch();
    clearBtns();

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

    saveMapButton = createButton('保存地图');
    saveMapButton.position(canvas2Left + env.w + 130, canvas2Top + 20);
    saveMapButton.class('btn1');
    saveMapButton.mouseClicked(saveMap);

    saveDataButton = createButton('保存数据');
    saveDataButton.position(canvas2Left + env.w + 130, canvas2Top + 70);
    saveDataButton.class('btn1');
    saveDataButton.mouseClicked(saveData);

    monitorTable = createElement('table');
    monitorTable.position(canvas2Left + env.w + 30, canvas2Top + 180);
    monitorTable.class('table');
    //表头
    var thead = createElement('thead', '<tr><th>小车名称</th><th>转弯次数</th><th>停车次数</th></tr>');
    thead.parent(monitorTable);

    isMapReady = true;

    // calcPath();
    // isAlgReady = true;
}

// 根据地图行数和列数，动态调整网格大小
function adjustCellWidth(rows, cols) {
    if (rows>80 || cols>80) {
        cellw = 10;
        cellh = 10;
    } else if (rows>30 || cols>30) {
        cellw = 20;
        cellh = 20;
    } else {
        cellw = 30;
        cellh = 30;
    }
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

function clearTable() {
    for (var i = monitorTable.elt.rows.length - 1; i > 0; i--) {
        monitorTable.elt.deleteRow(i);
    }
}

function clearBtns() {
    if (runPauseButton == undefined) {
        return;
    }
    var eleList = [runPauseButton, stepButton, resetButton, monitorTable, saveMapButton, saveDataButton];
    for (var element of eleList) {
        let parent = element.elt.parentElement;
        parent.removeChild(element.elt);
    }
}

//保存地囤
function saveMap() {
    // var dim = env.dimension;
    // var obs = env.obstacles;
    var ags = [];
    for (var agent of agentObjs) {
        let tmp = {
            'start': agent.start,
            'goal': agent.goal,
            'name': agent.name,
            'color': agent.color
        }
        ags.push(tmp);
    }
    var curMap = {
        dimension: env.dimension,
        agents: ags,
        obstacles: env.obstacles,
        wallRatio: -1,
    }
    console.log(JSON.stringify(curMap));
    var curMapFilename = 'map_' + str(env.dimension[1]) + 'by' + str(env.dimension[0]) +
        '_' + str(env.obstacles.length) + '_' + str(ags.length) + '_' + 'ex';
    saveToFile(curMap, curMapFilename);
    // let mm = new MapToSave(env.dimension, ags, env.obstacles);
    // console.log(mm.toString());
}

function saveData() {
    if (timeStats.length == 0) {
        alert("当前无统计数据");
        return 0;
    }
    if (mode == 'testMode') {
        let tmpName = mapName.elt.value; //map_8by8_12_1_ex1   map_32by32_204_10_ex0
        let xpos = tmpName.search('x') + 1; //16
        var curMapFilename = tmpName.slice(0, xpos) + '_ex_statistics';
    }
    else if (mode == 'userMode') {
        var curMapFilename = 'map_' + str(env.dimension[1]) + 'by' + str(env.dimension[0]) +
            '_' + str(env.obstacles.length) + '_' + str(agentObjs.length) + '_ex_statistics';
    }
    saveToFile(timeStats, curMapFilename + '.json');
    timeStats.length = 0;   // 下载后清空统计数据
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
    var tmpStats = {};
    var mname = mapName.elt.value;
    tmpStats["MapName"] = mname;
    var avgTime = agentAvgTime[mname.slice(0, mname.length-1)];
    tmpStats["TurnCounts"] = [];
    tmpStats["WaitCounts"] = [];
    tmpStats["PathLength"] = [];
    tmpStats["Execution-Timings"] = [];
    for (var moment in timings) {
        if (timings.hasOwnProperty(moment)) {

            switch (moment) {
                case "Calculate Plan":
                    tmpStats["Calculation-Timings"] = round(timings[moment].sum, 3);
                    break;
                case "Execution On Map":
                    var tmpSum = round(timings[moment].sum, 3); // 单位 ms

                    var tmpTotal = 0;
                    for (var agent of agentObjs) {
                        let aname = agent.name;
                        var tmpRunTime = avgTime * agent.pathLength;    //全部视为直走时所用耗时
                        tmpRunTime += avgTime * agent.turnCount * 1.094;    //转弯耗时估计为直行的2.094倍，补偿差值
                        tmpRunTime = round(tmpRunTime, 3);  //保留三位小数
                        tmpTotal += tmpRunTime;

                        let tmpObj = {};
                        tmpObj[aname] = tmpRunTime;
                        tmpStats["Execution-Timings"].push(tmpObj);
                        // console.log(moment + "-" + agent.name + ": " + tmpRunTime.toString() + "ms"); //应该是每个agent一个时间

                        // 转弯次数和停靠次数
                        let tmp1 = {};
                        tmp1[aname] = agent.turnCount;
                        tmpStats["TurnCounts"].push(tmp1);
                        let tmp2 = {};
                        tmp2[aname] = agent.waitCount;
                        tmpStats["WaitCounts"].push(tmp2);
                        // 记录路径长度
                        let tmp3 = {}
                        tmp3[aname] = agent.pathLength;
                        tmpStats["PathLength"].push(tmp3);
                    }
                    tmpStats["Average-Time"] = round(tmpTotal / agentObjs.length, 3);
                    break;
            }
            // if (timings[moment].sum > 1000) {
            //     var tmpSum = round(timings[moment].sum / 1000, 3);  //单位 s
            //     for(var agent of agentObjs) {
            //         var tmpRunTime = round(tmpSum / maxT * agent.pathLength, 3);
            //         console.log(moment + "-" + agent.name + ": " + tmpRunTime.toString() + "s"); //应该是每个agent一个时间
            //     }
            //     // console.log(moment + ": " + tmpSum.toString() + "s"); //应该是每个agent一个时间
            // } else {
            //     var tmpSum = round(timings[moment].sum, 3); // 单位 ms
            //     for(var agent of agentObjs) {
            //         var tmpRunTime = round(tmpSum / maxT * agent.pathLength, 3);
            //         console.log(moment + "-" + agent.name + ": " + tmpRunTime.toString() + "ms"); //应该是每个agent一个时间
            //     }
            //     // console.log(moment + ": " + (round(timings[moment].sum, 3)).toString() + "ms");
            // }
        }
    }
    timeStats.push(tmpStats);
    console.log("timeStats: ", timeStats);
}

//初始化时生成对应数量的Agent
function generateAgents(num, rows, cols) {
    var newAgents = [];
    for(var i=0; i<num; i++) {
        //创建Agent
        let agentName = 'agent'+str(i+1);
        let newAgent = {};
        newAgent['start'] = generateRandomPos(rows, cols);
        newAgent['goal'] = generateRandomPos(rows, cols);   //需要检查是否重复
        newAgent['name'] = agentName;
        newAgent['color'] = colors[i%8];
        newAgents.push(newAgent);
    }
    return newAgents;
}

//生成随机位置
function generateRandomPos(rows, cols) {
    let pos1 = floor(random(0, cols));
    let pos2 = floor(random(0, rows));
    return [pos1, pos2];
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
                option.className = 'selectOption';
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
    if (mapEdit) {
        var val = inputSpeed.value();
        if (val <= 100 && val >= 1) {
            agentSpeed = floor(map(val, 1, 100, 80, 2));
        } else {
            alert('请输入1-100之间的数字');
        }
    } else {
        alert('当前状态不可设置速度');
    }

}

function initSearch() {
    mapGraph = null;
    mapEdit = true;
    status = "Parameter Tuning";
    solution = undefined;
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

function runpause() {
    mapEdit = false;
    pauseCheck(!paused);
}

function step() {
    if (isMapChanged) {
        alert('请先运行');
    } else if (status == "All Reached") {
        alert('已到达终点');
    } else {
        mapEdit = false;
        pauseCheck(true); //暂停
        stepsAllowed = 1;
    }
}

function stepSearch() {
    if (!paused || stepsAllowed > 0) {
        // console.log(paused, stepsAllowed);
        if (frameCount % agentSpeed == 0) {
            stepsAllowed--;
            for (var agent of agentObjs) {
                if (curT > 0) {
                    agent.stepOff(curT - 1);
                }
            }
            for (var agent of agentObjs) {
                agent.stepShow(curT);
            }

            if (curT < maxT - 1) {
                curT += 1;
                status = 'Still Searching';
            } else {
                recordTime('Execution On Map');
                status = 'All Reached';
                mapEdit = false;
                pauseCheck(true);
                logTimings();
                let tt1 = millis();
                drawMonitorVars();
                let tt2 = millis();
                console.log("draw monitors:", tt2-tt1);
            }
        }

    } else if (paused && status == 'All Reached' && autoTest) {
        let tmpName = mapName.elt.value; //map_8by8_12_1_ex1   map_32by32_204_10_ex0
        let xpos = tmpName.search('x') + 1; //16
        let idx = eval(tmpName.slice(xpos, tmpName.length));
        if (idx < idxLimit) { //控制实验序号 0-99
            mapName.elt.value = tmpName.slice(0, xpos) + str(idx + 1);
        } else if (agentObjs.length < agentNumLimit) { //控制Agent数量
            //运行完保存数据
            saveToFile(timeStats, tmpName.slice(0, xpos) + '.json');
            timeStats.length = 0; //清空数组

            //开始下一组测试
            let orgAgentNum = tmpName.split('_')[3];
            let newAgentNum = eval(orgAgentNum) + agentNumStep;
            console.log("New Agent Num:", newAgentNum);
            if (newAgentNum >= agentNumLimit) {
                // noLoop();
                restart();
                return;
            }
            mapName.elt.value = tmpName.slice(0, tmpName.search('_' + orgAgentNum + '_ex') + 1) + str(newAgentNum) + '_ex0';
        }
        restart();
        initCanvas();
        runpause();
    }
}


function restart() {
    //重置状态
    // logTimings();
    clearTimings(1);
    clearTable();
    initSearch();
    pauseCheck(true);
    console.log('curT:' + str(curT));
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
    // 可以添加算法切换按钮，创建不同的CBS即可
    // cbs = new CBS(env);
    // cbs = new CBS_v2(env);
    solution = cbs.search();
    recordTime('Calculate Plan');

    // console.log(solution);
    // console.log('done out!');

    if (!Object.keys(solution).length || solution == -1) {
        status = "No Solution!"
        // logTimings();
        runpause();
        alert("No Solution!");
        // noLoop();
        return;
    } else {
        // TODO:补全路径，需要修改!
        for (var agent of agentObjs) {
            agent.path = solution[agent.name];
            agent.pathLength = agent.path.length;
            if (agent.path.length > maxT) {
                maxT = agent.path.length;
            }
        }

        for (var agent of agentObjs) {
            console.log(agent);
            agent.calcTurnInPath();
            agent.calcWaitInPath();
            if (agent.path.length < maxT) {
                agent.fullFillPath(maxT);
            }
        }
    }
}

function clearBorder() {
    if (isMapReady) {
        // console.log("清除上一个", lastIndex);
        agentObjs[lastIndex].closeBorder();
    }
}

// 从画布点击触发,flag=false，从按钮组触发，flag=true
function checkRadio() {
    //清除上一个Agent的痕迹
    clearBorder();

    var index = selBox.elt.selectedIndex;
    lastIndex = index;
    if (radioStart.elt.checked) {
        flagStart = true;
        flagEnd = false;
        flagBlock = false;
        // 查看当前被选择的是哪个Agent，并将其起点框出来显示
        // console.log(agentObjs[index].start);
        agentObjs[index].addBorder(agentObjs[index].start);
    } else if (radioEnd.elt.checked) {
        flagEnd = true;
        flagStart = false;
        flagBlock = false;
        agentObjs[index].addBorder(agentObjs[index].goal);
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
        // checkRadio();
        if (isBoundSatisfied(x, y)) {
            isMapChanged = true;
            if (flagStart) {
                var agentName = selBox.elt.value; //agentName
                curAgent = getAgentByName(agentName);
                if (env.grid[x][y].type != 1) {
                    //清除原来的start
                    clearBorder();
                    env.grid[curAgent.start[0]][curAgent.start[1]].type = 0;
                    // env.showOneGrid(curAgent.start[0], curAgent.start[1]);
                    //设定新的start
                    env.grid[x][y].type = 2;
                    curAgent.start = [x, y];
                    env.makeAgentDict();
                }
                checkRadio();
            } else if (flagEnd) {
                var agentName = selBox.elt.value; //agentName
                curAgent = getAgentByName(agentName);
                if (env.grid[x][y].type != 1) {
                    //清除原来的goal
                    clearBorder();
                    env.grid[curAgent.goal[0]][curAgent.goal[1]].type = 0;
                    // env.showOneGrid(curAgent.goal[0], curAgent.goal[1]);
                    //设定新的goal
                    env.grid[x][y].type = 3;
                    curAgent.goal = [x, y];
                    env.makeAgentDict();
                }
                checkRadio();
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

function mouseDragged() {
    if (mapEdit) {
        let x = int((mouseX - left_pos) / cellw);
        let y = int((mouseY - top_pos) / cellh);
        // checkRadio();
        if (isBoundSatisfied(x, y)) {
            isMapChanged = true;
            if (flagBlock) {
                var tmpFlag = true;
                for (var agent of agentObjs) {
                    if ((x == agent.start[0] && y == agent.start[1]) ||
                        (x == agent.goal[0] && y == agent.goal[1])) {
                        tmpFlag = false;
                    }
                }
                if (tmpFlag) {
                    // console.log(env.grid[x][y].type);
                    if (env.grid[x][y].type == 0) {
                        env.grid[x][y].setWall(true);
                        env.obstacles.push([x, y]);
                    }
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
    rect(left_pos, env.h + 30, 300, 50);
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
    // var delta = env.w/2>320 ? env.w/2 : 350;
    rect(left_pos, env.h + 80, 300, 120);
    stroke(0);
    fill(0);
    for (var moment in timings) {
        if (timings.hasOwnProperty(moment)) {
            switch (moment) {
                // case "Set Up":
                //     text(moment + ": " + (round(timings[moment].sum, 3)).toString() + "ms", left_pos + env.w / 2, env.h + 50);
                //     break;
                case "Calculate Plan":
                    text(moment + ": " + (round(timings[moment].sum, 3)).toString() + "ms", left_pos, env.h + 80);
                    break;
                case "Execution On Map":
                    if (timings[moment].sum > 1000) {
                        var tmpSum = round(timings[moment].sum / 1000, 3); //单位 s
                        text(moment + ": " + tmpSum.toString() + "s", left_pos, env.h + 110);
                        // agentObjs.forEach((agent, idx) => {
                        //     tmpRunTime = round(tmpSum / maxT * agent.pathLength, 3);
                        //     text(moment + "-" + agent.name + ": " + tmpRunTime.toString() + "s", left_pos, env.h + 110 + idx*30);
                        // });

                    } else {
                        var tmpSum = round(timings[moment].sum, 3); //单位 ms
                        text(moment + ": " + tmpSum.toString() + "ms", left_pos, env.h + 110);
                        // agentObjs.forEach((agent, idx) => {
                        //     tmpRunTime = round(tmpSum / maxT * agent.pathLength, 3);
                        //     text(moment + "-" + agent.name + ": " + tmpRunTime.toString() + "s", left_pos, env.h + 110 + idx*30);
                        // });
                    }
                    // text(moment + ": " + tmpSum.toString() + "s", left_pos, env.h + 110);
                    break;
                default:
                    break;
            }

        }
    }
}

// 打印小车的监控状态（转弯次数和停靠次数等）
function drawMonitorVars() {
    var tbody = createElement('tbody');
    tbody.parent(monitorTable);

    for (var agent of agentObjs) {
        addTableRow(agent, tbody);
    }
}

function addTableRow(agent, tbody) {
    var tr = createElement('tr');
    var tdName = createElement('td', agent.name);
    var tdTurn = createElement('td', agent.turnCount.toString());
    var tdWait = createElement('td', agent.waitCount.toString());

    tdName.parent(tr);
    tdTurn.parent(tr);
    tdWait.parent(tr);

    tr.parent(tbody);
}

function draw() {

    if (isMapReady) {
        drawMap();
        drawStatus();
        drawTimings();
    }

    stepSearch();
}
