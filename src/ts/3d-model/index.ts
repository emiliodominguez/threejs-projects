import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";

//#region Global variables
const mousePosition = Object.seal({ x: 0, y: 0 });
const textureLoader = new THREE.TextureLoader();
const clock = new THREE.Clock();
//#endregion

//#region GUI
const gui = new dat.GUI();
gui.width = 350;
//#endregion

//#region Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(innerWidth, innerHeight);
// renderer.setClearColor("#fff");
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);
//#endregion

//#region Scene
const scene = new THREE.Scene();
//#endregion

//#region Camera
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 1, 2000);
camera.position.set(10, 15, 25);
camera.lookAt(scene.position);
//#endregion

//#region Light
const light1 = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light1);
//#endregion

//#region Controls
const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
controls.update();
gui.add(controls, "enabled").name("Orbit controls").setValue(true).onChange(controls.reset);
//#endregion

//#region Event handlers
window.addEventListener("resize", () => {
	camera.aspect = innerWidth / innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(innerWidth, innerHeight);
});

window.addEventListener("pointermove", e => {
	e.preventDefault();

	mousePosition.x = (e.clientX / innerWidth) * 2 - 1;
	mousePosition.y = -(e.clientY / innerHeight) * 2 + 1;
});
//#endregion

//#region Main
const glftLoader = new GLTFLoader();
glftLoader.load("/3d-model/burger.glb", gltf => {
	scene.add(gltf.scene);
});
//#endregion

(function init() {
	controls.update();
	renderer.render(scene, camera);

	const delta = clock.getDelta();

	requestAnimationFrame(init);
})();
