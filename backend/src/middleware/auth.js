import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "secret";

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header)
    return res.status(401).json({ error: "Missing Authorization header" });

  const parts = header.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer")
    return res.status(401).json({ error: "Invalid Authorization header" });

  try {
    const payload = jwt.verify(parts[1], jwtSecret);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });

  if (req.user.role !== role)
    return res.status(403).json({ error: "Forbidden" });

  next();
};
