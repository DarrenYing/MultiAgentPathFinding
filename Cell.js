class Cell {
    constructor(x, y, isWall = false) {
        this.x = x;
        this.y = y;
        this.isWall = isWall;

        // 0-空白格 1-障碍物 2-起点 3-终点
        this.type = int(isWall);

        // 预加载起点和终点图片
        this.startImg = null;
        this.endImg = null;

    }

    show(color) {
        stroke(51);
        var imgSize = 3*cellw/4;
        switch (this.type) {
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
        }

    }




}
