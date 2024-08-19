const Event = require("../../models/Event");
 
const fetchEvents = async (query, res, next) => {
    try {
        const events = await Event.find(query);
        if (events.length === 0) {
            return next(new CustomError('No events found!', 404));
        }
        res.status(200).json({ events });
    } catch (err) {
        next(new CustomError(err.message, 500));
    }
};

module.exports = fetchEvents;