import { extendPaths, nearlyEqual } from './polygon-util';
import ThreeDCanvas from './threed-canvas';

export default class Points3DApp {
  constructor(htmlCanvas) {
    this.mCanvas = null;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);

    this.mDomElement = htmlCanvas;
  }

  start() {
    this.mCanvas = new ThreeDCanvas({
      domElement: this.mDomElement,
    });
    this.mCanvas.start();

    // document.addEventListener('mousedown', this.onMouseDown, false);
    document.addEventListener('mousemove', this.onMouseMove, false);

    this.parsePoints();
  }

  parsePoints(textStr) {
    let points = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
    ];

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
}
