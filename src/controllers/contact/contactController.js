const CustomError = require("../../errors/CustomError")
const Contact = require('../../models/Contact');

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
     sendMessageController
}