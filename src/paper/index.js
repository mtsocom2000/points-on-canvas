import SVG from 'svg.js';
import { EditablePath } from './datamodel.js';

export default class PaperCanvasApp {
  constructor(canvasElement) {
    this._originalCanvas = canvasElement;

    this._color = {
      coordinator: 'black',
      line: 'blue',
      pointNormal: 'blue',
      pointSelect: 'red',
      path: 'none',
      lineStyle: { color: 'black', width: 1, linecap: 'round' },
      textStyle: { size: 14, anchor: 'middle', fill: '#000' },
      pathStyle: { color: 'blue', width: 1, linecap: 'round' },
      pointStyle: 'blue',
      pointSelectStyle: { color: 'lightblue', width: 1, linecap: 'round' },
      pointR: 12,
    };

    this._config = {
      width: 1024,
      height: 768,
      padding: 50,
    };

    this._init();
    this._path = null;

    this._backupStyle = {};
  }

  _init() {
    this._svgDrawing = SVG('myCanvas').size(this._config.width, this._config.height);

    // fist layer to display ruler
    this._createCoordinator(1024, 768);
  }

  _createCoordinator(width, height) {
    let leftX = this.toSVGPoint({
      x: -width / 2 + this._config.padding,
      y: 0,
    });
    let rightX = this.toSVGPoint({
      x: width / 2 - this._config.padding - 18,
      y: 0,
    });
    this._svgDrawing.line(leftX.x, leftX.y, rightX.x, rightX.y).stroke(this._color.lineStyle);

    let xRightUp = this.toSVGPoint({
      x: width / 2 - this._config.padding - 18,
      y: 6,
    });
    let xRightDown = this.toSVGPoint({
      x: width / 2 - this._config.padding - 18,
      y: -6,
    });
    let xRightArrow = this.toSVGPoint({
      x: width / 2 - this._config.padding,
      y: 0,
    });
    this._svgDrawing.polyline([[xRightUp.x, xRightUp.y], [xRightDown.x, xRightDown.y], [xRightArrow.x, xRightArrow.y]]).fill(this._color.coordinator);

    let xTextPos = this.toSVGPoint({
      x: width / 2 - this._config.padding,
      y: 20,
    });
    this._svgDrawing.text('X').font(this._color.textStyle).move(xTextPos.x, xTextPos.y);

    for (let dx = -50; dx > -width / 2 + this._config.padding; dx -= 50) {
      const textPos = this.toSVGPoint({
        x: dx,
        y: -25
      });
      this._svgDrawing.text(dx.toString()).font(this._color.textStyle).move(textPos.x, textPos.y);

      let length = (dx % 100) === 0 ? 10 : 5;
      const from = this.toSVGPoint({
        x: dx,
        y: -length,
      });
      const to = this.toSVGPoint({
        x: dx,
        y: 0,
      });
      this._svgDrawing.line(from.x, from.y, to.x, to.y).stroke(this._color.lineStyle);
    }
    for (let dx = 50; dx < width / 2 - this._config.padding; dx += 50) {
      const textPos = this.toSVGPoint({
        x: dx,
        y: -25
      });
      this._svgDrawing.text(dx.toString()).font(this._color.textStyle).move(textPos.x, textPos.y);

      let length = (dx % 100) === 0 ? 10 : 5;
      const from = this.toSVGPoint({
        x: dx,
        y: -length,
      });
      const to = this.toSVGPoint({
        x: dx,
        y: 0,
      });
      this._svgDrawing.line(from.x, from.y, to.x, to.y).stroke(this._color.lineStyle);
    }

    // height
    let bottomY = this.toSVGPoint({
      x: 0,
      y: -height / 2 + this._config.padding,
    });
    let topY = this.toSVGPoint({
      x: 0,
      y: height / 2 - this._config.padding - 18,
    });
    this._svgDrawing.line(bottomY.x, bottomY.y, topY.x, topY.y).stroke(this._color.lineStyle);

    let yRight = this.toSVGPoint({
      x: 6,
      y: height / 2 - this._config.padding - 18,
    });
    let yArrow = this.toSVGPoint({
      x: 0,
      y: height / 2 - this._config.padding,
    });
    let yLeft = this.toSVGPoint({
      x: -6,
      y: height / 2 - this._config.padding - 18,
    });

    this._svgDrawing.polyline([[yLeft.x, yLeft.y], [yRight.x, yRight.y], [yArrow.x, yArrow.y]]).fill(this._color.coordinator);

    let yTextPos = this.toSVGPoint({
      x: 20,
      y: height / 2 - this._config.padding
    });
    this._svgDrawing.text('Y').font(this._color.textStyle).move(yTextPos.x, yTextPos.y);

    for (let dy = -50; dy > -height / 2 + this._config.padding; dy -= 50) {
      const textPos = this.toSVGPoint({
        x: -25,
        y: dy - 4
      });
      this._svgDrawing.text(dy.toString()).font(this._color.textStyle).move(textPos.x, textPos.y);

      let length = (dy % 100) === 0 ? 10 : 5;
      const from = this.toSVGPoint({
        x: -length,
        y: dy,
      });
      const to = this.toSVGPoint({
        x: 0,
        y: dy,
      });
      this._svgDrawing.line(from.x, from.y, to.x, to.y).stroke(this._color.lineStyle);
    }
    for (let dy = 50; dy < height / 2 - this._config.padding; dy += 50) {
      const textPos = this.toSVGPoint({
        x: -25,
        y: dy - 4
      });
      this._svgDrawing.text(dy.toString()).font(this._color.textStyle).move(textPos.x, textPos.y);

      let length = (dy % 100) === 0 ? 10 : 5;
      const from = this.toSVGPoint({
        x: -length,
        y: dy,
      });
      const to = this.toSVGPoint({
        x: 0,
        y: dy,
      });
      this._svgDrawing.line(from.x, from.y, to.x, to.y).stroke(this._color.lineStyle);
    }
  }

