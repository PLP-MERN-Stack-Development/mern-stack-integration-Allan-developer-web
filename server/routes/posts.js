const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Category = require('../models/Category');
const asyncHandler = require('../middleware/asyncHandler');
const { postValidationRules, validate } = require('../middleware/validators');
const { protect } = require('../middleware/auth');

// GET /api/posts - get all posts
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const posts = await Post.find().populate('author', 'name').populate('category', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  })
);

// GET /api/posts/:id - get a single post
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id).populate('author', 'name').populate('category', 'name');
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    // increment view count (async, but we await to persist)
    await post.incrementViewCount();
    res.json({ success: true, data: post });
  })
);

// POST /api/posts - create a post (protected)
router.post(
  '/',
  protect,
  postValidationRules(),
  validate,
  asyncHandler(async (req, res) => {
    // ensure category exists
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).json({ success: false, error: 'Invalid category' });

    const authorId = req.user && req.user.id;
    if (!authorId) return res.status(401).json({ success: false, error: 'Not authenticated' });

    const post = await Post.create({ ...req.body, author: authorId });
    res.status(201).json({ success: true, data: post });
  })
);

// PUT /api/posts/:id - update a post (protected, owner only)
router.put(
  '/:id',
  protect,
  postValidationRules(),
  validate,
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

    // ownership check
    if (post.author && post.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    // Only updating allowed fields for brevity
    post.title = req.body.title;
    post.content = req.body.content;
    post.excerpt = req.body.excerpt;
    post.isPublished = req.body.isPublished;
    post.category = req.body.category;

    await post.save();
    res.json({ success: true, data: post });
  })
);

// DELETE /api/posts/:id (protected, owner only)
router.delete(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

    if (post.author && post.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    await post.deleteOne();
    res.json({ success: true, data: {} });
  })
);

module.exports = router;
