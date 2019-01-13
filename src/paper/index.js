import paper from 'paper';

export default class PaperCanvasApp {
  constructor(canvasElement) {
    this._originalCanvas = canvasElement;

    this._color = {
      coordinator: 'black',
      line: 'blue',
      pointNormal: 'blue',
      pointSelect: 'red'
    };

    this._config = {
      width: 1024,
      height: 768,
      padding: 50,
    };

    this._init();
    this._sourcePath = null;
  }

  _init() {
    paper.setup(this._originalCanvas);

    paper.settings.hitTolerance = 10;
    paper.settings.handleSize = 8;

    this._tool = new paper.Tool();
    this._tool.onMouseDown = this.onCanvasMouseDown.bind(this);
    this._tool.onMouseMove = this.onCanvasMouseMove.bind(this);
    this._tool.onMouseUp = this.onCanvasMouseUp.bind(this);

    // fist layer to display ruler
    this._createCoordinator(1024, 768);

    // second layer to displlay path
    this._pathLayer = new paper.Layer();
    // // Create a Paper.js Path to draw a line into it:
    // var path = new paper.Path();
    // // Give the stroke a color
    // path.strokeColor = 'black';
    // var start = new paper.Point(100, 100);
    // // Move to start and draw a line from there
    // path.moveTo(start);
    // // Note that the plus operator on Point objects does not work
    // // in JavaScript. Instead, we need to call the add() function:
    // path.lineTo(start.add([200, -50]));
    // // Draw the view now:
    // paper.view.draw();
  }

  _createCoordinator(width, height) {
    let hpath = new paper.Path();
    hpath.strokeColor = this._color.coordinator;
    hpath.strokeWidth = 1;
    hpath.add(this.toPaperPoint({
      x: -width / 2 + this._config.padding,
      y: 0,
    }));
    hpath.add(this.toPaperPoint({
      x: width / 2 - this._config.padding - 18,
      y: 0,
    }));
    hpath.add(this.toPaperPoint({
      x: width / 2 - this._config.padding - 18,
      y: 6,
    }));
    hpath.add(this.toPaperPoint({
      x: width / 2 - this._config.padding,
      y: 0,
    }));
    hpath.add(this.toPaperPoint({
      x: width / 2 - this._config.padding - 18,
      y: -6,
    }));
    hpath.add(this.toPaperPoint({
      x: width / 2 - this._config.padding - 18,
      y: 6,
    }));
    let htext = new paper.PointText(this.toPaperPoint({
      x: width / 2 - this._config.padding,
      y: 20
    }));
    htext.justification = 'center';
    htext.fillColor = this._color.coordinator;
    htext.content = 'x';

    for (let dx = -50; dx > -width / 2 + this._config.padding; dx -= 50) {
      // dx < width / 2 - this._config.padding;
      let dxText = new paper.PointText(this.toPaperPoint({
        x: dx,
        y: -25
      }));
      dxText.justification = 'center';
      dxText.fillColor = this._color.coordinator;
      dxText.content = dx;

      let path = new paper.Path();
      let length = (dx % 100) === 0 ? 10 : 5;
      path.strokeColor = this._color.coordinator;
      path.add(this.toPaperPoint({
        x: dx,
        y: -length,
      }));
      path.add(this.toPaperPoint({
        x: dx,
        y: 0,
      }));
    }
    for (let dx = 50; dx < width / 2 - this._config.padding; dx += 50) {
      let dxText = new paper.PointText(this.toPaperPoint({
        x: dx,
        y: -25
      }));
      dxText.justification = 'center';
      dxText.fillColor = this._color.coordinator;
      dxText.content = dx;

      let path = new paper.Path();
      let length = (dx % 100) === 0 ? 10 : 5;
      path.strokeColor = this._color.coordinator;
      path.add(this.toPaperPoint({
        x: dx,
        y: -length,
      }));
      path.add(this.toPaperPoint({
        x: dx,
        y: 0,
      }));
    }

    // height
    let vpath = new paper.Path();
    vpath.strokeColor = this._color.coordinator;
    vpath.add(this.toPaperPoint({
      x: 0,
      y: -height / 2 + this._config.padding,
    }));
    vpath.add(this.toPaperPoint({
      x: 0,
      y: height / 2 - this._config.padding - 18,
    }));
    vpath.add(this.toPaperPoint({
      x: 6,
      y: height / 2 - this._config.padding - 18,
    }));
    vpath.add(this.toPaperPoint({
      x: 0,
      y: height / 2 - this._config.padding,
    }));
    vpath.add(this.toPaperPoint({
      x: -6,
      y: height / 2 - this._config.padding - 18,
    }));
    vpath.add(this.toPaperPoint({
      x: 6,
      y: height / 2 - this._config.padding - 18,
    }));
    let vtext = new paper.PointText(this.toPaperPoint({
      x: 20,
      y: height / 2 - this._config.padding
    }));
    vtext.justification = 'center';
    vtext.fillColor = this._color.coordinator;
    vtext.content = 'y';

    for (let dy = -50; dy > -height / 2 + this._config.padding; dy -= 50) {
      let dyText = new paper.PointText(this.toPaperPoint({
        x: -25,
        y: dy - 4
      }));
      dyText.justification = 'center';
      dyText.fillColor = this._color.coordinator;
      dyText.content = dy;

      let path = new paper.Path();
      let length = (dy % 100) === 0 ? 10 : 5;
      path.strokeColor = this._color.coordinator;
      path.add(this.toPaperPoint({
        x: -length,
        y: dy,
      }));
      path.add(this.toPaperPoint({
        x: 0,
        y: dy,
      }));
    }
    for (let dy = 50; dy < height / 2 - this._config.padding; dy += 50) {
      let dyText = new paper.PointText(this.toPaperPoint({
        x: -25,
        y: dy - 4
      }));
      dyText.justification = 'center';
      dyText.fillColor = this._color.coordinator;
      dyText.content = dy;

      let path = new paper.Path();
      let length = (dy % 100) === 0 ? 10 : 5;
      path.strokeColor = this._color.coordinator;
      path.add(this.toPaperPoint({
        x: -length,
        y: dy,
      }));
      path.add(this.toPaperPoint({
        x: 0,
        y: dy,
      }));
    }
  }

