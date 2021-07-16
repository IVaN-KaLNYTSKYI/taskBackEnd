const router = require('express').Router();

router.use('*', (req, res) => res.json('NOT FOUND ROUTER'));

module.exports = router;
