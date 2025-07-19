import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret :process.env.CLOUD_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) =>{
     try {
        if(!localFilePath) return null
        //  upload the file on the cloudinary
        const response = await  cloudinary.uploader.upload(localFilePath , {
            resource_type : "auto"
        })
        // FIle has been uploaded successfully 

        console.log("File is Uploaded on the Cloudinary", response.url);
        return response;
        
     } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temproly file as the upload operation  got failed
        return null 
     }
}