  start(path) {
    if (Array.isArray(path)) {
      this._sourcePath = path.slice();
      // manual close it
      this._sourcePath.push(this._sourcePath[0]);
    } else {
      this._sourcePath = [];
    }

    this.display(this._sourcePath);
  }

  display(sourcePath) {
    for (let i = 0; i < sourcePath.length; i++) {
      let ptFrom = sourcePath[i];
      let ptTo = sourcePath[(i + 1) % sourcePath.length];
      let path = new paper.Path();
      path.strokeColor = this._color.line;
      path.add(this.toPaperPoint({
        x: ptFrom.x,
        y: ptFrom.y,
      }));
      path.add(this.toPaperPoint({
        x: ptTo.x,
        y: ptTo.y,
      }));
    }

    // point itself
    for (let i = 0; i < sourcePath.length; i++) {
      let pt = sourcePath[i];
      let myCircle = new paper.Path.Circle(this.toPaperPoint({
        x: pt.x,
        y: pt.y,
      }), 5);
      myCircle.fillColor = this._color.pointNormal;
      myCircle.tag = 'point';
    }
  }

  onCanvasMouseDown(e) {
    if (this._selectItem) {
      this._selectItem.fillColor = this._color.pointNormal;
      this._selectItem = null;
    }

    if (this._hoverItem) {
      this._hoverItem.selected = false;

      this._selectItem = this._hoverItem;
      this._selectItem.fillColor = this._color.pointSelect;
      this._hoverItem = null;
    }
  }

  onCanvasMouseMove(e) {
    // e.item.layer === paper.project.activeLayer
    if (e.item && e.item.tag === 'point') {
      this._hoverItem = e.item;
      this._hoverItem.selected = true;
    } else if (this._hoverItem) {
      this._hoverItem.selected = false;
      this._hoverItem = null;
    }
  }

  onCanvasMouseUp(e) {
    console.log('mouse up');
  }

  toPaperPoint(pt) {
    return new paper.Point(
      pt.x + this._config.width / 2,
      -pt.y + this._config.height / 2);
  }

  toPathPoint(paperPoint) {
    return {
      x: paperPoint.x - this._config.width / 2,
      y: paperPoint.y - this._config.height / 2,
    };
  }
}
