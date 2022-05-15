import { ImageData, Pixel } from "./models";

export async function getImageData(src: string, scale: number = 0.5): Promise<ImageData> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		const pixels: Pixel[] = [];

		Object.assign(image, {
			src,
			crossOrigin: "Anonymous",
			onload: () => {
				const canvas = document.createElement("canvas");
				const context = canvas.getContext("2d") as CanvasRenderingContext2D;

				canvas.width = image.width * scale;
				canvas.height = image.height * scale;

				context.scale(1, -1);
				context.drawImage(image, 0, 0, canvas.width, canvas.height * -1);

				const { data } = context.getImageData(0, 0, canvas.width, canvas.height);

				for (let i = 0; i < data.length; i += 4) {
					pixels.push({
						r: data[i],
						g: data[i + 1],
						b: data[i + 2],
						position: {
							x: (i / 4) % canvas.width,
							y: Math.floor(i / 4 / canvas.height)
						}
					});
				}

				resolve({
					width: canvas.width,
					height: canvas.height,
					aspectRatio: canvas.width / canvas.height,
					pixels
				});
			},
			onerror: reject
		});
	});
}

export function rgbToHex(r: number, g: number, b: number): string {
	if (r > 255 || g > 255 || b > 255) throw new Error("Invalid color...");

	return (
		"#" +
		[r, g, b]
			.map(x => {
				const hex = x.toString(16);
				return hex.length === 1 ? "0" + hex : hex;
			})
			.join("")
	);
}
