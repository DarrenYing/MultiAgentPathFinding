// 记得统一函数和变量的命名规范

class Environment {
    constructor(dimension, agents, wallRatio = -1, obstacles = []) {
        this.dimension = dimension; //[cols, rows]
        this.wallRatio = wallRatio;
        this.obstacles = obstacles;
        this.grid = []; //记录地图每个点的状态

        this.w = dimension[0] * cellw;
        this.h = dimension[1] * cellh;

        this.agents = agents;
        this.agent_dict = {};

        this.initGrid();
        this.setStartEnd();
        this.makeAgentDict();

        this.constraints = new Constraints(); //记录当前使用环境的Agent的Constraint
        this.constraint_dict = {}; // agent:Constraints

        this.a_star = new AStar(this); //算法
    }

    getNeighbors(state) {
        var neighbors = [];
        // Wait
        var newState = new State(state.time + 1, state.location);
        if (this.isStateValid(newState)) {
            neighbors.push(newState);
        }
        //可以进一步解耦，对newLoc检查边界，newState检查约束
        for(let i=0; i < 4; i++) {
            let newx = state.location.x + dirs1[i][0];
            let newy = state.location.y + dirs1[i][1];
            var newLoc = new Location(newx, newy);
            var newState = new State(state.time + 1, newLoc);
            if (this.isStateValid(newState) && this.isEcSatisfied(state, newState)) {
                neighbors.push(newState);
            }
        }

        return neighbors;
    }

    getFirstConflict(solution) {
        var maxTime = 0;
        var keys = [];
        for (var key in solution) {
            if (!getAgentByName(key).isReached) {
                keys.push(key);
            }
            let path = solution[key];
            maxTime = max(maxTime, path.length);
        }
        // console.log(maxTime);
        var result = new Conflict();

        var combs = this.getCombinations(keys, 2);

        for (var t = 0; t < maxTime; t++) {
            //检测点冲突
            for (var i = 0; i < combs.length; i++) {
                var agent1 = combs[i][0]; //取出agentName
                var agent2 = combs[i][1];
                var state1 = this.getState(agent1, solution, t);
                var state2 = this.getState(agent2, solution, t);
                if (state1.isEqualExceptTime(state2)) { //点冲突
                    result.time = t;
                    result.type = 1; //Vertex
                    result.location1 = state1.location;
                    result.agent1 = agent1;
                    result.agent2 = agent2;

                    return result;
                }
            }

            //检测边冲突
            for (var i = 0; i < combs.length; i++) {
                var agent1 = combs[i][0]; //取出agentName
                var agent2 = combs[i][1];
                var state1a = this.getState(agent1, solution, t);
                var state1b = this.getState(agent1, solution, t + 1);
                var state2a = this.getState(agent2, solution, t);
                var state2b = this.getState(agent2, solution, t + 1);

                if (state1a.isEqualExceptTime(state2b) && state1b.isEqualExceptTime(state2a)) {
                    result.time = t;
                    result.type = 2; //Edge
                    result.agent1 = agent1;
                    result.agent2 = agent2;
                    result.location1 = state1a.location;
                    result.location2 = state1b.location;

                    return result;
                }
            }
        }
        return false;
    }

    combination(arr, nLen, size, singleArr, result) {
        if (size === 0) {
            let arrCopy = [];
            for (let j = 0; j < singleArr.length; j++) {
                arrCopy[j] = singleArr[j];
            }
            result.push(arrCopy);
            return
        }

        for (let i = nLen; i >= size; --i) {
            singleArr[size - 1] = arr[i - 1];
            this.combination(arr, i - 1, size - 1, singleArr, result);
        }
    }

    //返回arr的全部size-排列
    //[1,2,3],2-->[1,2] [1,3] [2,3]
    getCombinations(arr, size) {
        let result = [];
        this.combination(arr, arr.length, size, [], result);
        return result.reverse();
    }

    createConstraintFromConflict(conflict) {
        var constraintDict = {};
        //如果是点冲突
        if (conflict.type == 1) {
            var c = new Constraints();
            var vc = new VertexConstraint(conflict.time, conflict.location1);
            c.vertex_constraints.add(vc);
            constraintDict[conflict.agent1] = c;
            constraintDict[conflict.agent2] = c;
        }
        //如果是边冲突
        else if (conflict.type == 2) {
            var c1 = new Constraints();
            var c2 = new Constraints();

            var ec1 = new EdgeConstraint(conflict.time, conflict.location1, conflict.location2);
            var ec2 = new EdgeConstraint(conflict.time, conflict.location2, conflict.location1);

            c1.edge_constraints.add(ec1);
            c2.edge_constraints.add(ec2);

            constraintDict[conflict.agent1] = c1;
            constraintDict[conflict.agent2] = c2;
        }

        return constraintDict;
    }

    getState(agentName, solution, time) {
        if (time < solution[agentName].length) {
            return solution[agentName][time];
        } else {
            var agent = getAgentByName(agentName);
            agent.isReached = true; //标记已到达，不再参与这轮的冲突计算
            let index = solution[agentName].length - 1;
            return solution[agentName][index];
        }
    }

    calcG(current, neighbor) {
        return 1;
        // return abs(current.location.x - neighbor.location.x) + abs(current.location.y - neighbor.location.y)
    }

    calcH(state, agentName) {
        var goal = this.agent_dict[agentName]["goal"];
        return abs(state.location.x - goal.location.x) + abs(state.location.y - goal.location.y);
    }

    isReachTarget(state, agentName) {
        var targetState = this.agent_dict[agentName]["goal"];
        return state.isEqualExceptTime(targetState);
    }

