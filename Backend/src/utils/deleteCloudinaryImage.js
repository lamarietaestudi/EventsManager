const cloudinary = require('cloudinary').v2;

const deleteCloudinaryImage = async (urlImage) => {
  try {
    const filePath = urlImage.split('/').slice(-3).join('/').split('.')[0];
    const result = await cloudinary.uploader.destroy(filePath);
    return result;
  } catch (error) {
    console.error('Error al eliminar imagen de Cloudinary:', error);
    throw error;
  }
};

module.exports = { deleteCloudinaryImage };
