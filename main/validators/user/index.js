module.exports = {
    createValidator: require('./create-user.validator'),
    updateValidator: require('./update-user.validator'),
    idValidator: require('./id-user.validator'),
    emailValidator: require('./email-validator'),
    forgotPasswordValidator: require('./forgot-password-validator')
};
