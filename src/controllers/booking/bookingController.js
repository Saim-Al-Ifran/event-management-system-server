const Booking = require('../../models/Booking');
const Event = require('../../models/Event');
const CustomError = require('../../errors/CustomError');
 
const getAllBookings = async (req, res, next) => {
    try {
        let { page = 1, limit = 10 } = req.pagination;
        const { search } = req.query;

        page = parseInt(page, 10);
        limit = parseInt(limit, 10);

        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            return next(new CustomError('Invalid pagination values', 400));
        }

        let searchFilter = {};
        if (search) {
            searchFilter = {
                'event.title': { $regex: search, $options: 'i' }  
            };
        }

        const skip = (page - 1) * limit;
        const bookings = await Booking.aggregate([
            {
                $lookup: {
                    from: "events",
                    localField: "eventId",
                    foreignField: "_id",
                    as: "event"
                }
            },
            { 
                $unwind: "$event"
            },
            {
                $match: searchFilter
            },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                    ],
                    totalRecords: [
                        { $count: "count" }
                    ]
                }
            }
        ]);

        const totalRecords = bookings[0].totalRecords.length > 0 ? bookings[0].totalRecords[0].count : 0;
        const totalPages = Math.ceil(totalRecords / limit);
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;

        if (bookings[0].data.length === 0) {
            return next(new CustomError('No booking found!', 404));
        }

        res.status(200).json({
            data: bookings[0].data,
            totalRecords,
            totalPages,
            prevPage,
            nextPage,
            page
        });
    } catch (err) {
        next(new CustomError(err.message, 500));
    }
};



const getBookingsForUser = async (req, res, next) => {
    
    try {
        const userId = req.user.id;
        const bookings = await Booking.find({ attendeId: userId })
                                      .populate('eventId');

        if (!bookings) {
            return res.status(404).json({ message: "No bookings found!!" });
        }

        res.status(200).json({ bookings: bookings });

    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};


const bookEvent = async (req, res, next) => {

    try {
         
        const {eventId} = req.params;
        const { ticketQuantity } = req.body;

        const event = await Event.findById(eventId);
        if (!event) {
            return next(new CustomError('Event not found', 404));
        }
        if(event.author === req.user.id){
            return next(new CustomError("You cannot book your own event.",403));
        }
        if(event.status === 'pending'){
               return next(new CustomError("This event hasn't been published",403));
        }


        if(ticketQuantity > 5){
            return next(new CustomError("cann't book more then 5 tickets"));
        }
        
        if(event.capacity < ticketQuantity){
              return next(new CustomError("Not enough capacity for booking", 403));
        }

        const existingEvent = await Booking.findOne({eventId:eventId,attendeId:req.user.id});
        if(existingEvent){
               return next(new CustomError('You have already booked this event',403));
        }
  
         

        const booking = new Booking({
            eventId: eventId,
            attendeId: req.user.id, 
            ticketQuantity: ticketQuantity
        });

        event.capacity -= ticketQuantity;
        await event.save();
      
        await booking.save();
        res.status(201).json({ message: 'Event booked successfully', booking: booking });

    } catch (error) {
        
        next(new CustomError(error.message, 500));
    }

};


const requestBookingCancellation = async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user.id;

        const booking = await Booking.findOne({ _id: bookingId, attendeId: userId });
        if (!booking) {
            return next(new CustomError('Booking not found', 404));
        }
     
        booking.requestToDelete = true;
        await booking.save();

        res.status(200).json({ message: 'Cancellation request sent successfully' });
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};


const deleteBookings = async(req,res,next)=>{
       try {
             const {bookingId} = req.params;
             const booking = await Booking.findById(bookingId);
             
             if(!booking){
                  next(new CustomError('no booking data found!!',404));
             }
             if(booking.requestToDelete === true){
                    const event = await Event.findById(booking.eventId);
                    
                    if (!event) {
                        return next(new CustomError('Associated event not found', 404));
                    }

                    event.capacity += booking.ticketQuantity;
                    await Booking.deleteOne({_id:bookingId});
                    await event.save();

                    res.status(200).json({message:'Booking data deleted succesfully'});

             }else{
                    next(new CustomError('Booking cannot be deleted',403))
             }
       }catch(err){
              next(new CustomError(err.message,500));
       }
}

module.exports = {
    getAllBookings,
    getBookingsForUser, 
    bookEvent,
    requestBookingCancellation,
    deleteBookings
 };
