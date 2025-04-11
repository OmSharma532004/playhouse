const express = require('express');
const router = express.Router();
const cropController = require('../controller/Crop');
const catchAsync = require('../utils/CatchAsync');
const isProducer = require('../middleware');
const {getCropsByUser} = require('../controller/Crop');


// Route to add a new crop
router.route("/add")
    .post(isProducer, catchAsync(cropController.addCrop));

router.route("/getall")
    .get(catchAsync(cropController.getCrops));

// Route to get crop details by ID
router.route("/getcrop/:id")
    .get(catchAsync(cropController.getCropDetails));
    
// Route to get all crops by a certain user
router.route("/getallbyuser")
    .get(isProducer, catchAsync(getCropsByUser));

module.exports = router;
