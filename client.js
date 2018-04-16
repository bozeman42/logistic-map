const NODE_LIMIT = 100000;
const PRE_DRAW_ITERATIONS = 10000;

// initial population: 0 is all dead, 1 is so many that they will all starve
const INITIAL_POPULATION = 0.5;

// change these to change the portion of the graph you are viewing
// note that the graph x < 1 & x > 4 is always 0, so not much to see there.
let xLowerBound = 2.7;
let xUpperBound = 4;
let yLowerBound = 0;
let yUpperBound = 1;

let xRange = xUpperBound - xLowerBound;
let yRange = yUpperBound - yLowerBound;
const drawRounding = 6;


window.addEventListener('load',event => {

  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext("2d");
  ctx.canvas.height = window.innerHeight;
  ctx.canvas.width = window.innerWidth;
  let width = window.innerWidth;
  let height = window.innerHeight

  window.addEventListener('resize',event => {
    console.log(event.target.innerWidth,event.target.innerHeight);
    ctx.canvas.height = event.target.innerHeight;
    ctx.canvas.width = event.target.innerWidth;
    width = event.target.innerWidth;
    height = event.target.innerHeight;
    draw();
  })
  let positionIndicator = document.querySelector('#mousePosition')
  
  canvas.addEventListener('mousemove',event => {
    const {clientX} = event;
    const xPosition = xLowerBound + (xRange * clientX / width)
    positionIndicator.textContent = `lambda: ${xPosition}`
  });

  function draw(){
    let ySet;
    let delta = xRange / width;
    let y = INITIAL_POPULATION;
    for (let x = xLowerBound; x < xUpperBound; x = x + (xRange / width)){
      y = INITIAL_POPULATION;
      for (let g = 0; g < PRE_DRAW_ITERATIONS; g++){
        y = round(x*y*(1-y),10);
        if (y < 0) {
          y = 0;
        } else if (y > 1) {
          y = 1;
        }
      }
      ySet = new Set();
      for (g = 0; g < NODE_LIMIT;g++) {
        y = round(x*y*(1-y),4);
        if (!ySet.has(y)){
          ySet.add(y);
          ctx.fillRect(
            (x-xLowerBound) * ctx.canvas.width / (xRange),
           (yUpperBound-y)* ctx.canvas.height / yRange,1,1);
        } else {
          console.log('found duplicate',g,x);
          break;
        }
      }
    }
  }
  draw();
});

function round(input,places) {
  return Math.round(input*Math.pow(places,10))/Math.pow(places,10);
}