  start(path) {
    this.editablePath = new EditablePath(path);
    this.refresh();
  }

  refresh() {
    let sourcePath = this.editablePath.allRawPoints();
    let svgPolylineData = [];
    for (let i = 0; i < sourcePath.length; i++) {
      let ptFrom = sourcePath[i];
      let ptTo = sourcePath[(i + 1) % sourcePath.length];
      ptFrom = this.toSVGPoint({
        x: ptFrom.x,
        y: ptFrom.y,
      });
      svgPolylineData.push([ptFrom.x, ptFrom.y]);
      ptTo = this.toSVGPoint({
        x: ptTo.x,
        y: ptTo.y,
      });
      svgPolylineData.push([ptTo.x, ptTo.y]);
    }
    this._svgDrawing.polyline(svgPolylineData).fill(this._color.path).stroke(this._color.pathStyle);

    // point itself
    sourcePath = this.editablePath.allControlPoints();
    for (let i = 0; i < sourcePath.length; i++) {
      let pt = sourcePath[i];
      let circlePos = this.toSVGPoint({
        x: pt.x,
        y: pt.y,
      });
      const pointElement = this._svgDrawing.circle(this._color.pointR).fill(this._color.pointStyle);
      pointElement.move(circlePos.x - this._color.pointR / 2, circlePos.y - this._color.pointR / 2);
      pointElement.mouseout(e => this.onPointMouseOut(e));
      pointElement.mouseover(e => this.onPointMouseOver(e));
      pointElement.mousedown(e => this.onPointMouseDown(e));
      pointElement.userData = pt;
    }
  }

  onPointMouseOut(e) {
    Object.keys(this._backupStyle).forEach((key) => {
      e.currentTarget.style[key] = this._backupStyle[key];
    });

  }

  onPointMouseOver(e) {
    this._backupStyle = {};
    this._backupStyle.fill = e.currentTarget.style.fill;
    e.currentTarget.style.fill = '#f06';
  }

  onPointMouseDown(e) {
    // e.currentTarget.instance.userData
    e.currentTarget.instance.stroke({ color: 'blue', width: 3, linecap: 'round' });
    e.currentTarget.instance.remove();
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

      // test func works...
      if (this._selectItem.userData) {
        this._selectItem.userData._test();
        this.refresh();
      }
    } else {
      // another test func
      this.editablePath.testAddPt();
      this.refresh();
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

  toSVGPoint(pt) {
    return {
      x: pt.x + this._config.width / 2,
      y: -pt.y + this._config.height / 2,
    };
  }

  toPathPoint(paperPoint) {
    return {
      x: paperPoint.x - this._config.width / 2,
      y: paperPoint.y - this._config.height / 2,
    };
  }

  toPath() {
    return this._path.map(p => p);
  }

  updatePoint() {

  }
}
