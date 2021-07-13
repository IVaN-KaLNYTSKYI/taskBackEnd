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
            [req.avatar] = req.photos;

            const { user: { password, email, name }, photos, avatar } = req;

            const photosArr = [];

            const hashedPassword = await passwordHasher.hash(password);

            const createdUser = await userService.createUser({ ...req.user, password: hashedPassword });

            const { _id } = createdUser;

            if (avatar) {
                const { finalPath, photoPath } = await fileHelpers.fileDownload(avatar.name, _id, 'users', 'avatar');

                await avatar.mv(finalPath);

                await userService.updateUser({ _id }, { avatar: photoPath });
            }

            if (photos) {
                for (let i = 0; i < photos.length; i++) {
                    console.log(photos[i].name);
                    // eslint-disable-next-line no-await-in-loop
                    const { finalPath, photoPath } = await fileHelpers.fileDownload(photos[i].name, _id, 'users', 'avatars');
                    // eslint-disable-next-line no-await-in-loop
                    await photos[i].mv(finalPath);

                    photosArr.push(photoPath);
                }
                await userService.updateUser({ _id }, { $set: { avatars: photosArr } });
            }

            await mailService.sendMail(email, emailActionEnum.WELCOME, { userName: name, token: createdUser.activate_token });

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

            await userService.removeUser(req.params.userId);

            await fileHelpers.removeFileID(req.params.userId);

            await OAuth.remove({ user: user._id });

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

    addAvatar: async (req, res, next) => {
        try {
            const { avatar, user, photos } = req;

            const { _id, avatars } = user;

            const photosArr = [...avatars];

            await fileHelpers.removeFileID(req.params.userId, 'avatar');

            if (avatar) {
                const { finalPath, photoPath } = await fileHelpers.fileDownload(avatar.name, _id, 'users', 'avatar');

                await avatar.mv(finalPath);

                await userService.updateUser({ _id }, { avatar: photoPath });

                for (let i = 0; i < photos.length; i++) {
                    // eslint-disable-next-line no-await-in-loop,no-shadow
                    const { finalPath, photoPath } = await fileHelpers.fileDownload(photos[i].name, _id, 'users', 'avatars');
                    // eslint-disable-next-line no-await-in-loop
                    await photos[i].mv(finalPath);

                    photosArr.push(photoPath);
                }
                await userService.updateUser({ _id }, { $set: { avatars: photosArr } });
            }

            res.json(user);
        } catch (e) {
            next(e);
        }
    },

    addAvatars: async (req, res, next) => {
        try {
            const { user, photos } = req;

            const { _id, avatars } = user;

            const photosArr = [...avatars];

            if (photos.length) {
                for (let i = 0; i < photos.length; i++) {
                    // eslint-disable-next-line no-await-in-loop
                    const { finalPath, photoPath } = await fileHelpers.fileDownload(photos[i].name, _id, 'users', 'avatars');
                    // eslint-disable-next-line no-await-in-loop
                    await photos[i].mv(finalPath);
                    photosArr.push(photoPath);
                }
                await userService.updateUser({ _id }, { $set: { avatars: photosArr } });
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

            res.json('update-password');
        } catch (e) {
            next(e);
        }
    },

};
