import * as THREE from "three";

interface ClockLineOptions {
	width: number;
	height: number;
	depth: number;
	color?: string;
	wireframe?: boolean;
}

export default class ClockLine {
	private _mesh: THREE.Mesh;

	get mesh(): THREE.Mesh {
		return this._mesh;
	}

	constructor(options: ClockLineOptions) {
		const shape = new THREE.Shape();

		shape.moveTo(0, 0);
		shape.lineTo(0, 1);
		shape.lineTo(1, 1);
		shape.lineTo(1, 0);
		shape.lineTo(0, 0);

		const geometry = new THREE.ExtrudeBufferGeometry(shape);
		const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, metalness: 1, roughness: 1, wireframe: options.wireframe ?? false });
		const mesh = new THREE.Mesh(geometry, material);
		mesh.scale.set(options.width, options.height, options.depth);
		mesh.position.z = options.depth;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		this._mesh = mesh;
	}
}
