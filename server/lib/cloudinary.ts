import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "djglqe9it",
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export { cloudinary };
