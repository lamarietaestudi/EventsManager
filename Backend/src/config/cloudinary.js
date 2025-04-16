const cloudinary = require('cloudinary').v2;

const connectCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log('Connected to Cloudinary.');
  } catch (error) {
    throw new Error('Error Cloudinary connection: ', error.message);
  }
};

module.exports = { connectCloudinary };
