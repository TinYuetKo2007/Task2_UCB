import jwt from "jsonwebtoken";

const ROLE_RANK = {
  GUEST: 0,
  USER: 1,
  PRODUCER: 2,
  ADMIN: 3,
};

export const verify = (req, res, next) => {
  const auth = req.headers.authorization;

  // No header
  if (!auth) {
    return res.status(401).json({
      error: "Access denied: No Authorization header"
    });
  }

  const [type, token] = auth.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      error: "Invalid Authorization format"
    });
  }

  if (token === "null" || token === "undefined") {
    return res.status(401).json({
      error: "Invalid token"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded;
    req.user.isAdmin = decoded.role === "ADMIN";
    req.user.isProducer = decoded.role === "PRODUCER";
    req.user.isSuperAdmin = decoded.role === "SUPER_ADMIN";

    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);

    return res.status(401).json({
      error: "Invalid or expired token"
    });
  }
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
};

export const requireMinRole = (minRole) => {
  return (req, res, next) => {
    const userRole = req.user?.role || "GUEST";

    if (ROLE_RANK[userRole] < ROLE_RANK[minRole]) {
      return res.status(403).json({
        error: "Insufficient permissions"
      });
    }

    next();
  };
};