//Window
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

//Different accessmodes
//The different modes define what will be rendered at the time, what inputs are possible and what the inputs do
const accessMode = {
  view: 1,
  addNode: 2,
  addEdge1: 3,
  addEdge2: 4,
  editEdge: 5,
  editEdge2: 6,
  editNode1: 7,
  editNode2: 8
};

//Initial accessMode
var mode = accessMode.view;
//temp variable for nodename
var buffer;

//Central function to change between the accessMode, changing a mode will redefine all relevant functions
//to do exactly what they are supposed to do in that mode
//Using this appoach there is no necessarity for big switch cases in each of the change functions, but only the one here
//The central functions change in each operationmode are
// draw(), mouseClicked(), keypressed(), keyTyped() and drawTooltip
function changeOperationMode(newMode) {
  switch (newMode) {
    case accessMode.view:
      draw = function () {
        background(255);
        drawScene();
      };
      mouseClicked = function () {
        if(selectedNode = findNode()) {
          selectedNode.active = true;
          changeOperationMode(accessMode.editNode1);
        }
        else if ((selectedEdge = findEdge())) {
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
      keyTyped = function () {
        
      };
      drawTooltip = function () {
        textSize(20);
        textAlign(LEFT);
        fill(100, 100, 100);
        text("A - Add Node", canvasWidth - 170, canvasHeight - 130);
        text("E - Add Edge", canvasWidth - 170, canvasHeight - 100);
        text("Click - Select", canvasWidth - 170, canvasHeight - 70);
        textSize(fontsize);
        textAlign(CENTER, CENTER);
      };
      break;
    case accessMode.addNode:
      draw = function () {
        background(255);
        drawScene();
        newNode.X = mouseX;
        newNode.Y = mouseY;
        newNode.draw();
      };
      mouseClicked = function () {
        if (!newNode.closeToAny()) {
          nodeArray.push(newNode);
          changeOperationMode(accessMode.view);
        } else {
          changeOperationMode(accessMode.view);
        }
      };
      keyTyped = function () {
        
      };
      keyPressed = function () {};
      drawTooltip = function () {
        textSize(20);
        textAlign(LEFT);
        fill(100, 100, 100);
        text("Click - Place Node", canvasWidth - 220, canvasHeight - 70);
        textSize(fontsize);
        textAlign(CENTER, CENTER);
      };
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
      keyTyped = function () {
        
      };
      keyPressed = function () {};
      drawTooltip = function () {
        textSize(20);
        textAlign(LEFT);
        fill(100, 100, 100);
        text("Click - Select SourceNode", canvasWidth - 250, canvasHeight - 70);
        textSize(fontsize);
        textAlign(CENTER, CENTER);
      };
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
      keyTyped = function () {
        
      };
      keyPressed = function () {};
      drawTooltip = function () {
        textSize(20);
        textAlign(LEFT);
        fill(100, 100, 100);
        text("Click - Select TargetNode", canvasWidth - 250, canvasHeight - 70);
        textSize(fontsize);
        textAlign(CENTER, CENTER);
      };
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
      keyTyped = function () {
        
      };
      drawTooltip = function () {
        textSize(20);
        textAlign(LEFT);
        fill(100, 100, 100);
        text("Del - Delete Edge", canvasWidth - 170, canvasHeight - 100);
        text("Num - Set Cost", canvasWidth - 170, canvasHeight - 70);
        textSize(fontsize);
        textAlign(CENTER, CENTER);
      };
      break;
    case accessMode.editEdge2:
      draw = function () {
        background(255);
        drawScene();
      };
      mouseClicked = function () {
        selectedEdge.active = false;
        let newSelEdge = findEdge();
        if (newSelEdge && newSelEdge == selectedEdge) {
          selectedEdge.active = true;
        } else if (newSelEdge) {
          selectedEdge = newSelEdge;
          selectedEdge.active = true;
          changeOperationMode(accessMode.editEdge);
        } else {
          changeOperationMode(accessMode.view);
        }
      };
      keyPressed = function () {
        if (!isNaN(key)) {
          selectedEdge.cost = selectedEdge.cost + key;
        }
      };
      keyTyped = function () {
        
      };
      drawTooltip = function () {
        textSize(20);
        textAlign(LEFT);
        fill(100, 100, 100);
        text("Num - Set Cost", canvasWidth - 170, canvasHeight - 70);
        textSize(fontsize);
        textAlign(CENTER, CENTER);
      };
      break;

      case accessMode.editNode1:
      buffer = selectedNode.id;
      draw = function () {
        background(255);
        drawScene();
      };
      mouseClicked = function () {
        selectedNode.active = false;
        let temp = selectedNode;
        if ((selectedNode = findNode())== temp) {
          selectedNode.active = true;
          selectedNode.id = "";
          changeOperationMode(accessMode.editNode2);
        } else if ((selectedNode = findNode())) {
          selectedNode.active = true;
        } else {
          changeOperationMode(accessMode.view);
        }
      };
      keyPressed = function () {
        if (keyCode == DELETE) {
          let index = nodeArray.indexOf(selectedNode);
          if (index !== -1) {
            nodeArray.splice(index, 1);
          }
          //Delete connected Edges
          edgeArray = edgeArray.filter((edge, index, edgeArray) => {
            return edge.sourceNode !== selectedNode && edge.targetNode !== selectedNode;
          });
          
          changeOperationMode(accessMode.view);
        } else if (keyCode == ENTER)  {
          selectedNode.id = "";
          changeOperationMode(accessMode.editNode2);
        }
      };
      keyTyped = function () {
        
      };
      drawTooltip = function () {
        textSize(20);
        textAlign(LEFT);
        fill(100, 100, 100);
        text("Del - Delete Node", canvasWidth - 200, canvasHeight - 70);
        text("Enter - Change Name", canvasWidth - 200, canvasHeight - 100);
        textSize(fontsize);
        textAlign(CENTER, CENTER);
      };
      break;

      case accessMode.editNode2:
      draw = function () {
        background(255);
        drawScene();
      };
      mouseClicked = function () {
        selectedNode.active = false;
        selectedNode.id = selectedNode.id.trim();
        if(selectedNode.id.length == 0) {
          selectedNode.id = buffer;
        }
        changeOperationMode(accessMode.view);
      };
      keyPressed = function () {
        if (keyCode == ENTER)  {
          selectedNode.active = false;
          selectedNode.id = selectedNode.id.trim();
          if(selectedNode.id.length <1) {
            selectedNode.id = buffer;
          }
          changeOperationMode(accessMode.view);
        } else if (keyCode == BACKSPACE) {
          selectedNode.id = selectedNode.id.substring(0, selectedNode.id.length -1);
        }
      };
      keyTyped = function () {
        //Only Numbers and Letters are allowed as a part of a nodename -> Checking with a regular expression
        if((/[a-zA-Z0-9]/).test(key)) {
          selectedNode.id = selectedNode.id + key;
        }
      };
      drawTooltip = function () {
        textSize(20);
        textAlign(LEFT);
        fill(100, 100, 100);
        text("Any - Set Name", canvasWidth - 170, canvasHeight - 70);
        text("Click/Enter - Done", canvasWidth - 170, canvasHeight - 100);
        text("Backspace - Backspace", canvasWidth - 170, canvasHeight - 130);
        textSize(fontsize);
        textAlign(CENTER, CENTER);
      };
      break;
  }
  mode = newMode;
}

//array of Nodes and edges Placed in the Canvas
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

  //Set colors
  textColor = {
    activated: color(0, 0, 0),
    idle: color(255, 255, 255),
    warning: color(0, 0, 0),
    marked: color(255, 255, 255),
  };

  fillColor = {
    activated: color("#8AC926"),
    idle: color("#1982C4"),
    warning: color("#FF595E"),
    marked: color("#6A4C93"),
  };

  //Stroke currently disabled
  strokeColor = {
    activated: color(0, 0, 0),
    idle: color(0, 0, 0),
    warning: color(0, 0, 0),
    marked: color("#6A4C93"),
  };

  //TestNodes for testing changes directly without having to draw new ones per hand each time
  /*
  nodeArray.push(new GraphNode(100, 100, "A"));
  nodeArray.push(new GraphNode(300, 100, "B"));
  edgeArray.push(new GraphEdge(nodeArray[0], nodeArray[1], 1));
  edgeArray.push(new GraphEdge(nodeArray[1], nodeArray[0], 2));
  */
}


//Variable vor new Nodes, must be a new Node to guarantee the Type of the Variable newNode

var newNode = new GraphNode(-50, -50, "A");

//Variables for addEdge
var sourceNode = new GraphNode(-50, -50, "A");
var targetNode = new GraphNode(-50, -50, "A");

var selectedEdge;
var selectedNode;

//Following functions are the functions when the program starts, they will not be used like this once the operationmode was changed once

function draw() {
  background(255);
  drawScene();
}

//gets called when there is a button pressed
function keyPressed() {
  if (key == "a") {
    changeOperationMode(accessMode.addNode);
    newNode = new GraphNode(mouseX, mouseY, nextID());
  } else if (key == "e") {
    changeOperationMode(accessMode.addEdge1);
  }
}

function mouseClicked() {
  if ((selectedEdge = findEdge())) {
    selectedEdge.active = true;
    changeOperationMode(accessMode.editEdge);
  }
}

function drawTooltip() {
  textSize(20);
  textAlign(LEFT);
  fill(100, 100, 100);
  text("A - Add Node", canvasWidth - 170, canvasHeight - 130);
  text("E - Add Edge", canvasWidth - 170, canvasHeight - 100);
  text("Click - Select", canvasWidth - 170, canvasHeight - 70);
  textSize(fontsize);
  textAlign(CENTER, CENTER);
}

function drawScene() {
  drawTooltip();
  drawEdges();
  drawNodes();
}

//Function that iterates over the Array of Nodes and draws each Node an their Edges,
//Edges first, because the Edges start as lines from the Center of the Nodes and
//need to get covered by the Nodes
function drawNodes() {
  nodeArray.forEach((node) => node.draw());
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
  noStroke();
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

//Utilities
//get the Node that has been clicked on
function findNode() {
  return nodeArray.filter((node, index, edgeArray) => {
    return (node.contains(mouseX, mouseY));
  })[0];
}

function findEdge() {
  return edgeArray.filter((edge, index, edgeArray) => {
    return (edge.contains(mouseX, mouseY));
  })[0];
}

function findParallelEdge(inputedge) {
  return edgeArray.filter((edge, index, edgeArray) => {
    return edge.sourceNode == inputedge.targetNode && edge.targetNode == inputedge.sourceNode;
  });
}

