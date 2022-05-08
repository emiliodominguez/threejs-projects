import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import Ring from "./ring";

//#region GUI
const gui = new dat.GUI();
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

//#region Camera
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 2000);
camera.position.set(0, 0, 25);
//#endregion

//#region Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
gui.add(controls, "enabled").name("Orbit controls").setValue(false).onChange(controls.reset);
//#endregion

//#region Scene
const scene = new THREE.Scene();
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
function setRings({ amount, innerSpace }: typeof ringsConfiguration): THREE.Mesh[] {
	const newRings = [];

	for (let size = innerSpace; size <= amount + innerSpace; size++) {
		newRings.push(new Ring({ size: size + 1 }).mesh);
	}

	newRings.forEach(ring => scene.add(ring));
	return newRings;
}

function handleConfigurationChange(configuration: Partial<typeof ringsConfiguration>): void {
	scene.remove.apply(scene, scene.children);
	rings.length = 0;
	setRings({ ...ringsConfiguration, ...configuration }).forEach(ring => rings.push(ring));
}

const ringsConfiguration = { amount: 10, innerSpace: 3 };
const rings = setRings(ringsConfiguration);

//#region Debug
gui.add(ringsConfiguration, "amount")
	.name("Rings amount")
	.min(0)
	.max(25)
	.step(1)
	.onChange(amount => handleConfigurationChange({ ...ringsConfiguration, amount }));

gui.add(ringsConfiguration, "innerSpace")
	.name("Inner space")
	.min(0)
	.max(10)
	.step(1)
	.onChange(innerSpace => handleConfigurationChange({ ...ringsConfiguration, innerSpace }));
//#endregion

//#endregion

(function init() {
	rings.forEach((ring, i) => {
		ring.rotation.x = ring.rotation.x * 0.95 + mousePosition.y * 0.025 * (i + 0.05);
		ring.rotation.y = ring.rotation.y * 0.95 + mousePosition.x * 0.025 * (i + 0.05);
	});

	controls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(init);
})();
