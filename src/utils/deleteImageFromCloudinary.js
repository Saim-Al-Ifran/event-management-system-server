const cloudinary = require('../config/cloudinary');

const deleteImageFromCloudinary = async (cloudinaryURL) => {
  try {

      const regex = /\/v\d+\/([^\/]+\/[^\.]+)\./;
      const match = cloudinaryURL.match(regex);

      if (match && match[1]) {
          const publicId = match[1];
          const result = await cloudinary.uploader.destroy(publicId);
          return result;
      } else {
          console.log('Unable to extract the desired part');
          throw new Error('Invalid Cloudinary URL format');
      }
  } catch (error) {
      console.error('Cloudinary deletion error:', error);

      if (error.message.includes('Unexpected token < in JSON')) {
          // Handle non-JSON response (HTML error page)
          throw new Error(`Failed to delete resource from Cloudinary. Non-JSON response received.`);
      } else {
          throw new Error(`Failed to delete resource from Cloudinary: ${error.message}`);
      }
  }

};


module.exports = {
     deleteImageFromCloudinary
}