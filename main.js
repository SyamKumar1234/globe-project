import "./style.css";
import gsap from "gsap";
import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import atmosphereVertexShader from "./shaders/atmosphereVertex.glsl";
import atmosphereFragmentShader from "./shaders/atmosphereFragment.glsl";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  antialias: true, //create a smooth effect
});

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); //help to make the texture more resolution
document.body.appendChild(renderer.domElement);

//create sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50), //(radius, width segments, height segments)
  // new THREE.MeshBasicMaterial(
  //   // {color:0xff0000}
  //   {map : new THREE.TextureLoader().load('./assets/earth3.jpg')}
  //   ))
  new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      globeTexture: {
        value: new THREE.TextureLoader().load("./assets/earth9.jpg"),
      },
    },
  })
);
scene.add(sphere);

//create atmosphere
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5.2, 50, 50), //(radius, width segments, height segments)

  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  })
);
atmosphere.scale.set(1.1, 1.1, 1.1);
scene.add(atmosphere);

const group = new THREE.Group();
group.add(sphere);
scene.add(group);

const starGeometry = new THREE.BufferGeometry();
const starMeterial = new THREE.PointsMaterial({
  color: 0xffffff,
});
const starVertices = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = -Math.random() * 5000;
  starVertices.push(x, y, z);
}
starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starVertices, 3)
);
const stars = new THREE.Points(starGeometry, starMeterial);
scene.add(stars);
camera.position.setZ(15); //if camera is not set, then we wont be able to see the globe..because the camera will be in the center which means inside the cube..and inside the cube there is no color applied because we used mesh basic meterial.

const mouse = {
  x: undefined,
  y: undefined,
};
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  sphere.rotation.y += 0.002;
  group.rotation.y = mouse.x * 0.3;
  gsap.to(group.rotation, {
    x: -mouse.y * 0.3,
    y: mouse.x * 0.5,
    duration: 2,
  });
}
animate();

addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
  console.log(mouse);
});
