import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class SceneManager {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.init();
    this.setupMouseEvents();
  }

  init() {
    // Setup renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('game-screen').appendChild(this.renderer.domElement);

    // Setup camera
    this.camera.position.z = 15;

    // Setup controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    // Add stars background
    this.addStarfield();
  }

  setupMouseEvents() {
    this.renderer.domElement.addEventListener('click', (event) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.scene.children);

      if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.callback) {
          object.callback();
        }
      }
    });
  }

  addStarfield() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < 1000; i++) {
      vertices.push(
        THREE.MathUtils.randFloatSpread(100),
        THREE.MathUtils.randFloatSpread(100),
        THREE.MathUtils.randFloatSpread(100)
      );
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    const stars = new THREE.Points(geometry, material);
    this.scene.add(stars);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}