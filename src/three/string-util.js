export function parsePathsFromStr(str) {

}

export function parsePathFromStr(str) {
  let pathStr = str.replace(/\s+/g, '');
  // a paths string usually looks like 
  // '[
  // { x: 12, y: 23, z: 1 }, 
  // { x: 12, y: 23, z: 1 },
  // ]'
  // pathStr
}

export function parsePointFromStr(str) {
  let pointStr = str.replace(/\s+/g, '');
  // a point string usually looks like 
  // '
  // { x: 12, y: 23, z: 1 }, 
  // '
  // try JSON.parse
  while (pointStr[0] !== '{') {
    pointStr = pointStr.substr(1, pointStr.length - 1);
  }

  while (pointStr[pointStr.length - 1] !== '}') {
    pointStr = pointStr.substr(0, pointStr.length - 1);
  }

  return JSON.parse(pointStr);
}