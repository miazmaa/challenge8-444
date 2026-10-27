import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

// ----------------------------------------------------
// Scene
// ----------------------------------------------------
const scene = new THREE.Scene();
const backgroundTexture = new THREE.TextureLoader().load('./zavelstein_4k.webp');
backgroundTexture.mapping = THREE.EquirectangularReflectionMapping;
scene.background = backgroundTexture;

// ----------------------------------------------------
// Camera
// ----------------------------------------------------
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(20, 15, 20);

// ----------------------------------------------------
// Renderer
// ----------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

// ----------------------------------------------------
// Orbit Controls
// Allows Zoom, Pan, Orbit (Tilt/Rotate)
// ----------------------------------------------------
const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

// ----------------------------------------------------
// Ground Plane
// ----------------------------------------------------
const groundGeometry = new THREE.PlaneGeometry(100, 100);

const groundTexture = new RGBELoader().load('./felsenlabyrinth_1k.hdr');
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: groundTexture
});
groundTexture.repeat.set(0.25, 0.25);
groundTexture.offset.set(0.15, 0.1);
const ground = new THREE.Mesh(
    groundGeometry,
    groundMaterial
);

ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;

scene.add(ground);

// ----------------------------------------------------
// Example Cube
// ----------------------------------------------------
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);

const cubeTexture = new THREE.TextureLoader().load('./eucalyptus_bark_diff_1k.jpg');
const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: cubeTexture
});

const cube = new THREE.Mesh(
    cubeGeometry,
    cubeMaterial
);

cube.position.y = 2;
cube.castShadow = true;

scene.add(cube);

// ----------------------------------------------------
// Ambient Light
// ----------------------------------------------------
const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1
);

scene.add(ambientLight);

// ----------------------------------------------------
// Directional Light
// ----------------------------------------------------
const directionalLight = new THREE.DirectionalLight(
    0xffffff,
    2
);

directionalLight.position.set(20, 30, 10);
directionalLight.castShadow = true;

scene.add(directionalLight);

// ----------------------------------------------------
// Toggle Lights
// ----------------------------------------------------
let lightsOn = true;

document
    .getElementById("toggleButton")
    .addEventListener("click", () => {

        lightsOn = !lightsOn;

        ambientLight.visible = lightsOn;
        directionalLight.visible = lightsOn;
    });

// ----------------------------------------------------
// Window Resize
// ----------------------------------------------------
window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});

// ----------------------------------------------------
// Animation Loop
// ----------------------------------------------------
function animate() {

    requestAnimationFrame(animate);

    cube.rotation.y += 0.01;

    controls.update();

    renderer.render(scene, camera);
}

animate();