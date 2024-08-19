const User = require('../models/User'); 

const findUserAndCheckImage = async (userId) => {
    const user = await User.findById(userId);
    if (!user || !user.image) {
        throw new Error('User or image not found');
    }
    return user;
};

module.exports = {
    findUserAndCheckImage,
};
