import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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
scene.fog = new THREE.Fog(0x666666, 0.1, 750);
//#endregion

//#region Camera
const camera = new THREE.PerspectiveCamera(100, innerWidth / innerHeight, 1, 2000);
camera.position.setZ(350);
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
const smokeAmount = 500;
const smokeTexture = textureLoader.load("smoke/smoke.png");
const smokeMaterial = new THREE.MeshPhongMaterial({ map: smokeTexture, alphaTest: 0.005, opacity: 0.2, transparent: true });

smokeTexture.encoding = THREE.sRGBEncoding;

for (let i = 0; i < smokeAmount; i++) {
	const matrix = new THREE.Matrix4();
	const quaternion = new THREE.Quaternion();
	const geometry = new THREE.PlaneBufferGeometry(500, 500);

	const position = new THREE.Vector3();
	position.set(Math.random() * 2000 - 1000, Math.random() * 2000 - 1000, 0);

	const rotation = new THREE.Euler();
	rotation.set(0, 0, Math.random() * 360);

	const scale = new THREE.Vector3();
	const randomScale = Math.random() * 1.5;
	scale.set(randomScale, randomScale, 0);

	quaternion.setFromEuler(rotation);
	matrix.compose(position, quaternion, scale);
	geometry.applyMatrix4(matrix);

	const mesh = new THREE.Mesh(geometry, smokeMaterial);
	scene.add(mesh);
}

// const smokeMesh = new THREE.Mesh(mergeBufferGeometries(smokePlanes), smokeMaterial);
// smokeMesh.geometry.center();
// scene.add(smokeMesh);
//#endregion

(function init() {
	controls.update();
	renderer.render(scene, camera);

	const delta = clock.getDelta();

	scene.children.forEach(child => {
		child.rotation.z += delta * 0.05;
	});

	requestAnimationFrame(init);
})();
