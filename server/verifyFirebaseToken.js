import admin from "./firebaseAdmin.js";

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("Received token:", authHeader);  

  if (!authHeader) return res.status(401).json({ message: "No token" });

  // Strip "Bearer " prefix if present
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default verifyFirebaseToken;