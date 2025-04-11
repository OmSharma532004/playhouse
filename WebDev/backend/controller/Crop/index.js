// controllers/cropController.js
const Crop = require('../../models/crop');
const User = require('../../models/user');

exports.addCrop = async (req, res) => {
  try {
    console.log("Adding crop");
    const { name, quantity, pricePerUnit, description,  } = req.body;

    if(!name || !quantity || !pricePerUnit || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // const User= await User.findById(req.user._id);
    // if (!User) {
    //     console.log("User not found");
    //   return res.status(404).json({ error: 'User not found' });
    // }

    const newCrop = new Crop({
      name,
      quantity,
      pricePerUnit,
      description,
      farmer: req.user._id
    });

    await newCrop.save();
    res.status(201).json({ message: 'Crop added successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error adding crop' });
  }
};

exports.getCrops = async (req, res) => {
  try {
    const crops = await Crop.find();
    res.status(200).json(crops);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching crops' });
  }
};

exports.getCropDetails = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ error: 'Crop not found' });
    }
    res.status(200).json(crop);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching crop details' });
  }
};

//get all crops by a certain user
exports.getCropsByUser = async (req, res) => {
    console.log("Inside getCropsByUser");
    console.log("req.user:", req.user);
  
    if (!req.user || !req.user._id) {
      console.log("User not present in req.user");
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    const userId = req.user._id;
  
    try {
      console.log("Looking for crops with farmer:", userId);
      const crops = await Crop.find({ farmer: userId });
      console.log("Crops found:", crops);
  
      res.status(200).json(crops);
    } catch (error) {
      console.error("Error fetching crops from DB:", error);
      res.status(500).json({ error: "Error fetching crop details" });
    }
  };
  