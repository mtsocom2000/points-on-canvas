import * as THREE from 'three';
const PI = 3.1415926;
export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  const color = Array(3);
  for (var i = 0; i < 3; i++) {
    color[i] = letters[Math.floor(Math.random() * 16)];
  }
  return `#${color[0]}${color[0]}${color[1]}${color[1]}${color[2]}${color[2]}`;
}

export function nearlyEqual(x, y) {
  return Math.abs(x - y) < 0.001;
}

export function extendPaths(paths, extendWidth, keepRightAngle = true) {
  let loopPaths = [];
  let isClosePath = (nearlyEqual(paths[0].x, paths[paths.length - 1].x) && nearlyEqual(paths[0].x, paths[paths.length - 1].y));
  let prevVector = new THREE.Vector2();

  // direction of start point to end point
  let direction = new THREE.Vector2(
    paths[paths.length - 1].x - paths[0].x,
    paths[paths.length - 1].y - paths[0].y);

  let rotation = -PI / 2; 

  if (paths.length === 2) {
    // build a parallel line and close it...
    let p0 = paths[0];
    let p1 = paths[1];
    let extendVector = new THREE.Vector2(p1.x - p0.x, p1.y - p0.y);
    extendVector.normalize().multiplyScalar(extendWidth).rotateAround(new THREE.Vector2(0, 0), rotation);

    if (direction.dot(extendVector) > 0) {
      rotation = PI / 2;
      extendVector.negate();
    }

    let v0 = new THREE.Vector2();
    v0.copy(extendVector).add(new THREE.Vector2(p0.x, p0.y));
    let v1 = new THREE.Vector2();
    v1.copy(extendVector).add(new THREE.Vector2(p1.x, p1.y));

    loopPaths.push(v0);
    loopPaths.push(v1);
    return loopPaths;
  }

  let directionAdjusted = false;

  for (let i = 0; i < paths.length; i++) {
    let p0 = paths[i];
    let p1;

    // for closed path, need check the last point carefully
    if (i === paths.length - 1) {
      if (isClosePath) {
        p1 = paths[1];
      } else {
        break;
      }
    } else {
      p1 = paths[i + 1];
    }

    // a extend direction vector
    let extendVector = new THREE.Vector2(p1.x - p0.x, p1.y - p0.y);
    extendVector.normalize().multiplyScalar(extendWidth).rotateAround(new THREE.Vector2(0, 0), rotation);

    // reverse extend direction if needed
    if (!directionAdjusted) {
      if (direction.dot(extendVector) > 0) {
        rotation = PI / 2;
        extendVector.negate();
      }
      directionAdjusted = true;
    }

    // the start point of this edge
    let v0 = new THREE.Vector2();
    v0.copy(extendVector).add(new THREE.Vector2(p0.x, p0.y));

    let dot = extendVector.x * prevVector.x + extendVector.y * prevVector.y;
    let det = extendVector.x * prevVector.y - extendVector.y * prevVector.x;
    let angle = Math.atan2(det, dot);
    console.log(`${i}: angle: ${angle * 180 / PI} rot: ${rotation * 180 /PI}`);

    // if need handle right angle...
    //if (keepRightAngle && loopPaths.length > 0 && nearlyEqual(extendVector.dot(prevVector), 0)) {
    if (keepRightAngle && loopPaths.length > 0 && nearlyEqual(extendVector.dot(prevVector), 0)) {
      // check if right angle...
      // let dot = extendVector.x * prevVector.x + extendVector.y * prevVector.y;
      // let det = extendVector.x * prevVector.y - extendVector.y * prevVector.x;
      // let angle = Math.atan2(det, dot);
      loopPaths.pop();
      v0 = (extendVector.clone().add(prevVector).add(new THREE.Vector2(p0.x, p0.y)));
    }
    loopPaths.push(v0);

    // handle last point of closed path
    if (isClosePath && (i === paths.length - 1)) {
      loopPaths.shift();
      loopPaths.unshift(v0);
      break;
    }

    // the end point of this edge...
    let v1 = new THREE.Vector2();
    v1.copy(extendVector).add(new THREE.Vector2(p1.x, p1.y));
    loopPaths.push(v1);

    prevVector.copy(extendVector);
  }

  return loopPaths;
}