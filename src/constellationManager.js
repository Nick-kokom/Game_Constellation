import * as THREE from 'three';
import { ZodiacData } from './zodiacData';
import gsap from 'gsap';

export class ConstellationManager {
  constructor(scene) {
    this.scene = scene;
    this.stars = [];
    this.lines = [];
    this.currentConstellation = null;
  }

  createConstellation(zodiacSign) {
    this.clearConstellation();
    
    const constellationData = ZodiacData[zodiacSign];
    if (!constellationData) return;

    const starGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const starMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0xffffcc,
      emissiveIntensity: 0.5
    });

    // Create stars first
    const starPositions = new Map();
    constellationData.stars.forEach((position, index) => {
      const star = new THREE.Mesh(starGeometry, starMaterial.clone());
      star.position.set(...position);
      star.userData.index = index;
      star.userData.info = constellationData.starInfo[index];
      
      // Store position for line creation
      starPositions.set(index, star.position.clone());
      
      // Add click detection
      star.callback = () => this.onStarClick(star);
      
      this.stars.push(star);
      this.scene.add(star);

      // Animate star appearance
      star.scale.set(0, 0, 0);
      gsap.to(star.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        delay: index * 0.2,
        ease: "elastic.out(1, 0.5)"
      });
    });

    // Create lines between stars
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x4a90e2, 
      transparent: true, 
      opacity: 0.5 
    });
    
    constellationData.lines.forEach(([startIdx, endIdx]) => {
      const startPos = starPositions.get(startIdx);
      const endPos = starPositions.get(endIdx);
      
      if (startPos && endPos) {
        const points = [startPos, endPos];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, lineMaterial.clone());
        this.lines.push(line);
        this.scene.add(line);

        // Animate line appearance
        line.material.opacity = 0;
        gsap.to(line.material, {
          opacity: 0.5,
          duration: 1,
          delay: this.stars.length * 0.2
        });
      }
    });

    this.currentConstellation = zodiacSign;
  }

  clearConstellation() {
    this.stars.forEach(star => {
      this.scene.remove(star);
      star.geometry.dispose();
      star.material.dispose();
    });
    
    this.lines.forEach(line => {
      this.scene.remove(line);
      line.geometry.dispose();
      line.material.dispose();
    });
    
    this.stars = [];
    this.lines = [];
  }

  animateStars() {
    const time = Date.now() * 0.001;
    this.stars.forEach((star, index) => {
      star.material.emissiveIntensity = 0.5 + Math.sin(time + index) * 0.2;
    });
  }

  onStarClick(star) {
    const event = new CustomEvent('starClicked', { 
      detail: { 
        info: star.userData.info,
        zodiacSign: this.currentConstellation
      }
    });
    window.dispatchEvent(event);
  }
}