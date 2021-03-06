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

  mark() {
    if(this.marked) {
      this.marked = false
    } else {
      this.marked = true;
    }
  }
  setCost(cost) {
    this.cost = cost;
  }
  //check if given coordinates are inside the Node circle by calculating the distance between the Node center and the coordinates
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

  //uses the close function on every node of the nodeArray
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

  //draw function for the Node
  draw() {
    
    noStroke();

    //Ellipse
    //Change fill color based on Node status
    if (this.closeToAny()) {
      fill(fillColor.warning);
    } else if (this.marked) {
      fill(fillColor.marked);
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
    } else if (this.marked) {
      fill(textColor.marked);
    }else if (this.contains(mouseX, mouseY) || this.active) {
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
    
    //Draw Cost on the top right of the Node
    this.drawcost();

    //Needs extra coloring modes for being marked when going through the algorithm, to mark them as already
    //checked -> Maybe do that with the Strokes
  }

  //Function to draw the cost of the node on the top right of the node
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