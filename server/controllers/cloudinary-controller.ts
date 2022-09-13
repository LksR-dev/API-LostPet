import { cloudinary } from '../lib/cloudinary';

export async function uploadCloudinaryImg(img: string): Promise<any> {
	const urlImg = await cloudinary.uploader.upload(img, {
		resource_type: 'image',
		timeout: 15000,
	});

	return urlImg['secure_url'];
}
