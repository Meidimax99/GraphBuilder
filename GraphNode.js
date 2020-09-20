var textColor;
var fillColor;
var strokeColor;

class GraphNode {

    //Instancefields
    adjacentNodes = [];

    constructor(X, Y, id) {
        this.X = X;
        this.Y = Y;
        this.id = id;
    }

    //Schnittberechnung

    //Is a given Point inside the Circle?
    //better Name would be contains -> Refactor
    isIn(posX, posY) {
        if ((Math.sqrt(Math.pow(posX - this.X, 2) + Math.pow(posY - this.Y, 2))) <= r / 2) {
            return true;
        }
        return false;
    }
    //Check if a Node with given Centercoordinates and same global width intersects with this node
    intersects(posX, posY) {
        if ((Math.sqrt(Math.pow(posX - this.X, 2) + Math.pow(posY - this.Y, 2))) <= r) {
            return true;
        }
        return false;
    }

    //Check if a Node with given Centercoordinates and same global width is close to the other node
    close(posX, posY) {
        var distance = r;
        if ((Math.sqrt(Math.pow(posX - this.X, 2) + Math.pow(posY - this.Y, 2))) <= r + distance) {
            return true;
        }
        return false;
    }

    closeToAny() {
        let ret = false;
        for (var i = 0; i < nodeArray.length; i++) {
            if (nodeArray[i].id != this.id && (this.close(nodeArray[i].X, nodeArray[i].Y))) {
                ret = true;
            }
        }
        return ret;
    }

    static calculateAngle(X, Y) {
        let magnitude = Math.sqrt(Math.pow(-X, 2) + Math.pow(-Y, 2));
        X = X / magnitude;
        Y = Y / magnitude;
        return -(Math.atan2(0, 1) - Math.atan2(Y, X));
    }
    drawEdges() {
        //Draw Edges From Node
        stroke(0);

        for (let i = 0; i < this.adjacentNodes.length; i++) {
            line(this.X, this.Y, this.adjacentNodes[i].X, this.adjacentNodes[i].Y);
            //Draw arrowheads
            let angle = GraphNode.calculateAngle(this.adjacentNodes[i].X - this.X, this.adjacentNodes[i].Y - this.Y);
            translate(this.adjacentNodes[i].X, this.adjacentNodes[i].Y);
            rotate(angle + PI);
            translate(r / 2 + 1, 0);
            fill(0);
            triangle(0, 0, 10, 4, 10, -4);


            //reset transformations
            resetMatrix();
        }

    }
    drawNode() {

        //Draw Node

        noStroke();

        if (this.closeToAny()) {
            fill(fillColor.warning)
            ellipse(this.X, this.Y, r);

            fill(textColor.warning)
            text(this.id, this.X, this.Y - 6);
        } else if (this.isIn(mouseX, mouseY)) {
            fill(fillColor.activated)
            ellipse(this.X, this.Y, r);

            fill(textColor.activated)
            text(this.id, this.X, this.Y - 6);
        } else {
            fill(fillColor.idle)
            ellipse(this.X, this.Y, r);

            fill(textColor.idle)
            text(this.id, this.X, this.Y - 6);
        }

        //Needs extra coloring modes for being marked when going through the algorithm, to mark them as already 
        //checked -> Maybe do that with the Strokes

    }
}