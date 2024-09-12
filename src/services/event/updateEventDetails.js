const { uploadImageToCloudinary } = require("../../utils/imageUploadCloudinary");

const updateEventDetails = async (existingEvent, req ,res) => {
    const { title, description, date, location, capacity, category, price,status } = req.body;
    const image = req.file;
    
    let updatedImageUrl = existingEvent.image;
    if (image) {
        const cloudinaryResult = await uploadImageToCloudinary(image);
        updatedImageUrl = cloudinaryResult.secure_url;
    }
    console.log(typeof parseFloat(price));

    existingEvent.title = title || existingEvent.title;
    existingEvent.description = description || existingEvent.description;
    existingEvent.date = date || existingEvent.date;
    existingEvent.location = location || existingEvent.location;
    existingEvent.capacity = capacity || existingEvent.capacity;
    existingEvent.category = category || existingEvent.category;
    existingEvent.price = parseFloat(price) || existingEvent.price;
    existingEvent.image = updatedImageUrl;
    existingEvent.status = status;

    await existingEvent.save();
    res.status(200).json({ message: 'Event updated successfully', event: existingEvent });

};

module.exports = updateEventDetails;