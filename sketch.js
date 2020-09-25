//Window
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

//Different accessmodes
const accessMode = {
  view: 1,
  addNode: 2,
  addEdge1: 3,
  addEdge2: 4,
  editEdge: 5,
  editEdge2: 6
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

//Counter that keeps track of the next number to convert to a char
var charCounter = {
  it: 1,
  count: 65,
};

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

var selectedEdge;

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
      edgeArray.push(new GraphEdge(sourceNode, targetNode, 1));
    }
    mode = accessMode.view;
  } else if (mode == accessMode.view) {
    if (selectedEdge = findEdge()) {
      selectedEdge.active = true;
      mode = accessMode.editEdge;
    }
  } else if (mode == accessMode.editEdge) {
    selectedEdge.active = false;
    if (selectedEdge = findEdge()) {
      selectedEdge.active = true;
      mode = accessMode.editEdge;
    } else {
      mode = accessMode.view;
    }
  } else if (mode == accessMode.editEdge2) {
    selectedEdge.active = false;
    if (selectedEdge = findEdge()) {
      selectedEdge.active = true;
      mode = accessMode.editEdge2;
    } else {
      mode = accessMode.view;
    }
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

function findEdge() {
  for (var i = 0; i < edgeArray.length; i++) {
    if (edgeArray[i].contains(mouseX, mouseY)) {
      return edgeArray[i];
    }
  }
  return null;
}

//gets called when there is a button pressed
//TODO Keypressed function should be structured after the modes, not the keys
function keyPressed() {
  if (key == "a") {
    mode = accessMode.addNode;
    newNode = new GraphNode(mouseX, mouseY, nextID());
  } else if (key == "e") {
    mode = accessMode.addEdge1;
  } else if (mode == accessMode.editEdge) {
    if (keyCode == DELETE) {
      let index = edgeArray.indexOf(selectedEdge);
      if (index !== -1) {
        edgeArray.splice(index, 1);
      }
      mode = accessMode.view;
    } else if (!isNaN(key)) {
      selectedEdge.cost = key;
      mode = accessMode.editEdge2;
    }

  } else if (mode == accessMode.editEdge2) {
    if (!isNaN(key)) {
      selectedEdge.cost = selectedEdge.cost + key;
    }
  }
}

//Function that iterates over the Array of Nodes and draws each Node an their Edges,
//Edges first, because the Edges start as lines from the Center of the Nodes and
//need to get covered by the Nodes
function drawNodes() {
  nodeArray.forEach(node => node.draw());
}

function findParallelEdge(inputedge) {
  return edgeArray.filter((edge, index, edgeArray) => {
    return edge.sourceNode == inputedge.targetNode && edge.targetNode == inputedge.sourceNode;
  })
}

function drawEdges() {
  edgeArray.forEach(edge => {
    if (findParallelEdge(edge).length == 1) {
      edge.draw(true);
    } else {
      edge.draw(false);
    }
  });
}

//TODO Refactor for loops to foreach