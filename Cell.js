class Cell {
    constructor(x, y, isWall = false) {
        this.x = x;
        this.y = y;
        // this.isWall = isWall;

        // 0-空白格 1-障碍物 2-起点 3-终点 4-Agent
        this.type = int(isWall);

        // 预加载起点和终点图片
        this.startImg = null;
        this.endImg = null;
        // this.agentImg = null;
    }

    show(color=null) {
        stroke(51);
        var imgSize = 3 * cellw / 4;
        switch (this.type) {
            case 0:
                fill(255);
                rectMode(CENTER);
                rect(this.x * cellw+cellw/2, this.y * cellh+cellh/2, cellw-1, cellh-1);
                rectMode(CORNER);
                break;
            case 1:
                fill(100);
                rect(this.x * cellw, this.y * cellh, cellw, cellh);
                break;
            case 2:
                if (!this.startImg) {
                    this.startImg = loadImage('assets/start.png');
                }
                imageMode(CENTER);
                // console.log(color);
                tint(color[0], color[1], color[2], 100);
                image(this.startImg, this.x * cellw + cellw / 2, this.y * cellh + cellh / 2, imgSize, imgSize);
                break;
            case 3:
                if (!this.endImg) {
                    this.endImg = loadImage('assets/end.png');
                }
                imageMode(CENTER);
                tint(color[0], color[1], color[2], 100);
                image(this.endImg, this.x * cellw + cellw / 2, this.y * cellh + cellh / 2, imgSize, imgSize);
                break;
            // case 4:
            //     if (!this.agentImg) {
            //         this.agentImg = loadImage('assets/agent.png');
            //     }
            //     imageMode(CENTER);
            //     tint(color[0], color[1], color[2], 100);
            //     image(this.agentImg, this.x * cellw + cellw / 2, this.y * cellh + cellh / 2, imgSize, imgSize);
            //     break;
        }

    }

    toggleWall(){
      this.type = 1-this.type;
    }




}
