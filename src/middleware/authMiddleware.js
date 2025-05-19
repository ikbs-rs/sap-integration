import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // console.log("2222222222222222222222222222222222", req.headers);
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Token nije prosleđen" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("11111111111111111111111111111");
      return res.status(403).json({ message: "Nevalidan token" });
    }
    req.user = decoded;
    next();
  });
};
