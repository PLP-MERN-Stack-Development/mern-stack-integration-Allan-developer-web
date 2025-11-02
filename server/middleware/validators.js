const { body, validationResult } = require('express-validator');

const postValidationRules = () => {
  return [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }).withMessage('Title max 100 chars'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('category').notEmpty().withMessage('Category id is required').isMongoId().withMessage('Invalid category id'),
  ];
};

const categoryValidationRules = () => {
  return [
    body('name').trim().notEmpty().withMessage('Category name is required').isLength({ max: 50 }).withMessage('Name max 50 chars'),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

module.exports = {
  postValidationRules,
  categoryValidationRules,
  validate,
};
