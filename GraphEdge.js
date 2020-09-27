class GraphEdge {
    constructor(sourceNode, targetNode, cost) {
        this.sourceNode = sourceNode;
        this.targetNode = targetNode;
        this.cost = cost;
        this.active = false;
        this.curved = false;
        this.middle = GraphEdge.middleOfLine(
            this.sourceNode.X,
            this.sourceNode.Y,
            this.targetNode.X,
            this.targetNode.Y
        );
    }

    static calculateAngle(X, Y) {
        let magnitude = Math.sqrt(Math.pow(-X, 2) + Math.pow(-Y, 2));
        X = X / magnitude;
        Y = Y / magnitude;
        return -(Math.atan2(0, 1) - Math.atan2(Y, X));
    }

    //Check if given coordinates are on the Number of the edge
    //Take the centerpoint of the Edge and check if the given coordinates are within a set radius around that point
    contains(X, Y) {
        let radius = 16;

        if (
            Math.sqrt(
                Math.pow(X - this.middle.X, 2) + Math.pow(Y - this.middle.Y, 2)
            ) <= radius
        ) {
            return true;
        }
        return false;
    }
    drawNormal() {
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

        this.middle = GraphEdge.middleOfLine(
            this.sourceNode.X,
            this.sourceNode.Y,
            this.targetNode.X,
            this.targetNode.Y
        );
        text(this.cost, this.middle.X, this.middle.Y - 6);
    }
    static vectorLength(X, Y) {
        return Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));
    }
    drawCurved() {
        stroke(0);
        let vector = {
            X: this.sourceNode.X - this.targetNode.X,
            Y: this.sourceNode.Y - this.targetNode.Y,
        };

        let distance = GraphEdge.vectorLength(vector.X, vector.Y);
        let angle = GraphEdge.calculateAngle(vector.X, vector.Y);

        //Factor for roundness of the curve; smaller -> sharper edge
        let fac = 0.5;
        //Rotation of the curves relative to the direct connection of the nodes
        let rot = 0.2 * Math.PI;

        //curve Control points
        let startp = {
            x: this.sourceNode.X -
                fac * distance * Math.sin(angle - (4 * Math.PI) / 4),
            y: this.sourceNode.Y +
                fac * distance * Math.cos(angle - (4 * Math.PI) / 4),
        };
        let endp = {
            x: this.targetNode.X -
                fac * distance * Math.sin(angle + (4 * Math.PI) / 4),
            y: this.targetNode.Y +
                fac * distance * Math.cos(angle + (4 * Math.PI) / 4),
        };
        //Curve mid points

        let p2 = {
            x: this.sourceNode.X +
                (distance / 3) * Math.sin(angle - ((2 * Math.PI) / 4 + rot)),
            y: this.sourceNode.Y -
                (distance / 3) * Math.cos(angle - ((2 * Math.PI) / 4 + rot)),
        };
        let p3 = {
            x: this.targetNode.X +
                (distance / 3) * Math.sin(angle + ((2 * Math.PI) / 4 + rot)),
            y: this.targetNode.Y -
                (distance / 3) * Math.cos(angle + ((2 * Math.PI) / 4 + rot)),
        };

        /*
            //Showing start and end control points
            strokeWeight(5);
            stroke("#8AC926");
            point(startp.x, startp.y);
            stroke(0);
            point(endp.x, endp.y);
            strokeWeight(1);
            */

        noFill();
        if (this.contains(mouseX, mouseY) || this.active) {
            strokeWeight(8);
            stroke(fillColor.activated);
            beginShape();
            curveVertex(startp.x, startp.y);
            curveVertex(this.sourceNode.X, this.sourceNode.Y);

            this.middle = GraphEdge.middleOfLine(p2.x, p2.y, p3.x, p3.y);
            curveVertex(this.middle.X, this.middle.Y);

            curveVertex(this.targetNode.X, this.targetNode.Y);
            curveVertex(endp.x, endp.y);
            endShape();
        }
        strokeWeight(1);
        stroke(0);
        beginShape();
        curveVertex(startp.x, startp.y);
        curveVertex(this.sourceNode.X, this.sourceNode.Y);

        this.middle = GraphEdge.middleOfLine(p2.x, p2.y, p3.x, p3.y);
        curveVertex(this.middle.X, this.middle.Y);

        curveVertex(this.targetNode.X, this.targetNode.Y);
        curveVertex(endp.x, endp.y);
        endShape();

        //Arrowhead
        //Calculate Vector between the vectors in functionparameterlist
        let arrowangle = GraphEdge.calculateAngle(
            p3.x - this.targetNode.X,
            p3.y - this.targetNode.Y
        );
        translate(this.targetNode.X, this.targetNode.Y);
        //Angle should be influenced by the fac so that it always sits at the correct angle
        rotate(arrowangle + (2 * Math.PI * 9) / 360);
        translate(r / 2 + 1, 0);
        fill(0);
        triangle(0, 0, 10, 4, 10, -4);

        //reset transformations
        resetMatrix();

        //Draw Edge Cost
        noStroke();
        fill(0);

        text(this.cost, this.middle.X, this.middle.Y - 6);
    }

    draw(curved) {
        this.curved = curved;
        if (curved) {
            this.drawCurved();
        } else {
            this.drawNormal();
        }
    }

    setCost(cost) {
        if (cost > 0) {
            this.cost = cost;
        }
    }

    static middleOfLine(AX, AY, BX, BY) {
        return {
            X: (AX + BX) / 2,
            Y: (AY + BY) / 2,
        };
    }
}