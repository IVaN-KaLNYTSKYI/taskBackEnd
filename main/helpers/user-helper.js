module.exports = {
    userNormalizator: (userToNormalize = {}) => {
        const fieldsToRemove = ['password'];

        fieldsToRemove.forEach((filed) => {
            // eslint-disable-next-line no-param-reassign
            delete userToNormalize[filed];
        });

        return userToNormalize;
    }
};
