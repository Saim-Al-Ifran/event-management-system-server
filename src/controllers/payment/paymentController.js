 
const Booking = require('../../models/Booking');
const { stripeSecretKey } = require('../../secret');
const stripe = require('stripe')(stripeSecretKey);


const createPaymentIntent = async (req, res, next) => {
    try {
 
        const { price } = req.body; 
        if (!price || isNaN(price)) {
            return res.status(400).send({ error: 'Invalid price' });
        }

        const amount = parseInt(price * 100);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: ['card'],
        });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret, 
        });
    } catch (err) {
        console.error('Error creating payment intent:', err);
        res.status(500).send({ error: 'Failed to create payment intent' });
    }
};

const confirmPayment = async(req,res,next) =>{
    const payment = req.body;
    try {
        const successPayment = new Booking(payment);
        await successPayment.save();

        res.status(201).json({ message: 'Payment successful', successPayment });
    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createPaymentIntent,
    confirmPayment
 
};
