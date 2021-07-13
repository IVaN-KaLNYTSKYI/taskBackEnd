const router = require('express').Router();

const { isUserValid } = require('../../middlewares');
const { mailController } = require('../../controllers');

router.get('/activate', isUserValid.activateToken, mailController.activatedAccount);

router.post('/forgotPassword', isUserValid.emailValidIsCreatForgotToken, mailController.forgotToken);

module.exports = router;
