import { validationResult } from "express-validator";

function validate(req, res, next) {
  const errors = validationResult(req);

  const formattedErrors = {};

  errors.array({ onlyFirstError: true }).forEach((error) => {
    formattedErrors[error.path] = error.msg;
  });

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: formattedErrors,
    });
  }

  next();
}

export default validate;
