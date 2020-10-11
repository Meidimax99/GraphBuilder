class GraphEdge {
  constructor(sourceNode, targetNode, cost) {
    this.sourceNode = sourceNode;
    this.targetNode = targetNode;
    this.cost = cost;
    this.active = false;
    this.marked = false;
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
  drawNormal() {}
  static vectorLength(X, Y) {
    return Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));
  }

  draw(doubled) {
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
    if (doubled) {
      this.middle = {
        X: (this.middle.X - this.sourceNode.X) * 1.3 + this.sourceNode.X,
        Y: (this.middle.Y - this.sourceNode.Y) * 1.3 + this.sourceNode.Y,
      };
    }
    text(this.cost, this.middle.X, this.middle.Y - 6);
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
