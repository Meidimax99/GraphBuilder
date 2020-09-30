//Window
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

//Different accessmodes
//TODO Node for selecting Nodes similar to
const accessMode = {
  view: 1,
  addNode: 2,
  addEdge1: 3,
  addEdge2: 4,
  editEdge: 5,
  editEdge2: 6,
};

//Initial accessMode
var mode = accessMode.view;

function changeOperationMode(newMode) {
  switch (newMode) {
    case accessMode.view:
      draw = function () {
        background(255);
        drawScene();
      };
      mouseClicked = function () {
        if ((selectedEdge = findEdge())) {
          selectedEdge.active = true;
          changeOperationMode(accessMode.editEdge);
        }
      };
      keyPressed = function () {
        if (key == "a") {
          changeOperationMode(accessMode.addNode);
          newNode = new GraphNode(mouseX, mouseY, nextID());
        } else if (key == "e") {
          changeOperationMode(accessMode.addEdge1);
        }
      };
      break;
    case accessMode.addNode:
      draw = function () {
        background(255);
        drawScene();
        newNode.X = mouseX;
        newNode.Y = mouseY;
        newNode.draw(sourceNode.X, sourceNode.Y, mouseX, mouseY);
      };
      mouseClicked = function () {
        if (!newNode.closeToAny()) {
          nodeArray.push(newNode);
          changeOperationMode(accessMode.view);
        } else {
          changeOperationMode(accessMode.view);
        }
      };
      keyPressed = function () {};
      break;
    case accessMode.addEdge1:
      draw = function () {
        background(255);
        drawScene();
      };
      mouseClicked = function () {
        sourceNode = findNode();
        if (sourceNode) {
          changeOperationMode(accessMode.addEdge2);
        } else {
          changeOperationMode(accessMode.view);
        }
      };
      keyPressed = function () {};
      break;
    case accessMode.addEdge2:
      draw = function () {
        background(255);
        drawArrow(sourceNode.X, sourceNode.Y, mouseX, mouseY);
        drawScene();
      };
      mouseClicked = function () {
        targetNode = findNode();

        if (targetNode && targetNode != sourceNode) {
          //Testing for duplicate edge
          let duplicateEdge = edgeArray.filter((edge, index, edgeArray) => {
            return (
              edge.sourceNode == sourceNode && edge.targetNode == targetNode
            );
          });
          if (duplicateEdge.length < 1) {
            edgeArray.push(new GraphEdge(sourceNode, targetNode, 1));
          }
        }
        changeOperationMode(accessMode.view);
      };
      keyPressed = function () {};
      break;
    case accessMode.editEdge:
      draw = function () {
        background(255);
        drawScene();
      };
      mouseClicked = function () {
        selectedEdge.active = false;
        if ((selectedEdge = findEdge())) {
          selectedEdge.active = true;
          changeOperationMode(accessMode.editEdge);
        } else {
          changeOperationMode(accessMode.view);
        }
      };
      keyPressed = function () {
        if (keyCode == DELETE) {
          let index = edgeArray.indexOf(selectedEdge);
          if (index !== -1) {
            edgeArray.splice(index, 1);
          }
          changeOperationMode(accessMode.view);
        } else if (!isNaN(key)) {
          selectedEdge.cost = key;
          changeOperationMode(accessMode.editEdge2);
        }
      };
      break;
    case accessMode.editEdge2:
      draw = function () {
        background(255);
        drawScene();
      };
      mouseClicked = function () {
        selectedEdge.active = false;
        if ((selectedEdge = findEdge())) {
          selectedEdge.active = true;
          changeOperationMode(accessMode.editEdge2);
        } else {
          changeOperationMode(accessMode.view);
        }
      };
      keyPressed = function () {
        if (!isNaN(key)) {
          selectedEdge.cost = selectedEdge.cost + key;
        }
      };
      break;
  }
  mode = newMode;
}

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

  //TestNodes
  nodeArray.push(new GraphNode(100, 100, "A"));
  nodeArray.push(new GraphNode(300, 100, "B"));
  edgeArray.push(new GraphEdge(nodeArray[0], nodeArray[1], 1));
  edgeArray.push(new GraphEdge(nodeArray[1], nodeArray[0], 2));
}
//Variable vor new Nodes, must be a new Node to guarantee the Type of the Variable newNode
var newNode = new GraphNode(-50, -50, "A");

function drawScene() {
  drawEdges();
  drawNodes();
}

function draw() {
  background(255);
  drawScene();

  //Draw overlapping arrowhead
  //Should start from under a sourcenode and go over a possible targetnode
  //Or: Change alle Edges so that they start at the Border of the Node and not the Center
}

function drawArrow(AX, AY, BX, BY) {
  stroke(0);
  line(AX, AY, BX, BY);
  //Arrowhead
  //Calculate Vector between the vectors in functionparameterlist
  let angle = GraphEdge.calculateAngle(AX - BX, AY - BY);
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

function mouseClicked() {
  if ((selectedEdge = findEdge())) {
    selectedEdge.active = true;
    changeOperationMode(accessMode.editEdge);
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
    changeOperationMode(accessMode.addNode);
    newNode = new GraphNode(mouseX, mouseY, nextID());
  } else if (key == "e") {
    changeOperationMode(accessMode.addEdge1);
  }
}

//Function that iterates over the Array of Nodes and draws each Node an their Edges,
//Edges first, because the Edges start as lines from the Center of the Nodes and
//need to get covered by the Nodes
function drawNodes() {
  nodeArray.forEach((node) => node.draw());
}

function findParallelEdge(inputedge) {
  return edgeArray.filter((edge, index, edgeArray) => {
    return (
      edge.sourceNode == inputedge.targetNode &&
      edge.targetNode == inputedge.sourceNode
    );
  });
}

function drawEdges() {
  edgeArray.forEach((edge) => {
    if (findParallelEdge(edge).length == 1) {
      edge.draw(true);
    } else {
      edge.draw(false);
    }
  });
}

//TODO Refactor for loops to foreach
