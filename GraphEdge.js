class GraphEdge {

    constructor(sourceNode, targetNode, cost) {
        this.sourceNode = sourceNode;
        this.targetNode = targetNode;
        this.cost = cost;
        this.active = false;

    }

    static calculateAngle(X, Y) {
        let magnitude = Math.sqrt(Math.pow(-X, 2) + Math.pow(-Y, 2));
        X = X / magnitude;
        Y = Y / magnitude;
        return -(Math.atan2(0, 1) - Math.atan2(Y, X));
    }

    static drawArrow(AX, AY, BX, BY) {

    }
    //Check if given coordinates are on the Number of the edge
    //Take the centerpoint of the Edge and check if the given coordinates are within a set radius around that point
    contains(X, Y) {
        let middle = GraphEdge.middleOfLine(this.sourceNode.X, this.sourceNode.Y, this.targetNode.X, this.targetNode.Y);
        let radius = 16;

        if (Math.sqrt(Math.pow(X - middle.X, 2) + Math.pow(Y - middle.Y, 2)) <= radius) {
            return true;
        }
        return false;
    }

    draw() {
        if (this.contains(mouseX, mouseY) || this.active) {
            strokeWeight(8);
            stroke(fillColor.activated);
            line(
                this.sourceNode.X,
                this.sourceNode.Y,
                this.targetNode.X,
                this.targetNode.Y
            );
        }
        stroke(0);
        strokeWeight(1);
        line(
            this.sourceNode.X,
            this.sourceNode.Y,
            this.targetNode.X,
            this.targetNode.Y
        );
        //Arrowhead
        //Calculate Vector between the vectors in functionparameterlist
        let angle = GraphEdge.calculateAngle(
            this.sourceNode.X - this.targetNode.X,
            this.sourceNode.Y - this.targetNode.Y
        );
        translate(this.targetNode.X, this.targetNode.Y);
        rotate(angle);
        translate(r / 2 + 1, 0);
        fill(0);
        triangle(0, 0, 10, 4, 10, -4);

        //reset transformations
        resetMatrix();

        //Draw Edge Cost
        noStroke();
        fill(0);

        let costVect = GraphEdge.middleOfLine(
            this.sourceNode.X,
            this.sourceNode.Y,
            this.targetNode.X,
            this.targetNode.Y
        );
        text(this.cost, costVect.X, costVect.Y - 6);
    }


    setCost(cost) {
        if (cost > 0) {
            this.cost = cost;
        }
    }

    static middleOfLine(AX, AY, BX, BY) {
        return {
            X: (AX + BX) / 2,
            Y: (AY + BY) / 2
        };
    }
}