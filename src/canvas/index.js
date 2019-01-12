export default class Points2DApp {
  constructor(canvasElement) {
    this.mCanvas = canvasElement;
    this.mContext = this.mCanvas.getContext('2d');

    this.mWidth = parseInt(this.mCanvas.width, 10);
    this.mHeight = parseInt(this.mCanvas.height, 10);

    this.mUnitWidth = parseInt(this.mWidth * 0.9, 10);
    this.mUnitHeight = parseInt(this.mHeight * 0.9, 10);

    this.mContext.translate(this.mCanvas.width / 2, this.mCanvas.height / 2);

    this.init();
  }

  init() {
    this.mContext.strokeStyle = '#000000';
    this.mContext.fillStyle = '#000000';
    this.mContext.strokeStyle = 1;
    this.mContext.moveTo(-this.mWidth / 2, 0);
    this.mContext.lineTo(this.mWidth / 2, 0);
    this.mContext.stroke();

    this.mContext.beginPath();
    this.mContext.moveTo(this.mWidth / 2 - 20, -5);
    this.mContext.lineTo(this.mWidth / 2, 0);
    this.mContext.lineTo(this.mWidth / 2 - 20, 5);
    this.mContext.closePath();
    this.mContext.fill();

    this.mContext.beginPath();
    this.mContext.arc(-this.mUnitWidth / 2, 0, 2, 0, 2 * Math.PI);
    this.mContext.stroke();
    this.mContext.fillText('-1', -this.mUnitWidth / 2 - this.mContext.measureText('-1').width / 2, 15);
    this.mContext.beginPath();
    this.mContext.arc(this.mUnitWidth / 2, 0, 2, 0, 2 * Math.PI);
    this.mContext.stroke();
    this.mContext.fillText('+1', this.mUnitWidth / 2 - this.mContext.measureText('+1').width / 2, 15);

    this.mContext.moveTo(0, this.mHeight / 2);
    this.mContext.lineTo(0, -this.mHeight / 2);
    this.mContext.stroke();

    this.mContext.beginPath();
    this.mContext.moveTo(-5, -this.mHeight / 2 + 20);
    this.mContext.lineTo(0, -this.mHeight / 2);
    this.mContext.lineTo(5, -this.mHeight / 2 + 20);
    this.mContext.closePath();
    this.mContext.fill();

    this.mContext.beginPath();
    this.mContext.arc(0, -this.mUnitHeight / 2, 2, 0, 2 * Math.PI);
    this.mContext.stroke();
    this.mContext.fillText('+1', -15, -this.mUnitHeight / 2 + this.mContext.measureText('+1').width / 2);
    this.mContext.beginPath();
    this.mContext.arc(0, this.mUnitHeight / 2, 2, 0, 2 * Math.PI);
    this.mContext.stroke();
    this.mContext.fillText('-1', -15, this.mUnitHeight / 2 + this.mContext.measureText('-1').width / 2);
  }

  start() {
    this.testPathFunc();
  }

  testPathFunc() {
    this.mContext.strokeStyle = '#ff0000';
    this.mContext.lineWidth = 5;
    let start = false;
    [
      { x: 0, y: 0 },
      { x: 0.5, y: 0 },
      { x: 1, y: 0.8 },
      { x: 1,y: 1 },
      { x: 0.8, y: 1 },
      { x: 0.2, y: 0.2 },
      { x: 0, y: 0.2 },
    ].forEach(((point) => {
      const x = this.mUnitWidth / 2 * point.x;
      const y = -this.mUnitHeight / 2 * point.y;
      if (start) {
        this.mContext.lineTo(x, y);
      } else {
        start = true;
        this.mContext.moveTo(x, y);
      }
    }));
    if (start) {
      this.mContext.stroke();
    }
  }
}