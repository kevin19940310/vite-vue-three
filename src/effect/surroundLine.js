/**
 * 创建建筑物
*/
import * as Three from 'three';

import { color } from '../config/index';

export default class SurroundLine {
  constructor(scene, child, height, time) {
    this.height = height;  // 当前扫描高度
    this.time = time;
    this.scene = scene;
    this.child = child;

    // 模型颜色
    this.meshColor = color.mesh;
    // 头部颜色
    this.headerColor = color.head;

    this.createMesh();
    // 创建外围线条
    this.createLine();
  }
  computedMesh() {
    this.child.geometry.computeBoundingBox();
    this.child.geometry.computeBoundingSphere();
  }
  createMesh() {
    this.computedMesh();
    // 获取模型最小和最大高度
    const { max, min } = this.child.geometry.boundingBox;
    const size = max.z - min.z;

    const material = new Three.ShaderMaterial({
      uniforms: {
        // 当前扫描高度
        u_height: this.height,
        // 当前扫描颜色
        u_up_color: {
          value: new Three.Color(color.risingColor)
        },
        // 建筑物颜色
        v_city_color: {
          value: new Three.Color(this.meshColor)
        },
        // 建筑物顶部颜色
        u_head_color: {
          value: new Three.Color(this.headerColor)
        },
        // 高度差
        u_size: {
          value: size
        }
      },
      vertexShader: `
        varying vec3 v_position;
        void main() {
          v_position = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 v_position;

        uniform vec3 v_city_color;
        uniform vec3 u_head_color;
        uniform float u_size;

        uniform vec3 u_up_color;
        uniform float u_height;

        void main(){
          vec3 base_color = v_city_color;
          base_color = mix(base_color,u_head_color, v_position.z/ u_size);

          // 上升线条的高度是多少
          if(u_height > v_position.z && u_height < v_position.z + 6.0) {
            float f_index = (u_height - v_position.z) /3.0;
            base_color = mix(u_up_color, base_color, abs(f_index - 1.0));
          }

          gl_FragColor = vec4(base_color,1.0);
        }
      `
    });
    const mesh = new Three.Mesh(this.child.geometry, material);

    mesh.position.copy(this.child.position)
    mesh.rotation.copy(this.child.rotation)
    mesh.scale.copy(this.child.scale)
    this.scene.add(mesh);
  }
  createLine() {
    // 获取模型的外围
    const geometry = new Three.EdgesGeometry(this.child.geometry);
    // const material = new Three.LineBasicMaterial({
    //   color: color.soundLine
    // });
    const { max, min } = this.child.geometry.boundingBox;

    const material = new Three.ShaderMaterial({
      uniforms: {
        // 扫光颜色
        live_color: {
          value: new Three.Color(color.live_color)
        },
        u_time: this.time,
        u_max: {
          value: max
        },
        u_min: {
          value: min
        },
        line_color: {
          value: new Three.Color(color.soundLine)
        }
      },
      vertexShader: `
        uniform float u_time;
        uniform vec3 live_color;
        uniform vec3 line_color;
        uniform vec3 u_max;
        uniform vec3 u_min;
        varying vec3 v_color;
        void main() {
          float new_time = mod(u_time * 0.1, 1.0);
          float rangeY = mix(u_min.y, u_max.y, new_time);
          if(rangeY < position.y && rangeY > position.y - 200.0) {
            float f_index = 1.0 - sin((position.y - rangeY) / 200.0 * 3.14);
            float r = mix(live_color.r, line_color.r, f_index);
            float g = mix(live_color.g, line_color.g, f_index);
            float b = mix(live_color.b, line_color.b, f_index);
            v_color = vec3(r,g,b);
          } else {
            v_color = line_color;
          }
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
      uniform vec3 line_color;
      varying vec3 v_color;
        void main() {
          gl_FragColor = vec4(v_color,1.0);
        }
      `,
    })

    // 创建线条
    const line = new Three.LineSegments(geometry, material);
    // 继承模型的偏移量和旋转
    line.scale.copy(this.child.scale);
    line.rotation.copy(this.child.rotation);
    line.position.copy(this.child.position);
    this.scene.add(line);
  }
}