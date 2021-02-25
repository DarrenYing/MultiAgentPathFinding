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

    calcTurn(parents, cur) {
        if (parents[cur] == undefined || parents[parents[cur]] == undefined) {
            return 0;
        }

        let curx = cur.location.x;
        let cury = cur.location.y;
        let ppx = parents[parents[cur]].location.x;
        let ppy = parents[parents[cur]].location.y;
        if (abs(curx - ppx) == 1 && abs(cury - ppy) == 1) {
            return 1;
        }
        return 0;

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
        var maxCnt = 800;

        while (openList.length) {
            cnt++;
            if (cnt > maxCnt) {
                break;
            }
            var cur = 0;
            for (var i = 1; i < openList.length; i++) {
                if (fScore[openList[i]] < fScore[openList[cur]]) {
                    cur = i;
                }
                // else if (fScore[openList[i]] = fScore[openList[cur]]) { // f值相等时，优选选择h值小的，对于wait的情况会有问题，需要更仔细考虑
                //     if (hScore[openList[i]] < hScore[openList[cur]]) {
                //         cur = i;
                //     }
                // }
            }
            var current = openList[cur];
            // console.log("current:", current, fScore[current]);
            // console.log(fScore);

            if (this.env.isReachTarget(current, agentName)) {
                return this.reconstructPath(parents, current);
            }


            // this.removeFromArray(openList, current);
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
                let turnCost = this.calcTurn(parents, neighbor);
                fScore[neighbor] = tmpG + hScore[neighbor] + turnCost;
            }

            // console.log(openList);
            // console.log("fscore:", fScore);
            // console.log('\n');
        }

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

    // removeFromArray(arr, elt) {
    //   // Could use indexOf here instead to be more efficient
    //   for (var i = arr.length - 1; i >= 0; i--) {
    //     if (arr[i].toString() == elt.toString()) {
    //       arr.splice(i, 1);
    //     }
    //   }
    // }
}
