import * as THREE from 'three';
const TrackballControls = require('three-trackballcontrols');
const shortid = require('shortid');
export default class ThreeDCanvas {
  constructor(options) {
    this.mScene = null;
    this.mCamera = null;
    this.mRender = null;
    this.mTrackballControl = null;

    this.mOptions = Object.assign({
      domElement: document.querySelector('body'),
      showGridHelper: true,
      showAxisHelper: true,
    }, options);

    this.render = this.render.bind(this);

    this.mFirstPoint = null;
    this.mLastPoint = null;
    this.highLightObjec = null;

    this.mBoundingBox = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }

    this.mCanvasRatio = 1280 / 720;

    this.mPointsCache = {};
  }

  start() {
    this.mScene = new THREE.Scene();
    this.mScene.background = new THREE.Color( 0xffffff );

    if (this.mOptions.showGridHelper) {
      this.mScene.add(new THREE.GridHelper(100, 10));
    }

    if (this.mOptions.showAxisHelper) {
      this.mScene.add(new THREE.AxisHelper(50));
    }

    //this.mCamera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 10000);
    // const aspect = window.innerWidth / window.innerHeight;
    this.mCamera = new THREE.OrthographicCamera(
      this.mOptions.domElement.clientWidth / -2,
      this.mOptions.domElement.clientWidth / 2,
      this.mOptions.domElement.clientHeight / 2,
      this.mOptions.domElement.clientHeight / -2,
      1,
      500);
    // position and point the camera to the center of the scene
    this.mCamera.position.x = 0;
    this.mCamera.position.y = 0;
    this.mCamera.position.z = 200;
    this.mCamera.lookAt(this.mScene.position);

    // this.mTrackballControl = new TrackballControls(this.mCamera);
    // this.mTrackballControl.zoomSpeed = 1.2;
    // this.mTrackballControl.panSpeed = 0.8;
    // this.mTrackballControl.noZoom = false;
    // this.mTrackballControl.noPan = false;
    // this.mTrackballControl.staticMoving = true;
  
    this.mRender = new THREE.WebGLRenderer({ antialias: true });
    this.mRender.setClearColor(new THREE.Color(0xffffff, 0.8));
    this.mRender.setPixelRatio(window.devicePixelRatio);
    this.mRender.setSize(this.mOptions.domElement.clientWidth, this.mOptions.domElement.clientHeight);
    this.mRender.shadowMap.enabled = true;

    this.mAmbientLight = new THREE.AmbientLight(0xffffff);
    this.mScene.add(this.mAmbientLight);

    this.mDirectionlight = new THREE.DirectionalLight(0xffffff, 2);
    this.mDirectionlight.position.set(100, 100, 100);
    this.mScene.add(this.mDirectionlight);

    this.mPlanGeometry = new THREE.BoxBufferGeometry(20000, 20000, 2);

    this.mPlane = new THREE.Mesh(this.mPlanGeometry, new THREE.MeshBasicMaterial({
      color: 0x090966,
      opacity: 0.5,
      transparent: true,
    }));
    this.mPlane.tag = 'plane';
    this.mPlane.position.copy(new THREE.Vector3(0, 0, 0));
    this.mScene.add(this.mPlane);

    this.mOptions.domElement.appendChild(this.mRender.domElement);

    this.render();
  }

  mouseMove(position) {
    const rayCaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = position.x;
    mouse.y = position.y;
    rayCaster.setFromCamera(position, this.mCamera);
    const intersects = rayCaster.intersectObjects(this.mScene.children);

    let currentHighLightObj = null;
    if (intersects.length > 0) {
      const intersect = intersects[0];
      intersect.linePrecision = 1;
      if (intersect && intersect.object instanceof THREE.Mesh) {
        if (!intersect.object.tag || intersect.object.tag !== 'plane') {
          currentHighLightObj = intersect.object;
          intersect.object.material.emissive.setHex( 0xff0000 );
        }
      }
    }

    if (this.highLightObjec !== currentHighLightObj) {
      if (this.highLightObjec) {
        this.highLightObjec.material.emissive.setHex( 0x000000 );
      }
      this.highLightObjec = currentHighLightObj;  
    }
  }

  addPoint(position) {
    const rayCaster = new THREE.Raycaster();
    rayCaster.linePrecision = 1;
    const mouse = new THREE.Vector2();
    mouse.x = position.x;
    mouse.y = position.y;
    rayCaster.setFromCamera(position, this.mCamera);
    const intersects = rayCaster.intersectObjects(this.mScene.children);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      if (!intersect.face) {
        return;
      }
      
      const pos = new THREE.Vector3();
      // pos.copy(intersect.point).add(intersect.face.normal).divideScalar(DEFAULT_LENGTH).floor().multiplyScalar(DEFAULT_LENGTH).addScalar(DEFAULT_LENGTH / 2);
      pos.copy(intersect.point);
      if (!this.mFirstPoint) {
        this.mFirstPoint = pos;
      }

      this.createPaths(pos);
    }
  }

  hover() {

  }

  createPaths(pos) {
    const r = 2;
    const sphereGeometry = new THREE.SphereGeometry(r, 10, 10); 
    const sphereMaterial = new THREE.MeshBasicMaterial({color: 0x8888ff}); 
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(pos.x, pos.y, 0);
    sphere.tag = {
      id: shortid.generate(),
      value: pos,
      class: 'sphere',
    };
    this.mScene.add(sphere);
    this.mPointsCache[sphere.tag.id] = sphere;

    if (this.mLastPoint) {
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 });
      const lineGeometry = new THREE.Geometry();
      lineGeometry.vertices.push(this.mLastPoint);
      lineGeometry.vertices.push(sphere.position);
      const line = new THREE.Line( lineGeometry, lineMaterial );
      line.tag = 'line';
      this.mScene.add(line);
    }

    if (!this.mFirstPoint) {
      this.mFirstPoint = pos;
    }
    this.mLastPoint = sphere.position;

    // const points = [];
    // const geometry = new THREE.BufferGeometry().setFromPoints(points);
    // var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 0.5 } ) );
    // scene.add( line );

    // extend boundingbox
    this.updateBoundingBox(pos);
  }

  updateBoundingBox(pos) {
    if (pos.x < this.mBoundingBox.left) {
      this.mBoundingBox.left = pos.x;
    } else if (pos.x > this.mBoundingBox.right) {
      this.mBoundingBox.right = pos.x;
    }
    if (pos.y < this.mBoundingBox.bottom) {
      this.mBoundingBox.bottom = pos.y;
    } else if (pos.y > this.mBoundingBox.top) {
      this.mBoundingBox.top = pos.y;
    }

    let height = this.mBoundingBox.top - this.mBoundingBox.bottom;
    let heightCenter = (this.mBoundingBox.top + this.mBoundingBox.bottom) / 2;
    let width = this.mBoundingBox.right - this.mBoundingBox.left;
    let widthCenter = (this.mBoundingBox.right + this.mBoundingBox.left) / 2;
    let ratio = width / height;
    if (ratio > this.mCanvasRatio) {
      height = width / this.mCanvasRatio;
    } else {
      width = height * this.mCanvasRatio;
    }

    // this.mCamera.left = widthCenter - width / 2;
    // this.mCamera.right = widthCenter + width / 2;
    // this.mCamera.top = heightCenter + height / 2;
    // this.mCamera.bottom = heightCenter - height / 2;
    this.mCamera.position.x = widthCenter;
    this.mCamera.position.y = heightCenter;
    this.mCamera.position.z = 10;
    this.mCamera.lookAt({
      x: widthCenter,
      y: heightCenter,
      z: this.mScene.position.z,
    });

    Object.values(this.mPointsCache).forEach((sphere) => {
      if (this.mBoundingBox.right - this.mBoundingBox.left) {
        sphere.geometry.dispose();
        const r = (this.mBoundingBox.right - this.mBoundingBox.left) / 150;
        sphere.geometry = new THREE.SphereGeometry(r, 10, 10);
      }
    });

    this.mCamera.updateProjectionMatrix();
  }

  closePath() {
    if (this.mFirstPoint && this.mLastPoint) {
      const lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
      const lineGeometry = new THREE.Geometry();
      lineGeometry.vertices.push(this.mLastPoint);
      lineGeometry.vertices.push(this.mFirstPoint);
      const line = new THREE.Line( lineGeometry, lineMaterial );
      this.mScene.add(line);
    }

    this.mFirstPoint = null;
    this.mLastPoint = null;
  }

  render() {
    //this.mTrackballControl.update();

    requestAnimationFrame(this.render);
    this.mRender.render(this.mScene, this.mCamera);
  }
}