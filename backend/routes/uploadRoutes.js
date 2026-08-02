const express = require('express');
const router = express.Router();
const path = require('path');
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file uploaded');
  }
  const base =
    process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  res.status(201).json({
    message: 'Image uploaded',
    image: `${base}/uploads/${req.file.filename}`,
    fileName: req.file.filename,
  });
});

module.exports = router;
