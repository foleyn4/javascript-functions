function seed() {
  return Array.from(arguments);
}

function same([x, y], [j, k]) {
  if(x === j && y === k){
    return true;
  }
  else{
    return false;
  }
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  for (i in this){
    if(same(cell, this[i])) return true;
  }
  return false;
}

const printCell = (cell, state) => {
  if(contains.call(state,cell)){
    return '\u25A3';
  }
  else{
    return '\u25A2';
  }
};

const corners = (state = []) => {
  if(state.length === 0){
    return {topRight: [0,0], bottomLeft: [0,0]};
  }
  let largestX = state[0][0];
  let largestY = state[0][1];
  let smallestX = state[0][0];
  let smallestY = state[0][1];
  for(let i = 0; i < state.length; i++){
    if(largestX < state[i][0]){
      largestX = state[i][0];
    }
    if(largestY < state[i][1]){
      largestY = state[i][1];
    }
    if(smallestX > state[i][0]){
      smallestX = state[i][0];
    }
    if(smallestY > state[i][1]){
      smallestY = state[i][1];
    }
  }
  return {topRight: [largestX,largestY], bottomLeft: [smallestX,smallestY]};
};

//Y goes 4,3,2 x goes through all first
const printCells = (state) => {
  let rectangle = corners(state);
  let board = '';
  for(let i = rectangle.topRight[1]; i >= rectangle.bottomLeft[1]; i--){
    for(let j = rectangle.bottomLeft[0]; j <= rectangle.topRight[0]; j++){
      board += printCell([j,i],state) + ' ';
    }
    board +=  '\n';
  }
  return board;
};

const getNeighborsOf = ([x, y]) => {
  return [[x-1,y-1],[x,y-1],[x+1,y-1],[x-1,y],[x+1,y],[x-1,y+1],[x,y+1],[x+1,y+1]];
};

const getLivingNeighbors = (cell, state) => {
  let neighbors = getNeighborsOf(cell);
  let liveNeighbors = [];
  for(let i = 0; i <neighbors.length; i++){
    if(contains.call(state,neighbors[i])){
      liveNeighbors.push(neighbors[i]);
    }
  }
  return liveNeighbors;
};

const willBeAlive = (cell, state) => {
  let liveNeighbors = getLivingNeighbors(cell,state);
  let cellAlive = contains.call(state,cell);
  if(liveNeighbors.length === 3 || (cellAlive === true && liveNeighbors.length === 2)){
    return true;
  }
  else{
    return false;
  }
  
};

const calculateNext = (state) => {
  let rectangle = corners(state);
  let futureLife = [];
  for(let i = rectangle.bottomLeft[1]-1; i <= rectangle.topRight[1]+1; i++){
    for(let j = rectangle.bottomLeft[0]-1; j <= rectangle.topRight[0]+1; j++){
      if(willBeAlive([j,i], state)){
        futureLife.push([j,i]);
      }
    }
  }
  return futureLife;
};

const iterate = (state, iterations) => {
  newStates = [state];
  for(let i=0; i<iterations; i++){
    newStates.push(calculateNext(newStates[i]));
  }
  return newStates;
};

const main = (pattern, iterations) => {
  newStates = iterate(startPatterns[pattern], iterations);
  for(let i = 0; i<newStates.length; i++){
    console.log(printCells(newStates[i]));
  }
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;