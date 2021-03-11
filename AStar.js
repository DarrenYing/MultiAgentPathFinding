class AStar {
    constructor(env) {
        this.env = env;
    }

    reconstructPath(parents, current) {
        var path = [current];
        while (parents[current] != undefined) {
            current = parents[current];
            path.push(current);
        }
        path.reverse();
        return path;
    }

    search(agentName) {

        var initialState = this.env.agent_dict[agentName]["start"];
        var stepCost = 1;

        var closeList = [];
        var openList = [initialState];

        var parents = {}; //记录路径

        var gScore = {};
        gScore[initialState] = 0;

        var hScore = {};
        hScore[initialState] = this.env.calcH(initialState, agentName);

        var fScore = {};
        fScore[initialState] = hScore[initialState];

        // 由于无路可走时，Agent可以选择一直停在原地，所以设定一个最大迭代轮数
        var cnt = 0;
        var maxCnt = 1000;

        while (openList.length) {
            cnt++;
            if (cnt > maxCnt) {
                break;
            }
            // var cur = 0;
            // for (var i = 1; i < openList.length; i++) {
            var cur = openList.length-1;
            for (var i = openList.length-2; i >= 0; i--) {
                if (fScore[openList[i]] < fScore[openList[cur]]) {
                    cur = i;
                }
            }
            var current = openList[cur];
            // console.log("current:", current, fScore[current]);
            // console.log(fScore);

            if (this.env.isReachTarget(current, agentName)) {
                console.log(cnt);
                return this.reconstructPath(parents, current);
            }


            _.pull(openList, current);
            closeList.push(current);

            // console.log("open:", openList);
            // console.log("close:", closeList);


            var neighbors = this.env.getNeighbors(current);
            // console.log(neighbors.length);

            // console.log("neighbors:", neighbors);

            for (var i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];
                if (this.isInArray(closeList, neighbor)) {
                    continue;
                }

                var tmpG = gScore[current] + this.env.calcG(current, neighbor);

                if (!this.isInArray(openList, neighbor)) {
                    openList.push(neighbor);
                } else if (tmpG >= gScore[neighbor]) {
                    continue;
                }

                //更新g、f和parent
                parents[neighbor] = current;
                gScore[neighbor] = tmpG;
                hScore[neighbor] = this.env.calcH(neighbor, agentName);
                fScore[neighbor] = tmpG + hScore[neighbor];
                // visualDist[neighbor] = this.env.calcVisualDist(neighbor, agentName);
            }

            // console.log(openList);
            // console.log("fscore:", fScore);
            // console.log('\n');
        }

        console.log("failed:", agentName);
        return false;

    }

    isInArray(arr, ele) {
        for (let obj of arr) {
            if (JSON.stringify(obj) == JSON.stringify(ele)) {
                return true;
            }
        }
        return false;
    }

}
