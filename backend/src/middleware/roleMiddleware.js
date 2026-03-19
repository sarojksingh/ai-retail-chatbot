export const authorizeAdmin = (req, res, next) => {
  //console.log("user:- ", req.user);
  if (req.user.role !== "Admin") {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  next();
};