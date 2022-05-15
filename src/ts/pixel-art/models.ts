export interface Pixel {
	r: number;
	g: number;
	b: number;
	position: { x: number; y: number };
}

export interface ImageData {
	width: number;
	height: number;
	aspectRatio: number;
	pixels: Pixel[];
}
