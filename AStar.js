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

    var fScore = {};
    fScore[initialState] = this.env.heuristic(initialState, agentName);

    while (openList.length) {

      var cur = 0;
      for (var i = 1; i < openList.length; i++) {
        if (fScore[openList[i]] < fScore[openList[cur]]) {
          cur = i;
        }
      }
      var current = openList[cur];
      // console.log("current:", current);

      if (this.env.isReachTarget(current, agentName)) {
        return this.reconstructPath(parents, current);
      }


      this.removeFromArray(openList, current);
      closeList.push(current);

      // console.log("open:", openList);
      // console.log("close:", closeList);


      var neighbors = this.env.getNeighbors(current);

      // console.log("neighbors:", neighbors);

      for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];
        if (this.isInArray(closeList, neighbor)) {
          continue;
        }

        var tmpG = gScore[current] + stepCost;

        if (!this.isInArray(openList, neighbor)) {
          openList.push(neighbor);
        } else if (tmpG >= gScore[neighbor]) {
          continue;
        }

        //更新g、f和parent
        gScore[neighbor] = tmpG;
        fScore[neighbor] = tmpG + this.env.heuristic(neighbor, agentName);
        parents[neighbor] = current;
      }

      // console.log("open:", openList);
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

  removeFromArray(arr, elt) {
    // Could use indexOf here instead to be more efficient
    for (var i = arr.length - 1; i >= 0; i--) {
      if (arr[i] == elt) {
        arr.splice(i, 1);
      }
    }
  }
}
