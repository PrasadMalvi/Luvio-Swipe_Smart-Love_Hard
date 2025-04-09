const { body, validationResult } = require("express-validator");

const validateSendMessage = [
  body("chatId").optional().isMongoId(),
  body("receiverId").optional().isMongoId(),
  body("content")
    .isString()
    .withMessage("Content must be a string")
    .notEmpty()
    .withMessage("Content is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateSendMessage };
