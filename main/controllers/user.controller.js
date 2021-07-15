const { userService } = require('../services');
const { codesEnum } = require('../errors');
const { passwordHasher, fileHelpers, userHelper } = require('../helpers');
const { mailService } = require('../services');
const { emailActionEnum } = require('../constants');
const { OAuth } = require('../dataBase');

module.exports = {

    getAllUsers: async (req, res, next) => {
        try {
            const users = await userService.findUser().lean();

            const usersArr = [];

            for (let i = 0; i < users.length; i++) {
                const normalizedUser = userHelper.userNormalizator(users[i]);
                usersArr.push(normalizedUser);
            }

            res.json(usersArr);
        } catch (e) {
            next(e);
        }
    },

    createUser: async (req, res, next) => {
        try {
            const { user: { password, email, name }, avatar } = req;

            const hashedPassword = await passwordHasher.hash(password);

            const createdUser = await userService.createUser({ ...req.user, password: hashedPassword });

            const { _id } = createdUser;

            if (avatar) {
                const { finalPath, photoPath } = await fileHelpers.fileDownload(avatar.name, _id, 'users', 'avatars');

                await avatar.mv(finalPath);

                await userService.updateUser({ _id }, { avatar: photoPath, avatars: photoPath });
            }

            await mailService.sendMail(
                email,
                emailActionEnum.WELCOME,
                { userName: name, token: createdUser.activate_token, email }
            );

            const normalizedUser = userHelper.userNormalizator(createdUser.toJSON());

            res.status(codesEnum.CREATE).json(normalizedUser);
        } catch (e) {
            next(e);
        }
    },

    getUserById: async (req, res, next) => {
        try {
            const user = await userService.getSingleUser({ _id: req.params.userId }).lean();

            const normalizedUser = userHelper.userNormalizator(user);

            res.json(normalizedUser);
        } catch (e) {
            next(e);
        }
    },

    removeUserById: async (req, res, next) => {
        try {
            const { user } = req;

            /*  await userService.updateUser({ _id: req.params.userId }, { deleteUser: true }); */
            await userService.removeUser(req.params.userId);
            console.log(1);

            await fileHelpers.removeFileID(req.params.userId);
            console.log(1);
            await OAuth.remove({ user: user._id });
            console.log(1);
            await mailService.sendMail(user.email, emailActionEnum.REMOVE, { userName: user.name });

            res.json('user remove');
        } catch (e) {
            next(e);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const { password, name, email } = req.body;

            const hashedPassword = await passwordHasher.hash(password);

            await userService.updateUser(req.params.userId, {
                ...req.body, password: hashedPassword
            });

            await mailService.sendMail(email, emailActionEnum.UPDATE, { userName: name });

            res.json('update');
        } catch (e) {
            next(e);
        }
    },

    changeAvatar: async (req, res, next) => {
        try {
            const { user, body: { number } } = req;

            const { _id, avatars } = user;

            const photosArr = [...avatars];

            await userService.updateUser({ _id }, { $set: { avatar: photosArr[number] } });

            res.json('avatar change');
        } catch (e) {
            next(e);
        }
    },

    addAvatars: async (req, res, next) => {
        try {
            const { user, photos } = req;

            const { _id, avatars } = user;

            const photosArr = [...avatars];

            const { finalPath, photoPath } = await fileHelpers.fileDownload(photos[0].name, _id, 'users', 'avatars');

            await photos[0].mv(finalPath);

            photosArr.push(photoPath);

            await userService.updateUser({ _id }, { $set: { avatars: photosArr } });

            res.json(user);
        } catch (e) {
            next(e);
        }
    },

    addAvatar: async (req, res, next) => {
        try {
            const { avatar, user } = req;

            const { _id, avatars } = user;

            const photosArr = [...avatars];

            if (avatar) {
                const { finalPath, photoPath } = await fileHelpers.fileDownload(avatar.name, _id, 'users', 'avatars');

                await avatar.mv(finalPath);

                await userService.updateUser({ _id }, { avatar: photoPath, avatars: photosArr });
            }

            res.json(user);
        } catch (e) {
            next(e);
        }
    },

    forgotPassword: async (req, res, next) => {
        try {
            const { user: { _id }, headers: { password } } = req;

            const hashedPassword = await passwordHasher.hash(password);

            await userService.updateUser({ _id }, { password: hashedPassword });

            res.json('update-password-forgot');
        } catch (e) {
            next(e);
        }
    },

    changePassword: async (req, res, next) => {
        try {
            const { user: { _id }, body: { newPassword } } = req;

            const hashedPassword = await passwordHasher.hash(newPassword);

            await userService.updateUser({ _id }, { password: hashedPassword });

            res.json('update-password');
        } catch (e) {
            next(e);
        }
    },

};
