import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import Ring from "./ring";
import ClockLine from "./clock-line";

//#region GUI
const gui = new dat.GUI();
//#endregion

//#region Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(innerWidth, innerHeight);
// renderer.setClearColor("#fff");
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);
//#endregion

//#region Camera
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 2000);
camera.position.set(0, 0, 15);
//#endregion

//#region Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
gui.add(controls, "enabled").name("Orbit controls").setValue(true).onChange(controls.reset);
//#endregion

//#region Scene
const scene = new THREE.Scene();
//#endregion

//#region Lights
const lightOne = new THREE.SpotLight(new THREE.Color("#0ff"), 1);
lightOne.position.z = 30;

const lightTwo = new THREE.SpotLight(new THREE.Color("#009795"), 1);
lightTwo.position.set(0, 2, 20);

[lightOne, lightTwo].map((light, i) => {
	light.castShadow = true;
	light.shadow.mapSize.width = 512;
	light.shadow.mapSize.height = 512;
	gui.addColor(light, "color").name(`Light ${i + 1} color`);
	scene.add(light);
});

//#endregion

//#region Resize handler
window.addEventListener("resize", () => {
	camera.aspect = innerWidth / innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(innerWidth, innerHeight);
});
//#endregion

//#region Mouse positioning
const mousePosition = new THREE.Vector2(0, 0);

function updateMousePosition(e: PointerEvent): void {
	const x = e.clientX - innerWidth * 0.5;
	const y = e.clientY - innerHeight * 0.5;

	mousePosition.x = x * 0.001;
	mousePosition.y = y * 0.001;
}

window.addEventListener("pointermove", updateMousePosition);
//#endregion

//#region Rings
const ringsConfiguration = { amount: 4, innerSpace: 3 };
const ringsThickness = 0.75;

function setRings({ amount, innerSpace }: typeof ringsConfiguration): THREE.Mesh[] {
	const newRings = [];

	for (let size = innerSpace; size <= amount + innerSpace; size++) {
		newRings.push(new Ring({ size: size + 1, thickness: ringsThickness, color: "#eee" }).mesh);
	}

	newRings.forEach(ring => scene.add(ring));
	return newRings;
}

const rings = setRings(ringsConfiguration);
//#endregion

//#region Clock hands
const hoursHand = new ClockLine({ width: 0.075, height: 1, depth: 0.1 }).mesh;
const minutesHand = new ClockLine({ width: 0.075, height: 1.75, depth: 0.1 }).mesh;
const secondsHand = new ClockLine({ width: 0.025, height: 1.5, depth: 0.1 }).mesh;

const clockCenter = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshStandardMaterial({ metalness: 1, roughness: 1 }));
clockCenter.position.z = 0.15;

scene.add(hoursHand, minutesHand, secondsHand, clockCenter);
//#endregion

//#region Initialization
function init() {
	// Rings animation
	// ------------------------------
	rings.forEach((ring, i) => {
		ring.rotation.x = ring.rotation.x * 0.95 + mousePosition.y * 0.025 * (i + 0.05);
		ring.rotation.y = ring.rotation.y * 0.95 + mousePosition.x * 0.025 * (i + 0.05);
	});

	// Clock hands rotation
	// ------------------------------
	const date = new Date();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();
	const milliseconds = date.getMilliseconds();
	const smoothSeconds = seconds + milliseconds / 1000;

	hoursHand.rotation.z = -THREE.MathUtils.degToRad(0.5 * (60 * hours + minutes));
	minutesHand.rotation.z = -THREE.MathUtils.degToRad(6 * minutes);
	secondsHand.rotation.z = -THREE.MathUtils.degToRad(6 * smoothSeconds);

	// Renderer & controls
	// ------------------------------
	controls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(init);
}

init();
//#endregion
