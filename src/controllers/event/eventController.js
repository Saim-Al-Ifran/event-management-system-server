const CustomError = require("../../errors/CustomError");
const Event = require("../../models/Event");
const fetchEvents = require("../../services/event/fetchEvents");
const updateEventDetails = require("../../services/event/updateEventDetails");
const { uploadImageToCloudinary } = require("../../utils/imageUploadCloudinary");
const paginate = require('../../utils/paginate') 
const deleteEventById = require("../../services/event/deleteEvent");

const getEvents = async(req,res,next)=>{
        try {
               let {page,limit} = req.pagination;
               const { search } = req.query;
               const query = search
               ? { title: { $regex: search, $options: 'i' } }  
               : {};
               const events = await paginate(Event,query,page,limit);
               if(events.length === 0){
                  return next(new CustomError('No events found!!',404));
               }
               res.status(200).json({events});
        } catch (err) {
                next(new CustomError(err.message,500));   
        }
}
const getUserEvents = async(req,res,next)=>{
        const userId = req.user.id;
        await fetchEvents({author:userId},res,next);
}

const createEvent = async (req, res, next) => {
    try {
      
        const { title, description, date, location, capacity, category,price } = req.body;
         
        const cloudinaryResult = await uploadImageToCloudinary(req.file);
        
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            capacity,
            image: cloudinaryResult.secure_url,
            category,
            price,
            status:'active',
            author:req.user.id
        });

        if(req.user.role === 'user'){
              newEvent.status = 'pending';
        }

 
        const savedEvent = await newEvent.save();

        res.status(201).json({ message: 'Event created successfully', event: savedEvent });
    } catch (err) {
        next(new CustomError(err.message,500));
 
    }
};

const updateEvent = async (req, res, next) => {
    try {
        const { eventId } = req.params;

        const existingEvent = await Event.findById(eventId);
        if (!existingEvent) {
            return next(new CustomError('Event not found', 404));
        }

        await updateEventDetails(existingEvent, req ,res);

    } catch (err) {
        next(new CustomError(err.message, 500));
    }
};


const updateUserEvent = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const existingEvent = await Event.findById(eventId);
        if (!existingEvent) {
            return next(new CustomError('Event not found', 404));
        }

        if (existingEvent.author != req.user.id) {
            return next(new CustomError('Unauthorized access', 403));
        }

        await updateEventDetails(existingEvent, req , res);

    } catch (err) {
        next(new CustomError(err.message, 500));
    }
};


const deleteEvent = async (req, res, next) => {
    const { eventId } = req.params;
    await deleteEventById(eventId, null, res, next);
};

const userDeleteEvent = async (req, res, next) => {
    const { eventId } = req.params;
    await deleteEventById(eventId, req.user.id, res, next);
};
 

const duplicateEvent = async (req, res, next) => {
    try {
      
        const { eventId } = req.params;
        const originalEvent = await Event.findById(eventId);

        if (!originalEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
       
        const duplicatedEvent = new Event({
            title: originalEvent.title + ' (Copy)',  
            description: originalEvent.description,
            date: originalEvent.date,
            location: originalEvent.location,
            capacity: originalEvent.capacity,
            image: originalEvent.image,  
            category: originalEvent.category,
            price: originalEvent.price,
          
        });
  
        const savedDuplicatedEvent = await duplicatedEvent.save();
        res.status(201).json({ message: 'Event duplicated successfully', event: savedDuplicatedEvent });

    } catch (err) {
        next(new CustomError(err.message,500));
    }
};

const sortEvents = async (req, res, next) => {
    try {
        
        const { sortOrder } = req.query;
      
        const allowedSortOrders = ['asc', 'desc'];
        if (!allowedSortOrders.includes(sortOrder)) {
            return res.status(400).json({ message: 'Invalid sorting order' });
        }
        const events = await Event.find().sort({ date: sortOrder });      
        res.status(200).json({ events });

    } catch (err) {
        next(new CustomError(err.message, 500));
    }
};

const approveEvent = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if(event.status === 'active'){
            return next(new CustomError('This event is already activated',403));
        }
        event.status = 'active';
        await event.save();

        res.status(200).json({ message: 'Event approved successfully', event });
    } catch (err) {
        next(err);
    }
};


module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    duplicateEvent,
    sortEvents,
    deleteEvent,
    getUserEvents,
    updateUserEvent,
    userDeleteEvent,
    approveEvent
};
