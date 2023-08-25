import * as Three from 'three';

export default class Ball {
  constructor(scene, time) {
    this.scene = scene;
    this.time = time;

    this.createSphere();
  }
  createSphere(options) {
    const geometry = new Three.SphereGeometry(
      50,
      32,
      32,
      Math.PI / 2,
      Math.PI * 2,
      0,
      Math.PI / 2
    )
    // geometry.translate(0, options.height / 2, 0);
    const material = new Three.ShaderMaterial({
      uniforms: {
        u_color: {
          value: new Three.Color(options.color)
        },
        u_height: {
          value: options.height
        },
        u_opacity: {
          value: options.opacity
        },
        u_time: this.time,
        u_speed: {
          value: options.speed,
        }
      },
      vertexShader: `
        uniform float u_time;
        uniform float u_speed;
        uniform float u_height;
        varying vec3 v_position;
        varying float v_opacity;
        void main() {
          v_position = position * mod(u_time / u_speed, 1.0);
          v_opacity = mix(1.0, 0.0, position.y / u_height);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(v_position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 u_color;
        uniform float u_opacity;
        varying float v_opacity;
        void main() {
          gl_FragColor = vec4(u_color, u_opacity * v_opacity);
        }
      `,
      transparent: true,
      side: Three.DoubleSide, // 解决只显示一半
      depthTest: false, // 解决被建筑物挡住
    });
    const mesh = new Three.Mesh(geometry, material);
    mesh.position.copy(options.position);
    // mesh.position.set(0, 0, 0);
    this.scene.add(mesh);
  }
}