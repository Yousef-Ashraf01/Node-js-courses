module.exports = (...roles) => {
  // ["ADMIN" , "MANAGER"]
  console.log("roles", roles);
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      return res.status(403).json({
        message: "Unauthorized access. You don't have the required role.",
      });
    }
    next();
  };
};
