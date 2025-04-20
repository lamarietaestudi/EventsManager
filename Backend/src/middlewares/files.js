const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const uploadCloudinary = () => {
  try {
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'EventsManager/posters/',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'avif'],
        resource_type: 'image'
      }
    });
    return storage;
  } catch (error) {
    throw new Error('Upload Error: ', error.message);
  }
};

const upload = multer({ storage: uploadCloudinary() });

module.exports = upload;
