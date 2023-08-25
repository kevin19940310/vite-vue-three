import { color } from '../config/index';
import Cylinder from './cylinder';
export default class Circle {
  constructor(scene, time) {
    this.scene = scene;
    this.time = time;
    this.config = {
      radius: 50,
      height: 1,
      open: false,
      color: color.circle,
      opacity: 0.6,
      position: { x: 300, y: 0, z: 300 },
      speed: 2.0
    }

    this.createCylinder();
  }
  createCylinder() {
    new Cylinder(this.scene, this.time).createCylinder(this.config);
  }
}