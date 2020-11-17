class Agent {
    constructor(start, goal, name, color, path) {
        this.start = start;
        this.goal = goal;
        this.name = name;
        this.color = color;

        this.path = path; //[t, x, y]
        this.agentImg = loadImage('assets/agent.png');
    }

    // 把路径补足到最大时间点
    fullFillPath(maxT) {
        var n = this.path.length;
        var lastItem = this.path[n - 1];
        for (var i = n; i < maxT; i++) {
            this.path.push(lastItem);
        }
    }

    // 画Agent，执行一步
    stepShow(t) {
        let curx = this.path[t]['x'];
        let cury = this.path[t]['y'];

        translate(left_pos,top_pos);
        var imgSize = 3 * cellw / 4;
        imageMode(CENTER);
        tint(this.color[0], this.color[1], this.color[2]);
        image(this.agentImg, curx * cellw + cellw / 2, cury * cellh + cellh / 2, imgSize, imgSize);
        translate(-left_pos,-top_pos);

        // console.log(x, y);
        // console.log(this.agentImg);

    }

    // 消除上一步的图像


}
