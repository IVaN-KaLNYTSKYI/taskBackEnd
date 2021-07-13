const { User } = require('../dataBase');

module.exports = {
    findUser: () => User.find({}),
    getSingleUser: (params) => User.findOne(params),
    createUser: (objectUser) => User.create(objectUser),
    updateUser: (userId, updateBody) => User.updateOne({ _id: userId }, updateBody),
    removeUser: (id) => User.deleteOne({ _id: id }),
};
