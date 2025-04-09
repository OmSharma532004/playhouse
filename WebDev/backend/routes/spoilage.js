const express = require('express');
const Spoilage = require('../models/Spoilage/Spoilage');
const router = express.Router();

router.post("/save", async (req, res) => {
    try {

      console.log("Received data to save:", req.body);
  
      const { spoilage, temperature, humidity, sunlight } = req.body;
      const newSpoilage = new Spoilage({ spoilage, temperature, humidity, sunlight });
  

      console.log("Saving to MongoDB:", newSpoilage);
  
      await newSpoilage.save();
  

      console.log("Data successfully saved to MongoDB:", newSpoilage);
      res.status(201).json(newSpoilage, { message: "Data saved successfully" }, { success: true });
    } catch (error) {
      console.error("Error saving spoilage data:", error);
      res.status(500).json({ error: "Failed to save spoilage data" });
    }
  });
  


router.get('/get', async (req, res) => {
  try {
    const spoilageHistory = await Spoilage.find().sort({ timestamp: 1 }); 
    res.status(200).json(spoilageHistory);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching spoilage history' });
  }
});

module.exports = router;
