/**
 * 创建天空盒子
*/
import * as Thress from 'three';
export default class Background {
  constructor(scene) {
    this.scene = scene;
    this.url = '/src/assets/black-bg.png';
    this.init();
  }
  init() {
    // 创建纹理加载器
    const loader = new Thress.TextureLoader();
    const geometry = new Thress.SphereGeometry(5000, 32, 32);
    const material = new Thress.MeshBasicMaterial({
      side: Thress.DoubleSide,
      map: loader.load(this.url)
    });

    const shpere = new Thress.Mesh(geometry, material);
    shpere.position.copy({
      x: 0,
      y: 0,
      z: 0,
    })
    this.scene.add(shpere);
  }
} 