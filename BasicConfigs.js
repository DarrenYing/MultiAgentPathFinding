class Location {
    constructor(x = -1, y = -1) {
        this.x = x;
        this.y = y;
    }

    isEqualTo(other) {
        return this.x == other.x && this.y == other.y;
    }

    toString() {
        return '(' + this.x + ',' + this.y + ')';
    }
}


class State {
    constructor(time, location) {
        this.time = time;
        this.location = location;
    }

    isEqualTo(other) {
        return this.time == other.time && this.location.isEqualTo(other.location);
    }

    isEqualExceptTime(other) {
        return this.location.isEqualTo(other.location);
    }

    toString() {
        return '(' + this.time + ',' + this.location.x + ',' + this.location.y + ')';
    }
}

class Conflict {
    constructor() {
        this.time = -1;
        this.type = -1; // VERTEX 1   EDGE 2
        this.agent1 = '';
        this.agent2 = '';
        this.location1 = new Location();
        this.location2 = new Location();
    }

    toString() {
        return '(' + this.time + ',' + this.agent1 + ',' + this.agent2 +
            ',' + this.location1.toString() + ',' + this.location2.toString() + ')';
    }
}

class VertexConstraint {
    constructor(time, location) {
        this.time = time;
        this.location = location;
    }

    isEqualTo(other) {
        return this.time == other.time && this.location.isEqualTo(other.location);
    }

    toString() {
        return '(' + this.time + ',' + this.location.x + ',' + this.location.y + ')';
    }
}

class EdgeConstraint {
    constructor(time, location1, location2) {
        this.time = time;
        this.location1 = location1;
        this.location2 = location2;
    }

    isEqualTo(other) {
        return this.time == other.time && this.location1.isEqualTo(other.location1) &&
            this.location2.isEqualTo(other.location2);
    }

    toString() {
        return '(' + this.time + ',' + this.location1.toString() + ',' + this.location2.toString() + ')';
    }

}


class Constraints {
    constructor() {
        this.vertex_constraints = new Set();
        this.edge_constraints = new Set();
    }

    addConstraint(other) {
        this.vertex_constraints = new Set([...this.vertex_constraints, ...other.vertex_constraints]);
        this.edge_constraints = new Set([...this.edge_constraints, ...other.edge_constraints]);
    }

    toString() {
        var desc = "VC:";
        for (let vc of this.vertex_constraints) {
            desc += vc.toString() + '  ';
        }
        desc += "\nEC:";
        for (let ec of this.edge_constraints) {
            desc += ec.toString() + '  ';
        }
        return desc;
    }
}

// Constraint Tree Node
class CTNode {
    constructor() {
        this.solution = {};
        this.constraint_dict = {};
        this.cost = 0;
    }

    isEqualTo(other) {
        if (other instanceof CTNode) {
            return false;
        }
        return this.cost == other.cost;
    }

}


class Button {
    constructor(label, x, y, w, h, callback) {
        this.label = label;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.callback = callback;
    }

    show() {
        stroke(0);
        strokeWeight(1);
        fill(255);
        rect(this.x, this.y, this.w, this.h);
        fill(0);
        noStroke();
        text(this.label, this.x + 5, this.y + 5, this.w - 10, this.h - 10);
    }

    mouseClick(x, y) {
        if (this.callback != null &&
            x > this.x && x <= this.x + this.w &&
            y > this.y && y <= this.y + this.h) {
            this.callback(this);
        }
    }
}
