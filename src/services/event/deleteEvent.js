const CustomError = require("../../errors/CustomError");
const Event = require("../../models/Event");
const { deleteImageFromCloudinary } = require("../../utils/deleteImageFromCloudinary");

const deleteEventById = async (eventId, userId, res, next) => {
    try {
        const existingEvent = await Event.findById(eventId);
        if (!existingEvent) {
            return next(new CustomError('Event not found', 404));
        }

        if (userId && existingEvent.author != userId) {
            return next(new CustomError('Unauthorized access', 403));
        }

        if (existingEvent.image) {
            await deleteImageFromCloudinary(existingEvent.image);
        }

        await Event.deleteOne({ _id: existingEvent._id });

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        if (err.name === 'CastError') {
            return next(new CustomError('Invalid event ID', 400));
        }
        next(new CustomError(err.message, 500));
    }
};


module.exports = deleteEventById;