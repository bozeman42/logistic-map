const NODE_LIMIT = 10000;
let x = 0;
let y = 0.5;

let startingPop = 0.5
let xLowerBound = 3;
let xUpperBound = 4;
let xRange = xUpperBound - xLowerBound;
let yLowerBound = 0;
let yUpperBound = 1;
let yRange = yUpperBound - yLowerBound;

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
    for (let x = xLowerBound; x < xUpperBound; x = x + (xRange / width)){
      y = startingPop;
      for (let g = 0; g < 10000; g++){
        y = Math.round(x*y*(1-y)*100000) / 100000;
        if (y < 0) {
          y = 0;
        } else if (y > 1) {
          y = 1;
        }
      }
      ySet = new Set();
      for (g = 0; g < NODE_LIMIT;g++) {
        y = Math.round(x*y*(1-y)*100000) / 100000;
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
