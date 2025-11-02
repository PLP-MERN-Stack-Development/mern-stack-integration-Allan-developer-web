const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const asyncHandler = require('../middleware/asyncHandler');
const { categoryValidationRules, validate } = require('../middleware/validators');

// GET /api/categories - list categories
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, data: categories });
  })
);

// POST /api/categories - create a category
router.post(
  '/',
  categoryValidationRules(),
  validate,
  asyncHandler(async (req, res) => {
    const exists = await Category.findOne({ name: req.body.name });
    if (exists) return res.status(400).json({ success: false, error: 'Category already exists' });
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  })
);

module.exports = router;
