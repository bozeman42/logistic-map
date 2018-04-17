
// you can increase the number of points by increasing the node limit. This can provide more detail at high zoom levels, but can be very expensive CPU-wise
const NODE_LIMIT = 1000;

// PRE_DRAW_ITERATIONS are iterations on the function before drawing to allow the
// function to settle into its stable state where applicable and not show the 
// initial steps from the initial population to the stable state. set to 0 to see the
// regression to the stable state.
const PRE_DRAW_ITERATIONS = 10000;

// initial population: 0 is all dead, 1 is so many that they will all starve
const INITIAL_POPULATION = 0.5;

// change these to change the portion of the graph you are viewing
// note that the graph x < 1 & x > 4 is always 0, so not much to see there.
let xLowerBound = 0;
let xUpperBound = 4;
let yLowerBound = 0;
let yUpperBound = 1;

let xRange = xUpperBound - xLowerBound;
let yRange = yUpperBound - yLowerBound;
const drawRounding = -1;


window.addEventListener('load', event => {

  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext("2d");
  ctx.canvas.height = window.innerHeight;
  ctx.canvas.width = window.innerWidth;
  let width = window.innerWidth;
  let height = window.innerHeight

  window.addEventListener('resize', event => {
    ctx.canvas.height = event.target.innerHeight;
    ctx.canvas.width = event.target.innerWidth;
    width = event.target.innerWidth;
    height = event.target.innerHeight;
    draw();
  })

  // display the lambda at the x value of the mouse
  let positionIndicator = document.querySelector('#mousePosition')
  canvas.addEventListener('mousemove', event => {
    const {
      clientX
    } = event;
    const xPosition = xLowerBound + (xRange * clientX / width)
    positionIndicator.textContent = `lambda: ${xPosition}`
  });

  // zoom by dragging across the area you wish to see
  canvas.addEventListener('mousedown', startZoomBox);

  function startZoomBox(event) {
    if (event.which === 1) {
      canvas.addEventListener('mouseup', endZoomBox(event.clientX, event.clientY),{once: true});
    }
  }

  function endZoomBox(x, y) {
    return function (event) {
      const {
        clientX,
        clientY
      } = event;
      const beginCoords = pixelsToDataCoords(x, y);
      const endCoords = pixelsToDataCoords(clientX, clientY)
      if (beginCoords.x > endCoords.x) {
        xUpperBound = beginCoords.x;
        xLowerBound = endCoords.x;
      } else {
        xUpperBound = endCoords.x;
        xLowerBound = beginCoords.x;
      }
      if (beginCoords.y > endCoords.y) {
        yUpperBound = beginCoords.y;
        yLowerBound = endCoords.y;
      } else {
        yUpperBound = endCoords.y;
        yLowerBound = beginCoords.y;
      }
      xRange = xUpperBound - xLowerBound;
      yRange = yUpperBound - yLowerBound;
      draw();
    }
  }

  function pixelsToDataCoords(x, y) {
    return {
      x: xLowerBound + (xRange * x / width),
      y: yUpperBound - (yRange * y / height)
    }
  }

  function dataCoordsToPixels(x, y) {
    return {
      x: (x - xLowerBound) * width / xRange,
      y: (yUpperBound - y) * height / yRange
    }
  }

  function setRange() {
    xRange = xUpperBound - xLowerBound;
    yRange = yUpperBound - yLowerBound;
  }

  const deltaDisplay = document.querySelector('#delta');
  function draw() {
    let ySet;
    let delta = xRange / width;
    deltaDisplay.innerHTML = `x lower bound: ${xLowerBound}<br>
    x upper bound: ${xUpperBound}<br>
    xRange: ${xRange}<br>
    y lower bound: ${yLowerBound}<br>
    y upper bound: ${yUpperBound}<br>
    y range ${yRange}`;
    if (delta < 1e-16) {
      alert('Delta value too small. cannot zoom');
      return;
    }
    let y = INITIAL_POPULATION;
    ctx.clearRect(0, 0, width, height);
    for (let x = xLowerBound; x < xUpperBound; x = x +delta) {
      y = INITIAL_POPULATION;
      for (let g = 0; g < PRE_DRAW_ITERATIONS; g++) {
        y = round(x * y * (1 - y), -15);
        if (y < 0) {
          y = 0;
        } else if (y > 1) {
          y = 1;
        }
      }
      ySet = new Set();
      for (g = 0; g < NODE_LIMIT; g++) {
        y = round(x * y * (1 - y), drawRounding);
        if (!ySet.has(y)) {
          ySet.add(y);
          ctx.fillRect(
            (x - xLowerBound) * ctx.canvas.width / (xRange),
            (yUpperBound - y) * ctx.canvas.height / yRange,
            1,
            1);
        } else {
          // if duplicate value is found, stop iterating on this x / lambda
          // value as it should repeat the pattern from this point on
          break;
        }
      }
    }
  }
  draw();
});

function round(input, places) {
  if (places < 0) {
    return input;
  } else {
    return Math.round(input * Math.pow(10, places)) / Math.pow(10, places);
  }
}