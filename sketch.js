//Window
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

//Different accessmodes
const accessMode = {
  view: 1,
  addNode: 2,
  addEdge1: 3,
  addEdge2: 4,
};

//Initial accessMode
var mode = accessMode.view;

//array of Nodes Placed in the Canvas
var nodeArray = [];
var edgeArray = [];

let font,
  fontsize = 32;

//Preloading the Font makes sure it is available in the setup
function preload() {
  font = loadFont("./assets/fonts/Source_Sans_Pro/SourceSansPro-Regular.ttf");
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  // Set text characteristics
  textFont(font);
  textSize(fontsize);
  textAlign(CENTER, CENTER);

  //Assign GraphVars
  textColor = {
    activated: color(0, 0, 0),
    idle: color(255, 255, 255),
    warning: color(0, 0, 0),
  };

  fillColor = {
    activated: color("#8AC926"),
    idle: color("#1982C4"),
    warning: color("#FF595E"),
  };

  //Stroke currently disabled
  strokeColor = {
    activated: color(0, 0, 0),
    idle: color(0, 0, 0),
    warning: color(0, 0, 0),
  };
}
//Variable vor new Nodes, must be a new Node to guarantee the Type of the Variable newNode
var newNode = new GraphNode(-50, -50, "A");

function draw() {
  background(255);

  if (mode == accessMode.addEdge2) {
    drawArrow(sourceNode.X, sourceNode.Y, mouseX, mouseY);
  }

  drawEdges();
  drawNodes();

  if (mode == accessMode.view) {} else if (mode == accessMode.addNode) {
    newNode.X = mouseX;
    newNode.Y = mouseY;
    newNode.draw(sourceNode.X, sourceNode.Y, mouseX, mouseY);
  } else {}

  //Draw overlapping arrowhead
  //Should start from under a sourcenode and go over a possible targetnode
  //Or: Change alle Edges so that they start at the Border of the Node and not the Center
  if (mode == accessMode.addEdge2) {}
}

//Counter that keeps track of the next number to convert to a char
var charCounter = {
  it: 1,
  count: 65,
};

function drawArrow(AX, AY, BX, BY) {
  stroke(0);
  line(
    AX,
    AY,
    BX,
    BY
  );
  //Arrowhead
  //Calculate Vector between the vectors in functionparameterlist
  let angle = GraphEdge.calculateAngle(
    AX - BX,
    AY - BY
  );
  translate(BX, BY);
  rotate(angle);
  fill(0);
  triangle(0, 0, 10, 4, 10, -4);

  //reset transformations
  resetMatrix();
}

//returns next ID für new Node
//TODO Currently iterates through A-Z and will start over again, needs solution to iterate
//over Graphs with more than 26 nodes -> A2, B2 ...
//TODO Auslagern
function nextID() {
  var letter = char(charCounter.count);
  charCounter.count++;
  if (charCounter.count == 91) {
    charCounter.count = 65;
  }
  return letter;
}

//called when mouse is clicked
//Variables for addEdge
var sourceNode = new GraphNode(-50, -50, "A");
var targetNode = new GraphNode(-50, -50, "A");

var cost = 1;

function mouseClicked() {
  if (mode == accessMode.addNode) {
    if (!newNode.closeToAny()) {
      nodeArray.push(newNode);
      mode = accessMode.view;
    } else {
      mode = accessMode.view;
    }
  } else if (mode == accessMode.addEdge1) {
    sourceNode = findNode();
    if (sourceNode) {
      mode = accessMode.addEdge2;
    } else {
      mode = accessMode.view;
    }
  } else if (mode == accessMode.addEdge2) {
    targetNode = findNode();
    if (targetNode && targetNode != sourceNode) {
      edgeArray.push(new GraphEdge(sourceNode, targetNode));
    }
    mode = accessMode.view;
  }
}

//get the Node that has been clicked on
function findNode() {
  for (var i = 0; i < nodeArray.length; i++) {
    if (nodeArray[i].contains(mouseX, mouseY)) {
      return nodeArray[i];
    }
  }
  return null;
}

//gets called when there is a button pressed
function keyTyped() {
  if (key == "a") {
    mode = accessMode.addNode;
    newNode = new GraphNode(mouseX, mouseY, nextID());
  } else if (key == "e") {
    mode = accessMode.addEdge1;
  } else if (key == "p") {
    //DEBUGCOMMAND
    for (let i = 0; i < nodeArray.length; i++) {
      console.log(nodeArray[i]);
    }
  }
}

//Function that iterates over the Array of Nodes and draws each Node an their Edges,
//Edges first, because the Edges start as lines from the Center of the Nodes and
//need to get covered by the Nodes
function drawNodes() {
  for (var i = 0; i < nodeArray.length; i++) {
    nodeArray[i].draw();
  }
}

function drawEdges() {
  for (var i = 0; i < edgeArray.length; i++) {
    edgeArray[i].draw();
  }
}

//TODO Refactor for loops to foreach