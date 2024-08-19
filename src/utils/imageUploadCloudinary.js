const {Buffer} = require('buffer');
const cloudinary = require('../config/cloudinary');

const uploadImageToCloudinary = async (file) => {
            if (!file) {
                const error = new Error('No file uploaded');
                error.statusCode = 403;
                throw error;
            }

           
            const publicIdWithoutExtension = file.originalname.replace(/\.[^/.]+$/, '');

            const b64 = Buffer.from(file.buffer).toString('base64');
            const dataURI = 'data:' + file.mimetype + ';base64,' + b64;

            return await cloudinary.uploader.upload(dataURI, {
                folder: 'event_management/uploads',
                public_id: publicIdWithoutExtension,
            });
};


module.exports = {
    uploadImageToCloudinary
};
 