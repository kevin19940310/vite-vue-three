import { color } from '../config/index';
import Cylinder from './cylinder';
export default class Wall {
  constructor(scene, time) {
    this.scene = scene;
    this.time = time;
    this.config = {
      radius: 50,
      height: 50,
      open: true,
      color: color.wall,
      opacity: 0.6,
      position: { x: 0, y: 0, z: 0 },
      speed: 1.0
    }

    this.createWall();
  }
  createWall() {
    new Cylinder(this.scene, this.time).createCylinder(this.config);
  }
}