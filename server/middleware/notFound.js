/**
 * 404 Not Found Middleware for handling invalid API route requests.
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
};

module.exports = notFound;
