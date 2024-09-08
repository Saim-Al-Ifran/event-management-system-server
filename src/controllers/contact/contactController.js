const CustomError = require("../../errors/CustomError")
const Contact = require('../../models/Contact');
const paginate = require("../../utils/paginate");

const getAllFeedback = async(req,res,next)=>{
    try {
       let { page, limit } = req.pagination;
       const feedback = await paginate(Contact,{},page,limit);
       if(feedback.length===0){
          return next(new CustomError('no feedback found!',404));
       }
       res.status(200).json(feedback);
    } catch (err) {
       next(new CustomError(err.message,500));
    }
}

const sendMessageController = async(req,res,next)=>{
           try{
            const { title, email, message, phoneNumber } = req.body;
            const author = req.user.id;
      
            const newContact = new Contact({
              title,
              email,
              phoneNumber,
              message,
              author
            });
      
            const savedContact = await newContact.save();
            res.status(201).json(savedContact);

           }catch(err){
               next(new CustomError(err.message,500));
    
           }
}

module.exports = {
     sendMessageController,
     getAllFeedback
}