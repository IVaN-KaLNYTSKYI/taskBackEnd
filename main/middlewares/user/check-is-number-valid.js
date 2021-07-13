const { errorMess, ErrorHandler, codesEnum } = require('../../errors');
const { userService } = require('../../services');

module.exports = async (req, res, next) => {
    try {
        const { params: { userId }, body: { number } } = req;

        const user = await userService.getSingleUser({ _id: userId });

        if (!user) {
            throw new ErrorHandler(codesEnum.NOT_FOUND, errorMess.USER_NOT_FOUND.message, errorMess.USER_NOT_FOUND.code);
        }
        console.log(user.avatars.length);

        if (number >= user.avatars.length) {
            throw new ErrorHandler(codesEnum.NOT_FOUND, errorMess.USER_NOT_FOUND.message, errorMess.USER_NOT_FOUND.code);
        }

        next();
    } catch (e) {
        next(e);
    }
};
