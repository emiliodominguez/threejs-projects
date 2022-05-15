import * as THREE from "three";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { getImageData, rgbToHex } from "./helpers";
import { ImageData } from "./models";

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
const camera = new THREE.PerspectiveCamera(100, innerWidth / innerHeight, 1, 5000);
camera.position.setZ(250);
camera.lookAt(scene.position);
//#endregion

//#region Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);
//#endregion

//#region Controls
const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
controls.update();
gui.add(controls, "enabled").name("Orbit controls").setValue(true).onChange(controls.reset);
//#endregion

//#region Global variables
const mousePosition = Object.seal({ x: 0, y: 0 });
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

	// Light position
	const updatedPosition = new THREE.Vector3(mousePosition.x, mousePosition.y, 0.5);
	directionalLight.position.copy(updatedPosition);
});
//#endregion

//#region Functions
function getImagePoints(imageData: ImageData): void {
	const positions = new Float32Array(imageData.pixels.length * 3);
	const colors = new Float32Array(imageData.pixels.length * 3);
	const textureLoader = new THREE.TextureLoader();
	const geometry = new THREE.BufferGeometry();
	const material = new THREE.PointsMaterial({
		size: 2.5,
		map: textureLoader.load("pixel-art/disc.png"),
		alphaTest: 0.75,
		// blending: THREE.AdditiveBlending,
		vertexColors: true
	});

	geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
	geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

	for (let i = 0; i < imageData.pixels.length; i++) {
		const { r, g, b, position } = imageData.pixels[i];
		const step = i * 3;

		// Position
		positions[step] = position.x;
		positions[step + 1] = position.y;
		positions[step + 2] = 0;
		// positions[step + 2] = Math.random();

		// Color
		const color = new THREE.Color(rgbToHex(r, g, b));
		colors[step] = color.r;
		colors[step + 1] = color.g;
		colors[step + 2] = color.b;
	}

	const points = new THREE.Points(geometry, material);
	points.scale.setX(imageData.aspectRatio);
	scene.add(points);

	// Debug
	// gui.add(points.material, "size").name("Points size").min(0.5).max(25).step(0.1);
}

function applyVertexColors(geometry: THREE.BoxBufferGeometry, color: THREE.Color): void {
	const position = geometry.attributes.position;
	const colors = [];

	for (let i = 0; i < position.count; i++) {
		colors.push(color.r, color.g, color.b);
	}

	geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
}

function setImageCubes(imageData: ImageData): THREE.Mesh {
	const matrix = new THREE.Matrix4();
	const quaternion = new THREE.Quaternion();
	const cubes = [];

	for (let i = 0; i < imageData.pixels.length; i++) {
		const geometry = new THREE.BoxBufferGeometry(0.9, 0.9, 0.5);
		const pixel = imageData.pixels[i];

		const position = new THREE.Vector3();
		position.set(pixel.position.x, pixel.position.y, 0);

		const rotation = new THREE.Euler();
		rotation.set(0, 0, 0);

		const scale = new THREE.Vector3();
		scale.set(1, 1, 1);

		applyVertexColors(geometry, new THREE.Color(rgbToHex(pixel.r, pixel.g, pixel.b)));
		quaternion.setFromEuler(rotation);
		matrix.compose(position, quaternion, scale);
		geometry.applyMatrix4(matrix);
		cubes.push(geometry);
	}

	const mesh = new THREE.Mesh(mergeBufferGeometries(cubes), new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true, vertexColors: true }));
	mesh.scale.setX(imageData.aspectRatio);
	mesh.geometry.center();
	scene.add(mesh);

	return mesh;
}
//#endregion

(async () => {
	const imageUrl = prompt("Paste any image URL") || "https://cdn.domestika.org/c_limit,dpr_1.0,f_auto,q_auto,w_820/v1477952835/content-items/001/758/519/bow-original.jpg?1477952835";
	const imageData = await getImageData(imageUrl, 0.35);

	// getImagePoints(imageData);
	setImageCubes(imageData);

	(function init() {
		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(init);
	})();
})();
