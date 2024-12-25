import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ConstellationManager } from './constellationManager';
import { ZodiacData } from './zodiacData';
import { UIManager } from './uiManager';
import { SceneManager } from './sceneManager';

class Game {
  constructor() {
    this.sceneManager = new SceneManager();
    this.constellationManager = new ConstellationManager(this.sceneManager.scene);
    this.uiManager = new UIManager(this);
    this.currentZodiac = null;
    this.init();
  }

  init() {
    this.animate();
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.sceneManager.onWindowResize();
    });
  }

  showConstellation(zodiacSign) {
    this.currentZodiac = zodiacSign;
    this.constellationManager.createConstellation(zodiacSign);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.sceneManager.render();
    if (this.constellationManager.stars.length > 0) {
      this.constellationManager.animateStars();
    }
  }
}

// Start the game
new Game();