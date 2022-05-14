import * as THREE from "three";

interface RingOptions {
	size?: number;
	thickness?: number;
	depth?: number;
	color?: string;
	wireframe?: boolean;
}

export default class Ring {
	private _mesh: THREE.Mesh;

	get mesh(): THREE.Mesh {
		return this._mesh;
	}

	constructor(options: RingOptions) {
		const size = options.size ?? 2;
		const thickness = options.thickness ?? 0.75;
		const depth = options.depth ?? 0.5;
		const extrudeOptions = { depth, bevelEnabled: false, curveSegments: 500 };

		const arc = new THREE.Shape();
		arc.absarc(0, 0, size, 0, Math.PI * 2, false);

		const hole = new THREE.Path();
		hole.absarc(0, 0, size - thickness, 0, Math.PI * 2, true);
		arc.holes.push(hole);

		const geometry = new THREE.ExtrudeGeometry(arc, extrudeOptions);
		const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, metalness: 1, roughness: 0.2, wireframe: options.wireframe ?? false });
		const mesh = new THREE.Mesh(geometry, material);
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		this._mesh = mesh;
	}
}
