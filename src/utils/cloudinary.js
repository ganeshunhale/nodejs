import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
cloudinary.config({
    env_variable: process.env.CLOUDINARY_URL,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadCloudinary = async (localFilePath,fileName) => {
    try {
        cloudinary.config({
            // env_variable: process.env.CLOUDINARY_URL,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
        });
        if (!fs.existsSync(localFilePath)) {
            throw new Error(`File not found: ${localFilePath}`);
          }
        const result = await cloudinary.uploader.upload(localFilePath,  {
            public_id:fileName,
            resource_type:"auto",
            
        });
        console.log("file is uploaded successfully",result);
        fs.unlinkSync(localFilePath);
        return result;

    } catch (error) {
        console.log("error", error);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
          }
          throw error;
    }
}


export { uploadCloudinary }