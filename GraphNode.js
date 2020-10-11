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
    this.active = false;
    this.marked = false;
  }

  setCost(cost) {
    this.cost = cost;
  }
  //Is a given Point inside the Circle?
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
    if (Math.sqrt(Math.pow(posX - this.X, 2) + Math.pow(posY - this.Y, 2)) <= r) {
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

    //Draw Cost on the top right of the Node
    this.drawcost();

    //Ellipse
    //Change fill color based on Node status
    if (this.closeToAny()) {
      fill(fillColor.warning);
    } else if (this.contains(mouseX, mouseY) || this.active) {
      fill(fillColor.activated);
    } else {
      fill(fillColor.idle);
    }
    ellipse(this.X, this.Y, r);

    //Text

    //Change Text Color based on Node status
    if (this.closeToAny()) {
      fill(textColor.warning);
    } else if (this.contains(mouseX, mouseY) || this.active) {
      fill(textColor.activated);
    } else {
      fill(textColor.idle);
    }
    //Change Text size based on text length
    if(this.contains(mouseX, mouseY) || this.active) {
      textSize(30);
      text(this.id, this.X, this.Y - 6);
    } else if(this.id.length <= 6) {
      textSize(fontsize - 2 * (this.id.length + 1));
      text(this.id, this.X, this.Y - 6);
    } else {
      text(this.id.substring(0, 3) + "...", this.X, this.Y - 6);
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