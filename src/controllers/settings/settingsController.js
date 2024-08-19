 

const CustomError = require('../../errors/CustomError');
const Setting = require('../../models/Setting');
const { uploadImageToCloudinary } = require('../../utils/imageUploadCloudinary');

 
const getSettings = async (_req, res,next) => {
    try {
        const settings = await Setting.findOne();
        if(!settings){
            return next(new CustomError('No settings data found',404));
        }
        res.status(200).json(settings);
    } catch (error) {
        next(new CustomError(error.message,500));
    }
};

const createOrUpdateSettings = async (req, res, next) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) {
            settings = new Setting(req.body);
        } else {
            settings.set(req.body);
        }

 
        if (req.file) {
            const cloudinaryResult = await uploadImageToCloudinary(req.file);
            settings.siteLogo = cloudinaryResult.secure_url;  
        }

        const savedSettings = await settings.save();
        res.status(201).json(savedSettings);
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};

module.exports = {
    getSettings,
    createOrUpdateSettings
};
