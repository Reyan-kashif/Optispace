const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({
      success: false,
      data: null,
      message: 'Access denied. Admin privileges required.',
    });
  }
  next();
};

const authorizeFaculty = (req, res, next) => {
  if (req.user.role !== 'Faculty' && req.user.role !== 'Admin') {
    return res.status(403).json({
      success: false,
      data: null,
      message: 'Access denied. Faculty or Admin privileges required.',
    });
  }
  next();
};

const authorizeAny = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        data: null,
        message: `Access denied. Required role(s): ${allowedRoles.join(', ')}.`,
      });
    }
    next();
  };
};

module.exports = {
  authorizeAdmin,
  authorizeFaculty,
  authorizeAny,
};
