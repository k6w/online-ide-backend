const xss = require("xss");
const helmet = require("helmet");
const { body, validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  // Sanitize input to prevent XSS attacks
  req.body = sanitizeInput(req.body);

  // Ensure secure HTTP headers
  helmet()(req, res, next);
};

function sanitizeInput(input) {
  if (typeof input === "object") {
    for (const key in input) {
      if (typeof input[key] === "string") {
        input[key] = xss(input[key]);
      } else if (typeof input[key] === "object") {
        input[key] = sanitizeInput(input[key]);
      }
    }
  } else if (typeof input === "string") {
    return xss(input);
  }
  return input;
}
