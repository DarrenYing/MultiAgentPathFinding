var env;
var cbs;
var solution;

function setup() {
  createCanvas(400, 400);

  var dimension = [3, 3];
  var obstacles = [[0, 1], [2, 1]];
  var agents = [{
    'start': [0, 0],
    'goal': [2, 0],
    'name': 'agent0'
  }, {
    'start': [2, 0],
    'goal': [0, 0],
    'name': 'agent1'
  }];

  // var dimension = [8, 8];
  // var obstacles = [
  //   [6, 7],
  //   [1, 4],
  //   [7, 7],
  //   [2, 4],
  //   [7, 5],
  //   [3, 5],
  //   [0, 0],
  //   [5, 5],
  //   [6, 5],
  //   [3, 3],
  //   [0, 7],
  //   [6, 4]
  // ];
  // var agents = [{
  //   'start': [7, 1],
  //   'goal': [4, 0],
  //   'name': 'agent0'
  // }, {
  //   'start': [2, 2],
  //   'goal': [6, 0],
  //   'name': 'agent1'
  // }];

  env = new Environment(dimension, agents, obstacles);

  cbs = new CBS(env);
  solution = cbs.search();

  console.log(solution);

  console.log('done out!');

}

function draw() {
  noStroke();
}

function test() {
  p1 = new Location(1, 2);
  p2 = new Location(2, 1);

  // console.log(p1.isEqualTo(p2));
  // console.log(p1.toString());

  s1 = new State(1, p1);
  s2 = new State(1, p2);
  // console.log(s1.isEqualTo(s2));
  // console.log(s1.isEqualExceptTime(s2));
  // console.log(s1.toString());

  vc1 = new VertexConstraint(1, p1);
  vc2 = new VertexConstraint(2, p2);

  ec1 = new EdgeConstraint(1, p1, p1);
  ec2 = new EdgeConstraint(2, p2, p2);

  c1 = new Constraints();
  c1.vertex_constraints.add(vc1);
  c1.edge_constraints.add(ec1);
  c2 = new Constraints();
  c2.vertex_constraints.add(vc2);
  c2.edge_constraints.add(ec2);

  // console.log(c1.toString());
  // console.log(c2.toString());
  // c1.addConstraint(c2);
  // console.log(c1.toString());

  test = [];
  test.push(p1);
  test.push(p2);
  p3 = new Location(1, 2);
  console.log(test.includes(p3));
}
