// backend/routes/petRoutes.js
const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const { protect } = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');

// @route   POST /api/pets
// @desc    Create new pet post
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { name, type, breed, status, description, location, city, contact, lastSeenDate } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const pet = await Pet.create({
      name,
      type,
      breed,
      status,
      description,
      location,
      city,
      contact,
      lastSeenDate,
      imageUrl: req.file.path,
      cloudinaryId: req.file.filename,
      userId: req.user._id,
      userName: req.user.name
    });

    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/pets
// @desc    Get all pets with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { city, type, status, search } = req.query;
    let query = { isResolved: false };

    if (city) query.city = { $regex: city, $options: 'i' };
    if (type) query.type = type;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } }
      ];
    }

    const pets = await Pet.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/pets/my-posts
// @desc    Get user's own posts
// @access  Private
router.get('/my-posts', protect, async (req, res) => {
  try {
    const pets = await Pet.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/pets/:id
// @desc    Get single pet
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Increment views
    pet.views += 1;
    await pet.save();

    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/pets/:id
// @desc    Update pet post
// @access  Private
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Check if user owns the post
    if (pet.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update fields
    const { name, type, breed, status, description, location, city, contact, isResolved } = req.body;
    
    pet.name = name || pet.name;
    pet.type = type || pet.type;
    pet.breed = breed || pet.breed;
    pet.status = status || pet.status;
    pet.description = description || pet.description;
    pet.location = location || pet.location;
    pet.city = city || pet.city;
    pet.contact = contact || pet.contact;
    pet.isResolved = isResolved !== undefined ? isResolved : pet.isResolved;

    // Update image if new one uploaded
    if (req.file) {
      // Delete old image from cloudinary
      if (pet.cloudinaryId) {
        await cloudinary.uploader.destroy(pet.cloudinaryId);
      }
      pet.imageUrl = req.file.path;
      pet.cloudinaryId = req.file.filename;
    }

    const updatedPet = await pet.save();
    res.json(updatedPet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/pets/:id
// @desc    Delete pet post
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Check if user owns the post
    if (pet.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete image from cloudinary
    if (pet.cloudinaryId) {
      await cloudinary.uploader.destroy(pet.cloudinaryId);
    }

    await pet.deleteOne();
    res.json({ message: 'Pet post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/pets/:id/share
// @desc    Increment share count
// @access  Public
router.put('/:id/share', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    pet.shares += 1;
    await pet.save();

    res.json({ shares: pet.shares });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;