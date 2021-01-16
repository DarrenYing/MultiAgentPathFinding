class Agent {
    constructor(start, goal, name, color, path = null) {
        this.start = start;
        this.goal = goal;
        this.name = name;
        this.color = color;

        this.path = path; //[t, x, y]
        this.pathLength = 0;    //每个小车补全路径之前的路径长度
        this.agentImg = loadImage('assets/agent.png');

        this.isReached = false; //标记是否到达，到达后，就不会再参与冲突计算

        this.turnCount = 0; //转弯次数
        this.waitCount = 0; //等待次数

    }

    // 把路径补足到最大时间点
    fullFillPath(maxT) {
        var n = this.path.length;
        var lastItem = this.path[n - 1];
        // var lastItem =
        for (var i = n; i < maxT; i++) {
            this.path.push(lastItem);
        }
    }

    // 计算转弯次数
    calcTurnInPath() {
      for (var i = 2; i < this.path.length; i++) {
          if (abs(this.path[i - 2]['x'] - this.path[i]['x']) == 1 &&
              abs(this.path[i - 2]['y'] - this.path[i]['y']) == 1) {
              this.turnCount += 1;
          }
      }
    }

    // 计算等待次数
    calcWaitInPath() {
        for (var i = 1; i < this.path.length; i++) {
            if (abs(this.path[i - 1]['x'] - this.path[i]['x']) == 0 &&
                abs(this.path[i - 1]['y'] - this.path[i]['y']) == 0) {
                this.waitCount += 1;
            }
        }
    }



    // 画Agent，执行一步
    stepShow(t) {
        let curx = this.path[t]['x'];
        let cury = this.path[t]['y'];

        translate(left_pos, top_pos);

        var imgSize = 3 * cellw / 4;
        imageMode(CENTER);
        tint(this.color[0], this.color[1], this.color[2]);
        image(this.agentImg, curx * cellw + cellw / 2, cury * cellh + cellh / 2, imgSize, imgSize);


        translate(-left_pos, -top_pos);

        // console.log(x, y);
        // console.log(this.agentImg);

    }

    // 消除上一步的图像
    stepOff(t) {
        let curx = this.path[t]['x'];
        let cury = this.path[t]['y'];

        translate(left_pos, top_pos);

        var imgSize = 3 * cellw / 4;
        imageMode(CENTER);
        tint(255);
        image(this.agentImg, curx * cellw + cellw / 2, cury * cellh + cellh / 2, imgSize, imgSize);


        translate(-left_pos, -top_pos);
    }

}
