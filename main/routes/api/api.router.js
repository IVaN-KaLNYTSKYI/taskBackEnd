const router = require('express').Router();

const userRouter = require('../user');
const authRouter = require('../auth');
const mailRouter = require('../mail');

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/email', mailRouter);

module.exports = router;
