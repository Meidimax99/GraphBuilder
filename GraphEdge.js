class GraphEdge {

    constructor(sourceNode, targetNode, cost) {
        this.sourceNode = sourceNode;
        this.targetNode = targetNode;
        this.cost = cost;

    }

    static calculateAngle(X, Y) {
        let magnitude = Math.sqrt(Math.pow(-X, 2) + Math.pow(-Y, 2));
        X = X / magnitude;
        Y = Y / magnitude;
        return -(Math.atan2(0, 1) - Math.atan2(Y, X));
    }

    static drawArrow(AX, AY, BX, BY) {

    }

    draw() {
        stroke(0);
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
        text(cost, costVect.X, costVect.Y - 6);
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