import {
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Renderer {
  constructor(canvas) {
    this.hasGeometry = false;
    this.mesh = new Mesh();
    this.camera = this._setupCamera();
    this.scene = this._setupScene();
    this.renderer = this._setupRenderer(canvas);
    this.controls = this._setupControls();

    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      this.rerender();
    };

    animate();
  }

  rerender() {
    if (this.hasGeometry) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  updateMesh({ geometry, texture }) {
    this.hasGeometry = true;
    this.mesh.geometry = geometry;
    this.mesh.material = new MeshBasicMaterial({ map: texture });
    this.rerender();
  }

  updateSize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.rerender();
  }

  _setupCamera() {
    const camera = new PerspectiveCamera(45, 1, 0.0001, 1000);
    camera.position.set(1, 0, 1);
    camera.up.set(0, 0, 1);
    return camera;
  }

  _setupScene() {
    const scene = new Scene();
    scene.background = new Color(0xeeeeee);
    scene.add(this.mesh);
    return scene;
  }

  _setupRenderer(canvas) {
    const renderer = new WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    return renderer;
  }

  _setupControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.autoRotate = true;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minDistance = 0.5;
    controls.maxDistance = 2;
    controls.addEventListener("change", () => this.rerender());
    return controls;
  }
}
