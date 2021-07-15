const router = require('express').Router();

const { userController } = require('../../controllers');
const { isUserValid, authValid, fileMiddleware } = require('../../middlewares');

router.get('/', userController.getAllUsers);

router.post('/',
    fileMiddleware.checkAvatar,
    fileMiddleware.checkFile,
    isUserValid.createMiddleware,
    userController.createUser);

router.get('/:userId',
    isUserValid.idMiddleware,
    userController.getUserById);

router.delete('/:userId',
    authValid.checkAccessToken,
    isUserValid.idMiddleware,
    userController.removeUserById);

router.patch('/:userId',
    authValid.checkAccessToken,
    isUserValid.idMiddleware,
    isUserValid.updateMiddleware,
    userController.updateUser);

router.post('/:userId/avatar',
    authValid.checkAccessToken,
    fileMiddleware.checkFile,
    fileMiddleware.checkAvatar,
    isUserValid.idMiddleware,
    userController.addAvatar);

router.post('/:userId/changeAvatar',
    authValid.checkAccessToken,
    isUserValid.idMiddleware,
    isUserValid.checkNumber,
    userController.changeAvatar);

router.post('/:userId/avatars',
    authValid.checkAccessToken,
    fileMiddleware.checkFile,
    fileMiddleware.checkAvatar,
    isUserValid.idMiddleware,
    userController.addAvatars);

router.post('/forgotPassword',
    isUserValid.forgotToken,
    userController.forgotPassword);

router.post('/changePassword',
    authValid.checkAccessToken,
    isUserValid.changePassword,
    userController.changePassword);

module.exports = router;
