// backend/routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth');

// @route   POST /api/comments
// @desc    Add comment to pet post
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { petId, text } = req.body;

    const comment = await Comment.create({
      petId,
      userId: req.user._id,
      userName: req.user.name,
      text
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/comments/:petId
// @desc    Get all comments for a pet
// @access  Public
router.get('/:petId', async (req, res) => {
  try {
    const comments = await Comment.find({ petId: req.params.petId })
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete comment
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;