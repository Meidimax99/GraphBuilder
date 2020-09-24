var textColor;
var fillColor;
var strokeColor;

class GraphNode {
  //Instancefields
  adjacentNodes = [];
  cost = -1;


  constructor(X, Y, id) {
    this.X = X;
    this.Y = Y;
    this.id = id;
  }

  //Schnittberechnung

  //Is a given Point inside the Circle?
  //better Name would be contains -> Refactor
  contains(posX, posY) {
    if (
      Math.sqrt(Math.pow(posX - this.X, 2) + Math.pow(posY - this.Y, 2)) <=
      r / 2
    ) {
      return true;
    }
    return false;
  }
  //Check if a Node with given Centercoordinates and same global width intersects with this node
  intersects(posX, posY) {
    if (
      Math.sqrt(Math.pow(posX - this.X, 2) + Math.pow(posY - this.Y, 2)) <= r
    ) {
      return true;
    }
    return false;
  }

  //Check if a Node with given Centercoordinates and same global width is close to the other node
  close(posX, posY) {
    var distance = r;
    if (
      Math.sqrt(Math.pow(posX - this.X, 2) + Math.pow(posY - this.Y, 2)) <=
      r + distance
    ) {
      return true;
    }
    return false;
  }

  closeToAny() {
    let ret = false;
    for (var i = 0; i < nodeArray.length; i++) {
      if (
        nodeArray[i].id != this.id &&
        this.close(nodeArray[i].X, nodeArray[i].Y)
      ) {
        ret = true;
      }
    }
    return ret;
  }

  draw() {
    //Draw Node

    noStroke();

    this.drawcost();
    textSize(fontsize);
    if (this.closeToAny()) {
      fill(fillColor.warning);
      ellipse(this.X, this.Y, r);

      fill(textColor.warning);
      text(this.id, this.X, this.Y - 6);
    } else if (this.contains(mouseX, mouseY)) {
      fill(fillColor.activated);
      ellipse(this.X, this.Y, r);

      fill(textColor.activated);
      text(this.id, this.X, this.Y - 6);
    } else {
      fill(fillColor.idle);
      ellipse(this.X, this.Y, r);

      fill(textColor.idle);
      text(this.id, this.X, this.Y - 6);
    }

    //Needs extra coloring modes for being marked when going through the algorithm, to mark them as already
    //checked -> Maybe do that with the Strokes
  }

  drawcost() {
    textSize(20);
    fill(0);
    let costText;

    if (this.cost == -1) {
      costText = '∞';
    } else {
      costText = this.cost;
    }

    text(costText, this.X + r / 2, this.Y - r / 2);
  }
}