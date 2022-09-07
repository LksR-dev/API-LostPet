import { Dropzone } from 'dropzone';

// la url la exige la librería
export async function dropzoneUpload(uploadImg: Element, upploadBtn: Element): Promise<Dropzone> {
	return new Dropzone(upploadBtn, {
		url: '/falsa',
		autoProcessQueue: false,
		clickable: true,
		maxFiles: 1,
		clickeableElements: uploadImg,
		thumbnailWidth: 335,
		thumbnailHeight: 180,
	});
}

// myDropzone.on("thumbnail", function (file) {
//   // usando este evento pueden acceder al dataURL directamente
//   console.log(file.dataURL);
// });
