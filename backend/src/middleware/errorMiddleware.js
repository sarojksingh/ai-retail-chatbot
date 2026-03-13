export const errorHandler = (err, req, res, next) => {

  console.error("Error:", err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error"
    }
  });

};