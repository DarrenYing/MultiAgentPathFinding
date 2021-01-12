class CBS_v2 {
    constructor(env) {
        this.env = env;
        this.openSet = [];
        this.closedSet = [];
    }

    search() {
        var start = new CTNode();

        //初始化
        start.constraint_dict = {};
        for (var agent in this.env.agent_dict) {
            start.constraint_dict[agent] = new Constraints();
        }
        start.solution = this.env.calcSolution(); //计算初始路径解
        if (!start.solution) {
            return {};
        }

        start.cost = this.env.calcSolutionCost(start.solution);

        this.openSet.push(start);

        while (this.openSet.length) {
            var p = this.findMinCost(this.openSet);
            _.pull(this.openSet, p);
            this.closedSet.push(p);

            this.env.constraint_dict = p.constraint_dict; //变换环境
            var conflict = this.env.getFirstConflict(p.solution);

            // console.log("conflict:", conflict);
            // console.log("open1:", this.openSet);
            // console.log("close1:", this.closedSet);

            //如果没有冲突
            if (!conflict) {
                console.log('done!');
                return this.generatePlan(p.solution);
            }

            //如果有冲突
            //将冲突转化为约束
            var constraint_dict = this.env.createConstraintFromConflict(conflict);

            // console.log("constraint_dict:", constraint_dict);

            //根据冲突分裂结点
            for (var agent in constraint_dict) {
                console.log('###', typeof(agent));
                var newNode = _.cloneDeep(p);
                newNode.constraint_dict[agent].addConstraint(constraint_dict[agent]);

                this.env.constraint_dict = newNode.constraint_dict; //切换环境
                // newNode.solution = this.env.calcSolution(); //重新计算路径解
                newNode.solution = this.env.calcOneSolution(p.solution, agent);

                // console.log("newNode:", newNode);

                if (!newNode.solution) {
                    continue;
                }
                newNode.cost = this.env.calcSolutionCost(newNode.solution);
                newNode.nc = this.env.calcNumOfConflicts(newNode.constraint_dict);

                console.log("newNode:", newNode);
                console.log("cost:", newNode.cost);

                if (!this.isInArray(this.openSet, newNode)) {
                    this.openSet.push(newNode);
                }


            }
            // console.log("open2:", this.openSet);
            // console.log("close2:", this.closedSet);
        }
        return -1;   //无解
    }

    //检查CTNode是否在Set中
    isInArray(tmpArr, node) {
        for (var obj of tmpArr) {
            if (_.isEqualWith(obj, node, this.solCmp)) {
                return true;
            }
        }
        return false;
    }

    solCmp(obj, other) {
        var path1 = cbs.generatePlan(obj.solution);
        var path2 = cbs.generatePlan(other.solution);
        for (var agent in path1) {
            if (JSON.stringify(path1[agent]) != JSON.stringify(path2[agent])) {
                return false;
            }
        }
        return true;
    }

    findMinCost(tmpSet) {
        //找到cost最小的CTNode
        var minNode;
        var minCost = 99999;
        for (var node of tmpSet) {
            if (node.cost < minCost) {
                minNode = node;
                minCost = node.cost;
            }
            else if (node.cost == minCost) {
                if (node.nc < minNode.nc) {
                    minNode = node;
                    minCost = node.cost;
                }
            }
        }
        return minNode;
    }


    generatePlan(solution) {
        var plan = {};
        for (var agent in solution) {
            var path = solution[agent];
            var list = []
            for (var state of path) {
                var item = {
                    't': state.time,
                    'x': state.location.x,
                    'y': state.location.y
                };
                // var item = {};
                // item[state.time] = {
                //     'x': state.location.x,
                //     'y': state.location.y
                // };
                list.push(item);
                plan[agent] = list; //该条agent的执行路径
            }
        }
        return plan;
    }
}
