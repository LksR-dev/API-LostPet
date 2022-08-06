import { cloudinary } from "../lib/cloudinary";

export async function uploadCloudinaryImg(img: string): Promise<any> {
  const urlImg = await cloudinary.uploader.upload(img, {
    resource_type: "image",
  });

  return urlImg;
}
