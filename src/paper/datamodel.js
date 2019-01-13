export class EditablePoint {
  constructor(rawPt) {
    console.assert(rawPt.hasOwnProperty('x') && rawPt.hasOwnProperty('y'), 'only accept object like { x,y }');
    this._rawPt = {
      x: rawPt.x,
      y: rawPt.y,
      EditablePoint: this,
    };
    this._points = [rawPt];

    this._prev = null;
    this._next = null;
  }

  set prev(editablePt) {
    console.assert(editablePt instanceof EditablePoint, 'only accept EditablePoint');
    this._prev = editablePt;
  }
  get prev() {
    return this._prev;
  }
  set next(editablePt) {
    console.assert(editablePt instanceof EditablePoint, 'only accept EditablePoint');
    this._next = editablePt;
  }
  get next() {
    return this._next;
  }

  _test() {
    this._points.unshift({
      x: this._rawPt.x + 10,
      y: this._rawPt.y + 10,
    });
    this._points.push({
      x: this._rawPt.x - 10,
      y: this._rawPt.y - 10,
    });
  }

  // since some operation will add more points
  getRawPoints() {
    return this._points;
  }
  getControlPoint() {
    return this._rawPt;
  }

  getFirstRawPoints() {
    return this._points[0];
  }
  getLastRawPoints() {
    return this._points[this._points.length - 1];
  }
}

export class EditablePath {
  constructor(sourcePath) {
    this._path = [];
    for (let j = 0; j < sourcePath.length; j++) {
      let pt = sourcePath[j];
      let p = new EditablePoint(pt);
      this._path.push(p);
    }
    for (let i = 0; i < this._path.length; i++) {
      let prev;
      let next;
      if (i === 0) {
        next = this._path[i + 1];
        prev = this._path[this._path.length - 1];
      } else if (i === this._path.length - 1) {
        next = this._path[0];
        prev = this._path[i - 1];
      } else {
        next = this._path[i + 1];
        prev = this._path[i - 1];
      }
      this._path[i].prev = prev;
      prev.next = this._path[i];
      this._path[i].next = next;
      next.prev = this._path[i];
    }
    this._start = this._path[0];
  }

  get(index) {
    return this._path[index];
  }

  getIndex(editablePt) {
    for (let i = 0; i < this._path.index; i++) {
      if (this._path[i] === editablePt) {
        return i;
      }
    }
    return -1;
  }

  remove(index) {
    let pt = this.get(index);
    let prev = pt.prev;
    let next = pt.next;
    prev.next = next;
    next.prev = prev;
    this._path.splice(index, 1);
  }

  insertAt(index, rawPt) {
    let editablePt = new EditablePoint(rawPt);
    let currentPt = this.get(index);
    if (!currentPt) {
      // add to last...
      console.assert(false, 'can not find pt at given index');
      return;
    }
    let prev = currentPt.prev;
    prev.next = editablePt;
    editablePt.prev = prev;
    currentPt.prev = editablePt;
    editablePt.next = currentPt;

    this._path.splice(index, 0, editablePt);
  }

  testAddPt() {
    this.insertAt(parseInt(Math.random() * this._path.length, 10), {
      x: Math.random() * 800,
      y: Math.random() * 700,
    });
  }

  allRawPoints() {
    let path = [];
    this._path.forEach((p) => {
      path = path.concat(p.getRawPoints());
    });
    path.push(path[path.length - 1]);
    return path;
  }

  allControlPoints() {
    let path = this._path.map((p) => p.getControlPoint());
    path.push(path[path.length - 1]);
    return path;
  }

  allEditablePoints() {
    return this._path.slice(0);
  }
}