    makeAgentDict() {
        this.agent_dict = {};
        for (let agent of this.agents) {
            var startState = new State(0, new Location(agent.start[0], agent.start[1]));
            var endState = new State(0, new Location(agent.goal[0], agent.goal[1]));

            this.agent_dict[agent.name] = {
                'start': startState,
                'goal': endState
            };
        }
    }

    //是否满足边界约束和点约束
    isStateValid(state) {
        let vc = new VertexConstraint(state.time, state.location);
        let loc = [state.location.x, state.location.y];
        return state.location.x >= 0 && state.location.x < this.dimension[0] &&
            state.location.y >= 0 && state.location.y < this.dimension[1] &&
            !this.isInArray(this.constraints.vertex_constraints, vc) &&
            !this.isInArray(this.obstacles, loc);
    }

    isInArray(arr, ele) {
        for (let obj of arr) {
            if (obj.toString() == ele.toString()) {
                return true;
            }
        }
        return false;
    }

    //是否满足边约束
    isEcSatisfied(state1, state2) {
        let ec = new EdgeConstraint(state1.time, state1.location, state2.location);
        return !this.isInArray(this.constraints.edge_constraints, ec)
    }

    //不需要每个agent都重新计算，只计算constraint变化的即可
    calcSolution() {
        var solution = {};
        for (var agent in this.agent_dict) {
            if (this.constraint_dict[agent] == undefined) {
                this.constraint_dict[agent] = new Constraints();
            }
            this.constraints = this.constraint_dict[agent];
            var localSolution = this.a_star.search(agent);
            if (!localSolution) {
                return false;
            }
            solution[agent] = localSolution;
        }
        return solution;
    }

    calcOneSolution(orgSolution, agentToAdjust) {
        var solution = _.cloneDeep(orgSolution);
        for (var agent in this.agent_dict) {
            if (agent == agentToAdjust) {
                if (this.constraint_dict[agent] == undefined) {
                    this.constraint_dict[agent] = new Constraints();
                }
                this.constraints = this.constraint_dict[agent];
                var localSolution = this.a_star.search(agent);
                if (!localSolution) {
                    return false;
                }
                solution[agent] = localSolution;
            }
        }
        return solution;
    }

    calcSolutionCost(solution) {
        var totalCost = 0;
        for (var key in solution) {
            let path = solution[key];
            totalCost += path.length;
        }
        return totalCost;
    }

    calcNumOfConflicts(constraint_dict) {
        var nc = 0;
        for(let agent in constraint_dict) {
            let c = constraint_dict[agent];
            nc += c.vertex_constraints.size;
            nc += c.edge_constraints.size;
        }
        return nc;
    }

    // 初始化Cell
    initGrid() {
        if (this.wallRatio == -1) {
            for (var i = 0; i < this.dimension[0]; i++) { //col
                this.grid[i] = [];
                for (var j = 0; j < this.dimension[1]; j++) { //row
                    this.grid[i][j] = new Cell(i, j);
                }
            }
            for(var i=0; i < this.obstacles.length; i++){
                this.grid[this.obstacles[i][0]][this.obstacles[i][1]].setWall(true);
            }
        }
        else{
            for (var i = 0; i < this.dimension[0]; i++) { //col
                this.grid[i] = [];
                for (var j = 0; j < this.dimension[1]; j++) { //row
                    var isWall = random(1.0) < this.wallRatio;
                    this.grid[i][j] = new Cell(i, j, isWall);
                    if (isWall) {
                        this.obstacles.push([i, j]);
                    }
                }
            }
        }
    }

    // 删除指定block
    removeObstacle(x, y) {
        for (var i = 0; i < this.obstacles.length; i++) {
            if (x == this.obstacles[i][0] && y == this.obstacles[i][1]) {
                this.obstacles.splice(i, 1);
                return;
            }
        }
    }


    // 显示地图
    showGrid() {
        translate(left_pos, top_pos);
        // 画线
        strokeWeight(2);
        stroke(51);
        for (var i = 0; i <= this.dimension[0]; i++) {
            line(i * cellw, 0, i * cellw, this.h);
        }
        for (var i = 0; i <= this.dimension[1]; i++) {
            line(0, i * cellh, this.w, i * cellh);
        }

        translate(-left_pos, -top_pos);

    }

    showBlock() {
        translate(left_pos, top_pos);
        // 画障碍物
        strokeWeight(2);
        stroke(51);
        for (var i = 0; i < this.obstacles.length; i++) {
            let x = this.obstacles[i][0];
            let y = this.obstacles[i][1];
            this.grid[x][y].show();
        }
        translate(-left_pos, -top_pos);
    }

    showImg() {
        translate(left_pos, top_pos);
        // 画起点和终点
        strokeWeight(2);
        stroke(51);
        for (let agent of this.agents) {
            let color = agent.color;
            let sx = agent.start[0];
            let sy = agent.start[1];
            this.grid[sx][sy].show(color);
            let gx = agent.goal[0];
            let gy = agent.goal[1];
            this.grid[gx][gy].show(color);

        }
        translate(-left_pos, -top_pos);
    }

    showOneGrid(x, y) {
        translate(left_pos, top_pos);
        this.grid[x][y].show();
        translate(-left_pos, -top_pos);
    }

    setStartEnd() {
        for (let agent of this.agents) {
            let sx = agent['start'][0];
            let sy = agent['start'][1];
            this.grid[sx][sy].type = 2;
            this.removeObstacle(sx, sy);
            let gx = agent['goal'][0];
            let gy = agent['goal'][1];
            this.grid[gx][gy].type = 3;
            this.removeObstacle(gx, gy);
        }
    }
}
