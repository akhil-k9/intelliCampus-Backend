const requestController = require("../controllers/requestController");

const express = require('express');

const router = express.Router();

router.post('/send', requestController.requestSend);

router.get('/student/:studentId', requestController.getRequestsByStudentId);
router.get('/', requestController.getAllRequests);
router.get('/incharge', requestController.getInchargeRequests);
router.get('/hod', requestController.getHodRequests);






router.get('/approve', requestController.approveRequest);
router.get('/reject', requestController.rejectRequest);




module.exports = router;