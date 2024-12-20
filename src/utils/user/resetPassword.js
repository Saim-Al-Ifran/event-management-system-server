const CustomError = require("../../errors/CustomError");
const User = require("../../models/User");
const bcrypt = require('bcrypt');

const resetPassword = async (req, res, next, userType) => {
    try {
        const userEmail = req.user.email;
        const { oldPassword, newPassword } = req.body;

        const user = await User.findOne({email: userEmail});

        if (!user) {
            return next(new CustomError(`${userType} not found`, 404));
        }

        const isMatched = await bcrypt.compare(oldPassword, user.password);

        if (!isMatched) {
            return next(new CustomError('The current password you entered is incorrect', 401));
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        next(new CustomError(err.message, 500));
    }
};

module.exports = resetPassword;