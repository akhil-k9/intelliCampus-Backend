// 

const express = require('express');
const router = express.Router();
const stdController = require('../controllers/stdController');

router.post('/signup', stdController.signup);
router.post('/signin', stdController.signin);
router.get('/allstd', stdController.getAllStd);

module.exports = router;
