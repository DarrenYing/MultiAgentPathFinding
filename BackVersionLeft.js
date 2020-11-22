// No use, just for case

// removeOrgButton(runPauseButton);
// runPauseButton = new Button("运行", env.w + 30, 20, 50, 30, runpause);
// components.push(runPauseButton);

// removeOrgButton(stepButton);
// stepButton = new Button("单步", env.w + 30, 70, 50, 30, step)
// components.push(stepButton);
//
// removeOrgButton(resetButton);
// resetButton = new Button("重置", env.w + 30, 120, 50, 30, restart)
// components.push(resetButton);

// testButton = createButton('测试');
// testButton.position(canvas2Left+env.w+30, canvas2Top+170);
// testButton.class('btn1');

// function removeOrgButton(btn) {
//     if (btn) {
//         let i = components.indexOf(btn);
//         components.splice(i, 1);
//     }
// }

// function mouseClicked() {
//     for (var i = 0; i < components.length; i++) {
//         components[i].mouseClick(mouseX, mouseY);
//     }
// }

// function drawMap() {
//     if (mapEdit) {   // 不知道是啥问题，会变绿
//     env.showBlock();
//     env.showImg();
//     imageMode(CORNER);
//     mapGraph = get(left_pos, top_pos, env.w + 1, env.h + 1);
//     } else {
//         image(mapGraph, left_pos, top_pos);
//     }
// }


// class Button {
//     constructor(label, x, y, w, h, callback) {
//         this.label = label;
//         this.x = x;
//         this.y = y;
//         this.w = w;
//         this.h = h;
//         this.callback = callback;
//     }
//
//     show() {
//         stroke(0);
//         strokeWeight(1);
//         fill(255);
//         rect(this.x, this.y, this.w, this.h);
//         fill(0);
//         noStroke();
//         text(this.label, this.x + 5, this.y + 5, this.w - 10, this.h - 10);
//     }
//
//     mouseClick(x, y) {
//         if (this.callback != null &&
//             x > this.x && x <= this.x + this.w &&
//             y > this.y && y <= this.y + this.h) {
//             this.callback(this);
//         }
//     }
// }


// function test() {
//     p1 = new Location(1, 2);
//     p2 = new Location(2, 1);
//
//     // console.log(p1.isEqualTo(p2));
//     // console.log(p1.toString());
//
//     s1 = new State(1, p1);
//     s2 = new State(1, p2);
//     // console.log(s1.isEqualTo(s2));
//     // console.log(s1.isEqualExceptTime(s2));
//     // console.log(s1.toString());
//
//     vc1 = new VertexConstraint(1, p1);
//     vc2 = new VertexConstraint(2, p2);
//
//     ec1 = new EdgeConstraint(1, p1, p1);
//     ec2 = new EdgeConstraint(2, p2, p2);
//
//     c1 = new Constraints();
//     c1.vertex_constraints.add(vc1);
//     c1.edge_constraints.add(ec1);
//     c2 = new Constraints();
//     c2.vertex_constraints.add(vc2);
//     c2.edge_constraints.add(ec2);
//
//     // console.log(c1.toString());
//     // console.log(c2.toString());
//     // c1.addConstraint(c2);
//     // console.log(c1.toString());
//
//     test = [];
//     test.push(p1);
//     test.push(p2);
//     p3 = new Location(1, 2);
//     console.log(test.includes(p3));
// }
