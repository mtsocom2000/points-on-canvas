import { extendPaths, nearlyEqual } from './polygon-util';
import ThreeDCanvas from './threed-canvas';

export default class Points3DApp {
  constructor() {
    this.mCanvas = null;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);

    this.mDomElement = document.querySelector('#WebGL-output');
  }

  start() {
    this.mCanvas = new ThreeDCanvas({
      domElement: this.mDomElement,
    });
    this.mCanvas.start();

    // document.addEventListener('mousedown', this.onMouseDown, false);
    document.addEventListener('mousemove', this.onMouseMove, false);

    this.testPathFunc();
  }

  parsePoints(textStr) {
    let points = [];
    try {
      points = JSON.parse(textStr);
    } catch (e) {
      console.log(e);
    }
    if (Array.isArray(points)) {
      points.forEach((point) => {
        this.mCanvas.createPaths(point);
      });
      this.mCanvas.closePath();
    }
  }

  onMouseDown(event) {
    if (event.button === 2) {
      this.mCanvas.closePath();
      return;
    }
    const x = ( event.clientX / this.mDomElement.clientWidth ) * 2 - 1;
    const y = - ( event.clientY / this.mDomElement.clientHeight ) * 2 + 1;
    this.mCanvas.addPoint({ x, y });
  }

  onMouseMove(event) {
    const x = ( event.clientX / this.mDomElement.clientWidth ) * 2 - 1;
    const y = - ( event.clientY / this.mDomElement.clientHeight ) * 2 + 1;
    this.mCanvas.mouseMove({ x, y });
  }

  testPathFunc() {
    // const mycanvas = document.createElement('canvas');
    // mycanvas.id = 'mycanvas';
    // document.body.appendChild(mycanvas);
    // mycanvas.width = 1280;
    // mycanvas.height = 960;
    // mycanvas.style.position = 'absolute';
    // mycanvas.style.left = 0;
    // mycanvas.style.top = 0;
    // mycanvas.style.width = '1280px';
    // mycanvas.style.height = '960px';
    // mycanvas.style.background = 'aliceblue';
    // mycanvas.style.zIndex = 1000;
    // document.body.appendChild(mycanvas);

    // const context = mycanvas.getContext('2d');

    const pathsArray = [
      // [
      //   { x: 2, y: 2, },
      //   { x: 300, y: 200, },
      //   { x: 300, y: 300, },
      //   { x: 200, y: 300, },
      //   { x: 200, y: 200, },
      // ],
      [
        { x: 1.21, y: 1.232, },
        { x: 2.641, y: -1.232, },
        { x: 2.241, y: -1.432, },
      ],
      // [
      //   { x: 400, y: 300, },
      //   { x: 400, y: 500, },
      //   { x: 500, y: 500, },
      //   { x: 500, y: 600, },
      //   { x: 700, y: 600, },
      //   { x: 700, y: 350, },
      //   { x: 650, y: 350, },
      //   { x: 650, y: 300, },
      // ],
      // [
      //   { x: 400, y: 700, },
      //   { x: 400, y: 900, },
      //   { x: 50, y: 900, },
      //   { x: 50, y: 750, },
      //   { x: 100, y: 750, },
      //   { x: 100, y: 700, },
      // ],
      // [
      //   { x: 900, y: 700, },
      //   { x: 900, y: 900, },
      //   { x: 750, y: 900, },
      //   { x: 650, y: 800, },
      //   { x: 650, y: 700, },
      // ],
      // [
      //   { x: -600, y: -500, },
      //   { x: 661, y: 666, },
      //   { x: 461, y: 701, },
      //   { x: 402, y: 843, },
      //   { x: 200, y: 643, },
      //   { x: 200, y: 500, },
      // ],
    ];
    pathsArray.forEach((path) => {
      path.forEach((pos) => {
        this.mCanvas.createPaths(pos);
      });
      this.mCanvas.closePath();
    });
    // pathsArray.forEach(paths => {
    //   this.drawPath(paths, context);
    // });

    // context.strokeStyle = 'blue';

    // pathsArray.forEach(paths => {
    //   let newPtahs = extendPaths(paths, 20);
    //   this.drawPath(newPtahs, context);
    // });
  }

  drawPath(paths, context) {
    if (paths.length < 2) {
      return;
    }
    let isClose = false;
    if (nearlyEqual(paths[0].x, paths[paths.length - 1]) && nearlyEqual(paths[0].x, paths[paths.length - 1])) {
      isClose = true;
    }

    context.beginPath();

    let start = false;
    paths.forEach(p => {
      if (!start) {
        context.moveTo(p.x, p.y);
        start = true;
      } else {
        context.lineTo(p.x, p.y);
      }
    });
    context.stroke();

    if (isClose) {
      context.closePath();
    }

  }
}